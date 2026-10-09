import type { Metadata } from 'next';
import { SITE } from '@/lib/site';

export const OG_IMAGE = { url: `${SITE.url}/og-image.jpg`, width: 1200, height: 630, alt: 'Garage de la Belle Croix à Ennery' };

// Métadonnées complètes d'une page : Next remplace (sans fusionner) openGraph et twitter,
// on les reconstruit donc entièrement ici pour garder l'image de partage partout.
export function pageMetadata({
  path,
  title,
  description,
  shareTitle,
  absoluteTitle,
}: {
  path: string;
  title: string;
  description: string;
  shareTitle?: string;
  absoluteTitle?: boolean;
}): Metadata {
  const social = shareTitle || `${title} | ${SITE.name}`;
  return {
    title: absoluteTitle ? { absolute: title } : title,
    description,
    alternates: { canonical: path },
    openGraph: {
      type: 'website',
      locale: 'fr_FR',
      siteName: SITE.name,
      url: path,
      title: social,
      description,
      images: [OG_IMAGE],
    },
    twitter: { card: 'summary_large_image', title: social, description, images: [OG_IMAGE.url] },
  };
}
