'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Wrench, Menu, X } from 'lucide-react';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const isActive = (path: string) => {
    return pathname === path;
  };

  return (
    <header className="bg-black text-white sticky top-0 z-50 shadow-2xl border-b-2 border-gray-800">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="bg-white p-2.5 rounded-xl group-hover:bg-gray-200 transition-all duration-300 shadow-lg group-hover:scale-110 transform">
              <Wrench className="w-8 h-8 text-black" />
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-black tracking-tight">GARAGE DE LA BELLE CROIX</h1>
              <p className="text-xs md:text-sm text-gray-300 font-semibold">Votre garage de confiance</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            <Link 
              href="/" 
              className={`text-sm font-black uppercase tracking-wide py-2 px-3 rounded-lg transition-all duration-300 relative ${
                isActive('/') 
                  ? 'text-white' 
                  : 'text-gray-300 hover:text-white'
              }`}
            >
              Accueil
              {isActive('/') && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-white"></span>
              )}
            </Link>
            <Link 
              href="/offres" 
              className={`text-sm font-black uppercase tracking-wide py-2 px-3 rounded-lg transition-all duration-300 relative ${
                isActive('/offres') 
                  ? 'text-white' 
                  : 'text-gray-300 hover:text-white'
              }`}
            >
              Nos Offres
              {isActive('/offres') && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-white"></span>
              )}
            </Link>
            <Link 
              href="/contact" 
              className={`text-sm font-black uppercase tracking-wide py-2 px-3 rounded-lg transition-all duration-300 relative ${
                isActive('/contact') 
                  ? 'text-white' 
                  : 'text-gray-300 hover:text-white'
              }`}
            >
              Contact
              {isActive('/contact') && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-white"></span>
              )}
            </Link>
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMenu}
            className="md:hidden bg-white/10 hover:bg-white/20 p-2 rounded-lg transition-all duration-300"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        <div
          className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
            isMenuOpen ? 'max-h-96 opacity-100 mt-4' : 'max-h-0 opacity-0'
          }`}
        >
          <nav className="flex flex-col gap-2 pb-4 border-t border-gray-800 pt-4">
            <Link
              href="/"
              onClick={closeMenu}
              className={`py-3 px-4 rounded-lg font-black uppercase tracking-wide text-sm transition-all duration-300 ${
                isActive('/')
                  ? 'bg-white text-black'
                  : 'text-gray-300 hover:bg-white/10 hover:text-white'
              }`}
            >
              Accueil
            </Link>
            <Link
              href="/offres"
              onClick={closeMenu}
              className={`py-3 px-4 rounded-lg font-black uppercase tracking-wide text-sm transition-all duration-300 ${
                isActive('/offres')
                  ? 'bg-white text-black'
                  : 'text-gray-300 hover:bg-white/10 hover:text-white'
              }`}
            >
              Nos Offres
            </Link>
            <Link
              href="/contact"
              onClick={closeMenu}
              className={`py-3 px-4 rounded-lg font-black uppercase tracking-wide text-sm transition-all duration-300 ${
                isActive('/contact')
                  ? 'bg-white text-black'
                  : 'text-gray-300 hover:bg-white/10 hover:text-white'
              }`}
            >
              Contact
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}
