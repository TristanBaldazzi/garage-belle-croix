import type { MetadataRoute } from 'next';
import { SITE } from '@/lib/site';

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  const pages = ['', '/rendez-vous', '/devis', '/offres', '/contact'].map((path) => ({
    url: `${SITE.url}${path}`,
    lastModified,
    changeFrequency: (path === '/offres' ? 'weekly' : 'monthly') as 'weekly' | 'monthly',
    priority: path === '' ? 1 : 0.8,
  }));
  const legal = ['/mentions-legales', '/confidentialite'].map((path) => ({
    url: `${SITE.url}${path}`,
    lastModified,
    changeFrequency: 'yearly' as const,
    priority: 0.3,
  }));
  return [...pages, ...legal];
}
