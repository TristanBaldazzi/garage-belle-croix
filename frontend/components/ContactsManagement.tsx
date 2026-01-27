'use client';

import { useState, useEffect } from 'react';
import { contactsAPI } from '@/lib/api';
import toast from 'react-hot-toast';
import { format } from 'date-fns';
import { Mail, Archive, Trash2, CheckCircle, XCircle, Filter } from 'lucide-react';

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

  if (isLoading) {
    return (
      <div className="text-center py-12">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
        <p className="mt-4 text-gray-600">Chargement des contacts...</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h2 className="text-3xl font-bold mb-2">Demandes de contact</h2>
          <p className="text-gray-600">Gérez les messages reçus depuis le formulaire de contact</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setFilter('all')}
            className={`flex items-center gap-2 px-4 py-2 font-bold rounded-lg transition-all ${
              filter === 'all'
                ? 'bg-black text-white'
                : 'bg-white text-black border-2 border-gray-200 hover:border-black'
            }`}
          >
            <Filter className="w-4 h-4" />
            Tous
          </button>
          <button
            onClick={() => setFilter('unread')}
            className={`flex items-center gap-2 px-4 py-2 font-bold rounded-lg transition-all ${
              filter === 'unread'
                ? 'bg-black text-white'
                : 'bg-white text-black border-2 border-gray-200 hover:border-black'
            }`}
          >
            <Mail className="w-4 h-4" />
            Non lus
          </button>
          <button
            onClick={() => setFilter('archived')}
            className={`flex items-center gap-2 px-4 py-2 font-bold rounded-lg transition-all ${
              filter === 'archived'
                ? 'bg-black text-white'
                : 'bg-white text-black border-2 border-gray-200 hover:border-black'
            }`}
          >
            <Archive className="w-4 h-4" />
            Archivés
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden">
          <div className="max-h-[600px] overflow-y-auto">
            {contacts.length === 0 ? (
              <div className="p-12 text-center text-gray-500">
                <Mail className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                <p>Aucun contact trouvé</p>
              </div>
            ) : (
              contacts.map((contact) => (
                <div
                  key={contact._id}
                  onClick={() => setSelectedContact(contact)}
                  className={`p-4 border-b border-gray-200 cursor-pointer hover:bg-gray-50 transition ${
                    selectedContact?._id === contact._id ? 'bg-gray-100' : ''
                  } ${!contact.isRead ? 'bg-blue-50 border-l-4 border-l-blue-500' : ''}`}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-bold text-lg">{contact.name}</h3>
                        {!contact.isRead && (
                          <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full font-bold">
                            Nouveau
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 mb-1">{contact.email}</p>
                      {contact.subject && (
                        <p className="text-sm font-semibold mt-2 mb-2 text-gray-800">{contact.subject}</p>
                      )}
                      <p className="text-sm text-gray-500 mt-2 line-clamp-2">
                        {contact.message}
                      </p>
                      <p className="text-xs text-gray-400 mt-3">
                        {format(new Date(contact.createdAt), 'dd/MM/yyyy à HH:mm')}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {selectedContact && (
          <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-6">
            <div className="flex justify-between items-start mb-6">
              <h3 className="text-2xl font-bold">Détails du contact</h3>
              {!selectedContact.isRead && (
                <button
                  onClick={() => handleMarkAsRead(selectedContact._id)}
                  className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-blue-600 transition-colors"
                >
                  <CheckCircle className="w-4 h-4" />
                  Marquer comme lu
                </button>
              )}
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-sm font-bold text-gray-600">Nom</label>
                <p className="text-lg font-semibold">{selectedContact.name}</p>
              </div>

              <div>
                <label className="text-sm font-bold text-gray-600">Email</label>
                <p className="text-lg">{selectedContact.email}</p>
              </div>

              {selectedContact.phone && (
                <div>
                  <label className="text-sm font-bold text-gray-600">Téléphone</label>
                  <p className="text-lg">{selectedContact.phone}</p>
                </div>
              )}

              {selectedContact.subject && (
                <div>
                  <label className="text-sm font-bold text-gray-600">Sujet</label>
                  <p className="text-lg">{selectedContact.subject}</p>
                </div>
              )}

              <div>
                <label className="text-sm font-bold text-gray-600">Message</label>
                <p className="text-lg whitespace-pre-wrap bg-gray-50 p-4 border border-gray-200">
                  {selectedContact.message}
                </p>
              </div>

              <div>
                <label className="text-sm font-bold text-gray-600">Date</label>
                <p className="text-lg">
                  {format(new Date(selectedContact.createdAt), 'dd/MM/yyyy à HH:mm')}
                </p>
              </div>

              <div className="flex gap-4 pt-6 border-t border-gray-200">
                {!selectedContact.isArchived && (
                  <button
                    onClick={() => handleArchive(selectedContact._id)}
                    className="flex items-center gap-2 bg-gray-500 text-white px-4 py-2 rounded-lg font-bold hover:bg-gray-600 transition-colors"
                  >
                    <Archive className="w-4 h-4" />
                    Archiver
                  </button>
                )}
                <button
                  onClick={() => handleDelete(selectedContact._id)}
                  className="flex items-center gap-2 bg-red-500 text-white px-4 py-2 rounded-lg font-bold hover:bg-red-600 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                  Supprimer
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

