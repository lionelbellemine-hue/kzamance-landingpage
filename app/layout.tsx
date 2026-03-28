import type { Metadata } from 'next'
import { Google_Sans } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

const googleSans = Google_Sans({
  subsets: ['latin'],
  variable: '--font-google-sans',
  weight: ['400', '500', '700'],
  adjustFontFallback: false,
})

export const metadata: Metadata = {
  title: 'K-zamance — Ouverture le 4 mai 2026',
  description:
    "K-zamance est la plateforme qui relie les producteurs locaux et les consommateurs autour de produits frais, locaux et de saison. Moins d'intermédiaires, plus de transparence, plus de goût.",
  generator: 'v0.app',
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="fr">
      <body className={`${googleSans.variable} font-sans antialiased`}>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
