import type { Metadata } from 'next';
import { pageMetadata } from '@/lib/seo';

export const metadata: Metadata = pageMetadata({
  path: '/devis',
  title: 'Devis gratuit entretien, réparation et pneus à Ennery',
  description:
    'Devis gratuit et sans engagement pour l’entretien, la réparation, les pneus ou la vidange de votre voiture (et de votre moto) à Ennery, entre Metz et Thionville. Prix détaillé pièce par pièce, réponse rapide.',
  shareTitle: 'Devis gratuit - Garage de la Belle Croix à Ennery',
});

export default function DevisLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
