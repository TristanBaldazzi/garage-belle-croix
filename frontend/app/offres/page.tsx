'use client';

import { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { offersAPI, getOfferImageUrl } from '@/lib/api';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import LoadingSpinner from '@/components/LoadingSpinner';
import { ArrowRight, Tag, TrendingDown, Sparkles, Search, X } from 'lucide-react';

export default function OffresPage() {
  const [offersByCategory, setOffersByCategory] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
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
  }, []);

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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="flex items-center justify-center min-h-[60vh]">
          <LoadingSpinner size="large" />
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Page Header - Plus compact */}
      <section className="bg-gradient-to-br from-black via-gray-900 to-black text-white py-16 md:py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-white/5 via-transparent to-white/5"></div>
        <div className="relative container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 mb-4">
              <TrendingDown className="w-6 h-6 text-white" />
              <h1 className="text-4xl md:text-5xl font-black">Nos Offres</h1>
            </div>
            <p className="text-lg md:text-xl text-gray-300 leading-relaxed">
              Découvrez nos offres spéciales et promotions exclusives
            </p>
          </div>
        </div>
      </section>

      {/* Offers Section - Plus compact et professionnel */}
      <section className="py-16 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-4 max-w-6xl">
          {/* Barre de recherche */}
          <div className="mb-8">
            <div className="relative max-w-2xl mx-auto">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Rechercher une offre, une catégorie, un prix..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-12 py-3 border-2 border-gray-200 rounded-lg focus:border-black focus:outline-none text-base bg-white shadow-sm"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-black transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>
            {searchTerm && (
              <p className="text-sm text-gray-500 mt-3 text-center">
                {filteredOffersByCategory.reduce((acc, cat) => acc + cat.offers.length, 0)} offre(s) trouvée(s)
              </p>
            )}
          </div>

          {filteredOffersByCategory.length === 0 ? (
            <div className="text-center py-16">
              <div className="inline-block bg-gray-100 p-8 rounded-xl mb-6">
                <Sparkles className="w-16 h-16 text-gray-400" />
              </div>
              <p className="text-2xl text-gray-500 font-black mb-3">
                {searchTerm ? 'Aucune offre trouvée' : 'Aucune offre disponible'}
              </p>
              <p className="text-lg text-gray-400 mb-8">
                {searchTerm 
                  ? 'Essayez avec d\'autres mots-clés'
                  : 'Revenez bientôt pour découvrir nos nouvelles offres !'
                }
              </p>
              {searchTerm ? (
                <button
                  onClick={() => setSearchTerm('')}
                  className="inline-flex items-center gap-2 bg-black text-white px-8 py-3 font-black rounded-lg hover:bg-gray-800 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  Réinitialiser la recherche
                </button>
              ) : (
                <Link 
                  href="/contact"
                  className="inline-flex items-center gap-2 bg-black text-white px-8 py-3 font-black rounded-lg hover:bg-gray-800 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  Nous contacter
                  <ArrowRight className="w-5 h-5" />
                </Link>
              )}
            </div>
          ) : (
            <div className="space-y-12">
              {filteredOffersByCategory.map((categoryGroup: any) => (
                <div key={categoryGroup.category} className="space-y-4">
                  {/* Category Header - Plus compact */}
                  <div className="border-b-2 border-black pb-2">
                    <h2 className="text-2xl md:text-3xl font-black text-black">
                      {categoryGroup.label}
                    </h2>
                  </div>

                  {/* Offers List - Plus compact et professionnel */}
                  <div className="space-y-3">
                    {categoryGroup.offers.map((offer: any) => (
                      <div
                        key={offer._id}
                        className="bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 border border-gray-200 hover:border-black overflow-hidden group"
                      >
                        <div className="flex flex-col md:flex-row">
                          {/* Image - Plus petite */}
                          <div className="relative w-full md:w-48 h-40 md:h-auto flex-shrink-0">
                            {offer.image ? (
                              <Image
                                src={getOfferImageUrl(offer.image)}
                                alt={offer.title}
                                fill
                                className="object-cover"
                              />
                            ) : (
                              <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                                <Tag className="w-12 h-12 text-gray-400" />
                              </div>
                            )}
                            {offer.isPromotion && (
                              <div className="absolute top-2 right-2 bg-black text-white px-3 py-1.5 font-black text-xs rounded-lg shadow-lg flex items-center gap-1">
                                <TrendingDown className="w-3 h-3" />
                                -{offer.promotionPercentage}%
                              </div>
                            )}
                          </div>

                          {/* Content - Plus compact */}
                          <div className="flex-1 p-4 md:p-6 flex flex-col justify-between">
                            <div className="mb-3">
                              <h3 className="text-xl md:text-2xl font-black mb-2 text-black group-hover:text-gray-700 transition-colors">
                                {offer.title}
                              </h3>
                              <p className="text-sm md:text-base text-gray-600 leading-relaxed line-clamp-2">
                                {offer.description}
                              </p>
                            </div>

                            <div className="flex items-center justify-between pt-3 border-t border-gray-200">
                              <div className="flex items-baseline gap-2">
                                {offer.originalPrice && offer.isPromotion && (
                                  <span className="text-gray-400 line-through text-base font-bold">
                                    {offer.originalPrice.toFixed(2)}€
                                  </span>
                                )}
                                <span className="text-2xl md:text-3xl font-black text-black">
                                  {offer.price.toFixed(2)}€
                                </span>
                              </div>
                              <Link
                                href={`/contact?offer=${offer._id}`}
                                className="flex items-center gap-2 bg-black text-white px-5 py-2.5 font-black text-sm rounded-lg hover:bg-gray-800 transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105"
                              >
                                Devis
                                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                              </Link>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section - Plus compact */}
      <section className="py-16 bg-gradient-to-br from-black via-gray-900 to-black text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-white/5 via-transparent to-white/5"></div>
        <div className="relative container mx-auto px-4 text-center max-w-3xl">
          <h2 className="text-3xl md:text-4xl font-black mb-4">Besoin d'un devis personnalisé ?</h2>
          <p className="text-lg md:text-xl text-gray-300 mb-8 leading-relaxed">
            Contactez-nous pour obtenir un devis adapté à vos besoins
          </p>
          <Link 
            href="/contact"
            className="inline-flex items-center gap-2 bg-white text-black px-8 py-3 font-black text-lg rounded-lg hover:bg-gray-100 transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:scale-105"
          >
            Nous contacter
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
