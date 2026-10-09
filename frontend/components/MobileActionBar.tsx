import { Phone, Navigation } from 'lucide-react';
import { SITE } from '@/lib/site';

// Barre d'actions fixe en bas d'écran sur mobile : appeler, itinéraire
export default function MobileActionBar() {
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-white/10 bg-ink/95 px-5 pb-[calc(env(safe-area-inset-bottom)+12px)] pt-3 backdrop-blur lg:hidden">
      <div className="flex gap-3">
        <a href={SITE.phoneHref} className="btn-accent h-12 flex-1">
          <Phone className="h-4 w-4" strokeWidth={2.25} />
          Appeler le garage
        </a>
        <a
          href={SITE.mapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-outline-light h-12 w-14 px-0"
          aria-label="Itinéraire vers le garage"
        >
          <Navigation className="h-4 w-4" strokeWidth={2} />
        </a>
      </div>
    </div>
  );
}
