'use client';

import { Car } from 'lucide-react';

export default function LoadingSpinner({ 
  size = 'large',
  showText = true 
}: { 
  size?: 'small' | 'medium' | 'large';
  showText?: boolean;
}) {
  const sizeClasses = {
    small: 'w-12 h-12',
    medium: 'w-16 h-16',
    large: 'w-24 h-24'
  };

  const iconSizes = {
    small: 'w-6 h-6',
    medium: 'w-8 h-8',
    large: 'w-12 h-12'
  };

  const borderSizes = {
    small: 'border-4',
    medium: 'border-6',
    large: 'border-8'
  };

  return (
    <div className="flex flex-col items-center justify-center gap-4 py-8">
      <div className={`relative ${sizeClasses[size]}`}>
        {/* Pneu externe - rotation lente (sens horaire) */}
        <div className={`absolute inset-0 rounded-full ${borderSizes[size]} border-gray-200 border-t-black border-r-gray-400 animate-spin-slow`}>
          {/* Détails du pneu - bandes */}
          <div className="absolute inset-2 rounded-full border-2 border-gray-300/50"></div>
          <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-gray-300/30 transform -translate-y-1/2"></div>
          <div className="absolute top-0 bottom-0 left-1/2 w-0.5 bg-gray-300/30 transform -translate-x-1/2"></div>
        </div>
        
        {/* Pneu interne - rotation rapide (sens anti-horaire) */}
        <div className={`absolute inset-4 rounded-full ${size === 'large' ? 'border-4' : size === 'medium' ? 'border-3' : 'border-2'} border-gray-400 border-t-black border-l-gray-600 animate-spin`} style={{ animationDirection: 'reverse' }}>
          <div className="absolute inset-1 rounded-full border border-gray-500/50"></div>
        </div>
        
        {/* Centre avec icône de voiture */}
        <div className="absolute inset-0 flex items-center justify-center bg-white rounded-full shadow-inner">
          <Car className={`${iconSizes[size]} text-black`} strokeWidth={2.5} />
        </div>
      </div>
      
      {/* Texte de chargement optionnel */}
      {showText && (
        <p className="text-sm font-semibold text-gray-600 animate-pulse">Chargement...</p>
      )}
    </div>
  );
}

