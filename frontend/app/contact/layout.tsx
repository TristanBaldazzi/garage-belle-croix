import type { Metadata } from 'next';
import { pageMetadata } from '@/lib/seo';

export const metadata: Metadata = pageMetadata({
  path: '/contact',
  title: 'Contact et accès - Garage automobile à Ennery (57)',
  description:
    'Contactez le Garage de la Belle Croix au 06 09 36 94 90 ou 07 67 75 93 13. 1 rue Inore Fabbri, 57365 Ennery, entre Metz et Thionville. Question, devis ou demande sur une offre : réponse rapide.',
  shareTitle: 'Contact - Garage de la Belle Croix à Ennery',
});

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
