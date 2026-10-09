import type { Metadata } from 'next';
import { pageMetadata } from '@/lib/seo';

export const metadata: Metadata = pageMetadata({
  path: '/offres',
  title: 'Offres et promotions entretien, pneus, vidange à Ennery',
  description:
    'Les bons plans du moment au Garage de la Belle Croix à Ennery : promotions sur la vidange, les pneus, le freinage et l’entretien de votre voiture. Profitez-en sur devis gratuit.',
  shareTitle: 'Offres du moment - Garage de la Belle Croix à Ennery',
});

export default function OffresLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
