import { useSyncExternalStore } from 'react';
import { useSearchParams } from 'next/navigation';

const subscribe = (onChange: () => void) => {
  window.addEventListener('hashchange', onChange);
  return () => window.removeEventListener('hashchange', onChange);
};

// Paramètre transmis par un lien interne. Les liens du site le passent dans l'ancre
// (/devis#service=pneus) : sans « ? », Google ne voit qu'une seule URL par page.
// L'ancien format (?service=pneus) reste lu pour les liens déjà partagés.
export function useLinkParam(name: string): string | null {
  const searchParams = useSearchParams();
  const fromHash = useSyncExternalStore(
    subscribe,
    () => new URLSearchParams(window.location.hash.slice(1)).get(name),
    () => null
  );
  return searchParams.get(name) ?? fromHash;
}
