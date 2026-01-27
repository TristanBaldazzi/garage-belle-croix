import type { Metadata } from 'next';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import LocationMap from '@/components/LocationMap';
import ScrollDownArrow from '@/components/ScrollDownArrow';
import OffersPreview from '@/components/OffersPreview';
import { Wrench, Settings, Car, Droplet, ArrowRight, CheckCircle, Sparkles } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Garage de la Belle Croix - Entretien et Réparation Automobile à Ennery',
  description: 'Garage automobile à Ennery près de Metz-Thionville. Entretien, réparation, pneus, vidange. Devis gratuits. Contactez-nous au 0609369490.',
  keywords: 'garage automobile Ennery, entretien voiture Metz, réparation auto Thionville, pneus, vidange, garage de confiance',
  openGraph: {
    title: 'Garage de la Belle Croix - Entretien et Réparation Automobile',
    description: 'Votre garage de confiance pour l\'entretien et la réparation automobile à Ennery',
    type: 'website',
  },
};

export default async function Home() {

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Location Map Section - En haut comme sur ZeCarrossery */}
      <LocationMap />

      {/* Hero Section - Plus grand et plus impactant */}
      <section id="hero" className="relative bg-gradient-to-br from-black via-gray-900 to-black text-white overflow-hidden min-h-[90vh] flex items-center">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.03'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            backgroundRepeat: 'repeat'
          }}></div>
        </div>
        
        {/* Accent gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent"></div>
        
        <div className="relative container mx-auto px-4 py-32 md:py-40">
          <div className="max-w-5xl mx-auto text-center animate-fade-in-up">
            <div className="inline-block mb-8">
              <div className="bg-gradient-to-r from-white/20 to-white/10 backdrop-blur-md border-2 border-white/30 px-8 py-4 rounded-full shadow-2xl">
                <div className="flex items-center gap-3">
                  <Sparkles className="w-5 h-5 text-white" />
                  <span className="text-base md:text-lg font-bold uppercase tracking-widest">Expertise Automobile</span>
                </div>
              </div>
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black mb-6 leading-none tracking-tight">
              Votre Véhicule,
              <br />
              <span className="bg-gradient-to-r from-white via-gray-200 to-white bg-clip-text text-transparent">
                Notre Passion
              </span>
            </h1>
            
            <p className="text-base md:text-lg text-gray-200 mb-10 max-w-2xl mx-auto leading-relaxed font-light">
              Entretien, réparation, pneus, vidange... Nous prenons soin de votre véhicule avec expertise et professionnalisme.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <Link 
                href="/offres"
                className="group border-3 border-white text-white px-10 py-5 font-black text-xl rounded-xl hover:bg-white hover:text-black transition-all duration-300 flex items-center justify-center gap-3 backdrop-blur-md bg-white/10 shadow-xl hover:shadow-2xl"
              >
                Découvrir nos offres
                <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
              </Link>
              <Link 
                href="/contact"
                className="group border-3 border-white text-white px-10 py-5 font-black text-xl rounded-xl hover:bg-white hover:text-black transition-all duration-300 flex items-center justify-center gap-3 backdrop-blur-md bg-white/10 shadow-xl hover:shadow-2xl"
              >
                Nous contacter
              </Link>
            </div>
          </div>
        </div>

        {/* Scroll Down Arrow */}
        <ScrollDownArrow />
      </section>

      {/* Services Section */}
      <section id="services" className="py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-black mb-4 text-black tracking-tight">Nos Services</h2>
            <p className="text-base md:text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
              Une gamme complète de services pour entretenir et réparer votre véhicule
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Entretien */}
            <div className="relative bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-0.5 border border-gray-200 hover:border-gray-300 group">
              <div className="relative z-10 flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-black via-gray-900 to-black rounded-xl flex items-center justify-center mb-5 group-hover:scale-105 group-hover:rotate-2 transition-all duration-300 shadow-md">
                  <Wrench className="w-8 h-8 text-white group-hover:scale-110 transition-transform duration-300" strokeWidth={2} />
                </div>
                <h3 className="text-lg font-bold text-black group-hover:text-gray-700 transition-colors duration-300 leading-tight tracking-tight">
                  Entretien
                </h3>
              </div>
            </div>

            {/* Réparation */}
            <div className="relative bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-0.5 border border-gray-200 hover:border-gray-300 group">
              <div className="relative z-10 flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-black via-gray-900 to-black rounded-xl flex items-center justify-center mb-5 group-hover:scale-105 group-hover:rotate-2 transition-all duration-300 shadow-md">
                  <Settings className="w-8 h-8 text-white group-hover:rotate-90 transition-transform duration-300" strokeWidth={2} />
                </div>
                <h3 className="text-lg font-bold text-black group-hover:text-gray-700 transition-colors duration-300 leading-tight tracking-tight">
                  Réparation
                </h3>
              </div>
            </div>

            {/* Pneus */}
            <div className="relative bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-0.5 border border-gray-200 hover:border-gray-300 group">
              <div className="relative z-10 flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-black via-gray-900 to-black rounded-xl flex items-center justify-center mb-5 group-hover:scale-105 group-hover:rotate-2 transition-all duration-300 shadow-md">
                  <Car className="w-8 h-8 text-white group-hover:scale-110 transition-transform duration-300" strokeWidth={2} />
                </div>
                <h3 className="text-lg font-bold text-black group-hover:text-gray-700 transition-colors duration-300 leading-tight tracking-tight">
                  Pneus
                </h3>
              </div>
            </div>

            {/* Vidange */}
            <div className="relative bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-0.5 border border-gray-200 hover:border-gray-300 group">
              <div className="relative z-10 flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-black via-gray-900 to-black rounded-xl flex items-center justify-center mb-5 group-hover:scale-105 group-hover:rotate-2 transition-all duration-300 shadow-md">
                  <Droplet className="w-8 h-8 text-white group-hover:scale-110 transition-transform duration-300" strokeWidth={2} />
                </div>
                <h3 className="text-lg font-bold text-black group-hover:text-gray-700 transition-colors duration-300 leading-tight tracking-tight">
                  Vidange
                </h3>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Offers Preview */}
      <OffersPreview />

      {/* Why Choose Us */}
      <section className="py-20 bg-gradient-to-br from-black via-gray-900 to-black text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-white/5 via-transparent to-white/5"></div>
        <div className="relative container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-black mb-4 tracking-tight">Pourquoi Nous Choisir ?</h2>
            <p className="text-base md:text-lg text-gray-300 max-w-2xl mx-auto leading-relaxed">
              Des années d'expérience au service de votre satisfaction
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center group">
              <div className="w-20 h-20 bg-gradient-to-br from-white/20 to-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-105 transition-transform shadow-lg border border-white/20">
                <CheckCircle className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-lg font-bold mb-3">Expertise Reconnue</h3>
              <p className="text-sm text-gray-300 leading-relaxed">
                Une équipe experte au service de votre véhicule
              </p>
            </div>
            <div className="text-center group">
              <div className="w-20 h-20 bg-gradient-to-br from-white/20 to-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-105 transition-transform shadow-lg border border-white/20">
                <CheckCircle className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-lg font-bold mb-3">Prix Transparents</h3>
              <p className="text-sm text-gray-300 leading-relaxed">
                Devis gratuits et prix compétitifs sans surprise
              </p>
            </div>
            <div className="text-center group">
              <div className="w-20 h-20 bg-gradient-to-br from-white/20 to-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-105 transition-transform shadow-lg border border-white/20">
                <CheckCircle className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-lg font-bold mb-3">Service Rapide</h3>
              <p className="text-sm text-gray-300 leading-relaxed">
                Intervention rapide et respect des délais
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
