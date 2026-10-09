// Lectures côté serveur (rendu HTML complet pour Google), mises en cache 1 minute.
// En cas d'API indisponible, on renvoie une valeur vide : les composants clients prennent le relais.

const API_URL = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api').replace(/\/$/, '');
const REVALIDATE_SECONDS = 60;

async function getJson<T>(path: string, fallback: T): Promise<T> {
  try {
    const response = await fetch(`${API_URL}${path}`, { next: { revalidate: REVALIDATE_SECONDS } });
    if (!response.ok) return fallback;
    return (await response.json()) as T;
  } catch {
    return fallback;
  }
}

export interface OfferCategoryGroup {
  category: string;
  label: string;
  offers: any[];
}

export const getOffersByCategory = () => getJson<OfferCategoryGroup[]>('/offers', []);

export interface DayHours {
  open: string;
  close: string;
  isClosed: boolean;
}

export const getOpeningHours = () => getJson<Record<string, DayHours> | null>('/opening-hours', null);
