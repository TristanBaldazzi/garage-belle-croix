'use client';

import { useState } from 'react';
import Image from 'next/image';
import { MapPin, Navigation, X } from 'lucide-react';
import { useOpeningHours } from '@/lib/useOpeningHours';

export default function LocationMap() {
  const [showNavigationPopup, setShowNavigationPopup] = useState(false);
  const { getGroupedHours, isLoading } = useOpeningHours();
  const groupedHours = getGroupedHours();

  const address = "Garage De La Belle Croix - Ennery -Metz-Thionville";
  const mapsUrl = "https://www.google.com/maps/dir/?api=1&destination=Garage+De+La+Belle+Croix+Ennery";
  const wazeUrl = "https://waze.com/ul?q=Garage+De+La+Belle+Croix+Ennery";

  const handleNavigation = (type: 'maps' | 'waze') => {
    if (type === 'maps') {
      window.open(mapsUrl, '_blank');
    } else {
      window.open(wazeUrl, '_blank');
    }
    setShowNavigationPopup(false);
  };

  return (
    <>
      <section className="bg-white border-b-2 border-black relative">
        <div className="grid grid-cols-1 lg:grid-cols-2">
          {/* Left Panel - Information */}
          <div className="bg-gradient-to-br from-gray-50 via-white to-gray-50 p-5 md:p-6 lg:p-8 flex flex-col justify-center order-2 lg:order-1 relative overflow-hidden">
            {/* Decorative background elements */}
            <div className="absolute top-0 right-0 w-48 h-48 bg-black/3 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-black/3 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>
            
            <div className="w-full max-w-lg mx-auto px-4 lg:px-8 relative z-10">
              <div className="mb-6">
                <div className="mb-3">
                  <span className="text-xs font-black text-gray-400 uppercase tracking-widest">
                    LOCALISATION
                  </span>
                </div>
                <h2 className="text-2xl md:text-3xl font-black mb-2 text-black leading-tight">
                  Notre Localisation
                </h2>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Venez nous rendre visite dans notre garage à Ennery
                </p>
              </div>

              <div className="space-y-5 mb-6">
                {/* Adresse */}
                <div className="bg-white p-4 rounded-lg shadow-md border border-gray-200 hover:border-black transition-all duration-300 hover:shadow-lg group">
                  <div className="mb-2">
                    <span className="text-xs font-black text-gray-400 uppercase tracking-widest">
                      ADRESSE
                    </span>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="bg-gradient-to-br from-black to-gray-800 p-2 rounded-lg flex-shrink-0 shadow-md group-hover:scale-110 transition-transform">
                      <MapPin className="w-4 h-4 text-white" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-black leading-relaxed font-bold mb-1">
                        Garage De La Belle Croix
                      </p>
                      <p className="text-xs text-gray-600 font-medium">
                        1 Rue inore Fabbri, 57365 Ennery
                      </p>
                    </div>
                  </div>
                </div>

                {/* Navigation */}
                <div className="bg-white p-4 rounded-lg shadow-md border border-gray-200 hover:border-black transition-all duration-300 hover:shadow-lg">
                  <div className="mb-3">
                    <span className="text-xs font-black text-gray-400 uppercase tracking-widest">
                      NAVIGATION
                    </span>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="bg-gradient-to-br from-black to-gray-800 p-2 rounded-lg flex-shrink-0 shadow-md">
                      <Navigation className="w-4 h-4 text-white" />
                    </div>
                    <div className="flex-1">
                      <button
                        onClick={() => setShowNavigationPopup(true)}
                        className="w-full bg-gradient-to-r from-black to-gray-800 text-white px-4 py-2.5 rounded-lg font-black text-sm hover:from-gray-800 hover:to-black transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center justify-center gap-2"
                      >
                        <Navigation className="w-4 h-4" />
                        J'y vais
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Horaires */}
              <div className="bg-gradient-to-br from-black via-gray-900 to-black text-white p-5 rounded-lg shadow-xl border border-gray-800 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-full blur-2xl"></div>
                <div className="relative z-10">
                  <div className="mb-4">
                    <p className="text-base font-black">Horaires d'ouverture</p>
                  </div>
                  <div className="space-y-2 text-gray-200 text-xs">
                    {isLoading ? (
                      <p className="text-center py-2">Chargement...</p>
                    ) : (
                      groupedHours.map((group, index) => (
                        <div
                          key={index}
                          className={`flex justify-between items-center ${
                            index < groupedHours.length - 1 ? 'pb-2 border-b border-gray-700/50' : ''
                          }`}
                        >
                          <span className="font-bold">{group.label}</span>
                          <span className="font-semibold bg-white/10 px-2 py-1 rounded-md">{group.hours}</span>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Panel - Map avec effet 3D */}
          <div className="relative bg-gray-200 order-1 lg:order-2" style={{ minHeight: '350px' }}>
            <div className="absolute inset-0 p-4 lg:p-6">
              <div 
                className="w-full h-full rounded-lg overflow-hidden shadow-xl transform hover:scale-[1.01] transition-all duration-500"
                style={{
                  boxShadow: '0 15px 30px -10px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
                  transform: 'perspective(1000px) rotateY(-1.5deg) rotateX(1deg)',
                  transformStyle: 'preserve-3d',
                }}
              >
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2782.0864101362477!2d6.20768017667636!3d49.22594647138443!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x4795217671f9a9cb%3A0x1b7aaddec0e47e09!2sGarage%20De%20La%20Belle%20Croix%20-%20Ennery%20-Metz-Thionville!5e1!3m2!1sfr!2sfr!4v1769509293743!5m2!1sfr!2sfr"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="rounded-lg"
                />
              </div>
              
              {/* Effet de lumière 3D */}
              <div 
                className="absolute inset-0 pointer-events-none rounded-lg"
                style={{
                  background: 'linear-gradient(135deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0) 50%, rgba(0,0,0,0.06) 100%)',
                  mixBlendMode: 'overlay'
                }}
              ></div>
            </div>
          </div>
        </div>
      </section>

      {/* Navigation Popup */}
      {showNavigationPopup && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 relative border-4 border-black">
            <button
              onClick={() => setShowNavigationPopup(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-black transition-colors"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="text-center mb-8">
              <div className="w-20 h-20 bg-gradient-to-br from-black to-gray-800 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Navigation className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-3xl font-black mb-2 text-black">
                Choisissez votre application
              </h3>
              <p className="text-gray-600 text-lg">
                Comment souhaitez-vous vous rendre au garage ?
              </p>
            </div>

            <div className="space-y-4">
              <button
                onClick={() => handleNavigation('maps')}
                className="w-full bg-white border-3 border-gray-200 hover:border-blue-500 text-black p-6 rounded-xl font-black text-lg hover:bg-blue-50 transition-all duration-300 shadow-lg hover:shadow-2xl transform hover:scale-105 flex items-center justify-center gap-4 group"
              >
                <div className="relative w-10 h-10 flex-shrink-0">
                  <Image
                    src="/logo/google-maps.png"
                    alt="Google Maps"
                    fill
                    className="object-contain group-hover:scale-110 transition-transform"
                  />
                </div>
                <span>Ouvrir dans Google Maps</span>
              </button>

              <button
                onClick={() => handleNavigation('waze')}
                className="w-full bg-white border-3 border-gray-200 hover:border-blue-400 text-black p-6 rounded-xl font-black text-lg hover:bg-blue-50 transition-all duration-300 shadow-lg hover:shadow-2xl transform hover:scale-105 flex items-center justify-center gap-4 group"
              >
                <div className="relative w-10 h-10 flex-shrink-0">
                  <Image
                    src="/logo/waze.png"
                    alt="Waze"
                    fill
                    className="object-contain group-hover:scale-110 transition-transform"
                  />
                </div>
                <span>Ouvrir dans Waze</span>
              </button>
            </div>

            <p className="text-center text-gray-500 text-sm mt-6">
              Garage De La Belle Croix - Ennery
            </p>
          </div>
        </div>
      )}
    </>
  );
}
