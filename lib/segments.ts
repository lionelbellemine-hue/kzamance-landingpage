// Registre des cibles (segments) de landing pages pro.
// Chaque campagne Brevo pointe vers /<slug> (ex. pro.k-zamance.fr/producteur-miel-gard).
// Ajouter une cible = ajouter une entrée ici. Rien d'autre à toucher.
//
// Images : URLs Pexels (CDN public images.pexels.com, hotlink autorisé, sans clé).
// Toutes vérifiées en HTTP 200. À remplacer plus tard par tes propres photos.

export interface SegmentBenefit {
  title: string
  description: string
}

export interface SegmentStep {
  title: string
  description: string
}

export interface SegmentImages {
  hero: string
  showcase: string
  form: string
}

export interface Segment {
  slug: string
  // Hero
  eyebrow: string
  title: string
  titleAccent: string
  subtitle: string
  heroBullets: string[]
  // Arguments de vente
  benefits: SegmentBenefit[]
  // Bande image + texte
  showcaseTitle: string
  showcaseText: string
  // Déroulé
  steps: SegmentStep[]
  // Formulaire
  formTitle: string
  formSubtitle: string
  establishmentLabel: string
  establishmentPlaceholder: string
  // Bandeau final
  finalTitle: string
  finalText: string
  // Visuels
  images: SegmentImages
  // Métadonnées (CRM + email équipe)
  audienceLabel: string
  zone?: string
  // SEO / partage
  metaTitle: string
  metaDescription: string
}

const SEGMENTS: Record<string, Segment> = {
  "producteur-miel-gard": {
    slug: "producteur-miel-gard",
    eyebrow: "Apiculteurs du Gard",
    title: "Et si vos pots de miel se vendaient",
    titleAccent: "autrement ?",
    subtitle:
      "K-zamance vous met en relation directe avec des acheteurs - particuliers comme commerces - de votre région et de toute la France. Vous fixez vos prix, on s'occupe de vous trouver des clients.",
    heroBullets: [
      "Vous fixez vos prix, vous gardez la marge",
      "Des clients qui achètent en direct, pas des grossistes",
      "Aucun temps en plus : on gère la vente et les commandes",
    ],
    benefits: [
      {
        title: "Vous gardez la main sur vos prix",
        description:
          "Plus besoin de brader vos pots à un grossiste qui les revend trois fois plus cher. Ici, c'est vous qui fixez le prix, et la marge reste dans votre poche.",
      },
      {
        title: "Des clients juste à côté",
        description:
          "Les habitants, les épiceries et les restaurants du Gard cherchent du vrai miel local. On vous met en relation avec eux, directement.",
      },
      {
        title: "On s'occupe de tout ce qui n'est pas le miel",
        description:
          "La fiche, les photos, les commandes, la mise en relation : c'est notre travail. Vous, vous restez avec vos abeilles.",
      },
    ],
    showcaseTitle: "Vous savez récolter le miel, on sait le vendre !",
    showcaseText:
      "K-zamance vous trouve des clients réguliers près de chez vous et gère les commandes en ligne. Vous préparez et vous expédiez, votre miel part sans que vous ayez à courir après.",
    steps: [
      {
        title: "Vous laissez vos coordonnées",
        description:
          "Quelques infos, trente secondes. C'est tout ce qu'on vous demande aujourd'hui.",
      },
      {
        title: "Notre équipe vous rappelle",
        description:
          "Pas un robot, pas un commercial : quelqu'un de notre équipe vous rappelle pour comprendre votre activité et voir si on peut travailler ensemble.",
      },
      {
        title: "Vous commencez à vendre",
        description: "On crée votre fiche producteur et les premières commandes locales arrivent.",
      },
    ],
    formTitle: "Être rappelé",
    formSubtitle:
      "Laissez vos coordonnées, notre équipe vous rappelle pour en parler. Sans engagement, et sans vous faire perdre votre temps.",
    establishmentLabel: "Raison sociale",
    establishmentPlaceholder: "Ex. Les Ruchers du Gardon",
    finalTitle: "Envie d'en parler ?",
    finalText:
      "On lance notre pilote dans le Gard et on cherche quelques producteurs pour démarrer. Laissez vos coordonnées, on vous rappelle.",
    images: {
      hero: "https://images.pexels.com/photos/2260933/pexels-photo-2260933.jpeg",
      showcase: "https://images.pexels.com/photos/5634212/pexels-photo-5634212.jpeg",
      form: "https://images.pexels.com/photos/714522/pexels-photo-714522.jpeg",
    },
    audienceLabel: "Producteur de miel (Gard)",
    zone: "Gard (30)",
    metaTitle: "Vendez votre miel en direct (Gard) | K-zamance",
    metaDescription:
      "Apiculteurs du Gard : vendez votre miel en direct, à votre prix, aux habitants et commerces de votre région. Laissez vos coordonnées, on vous rappelle.",
  },
  "producteur-gard": {
    slug: "producteur-gard",
    eyebrow: "Producteurs du Gard et de l'Ardèche",
    title: "Et si vos produits se vendaient",
    titleAccent: "autrement ?",
    subtitle:
      "K-zamance vous met en relation directe avec des acheteurs - particuliers comme commerces - de votre région et de toute la France. Vous fixez vos prix, on s'occupe de vous trouver des clients.",
    heroBullets: [
      "Vous fixez vos prix, vous gardez la marge",
      "Des clients locaux, pas des intermédiaires",
      "Aucun temps en plus : on gère la vente et les commandes",
    ],
    benefits: [
      {
        title: "Vous gardez la main sur vos prix",
        description:
          "Plus d'intermédiaire qui prend sa part au passage. Vous vendez à votre prix, directement à ceux qui vous achètent.",
      },
      {
        title: "Des clients près de chez vous",
        description:
          "Les habitants, les épiceries et les restaurants de votre région cherchent du local. On vous met en relation avec eux, directement.",
      },
      {
        title: "On s'occupe de tout le reste",
        description:
          "Fiche, mise en avant, commandes, mise en relation : c'est notre travail. Vous, vous restez sur votre métier.",
      },
    ],
    showcaseTitle: "Vous produisez. Vendre, c'est notre métier.",
    showcaseText:
      "On vous trouve des clients réguliers près de chez vous et on gère les commandes en ligne. Vous préparez et vous expédiez, votre production part sans que vous y passiez vos soirées.",
    steps: [
      {
        title: "Vous laissez vos coordonnées",
        description:
          "Quelques infos, trente secondes. C'est tout ce qu'on vous demande aujourd'hui.",
      },
      {
        title: "Notre équipe vous rappelle",
        description:
          "Pas un robot, pas un commercial : quelqu'un de notre équipe vous rappelle pour comprendre votre activité et voir si on peut travailler ensemble.",
      },
      {
        title: "Vous commencez à vendre",
        description: "On crée votre fiche producteur et les premières commandes locales arrivent.",
      },
    ],
    formTitle: "Être rappelé",
    formSubtitle:
      "Laissez vos coordonnées, notre équipe vous rappelle pour en parler. Sans engagement, et sans vous faire perdre votre temps.",
    establishmentLabel: "Raison sociale",
    establishmentPlaceholder: "Ex. La Ferme des Cévennes",
    finalTitle: "Envie d'en parler ?",
    finalText:
      "On lance notre pilote dans le Gard et l'Ardèche et on cherche quelques producteurs pour démarrer. Laissez vos coordonnées, on vous rappelle.",
    images: {
      hero: "https://images.pexels.com/photos/31930012/pexels-photo-31930012.jpeg",
      showcase: "https://images.pexels.com/photos/14564807/pexels-photo-14564807.jpeg",
      form: "https://images.pexels.com/photos/9005793/pexels-photo-9005793.jpeg",
    },
    audienceLabel: "Producteur local (Gard / Ardèche)",
    zone: "Gard (30) et Ardèche (07)",
    metaTitle: "Vendez votre production en direct | K-zamance",
    metaDescription:
      "Producteurs du Gard et de l'Ardèche : vendez en direct, à votre prix, aux habitants et commerces de votre région. Laissez vos coordonnées, on vous rappelle.",
  },
}

export function getSegment(slug: string): Segment | null {
  return SEGMENTS[slug] ?? null
}

export function getAllSegments(): Segment[] {
  return Object.values(SEGMENTS)
}
