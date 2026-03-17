"use client"

import Image from "next/image"
import { useState } from "react"
import { Countdown } from "@/components/countdown"
import { WaitlistForm } from "@/components/waitlist-form"
import { FeatureCard, AudienceCard, StepCard } from "@/components/feature-card"

// ─── Icons ──────────────────────────────────────────────────────────────────

function LeafIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10z" />
      <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" />
    </svg>
  )
}

function MapPinIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  )
}

function ShieldIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  )
}

function SunIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
    </svg>
  )
}

function BasketIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
      <line x1="3" y1="6" x2="21" y2="6" />
      <path d="M16 10a4 4 0 0 1-8 0" />
    </svg>
  )
}

function TractorIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M3 4h9l1 7" />
      <path d="M4 11V4" />
      <path d="M8 10V4" />
      <path d="M18 5c0 0 1.5 1.5 1.5 3.5S18 12 18 12" />
      <circle cx="7" cy="15" r="3" />
      <circle cx="17" cy="15" r="2" />
      <path d="M10 15h4" />
      <path d="M13 11l1 1v4" />
    </svg>
  )
}

function SearchIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.35-4.35" />
    </svg>
  )
}

function PackageIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="m7.5 4.27 9 5.15" />
      <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" />
      <path d="m3.3 7 8.7 5 8.7-5" />
      <path d="M12 22V12" />
    </svg>
  )
}

function HeartIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
    </svg>
  )
}

// ─── Section Components ──────────────────────────────────────────────────────

function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="max-w-6xl mx-auto px-5 h-16 flex items-center justify-between">
        <a href="#" className="flex items-center gap-2.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-ring focus-visible:outline-offset-2 rounded-md" aria-label="K-zamance — Accueil">
          {/* Logo mark */}
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center flex-shrink-0" aria-hidden="true">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path d="M4 14V4l5 5 5-5v10" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <span className="text-base font-semibold text-foreground tracking-tight">K-zamance</span>
        </a>
        <div className="flex items-center gap-2">
          <span className="hidden sm:inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground bg-muted border border-border rounded-full px-3 py-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-primary" aria-hidden="true" />
            Ouverture le 1er avril 2026
          </span>
          <a
            href="#inscription"
            className="inline-flex items-center bg-primary text-primary-foreground rounded-full px-4 py-2 text-xs font-semibold hover:bg-primary/90 transition-colors duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-ring focus-visible:outline-offset-2"
          >
            Être informé
          </a>
        </div>
      </div>
    </header>
  )
}

function HeroSection({ isOpen, onOpeningReached }: { isOpen: boolean; onOpeningReached: () => void }) {
  return (
    <section
      className="relative min-h-[100svh] flex flex-col items-center justify-center pt-24 pb-16 px-5 overflow-hidden"
      aria-label="Présentation principale"
    >
      {/* Background image with overlay */}
      <div className="absolute inset-0 z-0" aria-hidden="true">
        <Image
          src="/images/hero-produce.jpg"
          alt=""
          fill
          className="object-cover object-center"
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-background/75" />
        {/* Subtle grain texture */}
        <div
          className="absolute inset-0 opacity-[0.025]"
          style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")", backgroundSize: "200px" }}
        />
      </div>

      <div className="relative z-10 flex flex-col items-center text-center gap-7 max-w-3xl">
        {/* Badge */}
        <div className="animate-in fade-in slide-in-from-bottom-3 duration-700 delay-150">
          <span className="inline-flex items-center gap-2 bg-primary/10 border border-primary/25 text-primary rounded-full px-4 py-1.5 text-xs font-semibold uppercase tracking-widest">
            <span className="w-1.5 h-1.5 rounded-full bg-primary" aria-hidden="true" />
            Bientôt disponible
          </span>
        </div>

        {/* Main heading */}
        <h1 className="animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200 font-serif text-4xl sm:text-5xl md:text-6xl font-semibold text-foreground leading-tight text-balance">
          Le local reprend{" "}
          <em className="not-italic text-primary">toute sa fraîcheur.</em>
        </h1>

        {/* Subheading */}
        <p className="animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300 text-base md:text-lg text-muted-foreground leading-relaxed max-w-xl text-balance">
          K-zamance relie directement <strong className="text-foreground font-medium">producteurs locaux</strong> et <strong className="text-foreground font-medium">consommateurs</strong> autour de produits frais, de saison, sans intermédiaire. Plus de proximité, plus de transparence, plus de goût.
        </p>

        {/* CTAs */}
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 delay-400 flex flex-col sm:flex-row items-center gap-3">
          <a
            href="#inscription"
            className="inline-flex items-center gap-2 bg-primary text-primary-foreground rounded-full px-7 py-3.5 text-sm font-semibold hover:bg-primary/90 transition-all duration-200 hover:scale-105 focus-visible:outline focus-visible:outline-2 focus-visible:outline-ring focus-visible:outline-offset-2 shadow-lg shadow-primary/20"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path d="M8 1.5A6.5 6.5 0 1 1 1.5 8 6.51 6.51 0 0 1 8 1.5zm.75 3.5v3.25L10.5 10 9.5 11 7.25 8.75V5h1.5z" fill="currentColor" />
            </svg>
            Être informé du lancement
          </a>
          <a
            href="#producteurs"
            className="inline-flex items-center gap-2 bg-background/80 border border-border text-foreground rounded-full px-6 py-3.5 text-sm font-medium hover:bg-muted transition-all duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-ring focus-visible:outline-offset-2"
          >
            Je suis producteur
          </a>
        </div>

        {/* Countdown */}
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 delay-500 w-full">
          {!isOpen && (
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-widest mb-4" aria-hidden="true">
              Ouverture dans
            </p>
          )}
          <Countdown onOpeningReached={onOpeningReached} />
        </div>
      </div>

      {/* Scroll indicator */}
      {!isOpen && (
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce" aria-hidden="true">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M10 4v12M5 11l5 5 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-muted-foreground" />
          </svg>
        </div>
      )}
    </section>
  )
}

function AudienceSection() {
  return (
    <section
      id="producteurs"
      className="py-20 md:py-28 px-5 bg-muted/40"
      aria-labelledby="audience-heading"
    >
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12 md:mb-16">
          <span className="text-xs font-semibold uppercase tracking-widest text-primary">Pour tous</span>
          <h2 id="audience-heading" className="mt-3 font-serif text-3xl md:text-4xl font-semibold text-foreground text-balance">
            Une plateforme pensée pour vous
          </h2>
        </div>
        <div className="grid md:grid-cols-2 gap-5 md:gap-6">
          <AudienceCard
            audience="consommateurs"
            icon={<BasketIcon />}
            title="Pour les consommateurs"
            subtitle="Retrouvez le goût du vrai, directement chez vous."
            points={[
              "Accédez à des produits frais cueillis à maturité",
              "Connaissez l'origine exacte de ce que vous mangez",
              "Soutenez l'agriculture locale et de saison",
              "Pré-réservez vos paniers avant la récolte",
            ]}
          />
          <AudienceCard
            audience="producteurs"
            icon={<TractorIcon />}
            title="Pour les producteurs"
            subtitle="Vendez mieux, sans intermédiaire."
            points={[
              "Accédez directement à vos clients locaux",
              "Anticipez vos récoltes grâce aux pré-commandes",
              "Valorisez votre travail à juste prix",
              "Construisez une relation de confiance durable",
            ]}
          />
        </div>
      </div>
    </section>
  )
}

function ValuesSection() {
  const values = [
    {
      icon: <LeafIcon />,
      title: "Durabilité",
      description: "Nous encourageons une agriculture respectueuse des cycles naturels, des sols et des hommes.",
    },
    {
      icon: <MapPinIcon />,
      title: "Proximité",
      description: "Chaque produit a un visage derrière lui. Moins de kilomètres, plus de sens.",
    },
    {
      icon: <ShieldIcon />,
      title: "Confiance",
      description: "Traçabilité complète, prix justes, aucun intermédiaire opaque. Vous savez ce que vous mangez.",
    },
    {
      icon: <SunIcon />,
      title: "Impact positif",
      description: "Ensemble, chaque achat contribue à une économie locale plus résiliente et plus humaine.",
    },
  ]

  return (
    <section
      className="py-20 md:py-28 px-5"
      aria-labelledby="values-heading"
    >
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12 md:mb-16">
          <span className="text-xs font-semibold uppercase tracking-widest text-primary">Nos engagements</span>
          <h2 id="values-heading" className="mt-3 font-serif text-3xl md:text-4xl font-semibold text-foreground text-balance">
            Ce en quoi nous croyons
          </h2>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {values.map((v) => (
            <FeatureCard key={v.title} icon={v.icon} title={v.title} description={v.description} />
          ))}
        </div>
      </div>
    </section>
  )
}

function HowItWorksSection() {
  const steps = [
    {
      number: 1,
      title: "Découvrez les producteurs",
      icon: <SearchIcon />,
      description: "Parcourez les fiches des producteurs locaux près de chez vous et leurs produits de saison.",
    },
    {
      number: 2,
      title: "Pré-réservez votre panier",
      icon: <BasketIcon />,
      description: "Choisissez vos produits à l'avance. Le producteur prépare votre commande en fonction de la récolte.",
    },
    {
      number: 3,
      title: "Récupérez vos produits frais",
      icon: <PackageIcon />,
      description: "Récupérez directement chez le producteur ou en point relais. Simple, frais, local.",
    },
  ]

  return (
    <section
      className="py-20 md:py-28 px-5 bg-muted/40"
      aria-labelledby="how-heading"
    >
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12 md:mb-16">
          <span className="text-xs font-semibold uppercase tracking-widest text-primary">Fonctionnement</span>
          <h2 id="how-heading" className="mt-3 font-serif text-3xl md:text-4xl font-semibold text-foreground text-balance">
            Comment ça marchera ?
          </h2>
          <p className="mt-4 text-muted-foreground text-base max-w-md mx-auto">
            Simple, transparent et humain — comme les produits que vous allez trouver.
          </p>
        </div>

        {/* Steps with connecting line on desktop */}
        <div className="relative grid md:grid-cols-3 gap-10 md:gap-6">
          {/* Connector line */}
          <div className="hidden md:block absolute top-7 left-[calc(16.67%+1.75rem)] right-[calc(16.67%+1.75rem)] h-px bg-border" aria-hidden="true" />
          {steps.map((step) => (
            <StepCard
              key={step.number}
              number={step.number}
              title={step.title}
              description={step.description}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

function WaitlistSection() {
  return (
    <section
      id="inscription"
      className="py-20 md:py-28 px-5"
      aria-labelledby="waitlist-heading"
    >
      <div className="max-w-xl mx-auto flex flex-col items-center text-center gap-6">
        {/* Icon */}
        <div className="w-14 h-14 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
          <HeartIcon />
        </div>

        <div>
          <span className="text-xs font-semibold uppercase tracking-widest text-primary">Pré-inscription</span>
          <h2 id="waitlist-heading" className="mt-3 font-serif text-3xl md:text-4xl font-semibold text-foreground text-balance">
            Soyez parmi les premiers informés
          </h2>
          <p className="mt-4 text-muted-foreground text-base leading-relaxed">
            Le site ouvre le <strong className="text-foreground font-medium">1er avril 2026</strong>. Laissez votre email pour être averti dès l'ouverture et accéder en avant-première à la plateforme.
          </p>
        </div>

        <div className="w-full mt-2">
          <WaitlistForm />
        </div>

        {/* Trust badges */}
        <div className="flex flex-wrap items-center justify-center gap-4 mt-2">
          {[
            { icon: <ShieldIcon />, text: "Données protégées" },
            { icon: <LeafIcon />, text: "Projet engagé" },
            { icon: <MapPinIcon />, text: "100 % local" },
          ].map((badge) => (
            <div key={badge.text} className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <span className="w-3.5 h-3.5 text-primary" aria-hidden="true">
                {badge.icon}
              </span>
              {badge.text}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function Footer() {
  return (
    <footer className="border-t border-border bg-muted/30 py-12 px-5">
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
          {/* Brand */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center flex-shrink-0" aria-hidden="true">
                <svg width="16" height="16" viewBox="0 0 18 18" fill="none">
                  <path d="M4 14V4l5 5 5-5v10" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <span className="text-sm font-semibold text-foreground">K-zamance</span>
            </div>
            <p className="text-xs text-muted-foreground max-w-[240px] leading-relaxed">
              La plateforme qui rapproche producteurs et consommateurs autour du frais, du local et du saisonnier.
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Ouverture le{" "}
              <time dateTime="2026-04-01" className="font-medium text-foreground/70">
                1er avril 2026
              </time>
            </p>
          </div>

          {/* Links */}
          <nav aria-label="Liens du pied de page">
            <ul className="flex flex-wrap gap-x-6 gap-y-2" role="list">
              {[
                { label: "Contact", href: "#" },
                { label: "Mentions légales", href: "#" },
                { label: "Confidentialité", href: "#" },
                { label: "CGU", href: "#" },
              ].map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-xs text-muted-foreground hover:text-foreground transition-colors duration-150 focus-visible:outline focus-visible:outline-2 focus-visible:outline-ring focus-visible:outline-offset-2 rounded"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="mt-8 pt-6 border-t border-border flex items-center justify-between gap-4 flex-wrap">
          <p className="text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} K-zamance. Tous droits réservés.
          </p>
          <p className="text-xs text-muted-foreground">
            Fait avec soin, pour le local.
          </p>
        </div>
      </div>
    </footer>
  )
}

// ─── Page ────────────────────────────────────────────────────────────────────

export default function HomePage() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <main>
        <HeroSection isOpen={isOpen} onOpeningReached={() => setIsOpen(true)} />
        <AudienceSection />
        <ValuesSection />
        <HowItWorksSection />
        <WaitlistSection />
      </main>
      <Footer />
    </div>
  )
}
