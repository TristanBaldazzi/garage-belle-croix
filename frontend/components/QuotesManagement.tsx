'use client';

import { useState, useEffect } from 'react';
import { quotesAPI } from '@/lib/api';
import toast from 'react-hot-toast';
import { format } from 'date-fns';
import { FileText, Archive, Trash2, CheckCircle, XCircle, Filter, Search, Tag } from 'lucide-react';

interface QuoteRequest {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  licensePlate?: string;
  message: string;
  offerId?: {
    _id: string;
    title: string;
    price?: number;
  } | null;
  offerTitle?: string;
  service?: string;
  vehicleType?: 'voiture' | 'moto';
  vehicle?: string;
  tireSize?: string;
  tireQuantity?: number;
  isRead: boolean;
  isArchived: boolean;
  createdAt: string;
}

export default function QuotesManagement() {
  const [quotes, setQuotes] = useState<QuoteRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'unread' | 'archived'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedQuote, setSelectedQuote] = useState<QuoteRequest | null>(null);

  useEffect(() => {
    loadQuotes();
  }, [filter, searchTerm]);

  const loadQuotes = async () => {
    try {
      setIsLoading(true);
      let params: any = {};
      if (filter === 'unread') {
        params.isRead = false;
        params.isArchived = false;
      } else if (filter === 'archived') {
        params.isArchived = true;
      }
      if (searchTerm) {
        params.search = searchTerm;
      }
      const data = await quotesAPI.getAll(params);
      setQuotes(data);
    } catch (error) {
      toast.error('Erreur lors du chargement des demandes de devis');
    } finally {
      setIsLoading(false);
    }
  };

  const handleMarkAsRead = async (id: string) => {
    try {
      await quotesAPI.markAsRead(id);
      toast.success('Marqué comme lu');
      loadQuotes();
      if (selectedQuote?._id === id) {
        setSelectedQuote({ ...selectedQuote, isRead: true });
      }
    } catch (error) {
      toast.error('Erreur');
    }
  };

  const handleArchive = async (id: string) => {
    try {
      await quotesAPI.archive(id);
      toast.success('Archivé');
      loadQuotes();
      setSelectedQuote(null);
    } catch (error) {
      toast.error('Erreur');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette demande de devis ?')) return;
    
    try {
      await quotesAPI.delete(id);
      toast.success('Demande de devis supprimée');
      loadQuotes();
      setSelectedQuote(null);
    } catch (error) {
      toast.error('Erreur lors de la suppression');
    }
  };

  if (isLoading) {
    return (
      <div className="text-center py-12">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
        <p className="mt-4 text-gray-600">Chargement des demandes de devis...</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h2 className="text-3xl font-black mb-2">Demandes de devis</h2>
          <p className="text-gray-600">Demandes de devis liées aux offres et devis libres (pneus, moto, auto)</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border-2 border-gray-300 rounded-lg focus:border-black focus:outline-none w-64"
            />
          </div>
          <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-md font-bold text-sm transition-all ${
                filter === 'all'
                  ? 'bg-black text-white'
                  : 'text-gray-600 hover:bg-gray-200'
              }`}
            >
              Tous
            </button>
            <button
              onClick={() => setFilter('unread')}
              className={`px-4 py-2 rounded-md font-bold text-sm transition-all ${
                filter === 'unread'
                  ? 'bg-black text-white'
                  : 'text-gray-600 hover:bg-gray-200'
              }`}
            >
              Non lus
            </button>
            <button
              onClick={() => setFilter('archived')}
              className={`px-4 py-2 rounded-md font-bold text-sm transition-all ${
                filter === 'archived'
                  ? 'bg-black text-white'
                  : 'text-gray-600 hover:bg-gray-200'
              }`}
            >
              Archivés
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Liste des demandes */}
        <div className="lg:col-span-2 space-y-3">
          {quotes.length === 0 ? (
            <div className="bg-white rounded-lg shadow-md border border-gray-200 p-12 text-center">
              <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-xl font-black text-gray-500 mb-2">Aucune demande de devis</p>
              <p className="text-gray-400">Les demandes de devis apparaîtront ici</p>
            </div>
          ) : (
            quotes.map((quote) => (
              <div
                key={quote._id}
                onClick={() => setSelectedQuote(quote)}
                className={`bg-white rounded-lg shadow-md border-2 cursor-pointer transition-all hover:shadow-xl ${
                  selectedQuote?._id === quote._id
                    ? 'border-black'
                    : quote.isRead
                    ? 'border-gray-200'
                    : 'border-black'
                } ${!quote.isRead ? 'bg-gray-50' : ''}`}
              >
                <div className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-black text-lg text-black">{quote.name}</h3>
                        {!quote.isRead && (
                          <span className="bg-black text-white text-xs font-black px-2 py-0.5 rounded">
                            Nouveau
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{quote.email}</p>
                      <div className="flex items-center gap-3 text-sm mb-2">
                        <div className="flex items-center gap-2 text-gray-500">
                          <Tag className="w-4 h-4" />
                          <span className="font-bold">{quote.offerTitle || quote.service}</span>
                        </div>
                        {quote.tireSize && (
                          <div className="bg-gray-100 px-2 py-1 rounded font-mono font-bold text-black">
                            {quote.tireSize}{quote.tireQuantity ? ` ×${quote.tireQuantity}` : ''}
                          </div>
                        )}
                        {quote.licensePlate && (
                          <div className="flex items-center gap-1 bg-gray-100 px-2 py-1 rounded font-black text-black">
                            {quote.vehicleType === 'moto' ? '🏍️' : '🚗'} {quote.licensePlate}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-400">
                        {format(new Date(quote.createdAt), 'dd/MM/yyyy HH:mm')}
                      </p>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 line-clamp-2">{quote.message}</p>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Détails de la demande sélectionnée */}
        <div className="lg:col-span-1">
          {selectedQuote ? (
            <div className="bg-white rounded-lg shadow-md border-2 border-gray-200 p-6 sticky top-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-black">Détails</h3>
                <div className="flex items-center gap-2">
                  {!selectedQuote.isRead && (
                    <button
                      onClick={() => handleMarkAsRead(selectedQuote._id)}
                      className="p-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition"
                      title="Marquer comme lu"
                    >
                      <CheckCircle className="w-5 h-5 text-gray-600" />
                    </button>
                  )}
                  {!selectedQuote.isArchived && (
                    <button
                      onClick={() => handleArchive(selectedQuote._id)}
                      className="p-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition"
                      title="Archiver"
                    >
                      <Archive className="w-5 h-5 text-gray-600" />
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(selectedQuote._id)}
                    className="p-2 bg-red-50 hover:bg-red-100 rounded-lg transition"
                    title="Supprimer"
                  >
                    <Trash2 className="w-5 h-5 text-red-600" />
                  </button>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-xs font-black text-gray-500 uppercase mb-1 block">
                    Nom
                  </label>
                  <p className="text-lg font-black">{selectedQuote.name}</p>
                </div>

                <div>
                  <label className="text-xs font-black text-gray-500 uppercase mb-1 block">
                    Email
                  </label>
                  <a
                    href={`mailto:${selectedQuote.email}`}
                    className="text-lg text-black hover:underline font-bold"
                  >
                    {selectedQuote.email}
                  </a>
                </div>

                {selectedQuote.phone && (
                  <div>
                    <label className="text-xs font-black text-gray-500 uppercase mb-1 block">
                      Téléphone
                    </label>
                    <a
                      href={`tel:${selectedQuote.phone}`}
                      className="text-lg text-black hover:underline font-bold"
                    >
                      {selectedQuote.phone}
                    </a>
                  </div>
                )}

                {selectedQuote.licensePlate && (
                  <div>
                    <label className="text-xs font-black text-gray-500 uppercase mb-1 block">
                      Plaque d'immatriculation
                    </label>
                    <div className="bg-gray-100 p-3 rounded-lg">
                      <p className="font-black text-lg text-black">{selectedQuote.licensePlate}</p>
                    </div>
                  </div>
                )}

                {selectedQuote.offerTitle ? (
                  <div>
                    <label className="text-xs font-black text-gray-500 uppercase mb-1 block">
                      Offre concernée
                    </label>
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <p className="font-black text-black">{selectedQuote.offerTitle}</p>
                      {selectedQuote.offerId?.price && (
                        <p className="text-sm text-gray-600 mt-1">
                          Prix: {selectedQuote.offerId.price.toFixed(2)}€
                        </p>
                      )}
                    </div>
                  </div>
                ) : (
                  <div>
                    <label className="text-xs font-black text-gray-500 uppercase mb-1 block">
                      Prestation
                    </label>
                    <div className="bg-gray-50 p-3 rounded-lg space-y-1">
                      <p className="font-black text-black">{selectedQuote.service}</p>
                      <p className="text-sm text-gray-600">
                        {selectedQuote.vehicleType === 'moto' ? 'Moto' : 'Voiture'}
                        {selectedQuote.vehicle && ` — ${selectedQuote.vehicle}`}
                      </p>
                      {selectedQuote.tireSize && (
                        <p className="text-sm font-mono font-bold">
                          Pneus : {selectedQuote.tireSize}{selectedQuote.tireQuantity ? ` (×${selectedQuote.tireQuantity})` : ''}
                        </p>
                      )}
                    </div>
                  </div>
                )}

                <div>
                  <label className="text-xs font-black text-gray-500 uppercase mb-1 block">
                    Message
                  </label>
                  <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                    {selectedQuote.message}
                  </p>
                </div>

                <div>
                  <label className="text-xs font-black text-gray-500 uppercase mb-1 block">
                    Date
                  </label>
                  <p className="text-gray-600">
                    {format(new Date(selectedQuote.createdAt), 'dd/MM/yyyy à HH:mm')}
                  </p>
                </div>

                <div className="pt-4 border-t border-gray-200">
                  <div className="flex items-center gap-2">
                    <a
                      href={`mailto:${selectedQuote.email}?subject=Re: Demande de devis - ${selectedQuote.offerTitle || selectedQuote.service || ''}`}
                      className="flex-1 bg-black text-white px-4 py-2 rounded-lg font-black text-center hover:bg-gray-800 transition"
                    >
                      Répondre
                    </a>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-md border-2 border-gray-200 p-12 text-center">
              <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 font-black">Sélectionnez une demande</p>
              <p className="text-sm text-gray-400 mt-2">
                Cliquez sur une demande pour voir les détails
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

