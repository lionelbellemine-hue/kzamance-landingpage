import { z } from "zod"
import type { Lead } from "@/lib/leads"
import { getSegment } from "@/lib/segments"
import { pushLeadToTwenty } from "@/lib/twenty"
import { notifyNewLead } from "@/lib/notify"

export const runtime = "nodejs"

const leadSchema = z.object({
  segment: z.string().trim().min(1),
  firstName: z.string().trim().min(1).max(80),
  lastName: z.string().trim().min(1).max(80),
  company: z.string().trim().min(1).max(160),
  phone: z
    .string()
    .trim()
    .min(8)
    .max(25)
    .regex(/^[\d\s.+()-]+$/, "Numéro de téléphone invalide"),
  email: z.string().trim().toLowerCase().email().optional().or(z.literal("")),
  message: z.string().trim().max(1000).optional(),
})

export async function POST(request: Request) {
  let payload: unknown
  try {
    payload = await request.json()
  } catch {
    return Response.json({ error: "Requête invalide." }, { status: 400 })
  }

  const parsed = leadSchema.safeParse(payload)
  if (!parsed.success) {
    return Response.json(
      { error: "Merci de vérifier les champs (nom, établissement et téléphone sont requis)." },
      { status: 400 },
    )
  }

  const segment = getSegment(parsed.data.segment)
  if (!segment) {
    return Response.json({ error: "Segment inconnu." }, { status: 400 })
  }

  const lead: Lead = {
    segment: parsed.data.segment,
    firstName: parsed.data.firstName,
    lastName: parsed.data.lastName,
    company: parsed.data.company,
    phone: parsed.data.phone,
    email: parsed.data.email || undefined,
    message: parsed.data.message || undefined,
    audienceLabel: segment.audienceLabel,
    zone: segment.zone,
  }

  // Email (capture garantie) + Twenty (système d'enregistrement) en PARALLÈLE.
  // On attend les deux : Twenty enchaîne Company → Person → Opportunity → Note,
  // et il faut que le Worker reste vivant jusqu'au bout (un waitUntil se ferait
  // couper par Cloudflare si l'instance Twenty démarre à froid → seule la Company
  // passerait). L'email garantit qu'aucun lead n'est perdu si Twenty échoue.
  const [notify, twenty] = await Promise.all([notifyNewLead(lead), pushLeadToTwenty(lead)])

  if (!notify.ok && !notify.skipped) console.error("[leads] échec notification:", notify.error)
  if (!twenty.ok && !twenty.skipped) console.error("[leads] échec push Twenty:", twenty.error)

  // Succès si le lead a été capté quelque part (email ou Twenty).
  if (notify.ok || twenty.ok) {
    return Response.json({ success: true })
  }

  console.error("[leads] lead non enregistré:", { twenty: twenty.error, notify: notify.error })
  return Response.json(
    { error: "Impossible d'enregistrer votre demande pour le moment. Réessayez dans un instant." },
    { status: 502 },
  )
}
