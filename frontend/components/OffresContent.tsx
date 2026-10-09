'use client';

import { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import { offersAPI } from '@/lib/api';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import LoadingSpinner from '@/components/LoadingSpinner';
import PageHero from '@/components/PageHero';
import OfferCard, { type Offer } from '@/components/OfferCard';
import { ArrowRight, Search, X } from 'lucide-react';

// Contenu de la page Offres : données initiales rendues côté serveur, recherche côté navigateur
export default function OffresContent({ initialOffersByCategory }: { initialOffersByCategory?: any[] }) {
  const [offersByCategory, setOffersByCategory] = useState<any[]>(initialOffersByCategory || []);
  const [isLoading, setIsLoading] = useState(!initialOffersByCategory);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (initialOffersByCategory) return;
    const loadOffers = async () => {
      try {
        const data = await offersAPI.getAll();
        setOffersByCategory(data);
      } catch (error) {
        console.error('Error loading offers:', error);
      } finally {
        setIsLoading(false);
      }
    };
    loadOffers();
  }, [initialOffersByCategory]);

  // Fonction de recherche qui filtre les offres
  const filteredOffersByCategory = useMemo(() => {
    if (!searchTerm.trim()) {
      return offersByCategory;
    }

    const searchLower = searchTerm.toLowerCase().trim();

    return offersByCategory
      .map((categoryGroup: any) => {
        const filteredOffers = categoryGroup.offers.filter((offer: any) => {
          // Recherche dans tous les champs
          const titleMatch = offer.title?.toLowerCase().includes(searchLower);
          const descriptionMatch = offer.description?.toLowerCase().includes(searchLower);
          const categoryMatch = categoryGroup.label?.toLowerCase().includes(searchLower) || 
                               categoryGroup.category?.toLowerCase().includes(searchLower);
          const priceMatch = offer.price?.toString().includes(searchTerm) || 
                           offer.originalPrice?.toString().includes(searchTerm);
          const promotionMatch = offer.isPromotion && 'promotion'.includes(searchLower);

          return titleMatch || descriptionMatch || categoryMatch || priceMatch || promotionMatch;
        });

        // Retourner seulement les catégories qui ont des offres après filtrage
        if (filteredOffers.length > 0) {
          return {
            ...categoryGroup,
            offers: filteredOffers
          };
        }
        return null;
      })
      .filter((category: any) => category !== null);
  }, [offersByCategory, searchTerm]);

  const resultCount = filteredOffersByCategory.reduce((acc, cat) => acc + cat.offers.length, 0);

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <PageHero
        eyebrow="Offres du moment"
        title="Le bon plan"
        accent="de la saison."
        subtitle="Promotions sur l’entretien, les pneus et la mécanique. Un clic sur « J’en profite » et on vous rappelle avec un devis."
        image="/images/offre-pneus.jpg"
      />

      <section className="py-14 md:py-20">
        <div className="container-site">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div className="relative w-full md:max-w-md">
              <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" strokeWidth={1.75} />
              <input
                type="text"
                placeholder="Rechercher une offre, une catégorie, un prix…"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="field-input pl-11 pr-11"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-muted hover:text-ink"
                  aria-label="Effacer la recherche"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
            {searchTerm && <p className="caps text-muted">{resultCount} offre(s) trouvée(s)</p>}
          </div>

          {isLoading ? (
            <div className="flex min-h-[40vh] items-center justify-center">
              <LoadingSpinner size="large" />
            </div>
          ) : filteredOffersByCategory.length === 0 ? (
            <div className="mt-10 border border-line bg-stone px-6 py-16 text-center">
              <p className="heading text-4xl">
                {searchTerm ? 'Aucune offre trouvée' : 'Pas d’offre en cours'}
              </p>
              <p className="mt-3 text-muted">
                {searchTerm ? 'Essayez avec d’autres mots-clés.' : 'Les prochaines promos arrivent bientôt. Le devis, lui, reste gratuit.'}
              </p>
              <div className="mt-8">
                {searchTerm ? (
                  <button onClick={() => setSearchTerm('')} className="btn-outline-dark">
                    Réinitialiser la recherche
                  </button>
                ) : (
                  <Link href="/devis" className="btn-accent">
                    Demander un devis
                  </Link>
                )}
              </div>
            </div>
          ) : (
            <div className="mt-14 space-y-16">
              {filteredOffersByCategory.map((categoryGroup: any, index: number) => (
                <div key={categoryGroup.category}>
                  <div className="flex items-baseline gap-4 border-b border-line pb-4">
                    <span className="heading text-outline text-4xl text-brand">{String(index + 1).padStart(2, '0')}</span>
                    <h2 className="heading text-4xl">{categoryGroup.label}</h2>
                  </div>

                  <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {categoryGroup.offers.map((offer: Offer) => (
                      <OfferCard key={offer._id} offer={offer} />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="bg-ink bg-hatch text-white">
        <div className="container-site flex flex-col gap-8 py-14 md:flex-row md:items-center md:justify-between md:py-16">
          <div>
            <h2 className="heading text-4xl md:text-5xl">
              Pas trouvé votre <span className="text-brand">prestation ?</span>
            </h2>
            <p className="mt-3 text-white/60">Entretien, réparation, pneus, vidange : demandez un devis personnalisé.</p>
          </div>
          <div className="flex flex-col gap-4 sm:flex-row">
            <Link href="/devis" className="btn-accent">Demander un devis</Link>
            <Link href="/rendez-vous" className="btn-outline-light">
              Prendre rendez-vous <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
