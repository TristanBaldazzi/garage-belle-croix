'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, Phone, ArrowRight } from 'lucide-react';
import Logo from '@/components/Logo';
import { SITE } from '@/lib/site';

const NAV_LINKS = [
  { href: '/', label: 'Accueil' },
  { href: '/#presentation', label: 'Présentation' },
  { href: '/offres', label: 'Offres' },
  { href: '/contact', label: 'Contact' },
];

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();

  const closeMenu = () => setIsMenuOpen(false);
  const isActive = (path: string) => pathname === path;

  // Bloque le défilement de la page quand le menu mobile est ouvert
  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMenuOpen]);

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-ink text-white">
      <div className="container-site flex h-[68px] items-center justify-between gap-6 lg:h-[84px]">
        <Logo onClick={closeMenu} />

        <nav className="hidden h-full items-center gap-10 lg:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`caps relative flex h-full items-center transition-colors ${
                isActive(link.href) ? 'text-white' : 'text-white/55 hover:text-white'
              }`}
            >
              {link.label}
              {isActive(link.href) && <span className="absolute inset-x-0 bottom-[26px] h-[2px] bg-brand" />}
            </Link>
          ))}
        </nav>

        <a href={SITE.phoneHref} className="btn-accent hidden h-11 px-6 lg:inline-flex">
          <Phone className="h-4 w-4" strokeWidth={2.25} />
          {SITE.phone}
        </a>

        <div className="flex items-center gap-2 lg:hidden">
          <a
            href={SITE.phoneHref}
            className="btn-accent h-11 w-12 px-0"
            aria-label={`Appeler le garage au ${SITE.phone}`}
          >
            <Phone className="h-[18px] w-[18px]" strokeWidth={2} />
          </a>
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="flex h-11 w-11 items-center justify-center border border-white/20 transition-colors hover:border-white/50"
            aria-label={isMenuOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
            aria-expanded={isMenuOpen}
          >
            {isMenuOpen ? <X className="h-5 w-5" strokeWidth={1.75} /> : <Menu className="h-5 w-5" strokeWidth={1.75} />}
          </button>
        </div>
      </div>

      {/* Menu mobile plein écran */}
      <div
        className={`fixed inset-x-0 bottom-0 top-[68px] overflow-y-auto bg-ink bg-hatch transition-opacity duration-200 lg:hidden ${
          isMenuOpen ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
      >
        <nav className="container-site flex min-h-full flex-col py-8">
          {NAV_LINKS.map((link, index) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={closeMenu}
              className="group flex items-center justify-between border-b border-white/10 py-5"
            >
              <span className="flex items-baseline gap-4">
                <span className="heading text-outline text-2xl text-brand">{String(index + 1).padStart(2, '0')}</span>
                <span className={`heading text-[34px] ${isActive(link.href) ? 'text-brand' : 'text-white'}`}>{link.label}</span>
              </span>
              <ArrowRight className="h-5 w-5 text-white/40" strokeWidth={1.75} />
            </Link>
          ))}
          <div className="mt-10 grid grid-cols-1 gap-4">
            <Link href="/rendez-vous" onClick={closeMenu} className="btn-accent">
              Prendre rendez-vous
            </Link>
            <Link href="/devis" onClick={closeMenu} className="btn-outline-light">
              Demander un devis
            </Link>
          </div>
          <div className="mt-auto pt-10">
            <span className="caps text-white/50">Appel direct</span>
            <a href={SITE.phoneHref} className="heading mt-2 block text-4xl">{SITE.phone}</a>
            <a href={SITE.phone2Href} className="heading mt-1 block text-2xl text-white/55">{SITE.phone2}</a>
          </div>
        </nav>
      </div>
    </header>
  );
}
