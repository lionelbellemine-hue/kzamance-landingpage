"use client"

import { useEffect, useState } from "react"

// La racine de pro.k-zamance.fr ne sert qu'aux campagnes (les LP vivent sur
// /<segment>). On affiche un petit loader sympa puis on redirige vers le site.
const TARGET = "https://k-zamance.fr"

export default function HomeRedirect() {
  const [go, setGo] = useState(false)

  useEffect(() => {
    const raf = requestAnimationFrame(() => setGo(true))
    const timer = setTimeout(() => window.location.replace(TARGET), 3000)
    return () => {
      cancelAnimationFrame(raf)
      clearTimeout(timer)
    }
  }, [])

  return (
    <main className="pro-theme flex min-h-screen flex-col items-center justify-center gap-6 bg-background px-6 text-center text-foreground">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="https://k-zamance.fr/logo2.png"
        width="64"
        height="64"
        alt="K-zamance"
        className="h-16 w-16 rounded-full"
      />

      <div className="max-w-md space-y-2">
        <h1 className="text-2xl font-bold text-foreground">On vous emmène sur K-zamance 🍃</h1>
        <p className="leading-relaxed text-muted-foreground">
          Cette adresse sert à nos campagnes. On vous redirige vers le site principal, deux petites
          secondes…
        </p>
      </div>

      {/* Barre de chargement (se remplit en 3 s) */}
      <div className="h-1.5 w-56 overflow-hidden rounded-full bg-muted" aria-hidden="true">
        <div
          className="h-full rounded-full bg-primary transition-[width] duration-[3000ms] ease-linear"
          style={{ width: go ? "100%" : "0%" }}
        />
      </div>

      <a
        href={TARGET}
        className="text-sm font-semibold text-primary underline-offset-4 hover:underline"
      >
        Y aller tout de suite →
      </a>
    </main>
  )
}
