"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import type { LeadPrefill } from "@/lib/leads"

type FormState = "idle" | "loading" | "success" | "error"

interface ProLeadFormProps {
  segment: string
  establishmentLabel: string
  establishmentPlaceholder: string
  initial?: LeadPrefill
}

export function ProLeadForm({
  segment,
  establishmentLabel,
  establishmentPlaceholder,
  initial,
}: ProLeadFormProps) {
  const [state, setState] = useState<FormState>("idle")
  const [errorMsg, setErrorMsg] = useState("")

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setErrorMsg("")

    const form = e.currentTarget
    const data = new FormData(form)
    const body = {
      segment,
      firstName: String(data.get("firstName") ?? "").trim(),
      lastName: String(data.get("lastName") ?? "").trim(),
      company: String(data.get("company") ?? "").trim(),
      phone: String(data.get("phone") ?? "").trim(),
      email: String(data.get("email") ?? "").trim(),
    }

    if (!body.firstName || !body.lastName || !body.company || !body.phone) {
      setErrorMsg("Prénom, nom, établissement et téléphone sont requis.")
      return
    }

    setState("loading")
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      })
      const json = (await res.json().catch(() => null)) as { error?: string } | null
      if (!res.ok) {
        throw new Error(json?.error || "Une erreur est survenue. Réessayez.")
      }
      form.reset()
      setState("success")
    } catch (err) {
      setState("error")
      setErrorMsg(err instanceof Error ? err.message : "Une erreur est survenue. Réessayez.")
    }
  }

  if (state === "success") {
    return (
      <div
        className="flex flex-col items-center gap-3 rounded-2xl border border-primary/20 bg-primary/5 px-6 py-10 text-center animate-in fade-in slide-in-from-bottom-3 duration-500"
        role="status"
        aria-live="polite"
      >
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
          <svg width="22" height="22" viewBox="0 0 20 20" fill="none" aria-hidden="true">
            <path
              d="M4 10l4.5 4.5L16 6"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <p className="text-lg font-semibold text-foreground">C'est noté, merci.</p>
        <p className="max-w-sm text-sm text-muted-foreground">
          Notre équipe vous rappelle très vite avec les coordonnées que vous avez laissées. À
          bientôt.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="firstName">Prénom *</Label>
          <Input
            id="firstName"
            name="firstName"
            autoComplete="given-name"
            required
            defaultValue={initial?.firstName}
            placeholder="Jean"
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="lastName">Nom *</Label>
          <Input
            id="lastName"
            name="lastName"
            autoComplete="family-name"
            required
            defaultValue={initial?.lastName}
            placeholder="Dupont"
          />
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="company">{establishmentLabel} *</Label>
        <Input
          id="company"
          name="company"
          autoComplete="organization"
          required
          defaultValue={initial?.company}
          placeholder={establishmentPlaceholder}
        />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="phone">Téléphone *</Label>
          <Input
            id="phone"
            name="phone"
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            required
            defaultValue={initial?.phone}
            placeholder="06 12 34 56 78"
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="email">
            Email <span className="font-normal text-muted-foreground">(optionnel)</span>
          </Label>
          <Input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            defaultValue={initial?.email}
            placeholder="vous@exemple.fr"
          />
        </div>
      </div>

      {errorMsg && (
        <p role="alert" className="text-sm text-destructive">
          {errorMsg}
        </p>
      )}

      <Button
        type="submit"
        size="lg"
        disabled={state === "loading"}
        className="mt-1 h-12 rounded-xl text-sm font-semibold"
      >
        {state === "loading" ? (
          <>
            <svg className="size-4 animate-spin" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
              />
            </svg>
            Envoi en cours
          </>
        ) : (
          "En savoir plus"
        )}
      </Button>

      <p className="text-center text-xs text-muted-foreground">
        Sans engagement. On utilise vos coordonnées juste pour vous rappeler, rien d'autre.
      </p>
    </form>
  )
}
