import type { Metadata } from 'next';
import { pageMetadata } from '@/lib/seo';

export const metadata: Metadata = pageMetadata({
  path: '/rendez-vous',
  title: 'Prendre rendez-vous au garage à Ennery',
  description:
    'Réservez en ligne votre rendez-vous au Garage de la Belle Croix à Ennery : entretien, réparation, pneus, vidange, auto et moto. Choisissez le jour et le créneau, on vous rappelle pour confirmer.',
  shareTitle: 'Rendez-vous en ligne - Garage de la Belle Croix à Ennery',
});

export default function RendezVousLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
