'use client';

import Link from 'next/link';
import { Check, ArrowRight, ArrowUpRight, Phone } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import PageHero from '@/components/PageHero';
import OpeningStatus from '@/components/OpeningStatus';
import { SITE } from '@/lib/site';
import { useOpeningHours } from '@/lib/useOpeningHours';

interface RequestPageShellProps {
  eyebrow: string;
  title: string;
  accent?: string;
  subtitle: string;
  highlights?: string[];
  headerExtra?: React.ReactNode;
  alternate?: 'devis' | 'rendez-vous';
  image?: string;
  children: React.ReactNode;
}

export default function RequestPageShell({
  eyebrow,
  title,
  accent,
  subtitle,
  highlights = [],
  headerExtra,
  alternate,
  image,
  children,
}: RequestPageShellProps) {
  const { getFormattedHours, getStatus, isLoading } = useOpeningHours();

  return (
    <div className="min-h-screen bg-stone">
      <Header />

      <PageHero eyebrow={eyebrow} title={title} accent={accent} subtitle={subtitle} image={image}>
        {headerExtra}
        {highlights.length > 0 && (
          <ul className="mt-8 flex flex-wrap gap-x-8 gap-y-3">
            {highlights.map((item) => (
              <li key={item} className="caps flex items-center gap-2 text-white/75">
                <Check className="h-4 w-4 text-brand" strokeWidth={2.5} />
                {item}
              </li>
            ))}
          </ul>
        )}
      </PageHero>

      <section className="py-12 md:py-20">
        <div className="container-site grid grid-cols-1 gap-8 lg:grid-cols-12">
          <div className="border-t-[3px] border-brand bg-white p-6 shadow-[0_30px_60px_-40px_rgba(11,11,12,0.35)] md:p-10 lg:col-span-8">
            {children}
          </div>

          <aside className="space-y-6 lg:col-span-4">
            <div className="bg-ink bg-hatch p-7 text-white">
              <p className="caps flex items-center gap-2 text-white/50">
                <Phone className="h-3.5 w-3.5 text-brand" strokeWidth={2.25} />
                Appel direct
              </p>
              <a href={SITE.phoneHref} className="heading mt-3 block text-[40px] transition-colors hover:text-brand">{SITE.phone}</a>
              <a href={SITE.phone2Href} className="heading block text-2xl text-white/55 transition-colors hover:text-brand">{SITE.phone2}</a>
              <p className="mt-2 text-sm text-white/50">Le plus rapide pour une question urgente</p>
            </div>

            <div className="border border-line bg-white">
              <div className="flex items-center justify-between gap-4 border-b border-line px-6 py-4">
                <p className="caps text-muted">Horaires</p>
                <OpeningStatus status={getStatus()} className="text-[10px] text-ink" />
              </div>
              <dl className="px-6 py-3 text-sm">
                {isLoading ? (
                  <p className="py-2 text-muted">Chargement…</p>
                ) : (
                  getFormattedHours().map((day) => (
                    <div key={day.key} className="flex justify-between gap-4 py-1.5">
                      <dt className={`caps text-[11px] ${day.isToday ? 'text-brand' : 'text-ink'}`}>{day.label}</dt>
                      <dd className={day.isClosed ? 'text-muted' : day.isToday ? 'font-semibold' : ''}>{day.shortHours}</dd>
                    </div>
                  ))
                )}
              </dl>
            </div>

            <div className="border border-line bg-white px-6 py-5">
              <p className="caps text-muted">Adresse</p>
              <p className="heading mt-3 text-2xl">
                {SITE.street}
                <br />
                {SITE.postalCode} {SITE.city}
              </p>
              <a href={SITE.mapsUrl} target="_blank" rel="noopener noreferrer" className="link-arrow mt-4">
                Itinéraire <ArrowUpRight className="h-4 w-4" />
              </a>
              <p className="mt-4 border-t border-line pt-4 text-sm">
                <a href={`mailto:${SITE.email}`} className="break-all text-muted hover:text-ink">{SITE.email}</a>
              </p>
            </div>

            {alternate && (
              <Link
                href={alternate === 'devis' ? '/devis' : '/rendez-vous'}
                className="group flex items-center justify-between gap-4 border border-line bg-white px-6 py-5 transition-colors hover:border-ink"
              >
                <span>
                  <span className="heading block text-xl">
                    {alternate === 'devis' ? 'Besoin d’un prix d’abord ?' : 'Déjà décidé ?'}
                  </span>
                  <span className="text-sm text-muted">
                    {alternate === 'devis' ? 'Demandez un devis gratuit' : 'Prenez rendez-vous en ligne'}
                  </span>
                </span>
                <ArrowRight className="h-5 w-5 text-brand transition-transform group-hover:translate-x-1" strokeWidth={2} />
              </Link>
            )}

            {/* Partenaire digital (réalisation du site) */}
            <a
              href="https://makemydesign.fr"
              target="_blank"
              rel="noopener"
              className="group flex items-center gap-4 border border-line bg-white px-6 py-5 transition-colors hover:border-ink"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/logo/make-my-design.jpg" alt="" width={48} height={48} className="h-12 w-12 flex-shrink-0" />
              <span className="min-w-0 flex-1">
                <span className="caps block text-[10px] text-muted">Notre partenaire digital</span>
                <span className="heading mt-1 block text-xl">Make My Design</span>
              </span>
              <ArrowUpRight className="h-5 w-5 flex-shrink-0 text-muted transition-colors group-hover:text-ink" strokeWidth={2} />
            </a>
          </aside>
        </div>
      </section>

      <Footer />
    </div>
  );
}
