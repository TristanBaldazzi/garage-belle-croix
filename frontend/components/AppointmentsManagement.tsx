'use client';

import { useState, useEffect } from 'react';
import { appointmentsAPI } from '@/lib/api';
import toast from 'react-hot-toast';
import { format } from 'date-fns';
import { CalendarCheck, Archive, Trash2, CheckCircle, XCircle, Phone, Mail, Car, Bike } from 'lucide-react';
import { scrollToDetailOnMobile, AdminCard, AdminPageHeader, AdminSpinner, Badge, DetailField, EmptyState, FilterTabs, IconButton, adminButton } from './admin/ui';
import { useRefreshAdminCounts } from './admin/counts';

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

const STATUS_LABELS: Record<AppointmentStatus, { label: string; tone: 'warning' | 'success' | 'muted' }> = {
  en_attente: { label: 'À confirmer', tone: 'warning' },
  confirme: { label: 'Confirmé', tone: 'success' },
  annule: { label: 'Annulé', tone: 'muted' },
};

const shortMonth = (date: string) =>
  new Date(`${date}T00:00:00`).toLocaleDateString('fr-FR', { month: 'short' }).replace('.', '');

const formatPreferredDate = (appointment: Appointment) => {
  const [y, m, d] = appointment.preferredDate.split('-');
  const day = new Date(Number(y), Number(m) - 1, Number(d)).toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' });
  return `${day} — ${appointment.preferredSlot === 'matin' ? 'matin' : 'après-midi'}`;
};

export default function AppointmentsManagement() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<'pending' | 'all' | 'archived'>('pending');
  const [selected, setSelected] = useState<Appointment | null>(null);
  const refreshCounts = useRefreshAdminCounts();

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
      refreshCounts();
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
      <AdminPageHeader
        title="Rendez-vous"
        subtitle="Rappelez le client, puis confirmez ou annulez la demande."
        actions={
          <FilterTabs
            value={filter}
            onChange={(f) => {
              setFilter(f);
              setSelected(null);
            }}
            options={[
              { id: 'pending', label: 'À confirmer' },
              { id: 'all', label: 'Tous' },
              { id: 'archived', label: 'Archivés' },
            ]}
          />
        }
      />

      {isLoading ? (
        <AdminCard>
          <AdminSpinner label="Chargement des rendez-vous…" />
        </AdminCard>
      ) : (
        <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-5">
          <AdminCard className="overflow-hidden lg:col-span-3">
            {appointments.length === 0 ? (
              <EmptyState
                icon={CalendarCheck}
                title={filter === 'pending' ? 'Aucun rendez-vous à confirmer' : 'Aucun rendez-vous'}
                text="Les demandes de rendez-vous faites sur le site apparaîtront ici."
              />
            ) : (
              <ul className="divide-y divide-gray-100">
                {appointments.map((appointment) => {
                  const VehicleIcon = appointment.vehicleType === 'moto' ? Bike : Car;
                  const isSelected = selected?._id === appointment._id;
                  return (
                    <li key={appointment._id}>
                      <button
                        type="button"
                        onClick={() => { select(appointment); scrollToDetailOnMobile(); }}
                        className={`relative flex w-full items-start gap-4 px-5 py-4 text-left transition-colors ${
                          isSelected ? 'bg-gray-50' : 'hover:bg-gray-50/70'
                        }`}
                      >
                        {isSelected && <span className="absolute inset-y-0 left-0 w-[3px] bg-brand" />}
                        <span className="flex w-14 flex-shrink-0 flex-col items-center rounded-lg border border-gray-200 bg-white py-1.5">
                          <span className="text-[10px] font-semibold uppercase text-gray-400">{shortMonth(appointment.preferredDate)}</span>
                          <span className="font-display text-2xl font-extrabold leading-none">{appointment.preferredDate.split('-')[2]}</span>
                          <span className="mt-0.5 text-[10px] font-medium text-gray-500">{appointment.preferredSlot === 'matin' ? 'Matin' : 'Aprèm'}</span>
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="flex flex-wrap items-center gap-2">
                            <span className={`truncate ${appointment.isRead ? 'font-medium' : 'font-bold'}`}>{appointment.name}</span>
                            {!appointment.isRead && <Badge tone="new">Nouveau</Badge>}
                            <Badge tone={STATUS_LABELS[appointment.status].tone}>{STATUS_LABELS[appointment.status].label}</Badge>
                          </span>
                          <span className="mt-1 flex items-center gap-1.5 truncate text-sm text-gray-600">
                            <VehicleIcon className="h-4 w-4 flex-shrink-0 text-gray-400" />
                            {appointment.service}
                          </span>
                          <span className="mt-1 block text-xs text-gray-400">
                            {appointment.phone} · reçu le {format(new Date(appointment.createdAt), 'dd/MM à HH:mm')}
                          </span>
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            )}
          </AdminCard>

          <div id="admin-detail" className="scroll-mt-20 lg:sticky lg:top-6 lg:col-span-2">
            {selected ? (
              <AdminCard>
                <div className="flex items-start justify-between gap-3 border-b border-gray-100 p-5">
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-400">Date souhaitée</p>
                    <p className="mt-1 font-display text-2xl font-extrabold uppercase italic leading-tight">{formatPreferredDate(selected)}</p>
                    <div className="mt-2">
                      <Badge tone={STATUS_LABELS[selected.status].tone}>{STATUS_LABELS[selected.status].label}</Badge>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {!selected.isArchived && <IconButton icon={Archive} label="Archiver" onClick={() => handleArchive(selected._id)} />}
                    <IconButton icon={Trash2} label="Supprimer" tone="danger" onClick={() => handleDelete(selected._id)} />
                  </div>
                </div>

                <div className="space-y-5 p-5">
                  <DetailField label="Client">
                    <p className="text-base font-semibold">{selected.name}</p>
                    <a href={`tel:${selected.phone}`} className="mt-1 flex items-center gap-2 font-medium hover:text-brand">
                      <Phone className="h-4 w-4 text-gray-400" /> {selected.phone}
                    </a>
                    {selected.email && (
                      <a href={`mailto:${selected.email}`} className="mt-1 flex items-center gap-2 break-all text-gray-600 hover:text-brand">
                        <Mail className="h-4 w-4 flex-shrink-0 text-gray-400" /> {selected.email}
                      </a>
                    )}
                  </DetailField>

                  <DetailField label="Prestation">{selected.service}</DetailField>

                  <DetailField label="Véhicule">
                    {selected.vehicleType === 'moto' ? 'Moto' : 'Voiture'}
                    {selected.vehicle && ` — ${selected.vehicle}`}
                    {selected.licensePlate && (
                      <span className="mt-1.5 block w-fit rounded border border-gray-300 bg-white px-2 py-0.5 font-mono text-sm font-bold tracking-wider">
                        {selected.licensePlate}
                      </span>
                    )}
                  </DetailField>

                  {selected.message && (
                    <DetailField label="Précisions">
                      <p className="whitespace-pre-wrap rounded-lg bg-gray-50 p-3 leading-relaxed text-gray-700">{selected.message}</p>
                    </DetailField>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-2 border-t border-gray-100 p-5">
                  <a href={`tel:${selected.phone}`} className={`col-span-2 ${adminButton('primary')}`}>
                    <Phone className="h-4 w-4" /> Appeler le client
                  </a>
                  {selected.status !== 'confirme' && (
                    <button onClick={() => handleStatus(selected._id, 'confirme')} className={adminButton('success')}>
                      <CheckCircle className="h-4 w-4" /> Confirmer
                    </button>
                  )}
                  {selected.status !== 'annule' && (
                    <button onClick={() => handleStatus(selected._id, 'annule')} className={adminButton('secondary')}>
                      <XCircle className="h-4 w-4" /> Annuler
                    </button>
                  )}
                </div>
              </AdminCard>
            ) : (
              <AdminCard className="hidden lg:block">
                <EmptyState icon={CalendarCheck} title="Aucune demande sélectionnée" text="Cliquez sur un rendez-vous pour voir le détail." />
              </AdminCard>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
