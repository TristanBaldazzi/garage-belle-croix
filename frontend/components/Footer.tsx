'use client';

import { Phone, Mail, MapPin, Clock } from 'lucide-react';
import { useOpeningHours } from '@/lib/useOpeningHours';

export default function Footer() {
  const { getGroupedHours, isLoading } = useOpeningHours();
  const groupedHours = getGroupedHours();

  return (
    <footer className="bg-black text-white border-t-2 border-gray-800">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          <div>
            <h3 className="text-2xl font-black mb-6">GARAGE DE LA BELLE CROIX</h3>
            <p className="text-gray-300 text-lg leading-relaxed mb-4">
              Votre partenaire de confiance pour l'entretien et la réparation de votre véhicule.
            </p>
            <p className="text-sm text-gray-400">
              Fait par{' '}
              <a
                href="https://makemydesign.fr"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-white underline underline-offset-2 transition-colors duration-200"
              >
                Make My Design
              </a>
            </p>
          </div>
          <div>
            <h3 className="text-2xl font-black mb-6">CONTACT</h3>
            <div className="space-y-4 text-base text-gray-300">
              <div className="flex items-center gap-4">
                <div className="bg-white/10 p-2 rounded-lg">
                  <Phone className="w-6 h-6" />
                </div>
                <span className="font-semibold">0609369490</span>
              </div>
              <div className="flex items-center gap-4">
                <div className="bg-white/10 p-2 rounded-lg">
                  <Mail className="w-6 h-6" />
                </div>
                <span className="font-semibold">contact@garage-belle-croix.fr</span>
              </div>
              <div className="flex items-center gap-4">
                <div className="bg-white/10 p-2 rounded-lg">
                  <MapPin className="w-6 h-6" />
                </div>
                <span className="font-semibold">1 Rue inore Fabbri, 57365 Ennery</span>
              </div>
            </div>
          </div>
          <div>
            <h3 className="text-2xl font-black mb-6">HORAIRES</h3>
            <div className="text-base text-gray-300 space-y-3">
              {isLoading ? (
                <div className="flex items-center gap-3">
                  <Clock className="w-5 h-5" />
                  <p>Chargement...</p>
                </div>
              ) : (
                groupedHours.map((group, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <Clock className="w-5 h-5" />
                    <div>
                      <p className="font-semibold">{group.label}</p>
                      <p>{group.hours}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
        <div className="border-t-2 border-gray-800 pt-8 text-center">
          <p className="text-base text-gray-400 font-semibold">© {new Date().getFullYear()} Garage de la Belle Croix - Tous droits réservés</p>
        </div>
      </div>
    </footer>
  );
}
