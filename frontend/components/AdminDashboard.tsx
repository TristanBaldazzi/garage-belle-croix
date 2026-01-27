'use client';

import { useState } from 'react';
import { useAuthStore } from '@/lib/store';
import toast from 'react-hot-toast';
import OffersManagement from './OffersManagement';
import ContactsManagement from './ContactsManagement';
import QuotesManagement from './QuotesManagement';
import CategoryOrderManagement from './CategoryOrderManagement';
import OpeningHoursManagement from './OpeningHoursManagement';
import { Wrench, Package, Mail, LogOut, Settings, FileText, Clock } from 'lucide-react';

export default function AdminDashboard() {
  const { logout } = useAuthStore();
  const [activeTab, setActiveTab] = useState<'offers' | 'contacts' | 'quotes' | 'categories' | 'hours'>('offers');

  const handleLogout = async () => {
    try {
      await logout();
      toast.success('Déconnexion réussie');
    } catch (error) {
      toast.error('Erreur de déconnexion');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-black text-white shadow-lg">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-white p-2 rounded">
                <Wrench className="w-6 h-6 text-black" />
              </div>
              <div>
                <h1 className="text-xl font-bold">Administration</h1>
                <p className="text-sm text-gray-300">Garage de la Belle Croix</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 bg-white text-black px-6 py-2 font-bold rounded-lg hover:bg-gray-200 transition-all duration-300"
            >
              <LogOut className="w-4 h-4" />
              Déconnexion
            </button>
          </div>
        </div>
      </header>

      {/* Tabs */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex gap-2">
            <button
              onClick={() => setActiveTab('offers')}
              className={`flex items-center gap-2 py-4 px-6 font-bold border-b-3 transition-all ${
                activeTab === 'offers'
                  ? 'border-black text-black'
                  : 'border-transparent text-gray-500 hover:text-black hover:border-gray-300'
              }`}
            >
              <Package className="w-5 h-5" />
              Gestion des offres
            </button>
            <button
              onClick={() => setActiveTab('contacts')}
              className={`flex items-center gap-2 py-4 px-6 font-bold border-b-3 transition-all ${
                activeTab === 'contacts'
                  ? 'border-black text-black'
                  : 'border-transparent text-gray-500 hover:text-black hover:border-gray-300'
              }`}
            >
              <Mail className="w-5 h-5" />
              Demandes de contact
            </button>
            <button
              onClick={() => setActiveTab('quotes')}
              className={`flex items-center gap-2 py-4 px-6 font-bold border-b-3 transition-all ${
                activeTab === 'quotes'
                  ? 'border-black text-black'
                  : 'border-transparent text-gray-500 hover:text-black hover:border-gray-300'
              }`}
            >
              <FileText className="w-5 h-5" />
              Demandes de devis
            </button>
            <button
              onClick={() => setActiveTab('categories')}
              className={`flex items-center gap-2 py-4 px-6 font-bold border-b-3 transition-all ${
                activeTab === 'categories'
                  ? 'border-black text-black'
                  : 'border-transparent text-gray-500 hover:text-black hover:border-gray-300'
              }`}
            >
              <Settings className="w-5 h-5" />
              Ordre des catégories
            </button>
            <button
              onClick={() => setActiveTab('hours')}
              className={`flex items-center gap-2 py-4 px-6 font-bold border-b-3 transition-all ${
                activeTab === 'hours'
                  ? 'border-black text-black'
                  : 'border-transparent text-gray-500 hover:text-black hover:border-gray-300'
              }`}
            >
              <Clock className="w-5 h-5" />
              Horaires d'ouverture
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-8">
        {activeTab === 'offers' && <OffersManagement />}
        {activeTab === 'contacts' && <ContactsManagement />}
        {activeTab === 'quotes' && <QuotesManagement />}
        {activeTab === 'categories' && <CategoryOrderManagement />}
        {activeTab === 'hours' && <OpeningHoursManagement />}
      </div>
    </div>
  );
}
