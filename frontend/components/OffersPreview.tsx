'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { offersAPI } from '@/lib/api';
import OfferCard, { type Offer } from '@/components/OfferCard';
import SectionHeading, { GhostWord } from '@/components/SectionHeading';

export default function OffersPreview({
  index,
  total,
  initialOffers,
}: {
  index: number;
  total: number;
  // Offres déjà chargées côté serveur (HTML lisible par Google) ; sinon chargement dans le navigateur
  initialOffers?: Offer[];
}) {
  const [offers, setOffers] = useState<Offer[]>(initialOffers || []);
  const [isLoading, setIsLoading] = useState(!initialOffers);

  useEffect(() => {
    if (initialOffers) return;
    const loadOffers = async () => {
      try {
        const data = await offersAPI.getAll();
        setOffers(data.flatMap((cat: any) => cat.offers || []));
      } catch (error) {
        console.error('Error loading offers:', error);
      } finally {
        setIsLoading(false);
      }
    };
    loadOffers();
  }, [initialOffers]);

  return (
    <section id="offres" className="relative scroll-mt-24 overflow-hidden bg-ink bg-hatch py-20 text-white md:py-28">
      <GhostWord word="Offres" dark className="-left-6 top-6 md:-left-10 md:top-10" />

      <div className="container-site relative">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <SectionHeading index={index} total={total} eyebrow="Offres du moment" title="Le bon plan" accent="de la saison." dark />
          <Link href="/offres" className="link-arrow hidden md:inline-flex">
            Toutes les offres <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {isLoading ? (
          <div className="mt-14 grid grid-cols-1 gap-6 md:grid-cols-3">
            {[0, 1, 2].map((i) => (
              <div key={i} className={`h-[480px] animate-pulse border border-white/10 bg-ink-800 ${i > 0 ? 'hidden md:block' : ''}`} />
            ))}
          </div>
        ) : offers.length === 0 ? (
          <div className="mt-14 flex flex-col gap-6 border border-white/10 bg-ink-800 p-8 md:flex-row md:items-center md:justify-between md:p-10">
            <div>
              <p className="heading text-3xl">Pas d’offre en cours</p>
              <p className="mt-2 text-white/55">Les prochaines promos arrivent bientôt. En attendant, le devis reste gratuit.</p>
            </div>
            <Link href="/devis" className="btn-accent">
              Demander un devis
            </Link>
          </div>
        ) : (
          <div
            className={`no-scrollbar -mx-5 mt-14 flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 md:mx-0 md:gap-6 md:overflow-visible md:px-0 ${
              offers.length >= 3 ? 'md:grid md:grid-cols-2 lg:grid-cols-3' : 'md:justify-center'
            }`}
          >
            {offers.slice(0, 3).map((offer) => (
              <OfferCard
                key={offer._id}
                offer={offer}
                className={`flex-shrink-0 snap-start ${offers.length === 1 ? 'w-full' : 'w-[85%]'} ${
                  offers.length >= 3 ? 'md:w-auto' : 'md:w-[calc(50%-12px)] lg:w-[380px]'
                }`}
              />
            ))}
          </div>
        )}

        <div className="mt-12 flex justify-center">
          <Link href="/offres" className="btn-outline-light">
            Voir toutes les offres <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
