'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { offersAPI } from '@/lib/api';
import LoadingSpinner from '@/components/LoadingSpinner';
import { ArrowRight, TrendingDown, Sparkles } from 'lucide-react';

export default function OffersPreview() {
  const [offersByCategory, setOffersByCategory] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

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

  const allOffers = offersByCategory.flatMap((cat: any) => cat.offers || []);

  return (
    <section className={`py-20 ${allOffers.length > 0 ? 'bg-white' : 'bg-gradient-to-b from-gray-50 to-white'}`}>
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-3 mb-4">
            <TrendingDown className="w-6 h-6 text-black" />
            <h2 className="text-3xl md:text-4xl font-black text-black tracking-tight">Nos Offres</h2>
          </div>
          <p className="text-base md:text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
            {allOffers.length > 0 
              ? 'Découvrez nos meilleures offres et promotions exclusives du moment'
              : 'Bientôt de nouvelles offres exceptionnelles !'}
          </p>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <LoadingSpinner size="large" />
          </div>
        ) : allOffers.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
              {allOffers.slice(0, 3).map((offer: any) => (
                <div 
                  key={offer._id} 
                  className="bg-gradient-to-br from-white to-gray-50 border border-gray-200 rounded-xl overflow-hidden hover:border-gray-300 transition-all duration-300 hover:shadow-lg group"
                >
                  {offer.isPromotion && (
                    <div className="relative bg-gradient-to-r from-red-600 to-red-700 text-white">
                      <div className="absolute top-3 right-3 z-10 bg-black text-white px-3 py-1.5 font-bold text-xs rounded-lg shadow-lg flex items-center gap-1.5">
                        <TrendingDown className="w-3 h-3" />
                        -{offer.promotionPercentage}% OFF
                      </div>
                      <div className="h-1 bg-gradient-to-r from-red-500 to-red-600"></div>
                    </div>
                  )}
                  {offer.image && (
                    <div className="relative w-full h-40 bg-gray-200">
                      <Image
                        src={`${process.env.NEXT_PUBLIC_API_URL?.replace('/api', '')}${offer.image}`}
                        alt={offer.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}
                  <div className="p-6">
                    <div className="mb-3">
                      <span className="inline-block bg-gradient-to-r from-gray-100 to-gray-200 text-gray-800 px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider">
                        {offer.category}
                      </span>
                    </div>
                    <h3 className="text-xl font-bold mb-3 group-hover:text-gray-700 transition-colors text-black">
                      {offer.title}
                    </h3>
                    <p className="text-sm text-gray-600 mb-6 leading-relaxed line-clamp-3">
                      {offer.description}
                    </p>
                    <div className="flex items-baseline gap-3 mb-6 pb-4 border-b border-gray-200">
                      {offer.originalPrice && (
                        <span className="text-gray-400 line-through text-sm font-semibold">
                          {offer.originalPrice.toFixed(2)}€
                        </span>
                      )}
                      <span className="text-2xl font-black text-black">{offer.price.toFixed(2)}€</span>
                    </div>
                    <Link 
                      href={`/contact?offer=${offer._id}`}
                      className="block w-full bg-gradient-to-r from-black to-gray-800 text-white text-center py-3 font-bold text-sm rounded-lg hover:from-gray-800 hover:to-black transition-all duration-300 group-hover:shadow-lg"
                    >
                      Demander un devis
                    </Link>
                  </div>
                </div>
              ))}
            </div>
            <div className="text-center">
              <Link 
                href="/offres"
                className="inline-flex items-center gap-3 bg-gradient-to-r from-black to-gray-800 text-white px-12 py-5 font-black text-xl rounded-xl hover:from-gray-800 hover:to-black transition-all duration-300 shadow-2xl hover:shadow-black/30 transform hover:scale-110"
              >
                Voir toutes les offres
                <ArrowRight className="w-6 h-6" />
              </Link>
            </div>
          </>
        ) : (
          <div className="text-center py-20">
            <div className="inline-block bg-gray-100 p-8 rounded-2xl mb-6">
              <Sparkles className="w-16 h-16 text-gray-400" />
            </div>
            <p className="text-2xl text-gray-500 font-bold mb-4">Aucune offre disponible pour le moment</p>
            <p className="text-xl text-gray-400 mb-8">Revenez bientôt pour découvrir nos nouvelles offres exceptionnelles !</p>
            <Link 
              href="/contact"
              className="inline-flex items-center gap-3 bg-black text-white px-12 py-5 font-black text-xl rounded-xl hover:bg-gray-800 transition-all duration-300 shadow-2xl transform hover:scale-110"
            >
              Nous contacter
              <ArrowRight className="w-6 h-6" />
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}

