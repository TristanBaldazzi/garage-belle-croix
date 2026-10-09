'use client';

import { useState, useEffect } from 'react';
import { appointmentsAPI } from '@/lib/api';
import toast from 'react-hot-toast';
import { format } from 'date-fns';
import { CalendarCheck, Archive, Trash2, CheckCircle, XCircle, Phone, Mail, Car, Bike } from 'lucide-react';

type AppointmentStatus = 'en_attente' | 'confirme' | 'annule';

interface Appointment {
  _id: string;
  name: string;
  phone: string;
  email?: string;
  vehicleType: 'voiture' | 'moto';
  vehicle?: string;
  licensePlate?: string;
  service: string;
  preferredDate: string;
  preferredSlot: 'matin' | 'apres-midi';
  message?: string;
  status: AppointmentStatus;
  isRead: boolean;
  isArchived: boolean;
  createdAt: string;
}

const STATUS_LABELS: Record<AppointmentStatus, { label: string; className: string }> = {
  en_attente: { label: 'À confirmer', className: 'bg-orange-100 text-orange-800' },
  confirme: { label: 'Confirmé', className: 'bg-green-100 text-green-800' },
  annule: { label: 'Annulé', className: 'bg-gray-200 text-gray-600' },
};

const formatPreferredDate = (appointment: Appointment) => {
  const [y, m, d] = appointment.preferredDate.split('-');
  return `${d}/${m}/${y} — ${appointment.preferredSlot === 'matin' ? 'Matin' : 'Après-midi'}`;
};

export default function AppointmentsManagement() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<'pending' | 'all' | 'archived'>('pending');
  const [selected, setSelected] = useState<Appointment | null>(null);

  useEffect(() => {
    loadAppointments();
  }, [filter]);

  const loadAppointments = async () => {
    try {
      setIsLoading(true);
      const params: any = {};
      if (filter === 'pending') {
        params.status = 'en_attente';
        params.isArchived = false;
      } else if (filter === 'all') {
        params.isArchived = false;
      } else {
        params.isArchived = true;
      }
      const data = await appointmentsAPI.getAll(params);
      setAppointments(data);
    } catch (error) {
      toast.error('Erreur lors du chargement des rendez-vous');
    } finally {
      setIsLoading(false);
    }
  };

  const select = async (appointment: Appointment) => {
    setSelected(appointment);
    if (!appointment.isRead) {
      try {
        await appointmentsAPI.markAsRead(appointment._id);
        setAppointments((list) => list.map((a) => (a._id === appointment._id ? { ...a, isRead: true } : a)));
      } catch {
        // sans conséquence : le rendez-vous restera marqué comme nouveau
      }
    }
  };

  const handleStatus = async (id: string, status: AppointmentStatus) => {
    try {
      const updated = await appointmentsAPI.updateStatus(id, status);
      toast.success(status === 'confirme' ? 'Rendez-vous confirmé' : status === 'annule' ? 'Rendez-vous annulé' : 'Statut mis à jour');
      setSelected(updated);
      loadAppointments();
    } catch (error) {
      toast.error('Erreur');
    }
  };

  const handleArchive = async (id: string) => {
    try {
      await appointmentsAPI.archive(id);
      toast.success('Archivé');
      setSelected(null);
      loadAppointments();
    } catch (error) {
      toast.error('Erreur');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce rendez-vous ?')) return;
    try {
      await appointmentsAPI.delete(id);
      toast.success('Rendez-vous supprimé');
      setSelected(null);
      loadAppointments();
    } catch (error) {
      toast.error('Erreur lors de la suppression');
    }
  };

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h2 className="text-3xl font-black mb-2">Demandes de rendez-vous</h2>
          <p className="text-gray-600">Rappelez le client puis confirmez ou annulez la demande</p>
        </div>
        <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1">
          {[
            { id: 'pending' as const, label: 'À confirmer' },
            { id: 'all' as const, label: 'Tous' },
            { id: 'archived' as const, label: 'Archivés' },
          ].map((f) => (
            <button
              key={f.id}
              onClick={() => setFilter(f.id)}
              className={`px-4 py-2 rounded-md font-bold text-sm transition-all ${
                filter === f.id ? 'bg-black text-white' : 'text-gray-600 hover:bg-gray-200'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {isLoading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
          <p className="mt-4 text-gray-600">Chargement des rendez-vous...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-3">
            {appointments.length === 0 ? (
              <div className="bg-white rounded-lg shadow-md border border-gray-200 p-12 text-center">
                <CalendarCheck className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-xl font-black text-gray-500 mb-2">Aucun rendez-vous</p>
                <p className="text-gray-400">Les demandes de rendez-vous en ligne apparaîtront ici</p>
              </div>
            ) : (
              appointments.map((appointment) => {
                const VehicleIcon = appointment.vehicleType === 'moto' ? Bike : Car;
                return (
                  <div
                    key={appointment._id}
                    onClick={() => select(appointment)}
                    className={`bg-white rounded-lg shadow-md border-2 cursor-pointer transition-all hover:shadow-xl p-4 ${
                      selected?._id === appointment._id || !appointment.isRead ? 'border-black' : 'border-gray-200'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <h3 className="font-black text-lg">{appointment.name}</h3>
                          {!appointment.isRead && (
                            <span className="bg-black text-white text-xs font-black px-2 py-0.5 rounded">Nouveau</span>
                          )}
                          <span className={`text-xs font-black px-2 py-0.5 rounded ${STATUS_LABELS[appointment.status].className}`}>
                            {STATUS_LABELS[appointment.status].label}
                          </span>
                        </div>
                        <p className="text-sm font-bold text-gray-800 flex items-center gap-2">
                          <VehicleIcon className="w-4 h-4" />
                          {appointment.service}
                        </p>
                        <p className="text-sm text-gray-600 mt-1">{appointment.phone}</p>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p className="font-black text-sm">{formatPreferredDate(appointment)}</p>
                        <p className="text-xs text-gray-400 mt-1">
                          Reçu le {format(new Date(appointment.createdAt), 'dd/MM/yyyy HH:mm')}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          <div className="lg:col-span-1">
            {selected ? (
              <div className="bg-white rounded-lg shadow-md border-2 border-gray-200 p-6 sticky top-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-black">Détails</h3>
                  <div className="flex items-center gap-2">
                    {!selected.isArchived && (
                      <button onClick={() => handleArchive(selected._id)} className="p-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition" title="Archiver">
                        <Archive className="w-5 h-5 text-gray-600" />
                      </button>
                    )}
                    <button onClick={() => handleDelete(selected._id)} className="p-2 bg-red-50 hover:bg-red-100 rounded-lg transition" title="Supprimer">
                      <Trash2 className="w-5 h-5 text-red-600" />
                    </button>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-xs font-black text-gray-500 uppercase mb-1">Date souhaitée</p>
                    <p className="text-lg font-black">{formatPreferredDate(selected)}</p>
                    <span className={`inline-block mt-2 text-xs font-black px-2 py-0.5 rounded ${STATUS_LABELS[selected.status].className}`}>
                      {STATUS_LABELS[selected.status].label}
                    </span>
                  </div>

                  <div>
                    <p className="text-xs font-black text-gray-500 uppercase mb-1">Client</p>
                    <p className="text-lg font-black">{selected.name}</p>
                    <a href={`tel:${selected.phone}`} className="flex items-center gap-2 font-bold hover:underline mt-1">
                      <Phone className="w-4 h-4" /> {selected.phone}
                    </a>
                    {selected.email && (
                      <a href={`mailto:${selected.email}`} className="flex items-center gap-2 text-gray-600 hover:underline mt-1 break-all">
                        <Mail className="w-4 h-4 flex-shrink-0" /> {selected.email}
                      </a>
                    )}
                  </div>

                  <div>
                    <p className="text-xs font-black text-gray-500 uppercase mb-1">Prestation</p>
                    <p className="font-bold">{selected.service}</p>
                  </div>

                  <div>
                    <p className="text-xs font-black text-gray-500 uppercase mb-1">Véhicule</p>
                    <p className="font-bold">
                      {selected.vehicleType === 'moto' ? 'Moto' : 'Voiture'}
                      {selected.vehicle && ` — ${selected.vehicle}`}
                    </p>
                    {selected.licensePlate && (
                      <p className="inline-block mt-1 bg-gray-100 px-2 py-1 rounded font-mono font-black">{selected.licensePlate}</p>
                    )}
                  </div>

                  {selected.message && (
                    <div>
                      <p className="text-xs font-black text-gray-500 uppercase mb-1">Précisions</p>
                      <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{selected.message}</p>
                    </div>
                  )}

                  <div className="pt-4 border-t border-gray-200 grid grid-cols-2 gap-2">
                    <a href={`tel:${selected.phone}`} className="col-span-2 flex items-center justify-center gap-2 bg-black text-white px-4 py-2 rounded-lg font-black hover:bg-gray-800 transition">
                      <Phone className="w-4 h-4" /> Appeler le client
                    </a>
                    {selected.status !== 'confirme' && (
                      <button onClick={() => handleStatus(selected._id, 'confirme')} className="flex items-center justify-center gap-2 bg-green-600 text-white px-3 py-2 rounded-lg font-bold hover:bg-green-700 transition">
                        <CheckCircle className="w-4 h-4" /> Confirmer
                      </button>
                    )}
                    {selected.status !== 'annule' && (
                      <button onClick={() => handleStatus(selected._id, 'annule')} className="flex items-center justify-center gap-2 bg-gray-200 text-gray-800 px-3 py-2 rounded-lg font-bold hover:bg-gray-300 transition">
                        <XCircle className="w-4 h-4" /> Annuler
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-md border-2 border-gray-200 p-12 text-center">
                <CalendarCheck className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500 font-black">Sélectionnez un rendez-vous</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
