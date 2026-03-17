import { BrevoError } from "@getbrevo/brevo"
import { z } from "zod"
import { createBrevoClient, getBrevoConfig } from "@/lib/brevo"

export const runtime = "nodejs"

const waitlistSchema = z.object({
  email: z.string().trim().toLowerCase().email(),
})

export async function POST(request: Request) {
  const config = getBrevoConfig()

  if (!config) {
    return Response.json(
      { error: "Configuration Brevo incomplète côté serveur." },
      { status: 500 }
    )
  }

  let payload: unknown

  try {
    payload = await request.json()
  } catch {
    return Response.json(
      { error: "Requête invalide." },
      { status: 400 }
    )
  }

  const result = waitlistSchema.safeParse(payload)

  if (!result.success) {
    return Response.json(
      { error: "Veuillez fournir une adresse email valide." },
      { status: 400 }
    )
  }

  try {
    const brevo = createBrevoClient(config.apiKey)

    await brevo.contacts.createContact({
      email: result.data.email,
      listIds: [config.listId],
      updateEnabled: true,
    })

    return Response.json({ success: true })
  } catch (error) {
    if (error instanceof BrevoError) {
      const brevoMessage =
        typeof error.body === "object" &&
        error.body !== null &&
        "message" in error.body &&
        typeof error.body.message === "string"
          ? error.body.message
          : null

      console.error("Brevo createContact failed", {
        statusCode: error.statusCode,
        message: error.message,
        body: error.body,
      })

      if (error.statusCode === 401 && brevoMessage?.includes("unrecognised IP address")) {
        return Response.json(
          {
            error:
              "Brevo bloque actuellement cette requête car l'IP du serveur n'est pas autorisée dans ton compte.",
          },
          { status: 503 }
        )
      }
    } else {
      console.error("Unexpected waitlist error", error)
    }

    return Response.json(
      { error: "Impossible de finaliser l'inscription pour le moment." },
      { status: 502 }
    )
  }
}
