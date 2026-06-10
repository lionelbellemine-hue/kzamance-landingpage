import { normalizeFrPhone, type Lead } from "@/lib/leads"

// Client Twenty CRM (REST API). Chaque lead du formulaire crée :
//   - une Company (l'établissement) - best effort
//   - une Person (le contact) reliée à la Company, avec tél + intitulé
//   - une Opportunity (le deal) dans le pipeline, reliée au contact + à la société
//   - une Note de contexte attachée à l'opportunité
//
// Tout est tolérant : si une étape échoue (schéma différent selon la version,
// champ custom absent…), on continue et on log. La Person est l'objectif minimal.
//
// Auth : header `Authorization: Bearer <TWENTY_API_KEY>`.
// Base : `${TWENTY_BASE_URL}/rest` (TWENTY_BASE_URL = racine de l'instance).

interface TwentyConfig {
  baseUrl: string
  apiKey: string
}

export function getTwentyConfig(): TwentyConfig | null {
  const rawUrl = process.env.TWENTY_BASE_URL?.trim()
  const apiKey = process.env.TWENTY_API_KEY?.trim()
  if (!rawUrl || !apiKey) return null

  // Normalise : retire le slash final et un éventuel suffixe /rest.
  const baseUrl = rawUrl.replace(/\/+$/, "").replace(/\/rest$/, "")
  return { baseUrl, apiKey }
}

export interface TwentyResult {
  ok: boolean
  skipped?: boolean
  personId?: string
  companyId?: string
  opportunityId?: string
  error?: string
}

const sleep = (ms: number): Promise<void> => new Promise((r) => setTimeout(r, ms))

// Requête Twenty avec retry. L'instance (Railway) peut se réveiller à froid : la
// 1ʳᵉ tentative réveille le service (et peut timer out), la 2ᵉ tombe sur un service
// chaud. On réessaie sur timeout / erreur réseau / 5xx.
async function twentyRequest<T>(
  config: TwentyConfig,
  path: string,
  body: unknown,
  attempt = 0,
): Promise<T> {
  const MAX_RETRIES = 1 // 2 tentatives au total
  try {
    const res = await fetch(`${config.baseUrl}/rest${path}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${config.apiKey}`,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(12_000),
    })
    const text = await res.text()
    if (!res.ok) {
      if (res.status >= 500 && attempt < MAX_RETRIES) {
        await sleep(1500)
        return twentyRequest(config, path, body, attempt + 1)
      }
      throw new Error(`Twenty ${path} → HTTP ${res.status}: ${text.slice(0, 400)}`)
    }
    return (text ? JSON.parse(text) : {}) as T
  } catch (err) {
    // Timeout (AbortError) ou erreur réseau → on réessaie une fois (cold start).
    if (attempt < MAX_RETRIES) {
      await sleep(1500)
      return twentyRequest(config, path, body, attempt + 1)
    }
    throw err
  }
}

// Twenty enveloppe la réponse : { data: { createPerson: {...} } } selon la version,
// parfois { data: {...} }. On extrait l'id de façon défensive.
function extractId(payload: unknown, key: string): string | undefined {
  const data = (payload as { data?: Record<string, unknown> })?.data
  if (!data) return undefined
  const inner = (data[key] ?? data) as { id?: string }
  return typeof inner?.id === "string" ? inner.id : undefined
}

// Réveille l'instance Twenty (Railway) avec un GET idempotent AVANT d'enchaîner les
// créations. Railway dort entre deux leads : sans ce warm-up, le 1ᵉʳ lead après une
// période d'inactivité voyait le cold-start manger le budget de la requête (la Company
// réveillait l'instance puis la Person tombait en timeout) → seule la Company passait.
// Une fois ce GET réussi, l'instance est chaude et la suite Company → Person →
// Opportunity s'exécute en ~1 s. En campagne, les leads arrivent groupés : seul le tout
// premier paie ce réveil.
async function warmUp(config: TwentyConfig): Promise<void> {
  const MAX_ATTEMPTS = 4
  for (let i = 0; i < MAX_ATTEMPTS; i++) {
    try {
      const res = await fetch(`${config.baseUrl}/rest/companies?limit=1`, {
        method: "GET",
        headers: { Authorization: `Bearer ${config.apiKey}`, Accept: "application/json" },
        signal: AbortSignal.timeout(10_000),
      })
      if (res.ok) return // instance chaude, on enchaîne
    } catch {
      // timeout / réseau pendant le réveil → on retente
    }
    if (i < MAX_ATTEMPTS - 1) await sleep(2000)
  }
}

export async function pushLeadToTwenty(lead: Lead): Promise<TwentyResult> {
  const config = getTwentyConfig()
  if (!config) return { ok: false, skipped: true, error: "Twenty non configuré" }

  const { national, callingCode } = normalizeFrPhone(lead.phone)

  let companyId: string | undefined
  let opportunityId: string | undefined

  // Réveil de l'instance avant les créations (cf. warmUp).
  await warmUp(config)

  // 1) Company (l'établissement) - best effort, n'empêche pas la suite.
  try {
    const companyPayload = await twentyRequest<unknown>(config, "/companies", {
      name: lead.company,
    })
    companyId = extractId(companyPayload, "createCompany")
  } catch (err) {
    console.warn("[twenty] création company échouée (on continue):", (err as Error).message)
  }

  // 2) Person (le contact) - objectif minimal.
  // NB : l'objet Person de Twenty n'a pas de champ `city` (vérifié sur l'instance).
  // La zone est portée par jobTitle (= audienceLabel, qui contient la zone) + la note.
  const personBody: Record<string, unknown> = {
    name: { firstName: lead.firstName, lastName: lead.lastName },
    phones: {
      primaryPhoneNumber: national,
      primaryPhoneCallingCode: callingCode,
      primaryPhoneCountryCode: "FR",
    },
    jobTitle: lead.audienceLabel,
  }
  if (lead.email) personBody.emails = { primaryEmail: lead.email }
  if (companyId) personBody.companyId = companyId

  let personId: string | undefined
  try {
    const personPayload = await twentyRequest<unknown>(config, "/people", personBody)
    personId = extractId(personPayload, "createPerson")
  } catch (err) {
    // Twenty rejette un email déjà présent (détection de doublon sur
    // emails.primaryEmail - c'est le SEUL champ qui bloque ; tél et nom non).
    // Le formulaire étant prérempli avec l'email du prospect, un contact déjà en
    // base (lead récurrent, import antérieur) ferait échouer la Person. Dans ce
    // cas on récupère le contact existant et on continue : nouvelle opportunité
    // sur ce contact, plutôt qu'un doublon ou un abandon.
    const message = (err as Error).message
    if (lead.email && /duplicate/i.test(message)) {
      personId = await findPersonByEmail(config, lead.email).catch(() => undefined)
    }
    // Person ni créée ni retrouvée : on log mais on N'ABANDONNE PAS - l'opportunité
    // est quand même créée (reliée à la société) pour ne pas perdre le deal.
    if (!personId) console.warn("[twenty] person non créée (on continue):", message)
  }

  // 3) Opportunity (le deal dans le pipeline) - best effort.
  // stage initial : "NEW" (1ʳᵉ colonne du pipeline). Reliée à la société + au contact.
  try {
    const oppBody: Record<string, unknown> = {
      name: `${lead.company} - ${lead.firstName} ${lead.lastName}`,
      stage: "NEW",
    }
    if (companyId) oppBody.companyId = companyId
    if (personId) oppBody.pointOfContactId = personId
    const oppPayload = await twentyRequest<unknown>(config, "/opportunities", oppBody)
    opportunityId = extractId(oppPayload, "createOpportunity")
  } catch (err) {
    console.warn("[twenty] création opportunité échouée (on continue):", (err as Error).message)
  }

  // 4) Note de contexte - attachée à l'opportunité (sinon au contact) - best effort.
  await attachNote(config, lead, { opportunityId, personId }).catch((err) =>
    console.warn("[twenty] note non créée (on continue):", (err as Error).message),
  )

  // ok = le deal est arrivé dans le pipeline (opportunité) ou au minimum un contact.
  // Une simple Company sans rien d'autre ne suffit pas : on veut le savoir dans les logs.
  const ok = Boolean(opportunityId || personId)
  return {
    ok,
    personId,
    companyId,
    opportunityId,
    error: ok ? undefined : "ni opportunité ni contact créés",
  }
}

// Recherche un contact par email principal (pour réutiliser un contact existant
// quand Twenty refuse la création en doublon). GET filtré côté Twenty.
async function findPersonByEmail(config: TwentyConfig, email: string): Promise<string | undefined> {
  const filter = encodeURIComponent(`emails.primaryEmail[eq]:${email}`)
  const res = await fetch(`${config.baseUrl}/rest/people?filter=${filter}&limit=1`, {
    method: "GET",
    headers: { Authorization: `Bearer ${config.apiKey}`, Accept: "application/json" },
    signal: AbortSignal.timeout(10_000),
  })
  if (!res.ok) return undefined
  const json = (await res.json()) as { data?: { people?: Array<{ id?: string }> } }
  const id = json?.data?.people?.[0]?.id
  return typeof id === "string" ? id : undefined
}

// Crée une note avec le détail du lead et la relie à l'opportunité (ou au contact).
// bodyV2 (markdown) sur Twenty récent, fallback body sur versions plus anciennes.
async function attachNote(
  config: TwentyConfig,
  lead: Lead,
  targets: { opportunityId?: string; personId?: string },
): Promise<void> {
  const target = targets.opportunityId
    ? { targetOpportunityId: targets.opportunityId }
    : targets.personId
      ? { targetPersonId: targets.personId }
      : null
  if (!target) return

  const lines = [
    `**Nouveau lead : ${lead.audienceLabel}**`,
    "",
    `- Établissement : ${lead.company}`,
    `- Contact : ${lead.firstName} ${lead.lastName}`,
    `- Téléphone : ${lead.phone}`,
    lead.email ? `- Email : ${lead.email}` : null,
    lead.zone ? `- Zone : ${lead.zone}` : null,
    `- Segment : ${lead.segment}`,
    `- Source : landing page pro.k-zamance.fr`,
    lead.message ? "" : null,
    lead.message ? `> ${lead.message}` : null,
  ]
    .filter((l) => l !== null)
    .join("\n")

  const title = `Lead : ${lead.firstName} ${lead.lastName} (${lead.company})`

  let noteId: string | undefined
  try {
    const payload = await twentyRequest<unknown>(config, "/notes", {
      title,
      bodyV2: { markdown: lines },
    })
    noteId = extractId(payload, "createNote")
  } catch {
    const payload = await twentyRequest<unknown>(config, "/notes", { title, body: lines })
    noteId = extractId(payload, "createNote")
  }

  if (noteId) {
    await twentyRequest(config, "/noteTargets", { noteId, ...target })
  }
}
