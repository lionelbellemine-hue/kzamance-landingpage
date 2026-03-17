"use client"

import { useState } from "react"

type FormState = "idle" | "loading" | "success" | "error"

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

interface WaitlistFormProps {
  compact?: boolean
}

export function WaitlistForm({ compact = false }: WaitlistFormProps) {
  const [email, setEmail] = useState("")
  const [state, setState] = useState<FormState>("idle")
  const [errorMsg, setErrorMsg] = useState("")

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setErrorMsg("")

    const normalizedEmail = email.trim().toLowerCase()

    if (!isValidEmail(normalizedEmail)) {
      setErrorMsg("Veuillez entrer une adresse email valide.")
      return
    }

    setState("loading")

    try {
      const response = await fetch("/api/waitlist", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: normalizedEmail }),
      })

      const data = (await response.json().catch(() => null)) as { error?: string } | null

      if (!response.ok) {
        throw new Error(data?.error || "Une erreur est survenue. Veuillez réessayer.")
      }

      setEmail("")
      setState("success")
    } catch (error) {
      setState("error")
      setErrorMsg(
        error instanceof Error
          ? error.message
          : "Une erreur est survenue. Veuillez réessayer."
      )
    }
  }

  if (state === "success") {
    return (
      <div
        className="flex flex-col items-center gap-3 py-4 animate-in fade-in slide-in-from-bottom-3 duration-500"
        role="status"
        aria-live="polite"
      >
        <div className="w-11 h-11 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
            <path d="M4 10l4.5 4.5L16 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="text-primary" style={{ stroke: "var(--color-primary, oklch(0.42 0.12 145))" }} />
          </svg>
        </div>
        <p className="text-base font-semibold text-foreground">Vous êtes inscrit·e !</p>
        <p className="text-sm text-muted-foreground text-center max-w-xs">
          Nous vous enverrons un email dès l&apos;ouverture du site le <strong>1er avril 2026</strong>.
        </p>
      </div>
    )
  }

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className={compact ? "w-full" : "flex flex-col items-center gap-4 w-full"}
      aria-label="Formulaire d'inscription à la liste d'attente"
    >
      <div className={compact ? "flex flex-col sm:flex-row gap-2 w-full" : "flex flex-col sm:flex-row gap-2 w-full max-w-md"}>
        <label htmlFor="waitlist-email" className="sr-only">
          Adresse email
        </label>
        <input
          id="waitlist-email"
          type="email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value)
            if (errorMsg) setErrorMsg("")
            if (state === "error") setState("idle")
          }}
          placeholder="votre@email.fr"
          required
          aria-invalid={!!errorMsg}
          aria-describedby={errorMsg ? "waitlist-error" : undefined}
          disabled={state === "loading"}
          className="flex-1 bg-card border border-border rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-colors disabled:opacity-60"
        />
        <button
          type="submit"
          disabled={state === "loading"}
          className="inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground rounded-xl px-6 py-3 text-sm font-semibold hover:bg-primary/90 transition-all duration-200 hover:scale-[1.02] active:scale-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-ring focus-visible:outline-offset-2 disabled:opacity-70 disabled:pointer-events-none whitespace-nowrap shadow-sm"
        >
          {state === "loading" ? (
            <>
              <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Inscription...
            </>
          ) : (
            "M'alerter"
          )}
        </button>
      </div>

      {errorMsg && (
        <p id="waitlist-error" role="alert" className="text-sm text-destructive text-center">
          {errorMsg}
        </p>
      )}

      {!errorMsg && (
        <p className={`text-xs text-muted-foreground ${compact ? "" : "text-center"}`}>
          Aucun spam. Vous pouvez vous désinscrire à tout moment.
        </p>
      )}
    </form>
  )
}
