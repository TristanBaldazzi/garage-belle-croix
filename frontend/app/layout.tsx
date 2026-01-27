import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Toaster } from 'react-hot-toast'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Garage de la Belle Croix - Entretien et Réparation Automobile à Ennery',
  description: 'Garage automobile à Ennery (Metz-Thionville). Entretien, réparation, pneus, vidange. Devis gratuits. Contactez-nous au 0609369490.',
  keywords: 'garage automobile, entretien voiture, réparation auto, pneus, vidange, Ennery, Metz, Thionville, garage de confiance',
  authors: [{ name: 'Garage de la Belle Croix' }],
  openGraph: {
    title: 'Garage de la Belle Croix - Entretien et Réparation Automobile',
    description: 'Votre garage de confiance pour l\'entretien et la réparation automobile à Ennery',
    type: 'website',
    locale: 'fr_FR',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr">
      <body className={inter.className}>
        {children}
        <Toaster position="top-right" />
      </body>
    </html>
  )
}

