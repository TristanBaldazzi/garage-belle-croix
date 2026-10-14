import type { Metadata } from 'next'
import { Inter, Barlow, Barlow_Condensed } from 'next/font/google'
import './globals.css'
import Script from 'next/script'
import { Toaster } from 'react-hot-toast'
import { SITE } from '@/lib/site'
import { getOpeningHours } from '@/lib/server-data'
import { getSlots } from '@/lib/hours'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })
const barlow = Barlow({ subsets: ['latin'], weight: ['400', '500', '600', '700'], variable: '--font-barlow' })
const barlowCondensed = Barlow_Condensed({
  subsets: ['latin'],
  weight: ['500', '600', '700', '800'],
  style: ['normal', 'italic'],
  variable: '--font-barlow-condensed',
})

const DEFAULT_DESCRIPTION =
  'Garage auto à Ennery, entre Metz et Thionville : entretien, réparation, pneus et vidange. Devis gratuit, prix annoncé avant intervention.'

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: 'Mécanique auto à Ennery (57) | Garage de la Belle Croix',
    template: '%s | Garage de la Belle Croix',
  },
  description: DEFAULT_DESCRIPTION,
  applicationName: SITE.name,
  authors: [{ name: SITE.name }],
  creator: 'Make My Design',
  formatDetection: { telephone: true, address: true, email: true },
  openGraph: {
    type: 'website',
    locale: 'fr_FR',
    siteName: SITE.name,
    title: 'Garage de la Belle Croix - La mécanique, sans détour',
    description: DEFAULT_DESCRIPTION,
    images: [{ url: `${SITE.url}/og-image.jpg`, width: 1200, height: 630, alt: 'Garage de la Belle Croix à Ennery' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Garage de la Belle Croix - Garage automobile à Ennery',
    description: DEFAULT_DESCRIPTION,
    images: [`${SITE.url}/og-image.jpg`],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1 },
  },
  other: {
    'geo.region': 'FR-57',
    'geo.placename': 'Ennery',
    'geo.position': `${SITE.lat};${SITE.lng}`,
    ICBM: `${SITE.lat}, ${SITE.lng}`,
  },
}

const SCHEMA_DAYS: Record<string, string> = {
  monday: 'Monday',
  tuesday: 'Tuesday',
  wednesday: 'Wednesday',
  thursday: 'Thursday',
  friday: 'Friday',
  saturday: 'Saturday',
  sunday: 'Sunday',
}

// Données structurées pour Google (fiche entreprise locale)
const buildLocalBusinessJsonLd = (hours: Awaited<ReturnType<typeof getOpeningHours>>) => ({
  '@context': 'https://schema.org',
  '@type': 'AutoRepair',
  '@id': `${SITE.url}/#garage`,
  name: SITE.name,
  url: SITE.url,
  logo: `${SITE.url}/logo/logo-belle-croix-navy.png`,
  image: [`${SITE.url}/og-image.jpg`, `${SITE.url}/images/atelier-pont.jpg`],
  description: DEFAULT_DESCRIPTION,
  telephone: '+33609369490',
  contactPoint: [
    { '@type': 'ContactPoint', telephone: '+33609369490', contactType: 'customer service', areaServed: 'FR', availableLanguage: 'French' },
    { '@type': 'ContactPoint', telephone: '+33767759313', contactType: 'customer service', areaServed: 'FR', availableLanguage: 'French' },
  ],
  email: SITE.email,
  address: {
    '@type': 'PostalAddress',
    streetAddress: SITE.street,
    postalCode: SITE.postalCode,
    addressLocality: SITE.city,
    addressRegion: 'Moselle',
    addressCountry: 'FR',
  },
  geo: { '@type': 'GeoCoordinates', latitude: SITE.lat, longitude: SITE.lng },
  hasMap: SITE.mapsUrl,
  areaServed: ['Ennery', 'Metz', 'Thionville', 'Maizières-lès-Metz', 'Hagondange', 'Moselle'].map((name) => ({ '@type': 'Place', name })),
  currenciesAccepted: 'EUR',
  ...(hours && {
    openingHoursSpecification: Object.entries(SCHEMA_DAYS)
      // Une entrée par plage : horaires coupés (8h-12h / 14h-18h) bien décrits pour Google
      .flatMap(([key, day]) =>
        getSlots(hours[key]).map((slot) => ({
          '@type': 'OpeningHoursSpecification',
          dayOfWeek: `https://schema.org/${day}`,
          opens: slot.open,
          closes: slot.close,
        }))
      ),
  }),
  hasOfferCatalog: {
    '@type': 'OfferCatalog',
    name: 'Prestations',
    itemListElement: [
      'Entretien et révision automobile',
      'Réparation et diagnostic électronique',
      'Freinage, embrayage, distribution',
      'Pneus : montage, équilibrage, géométrie',
      'Vidange et filtre à huile',
    ].map((name) => ({ '@type': 'Offer', itemOffered: { '@type': 'Service', name } })),
  },
})

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const localBusinessJsonLd = buildLocalBusinessJsonLd(await getOpeningHours())

  return (
    <html lang="fr">
      <body className={`${inter.variable} ${barlow.variable} ${barlowCondensed.variable} font-sans`}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessJsonLd) }}
        />
        {children}
        <Toaster position="top-right" toastOptions={{ style: { borderRadius: 0 } }} />
        {/* Analytics - suivi de visites (Make My Design) */}
        <Script
          src="https://makemydesign.fr/api-back/analytics/tracker.js"
          data-id="KQCTAmqGL1E"
          data-purpose="analytics"
          strategy="afterInteractive"
        />
      </body>
    </html>
  )
}

