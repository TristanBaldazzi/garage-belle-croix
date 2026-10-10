'use client';

import { useCallback, useEffect, useState } from 'react';
import { useAuthStore } from '@/lib/store';
import toast from 'react-hot-toast';
import { appointmentsAPI, contactsAPI, quotesAPI } from '@/lib/api';
import { AdminCountsContext } from './admin/counts';
import OffersManagement from './OffersManagement';
import ContactsManagement from './ContactsManagement';
import QuotesManagement from './QuotesManagement';
import CategoryOrderManagement from './CategoryOrderManagement';
import OpeningHoursManagement from './OpeningHoursManagement';
import AppointmentsManagement from './AppointmentsManagement';
import { Package, Mail, LogOut, ListOrdered, FileText, Clock, CalendarCheck, ExternalLink, Menu, X, type LucideIcon } from 'lucide-react';

type Tab = 'appointments' | 'quotes' | 'contacts' | 'offers' | 'categories' | 'hours';

const NAV: { group: string; items: { id: Tab; label: string; Icon: LucideIcon; counter?: 'appointments' | 'quotes' | 'contacts' }[] }[] = [
  {
    group: 'Demandes clients',
    items: [
      { id: 'appointments', label: 'Rendez-vous', Icon: CalendarCheck, counter: 'appointments' },
      { id: 'quotes', label: 'Devis', Icon: FileText, counter: 'quotes' },
      { id: 'contacts', label: 'Messages', Icon: Mail, counter: 'contacts' },
    ],
  },
  {
    group: 'Site',
    items: [
      { id: 'offers', label: 'Offres', Icon: Package },
      { id: 'categories', label: 'Ordre des catégories', Icon: ListOrdered },
      { id: 'hours', label: 'Horaires d’ouverture', Icon: Clock },
    ],
  },
];

type Counts = { appointments: number; quotes: number; contacts: number };

// Onglet mémorisé dans l'adresse (/admin#devis) pour le retrouver après un rafraîchissement
const TAB_HASH: Record<Tab, string> = {
  appointments: 'rendez-vous',
  quotes: 'devis',
  contacts: 'messages',
  offers: 'offres',
  categories: 'categories',
  hours: 'horaires',
};

const tabFromHash = (): Tab => {
  if (typeof window === 'undefined') return 'appointments';
  const hash = window.location.hash.replace('#', '');
  const found = (Object.keys(TAB_HASH) as Tab[]).find((tab) => TAB_HASH[tab] === hash);
  return found || 'appointments';
};

export default function AdminDashboard() {
  const { logout, user } = useAuthStore();
  const [activeTab, setActiveTab] = useState<Tab>(tabFromHash);
  const [counts, setCounts] = useState<Counts>({ appointments: 0, quotes: 0, contacts: 0 });
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const refreshCounts = useCallback(async () => {
    try {
      const [appointments, quotes, contacts] = await Promise.all([
        appointmentsAPI.getAll({ status: 'en_attente', isArchived: false }),
        quotesAPI.getAll({ isRead: false, isArchived: false }),
        contactsAPI.getAll({ isRead: false, isArchived: false }),
      ]);
      setCounts({ appointments: appointments.length, quotes: quotes.length, contacts: contacts.length });
    } catch {
      // compteurs non bloquants
    }
  }, []);

  useEffect(() => {
    refreshCounts();
    // Rafraîchit toutes les 2 minutes, uniquement si l'onglet du navigateur est visible
    const timer = setInterval(() => {
      if (document.visibilityState === 'visible') refreshCounts();
    }, 120_000);
    return () => clearInterval(timer);
  }, [refreshCounts]);

  const handleLogout = async () => {
    try {
      await logout();
      toast.success('Déconnexion réussie');
    } catch (error) {
      toast.error('Erreur de déconnexion');
    }
  };

  // Boutons précédent / suivant du navigateur
  useEffect(() => {
    const onHashChange = () => setActiveTab(tabFromHash());
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  const goTo = (tab: Tab) => {
    setActiveTab(tab);
    if (window.location.hash !== `#${TAB_HASH[tab]}`) window.location.hash = TAB_HASH[tab];
    setIsMenuOpen(false);
    refreshCounts();
  };

  const sidebar = (
    <div className="flex h-full flex-col bg-ink text-white">
      <div className="flex h-20 items-center border-b border-white/10 pl-6 pr-14 lg:pr-6">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/logo/logo-belle-croix-horizontal-white.svg" alt="Garage de la Belle Croix" className="h-9 w-auto" />
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-6">
        {NAV.map((section) => (
          <div key={section.group} className="mb-7">
            <p className="mb-2 px-3 text-[11px] font-semibold uppercase tracking-[0.16em] text-white/35">{section.group}</p>
            <ul className="space-y-0.5">
              {section.items.map(({ id, label, Icon, counter }) => {
                const active = activeTab === id;
                const count = counter ? counts[counter] : 0;
                return (
                  <li key={id}>
                    <button
                      type="button"
                      onClick={() => goTo(id)}
                      className={`relative flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm font-medium transition-colors ${
                        active ? 'bg-white/10 text-white' : 'text-white/60 hover:bg-white/5 hover:text-white'
                      }`}
                    >
                      {active && <span className="absolute inset-y-2 left-0 w-[3px] rounded-r bg-brand" />}
                      <Icon className={`h-[18px] w-[18px] ${active ? 'text-brand' : ''}`} strokeWidth={2} />
                      <span className="flex-1">{label}</span>
                      {count > 0 && (
                        <span className="min-w-[22px] rounded-full bg-brand px-1.5 py-0.5 text-center text-[11px] font-bold text-white">{count}</span>
                      )}
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      <div className="space-y-1 border-t border-white/10 p-3">
        <a
          href="/"
          target="_blank"
          className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-white/60 transition-colors hover:bg-white/5 hover:text-white"
        >
          <ExternalLink className="h-[18px] w-[18px]" />
          Voir le site
        </a>
        <button
          type="button"
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm font-medium text-white/60 transition-colors hover:bg-white/5 hover:text-white"
        >
          <LogOut className="h-[18px] w-[18px]" />
          Déconnexion
        </button>
        {user?.email && <p className="truncate px-3 pt-2 text-xs text-white/30">{user.email}</p>}
      </div>
    </div>
  );

  return (
    <AdminCountsContext.Provider value={refreshCounts}>
      <div className="min-h-screen bg-[#F5F5F3]">
        {/* Barre latérale (ordinateur) */}
        <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 lg:block">{sidebar}</aside>

        {/* Barre du haut + tiroir (mobile) */}
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between bg-ink px-4 lg:hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo/logo-belle-croix-horizontal-white.svg" alt="Garage de la Belle Croix" className="h-8 w-auto" />
          <button
            type="button"
            onClick={() => setIsMenuOpen(true)}
            className="relative flex h-10 w-10 items-center justify-center rounded-lg text-white hover:bg-white/10"
            aria-label="Ouvrir le menu"
          >
            <Menu className="h-5 w-5" />
            {counts.appointments + counts.quotes + counts.contacts > 0 && (
              <span className="absolute right-1.5 top-1.5 h-2.5 w-2.5 rounded-full bg-brand ring-2 ring-ink" />
            )}
          </button>
        </header>
        {isMenuOpen && (
          <div className="fixed inset-0 z-40 lg:hidden">
            <div className="absolute inset-0 bg-black/50" onClick={() => setIsMenuOpen(false)} />
            <div className="absolute inset-y-0 left-0 w-72 max-w-[85vw] shadow-2xl">
              {sidebar}
              <button
                type="button"
                onClick={() => setIsMenuOpen(false)}
                className="absolute right-3 top-5 flex h-10 w-10 items-center justify-center rounded-lg text-white/70 hover:bg-white/10"
                aria-label="Fermer le menu"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>
        )}

        <main className="lg:pl-64">
          <div className="mx-auto max-w-6xl px-4 py-6 md:px-8 md:py-10">
            {activeTab === 'appointments' && <AppointmentsManagement />}
            {activeTab === 'offers' && <OffersManagement />}
            {activeTab === 'contacts' && <ContactsManagement />}
            {activeTab === 'quotes' && <QuotesManagement />}
            {activeTab === 'categories' && <CategoryOrderManagement />}
            {activeTab === 'hours' && <OpeningHoursManagement />}
          </div>
        </main>
      </div>
    </AdminCountsContext.Provider>
  );
}
