import { BrevoClient } from "@getbrevo/brevo"

interface BrevoConfig {
  apiKey: string
  listId: number
}

function parseListId(value: string | undefined) {
  if (!value) {
    return null
  }

  const listId = Number.parseInt(value, 10)
  return Number.isInteger(listId) && listId > 0 ? listId : null
}

export function getBrevoConfig(): BrevoConfig | null {
  const apiKey = process.env.BREVO_API_KEY?.trim()
  const listId = parseListId(process.env.BREVO_LIST_ID)

  if (!apiKey || !listId) {
    return null
  }

  return { apiKey, listId }
}

export function createBrevoClient(apiKey: string) {
  return new BrevoClient({
    apiKey,
    timeoutInSeconds: 15,
  })
}
