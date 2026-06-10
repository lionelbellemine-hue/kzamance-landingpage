import type { Metadata, Viewport } from "next"
import { Google_Sans, Poppins } from "next/font/google"
import "./globals.css"

const googleSans = Google_Sans({
  subsets: ["latin"],
  variable: "--font-google-sans",
  weight: ["400", "500", "700"],
  adjustFontFallback: false,
})

// Police de l'application K-zamance, réutilisée sur les LP pro (classe .pro-theme).
const poppins = Poppins({
  subsets: ["latin"],
  variable: "--font-poppins",
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
})

export const viewport: Viewport = {
  themeColor: "#163422",
}

export const metadata: Metadata = {
  metadataBase: new URL("https://pro.k-zamance.fr"),
  title: "K-zamance",
  description:
    "K-zamance relie les producteurs locaux et les consommateurs de leur région, en direct.",
  applicationName: "K-zamance",
  // Sous-domaine de campagnes : on n'indexe pas.
  robots: { index: false, follow: false },
  manifest: "/site.webmanifest",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "32x32", type: "image/x-icon" },
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon-96x96.png", sizes: "96x96", type: "image/png" },
    ],
    shortcut: "/favicon.ico",
    apple: { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
  },
  openGraph: {
    type: "website",
    locale: "fr_FR",
    siteName: "K-zamance",
    title: "K-zamance",
    description:
      "K-zamance relie les producteurs locaux et les consommateurs de leur région, en direct.",
    images: [{ url: "/og-image.png", alt: "K-zamance" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "K-zamance",
    description:
      "K-zamance relie les producteurs locaux et les consommateurs de leur région, en direct.",
    images: ["/og-image.png"],
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="fr">
      <body className={`${googleSans.variable} ${poppins.variable} font-sans antialiased`}>
        {children}
      </body>
    </html>
  )
}
