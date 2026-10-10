'use client';

import { useState, useEffect } from 'react';
import { contactsAPI } from '@/lib/api';
import toast from 'react-hot-toast';
import { format } from 'date-fns';
import { Mail, Archive, Trash2, CheckCircle, Phone, Reply } from 'lucide-react';
import { scrollToDetailOnMobile, AdminCard, AdminPageHeader, AdminSpinner, Badge, DetailField, EmptyState, FilterTabs, IconButton, adminButton } from './admin/ui';
import { useRefreshAdminCounts } from './admin/counts';

interface Contact {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  message: string;
  subject?: string;
  isRead: boolean;
  isArchived: boolean;
  createdAt: string;
}

export default function ContactsManagement() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'unread' | 'archived'>('all');
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const refreshCounts = useRefreshAdminCounts();

  useEffect(() => {
    loadContacts();
  }, [filter]);

  const loadContacts = async () => {
    try {
      setIsLoading(true);
      let params: any = {};
      if (filter === 'unread') {
        params.isRead = false;
        params.isArchived = false;
      } else if (filter === 'archived') {
        params.isArchived = true;
      }
      const data = await contactsAPI.getAll(params);
      setContacts(data);
      refreshCounts();
    } catch (error) {
      toast.error('Erreur lors du chargement des contacts');
    } finally {
      setIsLoading(false);
    }
  };

  const handleMarkAsRead = async (id: string) => {
    try {
      await contactsAPI.markAsRead(id);
      toast.success('Marqué comme lu');
      loadContacts();
      if (selectedContact?._id === id) {
        setSelectedContact({ ...selectedContact, isRead: true });
      }
    } catch (error) {
      toast.error('Erreur');
    }
  };

  const handleArchive = async (id: string) => {
    try {
      await contactsAPI.archive(id);
      toast.success('Archivé');
      loadContacts();
      setSelectedContact(null);
    } catch (error) {
      toast.error('Erreur');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce contact ?')) return;
    
    try {
      await contactsAPI.delete(id);
      toast.success('Contact supprimé');
      loadContacts();
      setSelectedContact(null);
    } catch (error) {
      toast.error('Erreur lors de la suppression');
    }
  };

  return (
    <div>
      <AdminPageHeader
        title="Messages"
        subtitle="Les messages envoyés depuis le formulaire de contact du site."
        actions={
          <FilterTabs
            value={filter}
            onChange={(f) => {
              setFilter(f);
              setSelectedContact(null);
            }}
            options={[
              { id: 'all', label: 'Tous' },
              { id: 'unread', label: 'Non lus' },
              { id: 'archived', label: 'Archivés' },
            ]}
          />
        }
      />

      {isLoading ? (
        <AdminCard>
          <AdminSpinner label="Chargement des messages…" />
        </AdminCard>
      ) : (
        <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-5">
          <AdminCard className="overflow-hidden lg:col-span-2">
            {contacts.length === 0 ? (
              <EmptyState icon={Mail} title="Aucun message" text="Les messages du formulaire de contact apparaîtront ici." />
            ) : (
              <ul className="max-h-[70vh] divide-y divide-gray-100 overflow-y-auto">
                {contacts.map((contact) => {
                  const isSelected = selectedContact?._id === contact._id;
                  return (
                    <li key={contact._id}>
                      <button
                        type="button"
                        onClick={() => { setSelectedContact(contact); scrollToDetailOnMobile(); }}
                        className={`relative block w-full px-5 py-4 text-left transition-colors ${isSelected ? 'bg-gray-50' : 'hover:bg-gray-50/70'}`}
                      >
                        {isSelected && <span className="absolute inset-y-0 left-0 w-[3px] bg-brand" />}
                        <span className="flex items-center justify-between gap-3">
                          <span className="flex min-w-0 items-center gap-2">
                            {!contact.isRead && <span className="h-2 w-2 flex-shrink-0 rounded-full bg-brand" />}
                            <span className={`truncate ${contact.isRead ? 'font-medium' : 'font-bold'}`}>{contact.name}</span>
                          </span>
                          <span className="flex-shrink-0 text-xs text-gray-400">{format(new Date(contact.createdAt), 'dd/MM HH:mm')}</span>
                        </span>
                        {contact.subject && <span className="mt-1 block truncate text-sm font-medium text-gray-800">{contact.subject}</span>}
                        <span className="mt-1 line-clamp-2 text-sm text-gray-500">{contact.message}</span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            )}
          </AdminCard>

          <div id="admin-detail" className="scroll-mt-20 lg:sticky lg:top-6 lg:col-span-3">
            {selectedContact ? (
              <AdminCard>
                <div className="flex items-start justify-between gap-3 border-b border-gray-100 p-5">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="text-lg font-semibold">{selectedContact.name}</p>
                      {!selectedContact.isRead && <Badge tone="new">Nouveau</Badge>}
                    </div>
                    <p className="mt-0.5 text-sm text-gray-500">Reçu le {format(new Date(selectedContact.createdAt), "dd/MM/yyyy 'à' HH:mm")}</p>
                  </div>
                  <div className="flex flex-shrink-0 gap-2">
                    {!selectedContact.isArchived && <IconButton icon={Archive} label="Archiver" onClick={() => handleArchive(selectedContact._id)} />}
                    <IconButton icon={Trash2} label="Supprimer" tone="danger" onClick={() => handleDelete(selectedContact._id)} />
                  </div>
                </div>

                <div className="space-y-5 p-5">
                  <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                    <DetailField label="E-mail">
                      <a href={`mailto:${selectedContact.email}`} className="break-all font-medium hover:text-brand">{selectedContact.email}</a>
                    </DetailField>
                    {selectedContact.phone && (
                      <DetailField label="Téléphone">
                        <a href={`tel:${selectedContact.phone}`} className="font-medium hover:text-brand">{selectedContact.phone}</a>
                      </DetailField>
                    )}
                  </div>
                  {selectedContact.subject && <DetailField label="Sujet">{selectedContact.subject}</DetailField>}
                  <DetailField label="Message">
                    <p className="whitespace-pre-wrap rounded-lg bg-gray-50 p-4 leading-relaxed text-gray-700">{selectedContact.message}</p>
                  </DetailField>
                </div>

                <div className="flex flex-wrap gap-2 border-t border-gray-100 p-5">
                  <a
                    href={`mailto:${selectedContact.email}?subject=${encodeURIComponent(`Re: ${selectedContact.subject || 'Votre message au Garage de la Belle Croix'}`)}`}
                    className={adminButton('primary')}
                  >
                    <Reply className="h-4 w-4" /> Répondre par e-mail
                  </a>
                  {selectedContact.phone && (
                    <a href={`tel:${selectedContact.phone}`} className={adminButton('secondary')}>
                      <Phone className="h-4 w-4" /> Appeler
                    </a>
                  )}
                  {!selectedContact.isRead && (
                    <button onClick={() => handleMarkAsRead(selectedContact._id)} className={adminButton('ghost')}>
                      <CheckCircle className="h-4 w-4" /> Marquer comme lu
                    </button>
                  )}
                </div>
              </AdminCard>
            ) : (
              <AdminCard className="hidden lg:block">
                <EmptyState icon={Mail} title="Aucun message sélectionné" text="Cliquez sur un message pour le lire." />
              </AdminCard>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
