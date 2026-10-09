'use client';

import { useOpeningHours } from '@/lib/useOpeningHours';
import { SITE } from '@/lib/site';
import OpeningStatus from '@/components/OpeningStatus';

// Bloc bas-droite du hero : statut d'ouverture + téléphone
export default function HeroContact() {
  const { getStatus } = useOpeningHours();

  return (
    <div className="text-white lg:text-right">
      <div className="min-h-[16px] lg:flex lg:justify-end">
        <OpeningStatus status={getStatus()} className="text-white/80" />
      </div>
      <a href={SITE.phoneHref} className="heading mt-3 block text-[40px] transition-colors hover:text-brand md:text-[52px]">
        {SITE.phone}
      </a>
      <a href={SITE.phone2Href} className="heading block text-2xl text-white/60 transition-colors hover:text-brand">
        <span className="font-display text-sm font-semibold normal-case not-italic tracking-normal text-white/40">ou </span>
        {SITE.phone2}
      </a>
      <p className="caps mt-3 text-white/45">Ennery · Metz · Thionville</p>
    </div>
  );
}

export function HeroStatus() {
  const { getStatus } = useOpeningHours();
  return (
    <div className="min-h-[16px]">
      <OpeningStatus status={getStatus()} className="text-white/80" />
    </div>
  );
}

// Trois bandes rouges obliques (signature graphique)
export function RedStripes({ className = '' }: { className?: string }) {
  return (
    <div aria-hidden="true" className={`pointer-events-none flex gap-3 ${className}`}>
      <span className="block h-full w-7 -skew-x-[22deg] bg-brand md:w-9" />
      <span className="block h-full w-7 -skew-x-[22deg] bg-brand-dark md:w-9" />
      <span className="block h-full w-7 -skew-x-[22deg] bg-brand-deeper md:w-9" />
    </div>
  );
}
