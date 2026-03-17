import { cn } from "@/lib/utils"

interface FeatureCardProps {
  icon: React.ReactNode
  title: string
  description: string
  className?: string
}

export function FeatureCard({ icon, title, description, className }: FeatureCardProps) {
  return (
    <article
      className={cn(
        "group flex flex-col gap-4 bg-card rounded-2xl border border-border p-6 transition-all duration-300 hover:shadow-md hover:-translate-y-0.5",
        className
      )}
    >
      <div className="w-11 h-11 rounded-xl bg-primary/10 border border-primary/15 flex items-center justify-center text-primary flex-shrink-0 transition-colors duration-200 group-hover:bg-primary/15">
        {icon}
      </div>
      <div>
        <h3 className="text-base font-semibold text-foreground mb-1.5">{title}</h3>
        <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
      </div>
    </article>
  )
}

interface AudienceCardProps {
  audience: "consommateurs" | "producteurs"
  icon: React.ReactNode
  title: string
  subtitle: string
  points: string[]
}

export function AudienceCard({ audience, icon, title, subtitle, points }: AudienceCardProps) {
  const isConsumer = audience === "consommateurs"

  return (
    <article
      className={cn(
        "flex flex-col gap-5 rounded-3xl p-7 md:p-8 border transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5",
        isConsumer
          ? "bg-primary/5 border-primary/20"
          : "bg-accent/10 border-accent/25"
      )}
    >
      <div className={cn(
        "w-12 h-12 rounded-2xl flex items-center justify-center",
        isConsumer ? "bg-primary/15 text-primary" : "bg-accent/25 text-foreground"
      )}>
        {icon}
      </div>
      <div>
        <h3 className="text-xl font-semibold text-foreground mb-1">{title}</h3>
        <p className="text-sm font-medium text-muted-foreground">{subtitle}</p>
      </div>
      <ul className="flex flex-col gap-2.5" role="list">
        {points.map((point) => (
          <li key={point} className="flex items-start gap-2.5 text-sm text-foreground/80 leading-relaxed">
            <span
              className={cn(
                "mt-1 w-1.5 h-1.5 rounded-full flex-shrink-0",
                isConsumer ? "bg-primary" : "bg-accent"
              )}
              aria-hidden="true"
            />
            {point}
          </li>
        ))}
      </ul>
    </article>
  )
}

interface StepCardProps {
  number: number
  title: string
  description: string
}

export function StepCard({ number, title, description }: StepCardProps) {
  return (
    <div className="flex flex-col items-center text-center gap-4 px-4">
      <div className="relative">
        <div className="w-14 h-14 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xl font-bold shadow-md shadow-primary/20">
          {number}
        </div>
      </div>
      <div>
        <h3 className="text-base font-semibold text-foreground mb-1.5">{title}</h3>
        <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
      </div>
    </div>
  )
}
