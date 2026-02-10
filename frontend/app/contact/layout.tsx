import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact - Garage de la Belle Croix',
  description: 'Contactez le Garage de la Belle Croix à Ennery. Téléphone: 0609369490. Adresse: 1 Rue inore Fabbri, 57365 Ennery. Demandez un devis gratuit.',
  keywords: 'contact garage Ennery, devis gratuit, garage automobile Metz, réparation auto',
  robots: {
    index: true,
    follow: true,
  },
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}



