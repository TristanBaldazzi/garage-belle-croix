'use client';

import { ChevronDown } from 'lucide-react';

export default function ScrollDownArrow() {
  const handleScroll = () => {
    const servicesSection = document.getElementById('services');
    if (servicesSection) {
      servicesSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
      // Fallback: scroll down by viewport height
      window.scrollBy({ top: window.innerHeight * 0.8, behavior: 'smooth' });
    }
  };

  return (
    <button
      onClick={handleScroll}
      className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20 group cursor-pointer"
      aria-label="Découvrir la suite"
    >
      <div className="flex flex-col items-center gap-2 animate-bounce">
        <span className="text-white/90 text-sm font-semibold uppercase tracking-wider group-hover:text-white transition-colors">
          Découvrir
        </span>
        <div className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-md border-2 border-white/30 flex items-center justify-center group-hover:bg-white/20 group-hover:border-white/50 transition-all duration-300 shadow-lg group-hover:shadow-xl">
          <ChevronDown className="w-6 h-6 text-white group-hover:scale-110 transition-transform duration-300" strokeWidth={3} />
        </div>
      </div>
    </button>
  );
}



