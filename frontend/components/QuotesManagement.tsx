'use client';

import { useState, useEffect } from 'react';
import { quotesAPI } from '@/lib/api';
import toast from 'react-hot-toast';
import { format } from 'date-fns';
import { FileText, Archive, Trash2, CheckCircle, Search, Phone, Reply, Car, Bike } from 'lucide-react';
import { scrollToDetailOnMobile, AdminCard, AdminPageHeader, AdminSpinner, Badge, DetailField, EmptyState, FilterTabs, IconButton, adminButton, adminInput } from './admin/ui';
import { useRefreshAdminCounts } from './admin/counts';

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
  const refreshCounts = useRefreshAdminCounts();

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
      refreshCounts();
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

  return (
    <div>
      <AdminPageHeader
        title="Devis"
        subtitle="Demandes de devis libres et demandes liées à une offre du site."
        actions={
          <>
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Rechercher…"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`${adminInput} w-64 pl-9`}
              />
            </div>
            <FilterTabs
              value={filter}
              onChange={(f) => {
                setFilter(f);
                setSelectedQuote(null);
              }}
              options={[
                { id: 'all', label: 'Tous' },
                { id: 'unread', label: 'Non lus' },
                { id: 'archived', label: 'Archivés' },
              ]}
            />
          </>
        }
      />

      <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-5">
        <AdminCard className="overflow-hidden lg:col-span-3">
          {isLoading && quotes.length === 0 ? (
            <AdminSpinner label="Chargement des devis…" />
          ) : quotes.length === 0 ? (
            <EmptyState
              icon={FileText}
              title={searchTerm ? 'Aucun résultat' : 'Aucune demande de devis'}
              text={searchTerm ? 'Essayez un autre nom, e-mail ou plaque.' : 'Les demandes de devis faites sur le site apparaîtront ici.'}
            />
          ) : (
            <ul className={`divide-y divide-gray-100 transition-opacity ${isLoading ? 'opacity-60' : ''}`}>
              {quotes.map((quote) => {
                const isSelected = selectedQuote?._id === quote._id;
                const VehicleIcon = quote.vehicleType === 'moto' ? Bike : Car;
                return (
                  <li key={quote._id}>
                    <button
                      type="button"
                      onClick={() => { setSelectedQuote(quote); scrollToDetailOnMobile(); }}
                      className={`relative block w-full px-5 py-4 text-left transition-colors ${isSelected ? 'bg-gray-50' : 'hover:bg-gray-50/70'}`}
                    >
                      {isSelected && <span className="absolute inset-y-0 left-0 w-[3px] bg-brand" />}
                      <span className="flex items-center justify-between gap-3">
                        <span className="flex min-w-0 items-center gap-2">
                          {!quote.isRead && <span className="h-2 w-2 flex-shrink-0 rounded-full bg-brand" />}
                          <span className={`truncate ${quote.isRead ? 'font-medium' : 'font-bold'}`}>{quote.name}</span>
                          {quote.offerTitle && <Badge tone="brand">Offre</Badge>}
                        </span>
                        <span className="flex-shrink-0 text-xs text-gray-400">{format(new Date(quote.createdAt), 'dd/MM HH:mm')}</span>
                      </span>
                      <span className="mt-1.5 flex flex-wrap items-center gap-2 text-sm text-gray-600">
                        <span className="flex items-center gap-1.5">
                          <VehicleIcon className="h-4 w-4 text-gray-400" />
                          {quote.offerTitle || quote.service}
                        </span>
                        {quote.tireSize && (
                          <span className="rounded bg-gray-100 px-1.5 py-0.5 font-mono text-xs font-semibold text-ink">
                            {quote.tireSize}
                            {quote.tireQuantity ? ` ×${quote.tireQuantity}` : ''}
                          </span>
                        )}
                        {quote.licensePlate && (
                          <span className="rounded border border-gray-300 px-1.5 py-0.5 font-mono text-xs font-bold tracking-wider text-ink">{quote.licensePlate}</span>
                        )}
                      </span>
                      <span className="mt-1 line-clamp-1 text-sm text-gray-400">{quote.message}</span>
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </AdminCard>

        <div id="admin-detail" className="scroll-mt-20 lg:sticky lg:top-6 lg:col-span-2">
          {selectedQuote ? (
            <AdminCard>
              <div className="flex items-start justify-between gap-3 border-b border-gray-100 p-5">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-lg font-semibold">{selectedQuote.name}</p>
                    {!selectedQuote.isRead && <Badge tone="new">Nouveau</Badge>}
                  </div>
                  <p className="mt-0.5 text-sm text-gray-500">Reçu le {format(new Date(selectedQuote.createdAt), "dd/MM/yyyy 'à' HH:mm")}</p>
                </div>
                <div className="flex flex-shrink-0 gap-2">
                  {!selectedQuote.isArchived && <IconButton icon={Archive} label="Archiver" onClick={() => handleArchive(selectedQuote._id)} />}
                  <IconButton icon={Trash2} label="Supprimer" tone="danger" onClick={() => handleDelete(selectedQuote._id)} />
                </div>
              </div>

              <div className="space-y-5 p-5">
                <div className="rounded-lg bg-gray-50 p-4">
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-400">
                    {selectedQuote.offerTitle ? 'Offre concernée' : 'Prestation'}
                  </p>
                  <p className="mt-1 font-semibold">{selectedQuote.offerTitle || selectedQuote.service}</p>
                  {selectedQuote.offerId?.price !== undefined && selectedQuote.offerTitle && (
                    <p className="mt-0.5 text-sm text-gray-600">Prix affiché : {selectedQuote.offerId.price.toFixed(2)} €</p>
                  )}
                  {!selectedQuote.offerTitle && (
                    <p className="mt-0.5 text-sm text-gray-600">
                      {selectedQuote.vehicleType === 'moto' ? 'Moto' : 'Voiture'}
                      {selectedQuote.vehicle && ` — ${selectedQuote.vehicle}`}
                    </p>
                  )}
                  {selectedQuote.tireSize && (
                    <p className="mt-1.5 font-mono text-sm font-semibold">
                      Pneus : {selectedQuote.tireSize}
                      {selectedQuote.tireQuantity ? ` (×${selectedQuote.tireQuantity})` : ''}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  <DetailField label="E-mail">
                    <a href={`mailto:${selectedQuote.email}`} className="break-all font-medium hover:text-brand">{selectedQuote.email}</a>
                  </DetailField>
                  {selectedQuote.phone && (
                    <DetailField label="Téléphone">
                      <a href={`tel:${selectedQuote.phone}`} className="font-medium hover:text-brand">{selectedQuote.phone}</a>
                    </DetailField>
                  )}
                  {selectedQuote.licensePlate && (
                    <DetailField label="Immatriculation">
                      <span className="inline-block rounded border border-gray-300 bg-white px-2 py-0.5 font-mono font-bold tracking-wider">{selectedQuote.licensePlate}</span>
                    </DetailField>
                  )}
                </div>

                <DetailField label="Message">
                  <p className="whitespace-pre-wrap rounded-lg bg-gray-50 p-3 leading-relaxed text-gray-700">{selectedQuote.message}</p>
                </DetailField>
              </div>

              <div className="flex flex-wrap gap-2 border-t border-gray-100 p-5">
                <a
                  href={`mailto:${selectedQuote.email}?subject=${encodeURIComponent(`Re: Demande de devis - ${selectedQuote.offerTitle || selectedQuote.service || ''}`)}`}
                  className={adminButton('primary')}
                >
                  <Reply className="h-4 w-4" /> Répondre
                </a>
                {selectedQuote.phone && (
                  <a href={`tel:${selectedQuote.phone}`} className={adminButton('secondary')}>
                    <Phone className="h-4 w-4" /> Appeler
                  </a>
                )}
                {!selectedQuote.isRead && (
                  <button onClick={() => handleMarkAsRead(selectedQuote._id)} className={adminButton('ghost')}>
                    <CheckCircle className="h-4 w-4" /> Marquer comme lu
                  </button>
                )}
              </div>
            </AdminCard>
          ) : (
            <AdminCard className="hidden lg:block">
              <EmptyState icon={FileText} title="Aucune demande sélectionnée" text="Cliquez sur une demande pour voir le détail." />
            </AdminCard>
          )}
        </div>
      </div>
    </div>
  );
}
