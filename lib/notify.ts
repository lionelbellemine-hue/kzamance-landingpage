import { formatFrPhone, type Lead } from "@/lib/leads"

// Notification du nouveau lead à l'équipe par email (Brevo transactionnel).
// C'est le canal qui GARANTIT la capture : l'email contient toutes les infos,
// indépendamment de Twenty (qui est synchronisé en arrière-plan).
// Pas de SMS, pas de Calendly. Appel REST direct (api.brevo.com/v3/smtp/email).

const BREVO_SMTP = "https://api.brevo.com/v3/smtp/email"

interface NotifyConfig {
  apiKey: string
  to: string
  fromEmail: string
  fromName: string
}

function getNotifyConfig(): NotifyConfig | null {
  const apiKey = process.env.BREVO_API_KEY?.trim()
  const to = process.env.LEAD_NOTIFY_EMAIL?.trim()
  // L'expéditeur DOIT être un sender validé dans le compte Brevo.
  const fromEmail = process.env.LEAD_FROM_EMAIL?.trim() || to
  if (!apiKey || !to || !fromEmail) return null
  return {
    apiKey,
    to,
    fromEmail,
    fromName: process.env.LEAD_FROM_NAME?.trim() || "Leads K-zamance",
  }
}

function buildHtml(lead: Lead): string {
  const phonePretty = formatFrPhone(lead.phone)
  const row = (label: string, value: string) =>
    `<tr><td style="padding:6px 0;color:#6b7280;width:160px">${label}</td><td style="padding:6px 0;color:#111827;font-weight:500">${value}</td></tr>`

  return `<!doctype html>
<html lang="fr"><body style="margin:0;background:#f6f7f5;font-family:-apple-system,Segoe UI,Roboto,sans-serif">
  <div style="max-width:560px;margin:0 auto;padding:24px">
    <div style="background:#fff;border:1px solid #e5e7eb;border-radius:14px;overflow:hidden">
      <div style="background:#163422;padding:20px 24px">
        <p style="margin:0;color:#bfe8c8;font-size:12px;letter-spacing:.08em;text-transform:uppercase">Nouveau contact à rappeler</p>
        <h1 style="margin:4px 0 0;color:#fff;font-size:20px">${lead.firstName} ${lead.lastName}</h1>
        <p style="margin:4px 0 0;color:#bfe8c8;font-size:14px">${lead.audienceLabel}</p>
      </div>
      <div style="padding:20px 24px">
        <table style="width:100%;border-collapse:collapse;font-size:14px">
          ${row("Établissement", lead.company)}
          ${row("Téléphone", `<a href="tel:${lead.phone}" style="color:#16794f;text-decoration:none">${phonePretty}</a>`)}
          ${lead.email ? row("Email", `<a href="mailto:${lead.email}" style="color:#16794f">${lead.email}</a>`) : ""}
          ${lead.zone ? row("Zone", lead.zone) : ""}
          ${lead.message ? row("Message", lead.message) : ""}
        </table>
        <a href="tel:${lead.phone}" style="display:inline-block;margin-top:20px;background:#269c32;color:#fff;text-decoration:none;padding:12px 22px;border-radius:10px;font-weight:600;font-size:14px">📞 Rappeler ${lead.firstName}</a>
      </div>
    </div>
    <p style="text-align:center;color:#9ca3af;font-size:12px;margin-top:16px">Lead capté via pro.k-zamance.fr - segment « ${lead.segment} »</p>
  </div>
</body></html>`
}

export interface NotifyResult {
  ok: boolean
  skipped?: boolean
  error?: string
}

export async function notifyNewLead(lead: Lead): Promise<NotifyResult> {
  const config = getNotifyConfig()
  if (!config) return { ok: false, skipped: true, error: "Notification non configurée" }

  const payload: Record<string, unknown> = {
    sender: { name: config.fromName, email: config.fromEmail },
    to: [{ email: config.to }],
    subject: `🔔 À rappeler : ${lead.firstName} ${lead.lastName} (${lead.audienceLabel})`,
    htmlContent: buildHtml(lead),
  }
  // Répondre à l'email tombe sur le prospect si renseigné.
  if (lead.email)
    payload.replyTo = { email: lead.email, name: `${lead.firstName} ${lead.lastName}` }

  try {
    const res = await fetch(BREVO_SMTP, {
      method: "POST",
      headers: {
        "api-key": config.apiKey,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(15_000),
    })
    if (!res.ok) {
      const text = await res.text()
      return { ok: false, error: `Brevo smtp/email → HTTP ${res.status}: ${text.slice(0, 300)}` }
    }
    return { ok: true }
  } catch (err) {
    return { ok: false, error: (err as Error).message }
  }
}
