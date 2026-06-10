import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { ProLeadForm } from "@/components/pro-lead-form"
import { readPrefill, type LeadPrefill } from "@/lib/leads"
import { getAllSegments, getSegment, type Segment } from "@/lib/segments"

export const dynamicParams = true

export function generateStaticParams() {
  return getAllSegments().map((s) => ({ segment: s.slug }))
}

// Génère une URL Pexels recadrée à la bonne taille (CDN, sans clé).
function px(url: string, w: number, h: number): string {
  return `${url}?auto=compress&cs=tinysrgb&fit=crop&w=${w}&h=${h}`
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ segment: string }>
}): Promise<Metadata> {
  const { segment } = await params
  const data = getSegment(segment)
  if (!data) return { title: "K-zamance" }
  return {
    title: data.metaTitle,
    description: data.metaDescription,
    robots: { index: false, follow: false },
    openGraph: {
      title: data.metaTitle,
      description: data.metaDescription,
      images: [{ url: px(data.images.hero, 1200, 630) }],
    },
  }
}

// ─── UI ──────────────────────────────────────────────────────────────────────

function Logo({ light = false }: { light?: boolean }) {
  return (
    <a href="https://k-zamance.fr" className="flex items-center gap-2.5" aria-label="K-zamance">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="https://k-zamance.fr/logo2.png"
        width="32"
        height="32"
        alt=""
        className="h-8 w-8 flex-shrink-0 rounded-full"
      />
      <span
        className={`text-base font-semibold tracking-tight ${light ? "text-white" : "text-foreground"}`}
      >
        K-zamance
      </span>
    </a>
  )
}

function CheckIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path
        d="M4 10l4.5 4.5L16 6"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function ArrowIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path
        d="M3 8h10M9 4l4 4-4 4"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

// Hero avec le formulaire (2 colonnes desktop, empilé sur mobile).
function Hero({ data, initial }: { data: Segment; initial: LeadPrefill }) {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-[#14241c] via-[#163422] to-[#1f7a3a] px-5 pt-28 pb-16 md:pt-32 md:pb-20">
      <div className="mx-auto grid max-w-6xl items-center gap-10 lg:grid-cols-2">
        {/* Texte */}
        <div className="flex flex-col gap-5 text-center lg:text-left">
          <span className="mx-auto inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-white backdrop-blur-sm lg:mx-0 lg:w-fit">
            <span aria-hidden="true">🐝</span>
            {data.eyebrow}
          </span>
          <h1 className="text-balance text-3xl font-bold leading-tight text-white sm:text-4xl md:text-5xl">
            {data.title} <span className="text-amber-300">{data.titleAccent}</span>
          </h1>
          <p className="text-balance leading-relaxed text-white/85">{data.subtitle}</p>
          <ul className="mx-auto flex flex-col gap-2.5 text-left lg:mx-0">
            {data.heroBullets.map((b) => (
              <li key={b} className="flex items-start gap-2.5 text-sm font-medium text-white/95">
                <span className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-amber-300 text-[#14241c]">
                  <CheckIcon />
                </span>
                {b}
              </li>
            ))}
          </ul>
          <p className="text-xs text-white/65">
            Sans engagement · Réponse sous 48h · Pilote Gard &amp; Ardèche
          </p>
        </div>

        {/* Formulaire dans le hero */}
        <div
          id="rappel"
          className="scroll-mt-24 rounded-3xl border border-black/5 bg-card p-6 shadow-2xl shadow-black/20 md:p-7"
        >
          <div className="mb-5">
            <h2 className="text-xl font-bold text-foreground">{data.formTitle}</h2>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              {data.formSubtitle}
            </p>
          </div>
          <ProLeadForm
            segment={data.slug}
            establishmentLabel={data.establishmentLabel}
            establishmentPlaceholder={data.establishmentPlaceholder}
            initial={initial}
          />
        </div>
      </div>
    </section>
  )
}

function TrustBar() {
  const items = [
    "Sans commission cachée",
    "Vous fixez vos prix",
    "Notre équipe vous répond",
    "100 % local (Gard & Ardèche)",
  ]
  return (
    <section className="border-b border-border bg-muted/40 px-5 py-5">
      <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-center gap-x-8 gap-y-3">
        {items.map((label) => (
          <span
            key={label}
            className="inline-flex items-center gap-2 text-sm font-medium text-foreground/80"
          >
            <span className="text-primary">
              <CheckIcon />
            </span>
            {label}
          </span>
        ))}
      </div>
    </section>
  )
}

function Benefits({ data }: { data: Segment }) {
  return (
    <section className="px-5 py-16 md:py-20">
      <div className="mx-auto max-w-5xl">
        <h2 className="mb-10 text-center text-2xl font-bold text-foreground md:text-3xl">
          Pourquoi K-zamance ?
        </h2>
        <div className="grid gap-5 md:grid-cols-3">
          {data.benefits.map((b) => (
            <div
              key={b.title}
              className="flex flex-col gap-3 rounded-2xl border border-border bg-card p-6"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <CheckIcon />
              </div>
              <h3 className="text-lg font-semibold text-foreground">{b.title}</h3>
              <p className="text-sm leading-relaxed text-muted-foreground">{b.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function Showcase({ data }: { data: Segment }) {
  return (
    <section className="bg-muted/40 px-5 py-16 md:py-20">
      <div className="mx-auto grid max-w-5xl items-center gap-8 md:grid-cols-2">
        <div className="overflow-hidden rounded-3xl border border-border shadow-sm">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={px(data.images.showcase, 900, 720)}
            alt=""
            loading="lazy"
            className="aspect-[5/4] w-full object-cover"
          />
        </div>
        <div className="flex flex-col items-start gap-4">
          <h2 className="text-balance text-2xl font-bold leading-snug text-foreground md:text-3xl">
            {data.showcaseTitle}
          </h2>
          <p className="leading-relaxed text-muted-foreground">{data.showcaseText}</p>
          <a
            href="#rappel"
            className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Être rappelé
            <ArrowIcon />
          </a>
        </div>
      </div>
    </section>
  )
}

function Steps({ data }: { data: Segment }) {
  return (
    <section className="px-5 py-16 md:py-20">
      <div className="mx-auto max-w-4xl">
        <div className="mb-12 text-center">
          <span className="text-xs font-semibold uppercase tracking-widest text-primary">
            Comment ça marche
          </span>
          <h2 className="mt-3 text-balance text-2xl font-bold text-foreground md:text-3xl">
            Trois étapes, zéro prise de tête
          </h2>
        </div>
        <div className="grid gap-8 md:grid-cols-3">
          {data.steps.map((step, i) => (
            <div key={step.title} className="flex flex-col items-center gap-3 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-base font-semibold text-primary-foreground">
                {i + 1}
              </div>
              <h3 className="text-lg font-semibold text-foreground">{step.title}</h3>
              <p className="text-sm leading-relaxed text-muted-foreground">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

const FAQ_ITEMS = [
  {
    q: "C'est quoi K-zamance, concrètement ?",
    a: "Une marketplace locale qui met votre production directement devant les habitants et les commerces de votre région. Pas d'intermédiaire qui rogne vos marges : vous vendez, vous gardez la main.",
  },
  {
    q: "Combien ça coûte ?",
    a: "On en parle de vive voix, simplement, sans mauvaise surprise. L'appel ne vous engage à rien.",
  },
  {
    q: "Je dois gérer la livraison ?",
    a: "Oui. Vous préparez et expédiez les commandes : livraison en point relais ou à domicile. De notre côté, on vous amène les clients et on centralise les commandes.",
  },
  {
    q: "Je n'ai pas de temps pour l'administratif.",
    a: "C'est justement notre travail. Vous laissez vos coordonnées, notre équipe s'occupe du reste : fiche, mise en avant, commandes.",
  },
  {
    q: "Et si ça ne me convient pas ?",
    a: "Aucun engagement. L'échange sert juste à voir si on est faits pour travailler ensemble. Vous décidez ensuite.",
  },
]

function Faq() {
  return (
    <section className="bg-muted/40 px-5 py-16 md:py-20">
      <div className="mx-auto max-w-2xl">
        <div className="mb-10 text-center">
          <span className="text-xs font-semibold uppercase tracking-widest text-primary">
            Vos questions
          </span>
          <h2 className="mt-3 text-balance text-2xl font-bold text-foreground md:text-3xl">
            Les questions qu'on nous pose
          </h2>
        </div>
        <div className="flex flex-col gap-3">
          {FAQ_ITEMS.map((item) => (
            <details key={item.q} className="group rounded-2xl border border-border bg-card p-5">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-semibold text-foreground">
                {item.q}
                <span className="text-2xl leading-none text-primary transition-transform duration-200 group-open:rotate-45">
                  +
                </span>
              </summary>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{item.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  )
}

function FinalCta({ data }: { data: Segment }) {
  return (
    <section className="px-5 py-16 md:py-20">
      <div className="mx-auto flex max-w-2xl flex-col items-center gap-5 text-center">
        <h2 className="text-balance text-2xl font-bold text-foreground md:text-3xl">
          {data.finalTitle}
        </h2>
        <p className="leading-relaxed text-muted-foreground">{data.finalText}</p>
        <a
          href="#rappel"
          className="inline-flex items-center gap-2 rounded-full bg-primary px-7 py-3.5 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/20 transition-all duration-200 hover:scale-105 hover:bg-primary/90"
        >
          Être rappelé
          <ArrowIcon />
        </a>
      </div>
    </section>
  )
}

function StickyMobileCta() {
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-background/95 p-3 backdrop-blur md:hidden">
      <a
        href="#rappel"
        className="flex h-12 items-center justify-center rounded-xl bg-primary text-sm font-semibold text-primary-foreground"
      >
        En savoir plus
      </a>
    </div>
  )
}

// ─── Page ──────────────────────────────────────────────────────────────────────

export default async function SegmentPage({
  params,
  searchParams,
}: {
  params: Promise<{ segment: string }>
  searchParams: Promise<Record<string, string | string[] | undefined>>
}) {
  const { segment } = await params
  const data = getSegment(segment)
  if (!data) notFound()

  const initial = readPrefill(await searchParams)

  return (
    <div className="pro-theme min-h-screen bg-background text-foreground">
      <header className="fixed top-0 right-0 left-0 z-50 border-b border-white/10 bg-[#14241c]/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5">
          <Logo light />
          <a
            href="#rappel"
            className="inline-flex items-center rounded-full bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Être rappelé
          </a>
        </div>
      </header>
      <main className="pb-20 md:pb-0">
        <Hero data={data} initial={initial} />
        <TrustBar />
        <Benefits data={data} />
        <Showcase data={data} />
        <Steps data={data} />
        <Faq />
        <FinalCta data={data} />
      </main>
      <footer className="border-t border-border bg-muted/30 px-5 py-10">
        <div className="mx-auto flex max-w-5xl flex-col items-center gap-2 text-center">
          <Logo />
          <p className="mt-2 max-w-md text-xs leading-relaxed text-muted-foreground">
            K-zamance, la marketplace qui met les producteurs locaux en lien direct avec ceux qui
            achètent près de chez eux.
          </p>
          <p className="mt-2 text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} K-zamance. Tous droits réservés.
          </p>
        </div>
      </footer>
      <StickyMobileCta />
    </div>
  )
}
