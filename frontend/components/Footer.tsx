'use client';

import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { useOpeningHours } from '@/lib/useOpeningHours';
import { SITE } from '@/lib/site';
import Logo from '@/components/Logo';
import MobileActionBar from '@/components/MobileActionBar';

const FOOTER_NAV = [
  { href: '/', label: 'Accueil' },
  { href: '/#presentation', label: 'Présentation' },
  { href: '/offres', label: 'Offres' },
  { href: '/contact', label: 'Contact & devis' },
  { href: '/rendez-vous', label: 'Prendre rendez-vous' },
];

export default function Footer() {
  const { getGroupedHours, isLoading } = useOpeningHours();
  const groupedHours = getGroupedHours();

  return (
    <>
      <footer className="relative overflow-hidden border-t-[3px] border-brand bg-ink pb-24 text-white/60 lg:pb-0">
        <div className="container-site pt-16 md:pt-20">
          <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-12">
            <div className="sm:col-span-2 lg:col-span-5">
              <Logo size="lg" />
              <a href={SITE.phoneHref} className="heading mt-8 block text-[44px] text-white transition-colors hover:text-brand md:text-[52px]">
                {SITE.phone}
              </a>
              <a href={SITE.phone2Href} className="heading mt-1 block text-[28px] text-white/50 transition-colors hover:text-brand">
                {SITE.phone2}
              </a>
              <p className="mt-4 max-w-sm text-[15px] leading-relaxed">
                Garage automobile indépendant à Ennery. Entretien, réparation, pneus et vidange pour Metz,
                Thionville et alentours.
              </p>
            </div>

            <div className="lg:col-span-3">
              <p className="caps text-white/40">Coordonnées</p>
              <ul className="mt-5 space-y-3 text-[15px]">
                <li className="text-white/80">
                  {SITE.street}
                  <br />
                  {SITE.postalCode} {SITE.city}
                </li>
                <li>
                  <a href={`mailto:${SITE.email}`} className="break-all transition-colors hover:text-white">
                    {SITE.email}
                  </a>
                </li>
                <li>
                  <a href={SITE.mapsUrl} target="_blank" rel="noopener noreferrer" className="link-arrow">
                    Itinéraire <ArrowUpRight className="h-3.5 w-3.5" strokeWidth={2.25} />
                  </a>
                </li>
              </ul>
            </div>

            <div className="lg:col-span-2">
              <p className="caps text-white/40">Horaires</p>
              <dl className="mt-5 space-y-3 text-[15px]">
                {isLoading ? (
                  <p>Chargement…</p>
                ) : (
                  groupedHours.map((group) => (
                    <div key={group.label}>
                      <dt className="inline">{group.label.replace(' - ', ' – ')}</dt>
                      <span className="text-white/30"> · </span>
                      <dd className={`inline ${group.hours === 'Fermé' ? 'text-white/40' : 'text-white/80'}`}>
                        {group.shortHours.toLowerCase()}
                      </dd>
                    </div>
                  ))
                )}
              </dl>
            </div>

            <div className="lg:col-span-2">
              <p className="caps text-white/40">Navigation</p>
              <ul className="mt-5 space-y-3 text-[15px]">
                {FOOTER_NAV.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="transition-colors hover:text-white">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Nom géant détouré en pied de page */}
        <div aria-hidden="true" className="mt-14 hidden select-none overflow-hidden lg:block">
          <span className="heading text-outline block whitespace-nowrap text-center text-[14.5vw] leading-[0.82] text-white/[0.09]">
            Belle Croix
          </span>
        </div>

        <div className="container-site">
          <div className="mt-14 flex flex-col gap-4 border-t border-white/10 py-7 text-[13px] lg:mt-0 text-white/40 md:flex-row md:items-center md:justify-between">
            <p>© {new Date().getFullYear()} {SITE.name}</p>
            <div className="flex flex-wrap gap-x-6 gap-y-2">
              <Link href="/mentions-legales" className="transition-colors hover:text-white">Mentions légales</Link>
              <Link href="/confidentialite" className="transition-colors hover:text-white">Confidentialité</Link>
            </div>
            <p>
              Site réalisé par{' '}
              <a
                href="https://makemydesign.fr"
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-white/70 transition-colors hover:text-white"
              >
                Make My Design
              </a>
            </p>
          </div>
        </div>
      </footer>
      <MobileActionBar />
    </>
  );
}
