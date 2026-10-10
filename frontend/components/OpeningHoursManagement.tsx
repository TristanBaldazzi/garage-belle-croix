'use client';

import { useState, useEffect } from 'react';
import { openingHoursAPI } from '@/lib/api';
import toast from 'react-hot-toast';
import { Clock, Save, Copy } from 'lucide-react';
import { AdminCard, AdminPageHeader, AdminSpinner, EmptyState, adminButton, adminInput } from './admin/ui';

const DAYS = [
  { key: 'monday', label: 'Lundi', short: 'Lun' },
  { key: 'tuesday', label: 'Mardi', short: 'Mar' },
  { key: 'wednesday', label: 'Mercredi', short: 'Mer' },
  { key: 'thursday', label: 'Jeudi', short: 'Jeu' },
  { key: 'friday', label: 'Vendredi', short: 'Ven' },
  { key: 'saturday', label: 'Samedi', short: 'Sam' },
  { key: 'sunday', label: 'Dimanche', short: 'Dim' },
];

interface DayHours {
  open: string;
  close: string;
  isClosed: boolean;
}

interface OpeningHours {
  monday: DayHours;
  tuesday: DayHours;
  wednesday: DayHours;
  thursday: DayHours;
  friday: DayHours;
  saturday: DayHours;
  sunday: DayHours;
}

export default function OpeningHoursManagement() {
  const [hours, setHours] = useState<OpeningHours | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    loadHours();
  }, []);

  const loadHours = async () => {
    try {
      setIsLoading(true);
      const data = await openingHoursAPI.get();
      setHours(data);
    } catch (error) {
      toast.error('Erreur lors du chargement des horaires');
    } finally {
      setIsLoading(false);
    }
  };

  const updateDay = (dayKey: string, field: string, value: string | boolean) => {
    if (!hours) return;
    
    setHours({
      ...hours,
      [dayKey]: {
        ...hours[dayKey as keyof OpeningHours],
        [field]: value
      }
    });
  };

  const handleSave = async () => {
    if (!hours) return;
    
    try {
      setIsSaving(true);
      await openingHoursAPI.update(hours);
      toast.success('Horaires sauvegardés avec succès');
    } catch (error) {
      toast.error('Erreur lors de la sauvegarde');
    } finally {
      setIsSaving(false);
    }
  };

  // Recopie les horaires du lundi sur mardi → vendredi
  const copyMondayToWeekdays = () => {
    if (!hours) return;
    const monday = hours.monday;
    setHours({
      ...hours,
      tuesday: { ...monday },
      wednesday: { ...monday },
      thursday: { ...monday },
      friday: { ...monday },
    });
    toast.success('Horaires du lundi copiés sur mardi → vendredi');
  };

  const saveButton = (
    <button onClick={handleSave} disabled={isSaving || !hours} className={adminButton('accent')}>
      <Save className="h-4 w-4" />
      {isSaving ? 'Enregistrement…' : 'Enregistrer'}
    </button>
  );

  return (
    <div>
      <AdminPageHeader
        title="Horaires d’ouverture"
        subtitle="Utilisés partout : site, prise de rendez-vous en ligne et fiche lue par Google."
        actions={saveButton}
      />

      {isLoading ? (
        <AdminCard>
          <AdminSpinner label="Chargement des horaires…" />
        </AdminCard>
      ) : !hours ? (
        <AdminCard>
          <EmptyState icon={Clock} title="Impossible de charger les horaires" text="Vérifiez que le serveur est bien démarré puis rechargez la page." />
        </AdminCard>
      ) : (
        <AdminCard className="max-w-3xl overflow-hidden">
          <div className="hidden grid-cols-[140px_150px_1fr] gap-4 border-b border-gray-100 bg-gray-50/60 px-5 py-2.5 text-[11px] font-semibold uppercase tracking-wider text-gray-400 sm:grid">
            <span>Jour</span>
            <span>Statut</span>
            <span>Horaires</span>
          </div>
          <ul className="divide-y divide-gray-100">
            {DAYS.map((day) => {
              const dayHours = hours[day.key as keyof OpeningHours];
              return (
                <li key={day.key} className="grid grid-cols-1 items-center gap-3 px-5 py-3.5 sm:grid-cols-[140px_150px_1fr] sm:gap-4">
                  <span className="font-semibold">{day.label}</span>
                  <label className="flex w-fit cursor-pointer items-center gap-3">
                    <input
                      type="checkbox"
                      checked={!dayHours.isClosed}
                      onChange={(e) => updateDay(day.key, 'isClosed', !e.target.checked)}
                      className="peer sr-only"
                    />
                    <span className="relative h-6 w-11 rounded-full bg-gray-300 transition-colors after:absolute after:left-0.5 after:top-0.5 after:h-5 after:w-5 after:rounded-full after:bg-white after:shadow after:transition-transform peer-checked:bg-emerald-500 peer-checked:after:translate-x-5" />
                    <span className={`text-sm font-medium ${dayHours.isClosed ? 'text-gray-400' : 'text-emerald-700'}`}>
                      {dayHours.isClosed ? 'Fermé' : 'Ouvert'}
                    </span>
                  </label>
                  {dayHours.isClosed ? (
                    <span className="text-sm text-gray-400">—</span>
                  ) : (
                    <div className="flex items-center gap-2">
                      <input
                        type="time"
                        value={dayHours.open}
                        onChange={(e) => updateDay(day.key, 'open', e.target.value)}
                        className={`${adminInput} w-[120px] font-medium tabular-nums`}
                        aria-label={`${day.label} : ouverture`}
                      />
                      <span className="text-gray-400">→</span>
                      <input
                        type="time"
                        value={dayHours.close}
                        onChange={(e) => updateDay(day.key, 'close', e.target.value)}
                        className={`${adminInput} w-[120px] font-medium tabular-nums`}
                        aria-label={`${day.label} : fermeture`}
                      />
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-gray-100 bg-gray-50/60 px-5 py-3.5">
            <button onClick={copyMondayToWeekdays} className={adminButton('ghost', 'sm')}>
              <Copy className="h-4 w-4" /> Copier le lundi sur mardi → vendredi
            </button>
            {saveButton}
          </div>
        </AdminCard>
      )}
    </div>
  );
}
