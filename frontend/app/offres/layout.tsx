import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Nos Offres - Garage de la Belle Croix',
  description: 'Découvrez nos offres spéciales et promotions sur l\'entretien, la réparation, les pneus et la vidange. Devis gratuits.',
  keywords: 'offres garage, promotions auto, devis gratuit, entretien voiture, réparation auto',
  robots: {
    index: true,
    follow: true,
  },
};

export default function OffresLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}



