// Types et utilitaires partagés pour la capture de leads pro (formulaire de rappel).
// La LP poste sur /api/leads → push Twenty CRM + email à l'équipe.

export interface LeadInput {
  segment: string
  firstName: string
  lastName: string
  company: string
  phone: string
  email?: string
  message?: string
}

// Contexte ajouté côté serveur à partir du segment (pour le CRM et l'email).
export interface LeadContext {
  audienceLabel: string
  zone?: string
}

export type Lead = LeadInput & LeadContext

// Valeurs de pré-remplissage du formulaire, lues dans l'URL de la campagne.
export interface LeadPrefill {
  firstName?: string
  lastName?: string
  company?: string
  phone?: string
  email?: string
}

type SearchParams = Record<string, string | string[] | undefined>

// Lit les valeurs de pré-remplissage depuis les query params d'une URL de campagne.
// Brevo insère les attributs du contact dans le lien (ex. ?prenom={{contact.PRENOM}}).
// On accepte plusieurs alias pour coller aux attributs Brevo (PRENOM, NOM, SMS…).
export function readPrefill(params: SearchParams): LeadPrefill {
  const pick = (...keys: string[]): string | undefined => {
    for (const key of keys) {
      const raw = params[key]
      const value = Array.isArray(raw) ? raw[0] : raw
      if (value && value.trim()) return value.trim()
    }
    return undefined
  }
  return {
    firstName: pick("prenom", "firstname", "firstName", "fn"),
    lastName: pick("nom", "lastname", "lastName", "ln"),
    company: pick("etablissement", "entreprise", "societe", "company", "raison_sociale"),
    // Brevo passe le tél au format SMS (« 33612345678 »). On l'affiche en format
    // national saisissable (« 0612345678 ») dans le champ.
    phone: toFrNationalInput(pick("tel", "telephone", "phone", "sms", "mobile")),
    email: pick("email", "mail", "e"),
  }
}

// Normalise un téléphone français : retire séparateurs, gère +33 / 0033 / 0X.
// Renvoie le numéro national (sans indicatif) + l'indicatif appelant.
export function normalizeFrPhone(raw: string): {
  national: string
  callingCode: string
  e164: string
} {
  const cleaned = raw.replace(/[^\d+]/g, "")
  let digits = cleaned

  if (digits.startsWith("+33")) digits = digits.slice(3)
  else if (digits.startsWith("0033")) digits = digits.slice(4)
  else if (digits.startsWith("33") && digits.length === 11) digits = digits.slice(2)
  else if (digits.startsWith("0")) digits = digits.slice(1)

  digits = digits.replace(/\D/g, "")

  return {
    national: digits,
    callingCode: "+33",
    e164: digits ? `+33${digits}` : "",
  }
}

// Affichage lisible « 06 12 34 56 78 » à partir du national à 9 chiffres.
export function formatFrPhone(raw: string): string {
  const { national } = normalizeFrPhone(raw)
  const withZero = national.length === 9 ? `0${national}` : national
  return withZero.replace(/(\d{2})(?=\d)/g, "$1 ").trim()
}

// Format national saisissable « 0612345678 » (sans espaces) pour préremplir un
// champ de saisie, quel que soit le format d'entrée (33…, +33…, 06…). undefined si vide.
export function toFrNationalInput(raw?: string): string | undefined {
  if (!raw || !raw.trim()) return undefined
  const { national } = normalizeFrPhone(raw)
  if (!national) return undefined
  return national.length === 9 ? `0${national}` : national
}
