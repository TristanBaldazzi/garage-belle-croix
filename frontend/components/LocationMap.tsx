'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Navigation, X, Phone, MapPin } from 'lucide-react';
import { useOpeningHours } from '@/lib/useOpeningHours';
import { SITE } from '@/lib/site';
import SectionHeading, { GhostWord } from '@/components/SectionHeading';
import OpeningStatus from '@/components/OpeningStatus';

const ACCESS_STEPS = [
  {
    title: 'Rue Inore Fabbri',
    text: 'Rejoignez la rue Inore Fabbri (D52d), zone d’activités d’Ennery. Sur Google Maps, elle s’affiche aussi « Pièce de Boulay ».',
  },
  {
    title: 'Longez l’usine Aprometal',
    text: 'Tournez dans la petite route « Pièce de Boulay » qui remonte le long du côté gauche (ouest) de la grande usine Aprometal.',
  },
  {
    title: 'Le toit rouge, à gauche',
    text: 'Environ 100 m plus loin, le garage est le bâtiment au toit rouge sur votre gauche. Parking devant l’atelier.',
  },
];

export default function LocationMap({ index, total }: { index: number; total: number }) {
  const [showNavigationPopup, setShowNavigationPopup] = useState(false);
  // La vue satellite aide à repérer le bâtiment (toit rouge)
  const [mapView, setMapView] = useState<'plan' | 'satellite'>('satellite');
  const { getFormattedHours, getStatus, isLoading } = useOpeningHours();
  const days = getFormattedHours();

  const handleNavigation = (type: 'maps' | 'waze') => {
    window.open(type === 'maps' ? SITE.mapsUrl : SITE.wazeUrl, '_blank');
    setShowNavigationPopup(false);
  };

  return (
    <>
      <section id="acces" className="relative scroll-mt-24 overflow-hidden bg-white py-20 md:py-28">
        <GhostWord word="Ennery" className="-right-4 top-4 md:-right-8 md:top-8" />

        <div className="container-site relative">
          <SectionHeading index={index} total={total} eyebrow="Nous trouver" title="Passez nous voir" accent="à Ennery." />

          <div className="mt-14 grid grid-cols-1 border border-line bg-white shadow-[0_30px_60px_-30px_rgba(11,11,12,0.25)] lg:grid-cols-12">
            <div className="relative min-h-[340px] bg-stone md:min-h-[440px] lg:col-span-7">
              <iframe
                key={mapView}
                title="Plan d'accès au Garage de la Belle Croix"
                src={`https://maps.google.com/maps?q=${SITE.lat},${SITE.lng}&z=${mapView === 'satellite' ? 18 : 17}&t=${mapView === 'satellite' ? 'k' : 'm'}&hl=fr&output=embed`}
                className={`absolute inset-0 h-full w-full ${mapView === 'plan' ? 'grayscale-[65%] contrast-[1.05]' : ''}`}
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
              <span className="caps pointer-events-none absolute left-4 top-4 flex items-center gap-2 bg-brand px-3 py-2 text-[10px] text-white shadow-lg">
                <MapPin className="h-3.5 w-3.5" strokeWidth={2.25} />
                Garage de la Belle Croix
              </span>
              <div className="absolute bottom-8 left-4 flex bg-ink p-1 shadow-lg" role="radiogroup" aria-label="Type de carte">
                {(['plan', 'satellite'] as const).map((view) => (
                  <button
                    key={view}
                    type="button"
                    role="radio"
                    aria-checked={mapView === view}
                    onClick={() => setMapView(view)}
                    className={`caps px-3 py-2 text-[10px] transition-colors ${
                      mapView === view ? 'bg-brand text-white' : 'text-white/60 hover:text-white'
                    }`}
                  >
                    {view === 'plan' ? 'Plan' : 'Satellite'}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex flex-col p-6 md:p-10 lg:col-span-5">
              <p className="caps text-muted">Adresse</p>
              <p className="heading mt-3 text-[30px]">
                {SITE.street}
                <br />
                {SITE.postalCode} {SITE.city}
              </p>
              <p className="mt-2 text-[15px] text-muted">Entre Metz et Thionville, parking devant l’atelier.</p>

              <p className="caps mt-8 text-muted">Téléphone</p>
              <p className="mt-3 flex flex-wrap items-baseline gap-x-4 gap-y-1">
                <a href={SITE.phoneHref} className="heading text-[30px] transition-colors hover:text-brand">{SITE.phone}</a>
                <a href={SITE.phone2Href} className="heading text-xl text-muted transition-colors hover:text-brand">{SITE.phone2}</a>
              </p>

              <div className="mt-8 flex items-center justify-between gap-4 border-b border-line pb-3">
                <p className="caps text-muted">Horaires</p>
                <OpeningStatus status={getStatus()} />
              </div>

              <dl className="text-[15px]">
                {isLoading ? (
                  <p className="py-4 text-muted">Chargement…</p>
                ) : (
                  days.map((day) => (
                    <div
                      key={day.key}
                      className={`flex items-center justify-between gap-4 border-b border-line py-2.5 ${day.isToday ? '-mx-3 bg-stone px-3' : ''}`}
                    >
                      <dt className="caps flex items-center gap-2 text-[12px] text-ink">
                        {day.label}
                        {day.isToday && <span className="bg-brand px-1.5 py-0.5 text-[9px] text-white">Aujourd’hui</span>}
                      </dt>
                      <dd className={day.isClosed ? 'text-muted' : day.isToday ? 'font-semibold' : ''}>{day.shortHours}</dd>
                    </div>
                  ))
                )}
              </dl>

              <div className="mt-8 grid grid-cols-2 gap-4">
                <button onClick={() => setShowNavigationPopup(true)} className="btn-accent">
                  <Navigation className="h-4 w-4" strokeWidth={2.25} />
                  J’y vais
                </button>
                <a href={SITE.phoneHref} className="btn-outline-dark">
                  <Phone className="h-4 w-4" strokeWidth={2.25} />
                  Appeler
                </a>
              </div>
            </div>
          </div>

          {/* Accès pas à pas : le repère Google du garage est placé au carrefour, pas sur le bâtiment */}
          <div className="border border-t-0 border-line bg-ink bg-hatch p-6 text-white md:p-10">
            <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
              <p className="heading text-[30px] md:text-4xl">
                Comment <span className="text-brand">arriver.</span>
              </p>
              <p className="max-w-md text-sm text-white/55">
                Le GPS peut vous arrêter au carrefour de la rue Inore Fabbri : le garage est 100 m plus haut, en retrait.
              </p>
            </div>
            <ol className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-3 md:gap-8">
              {ACCESS_STEPS.map((step, i) => (
                <li key={step.title} className="flex gap-4 border-t border-white/10 pt-5">
                  <span className="heading text-outline text-4xl text-brand">{String(i + 1).padStart(2, '0')}</span>
                  <div>
                    <p className="heading text-xl">{step.title}</p>
                    <p className="mt-1.5 text-[15px] leading-relaxed text-white/60">{step.text}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      {showNavigationPopup && (
        <div
          className="fixed inset-0 z-[60] flex items-end justify-center bg-ink/70 p-4 animate-fade-in sm:items-center"
          onClick={() => setShowNavigationPopup(false)}
        >
          <div className="relative w-full max-w-sm border-t-[3px] border-brand bg-white p-6 shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => setShowNavigationPopup(false)}
              className="absolute right-4 top-4 text-muted hover:text-ink"
              aria-label="Fermer"
            >
              <X className="h-5 w-5" />
            </button>
            <h3 className="heading text-3xl">Itinéraire</h3>
            <p className="mt-1 text-sm text-muted">Choisissez votre application de navigation</p>
            <div className="mt-6 space-y-3">
              {[
                { type: 'maps' as const, label: 'Google Maps', logo: '/logo/google-maps.png' },
                { type: 'waze' as const, label: 'Waze', logo: '/logo/waze.png' },
              ].map((app) => (
                <button
                  key={app.type}
                  onClick={() => handleNavigation(app.type)}
                  className="flex w-full items-center gap-4 border border-line px-4 py-3.5 text-left font-semibold transition-colors hover:border-ink"
                >
                  <Image src={app.logo} alt="" width={28} height={28} className="object-contain" />
                  {app.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
