'use client';

import { useState, useEffect } from 'react';
import { openingHoursAPI } from '@/lib/api';
import toast from 'react-hot-toast';
import { Clock, Save, Copy, Plus, X } from 'lucide-react';
import { AdminCard, AdminPageHeader, AdminSpinner, EmptyState, adminButton, adminInput } from './admin/ui';
import type { DayKey, TimeSlot } from '@/lib/hours';

const DAYS: { key: DayKey; label: string }[] = [
  { key: 'monday', label: 'Lundi' },
  { key: 'tuesday', label: 'Mardi' },
  { key: 'wednesday', label: 'Mercredi' },
  { key: 'thursday', label: 'Jeudi' },
  { key: 'friday', label: 'Vendredi' },
  { key: 'saturday', label: 'Samedi' },
  { key: 'sunday', label: 'Dimanche' },
];

const MAX_SLOTS = 4;

interface DayState {
  isClosed: boolean;
  slots: TimeSlot[];
}

type HoursState = Record<DayKey, DayState>;

const toMinutes = (time: string) => {
  const [h, m] = time.split(':').map(Number);
  return h * 60 + (m || 0);
};
const fromMinutes = (minutes: number) => {
  const m = Math.max(0, Math.min(minutes, 23 * 60 + 59));
  return `${String(Math.floor(m / 60)).padStart(2, '0')}:${String(m % 60).padStart(2, '0')}`;
};

// Erreur éventuelle d'un jour (plage inversée ou chevauchement)
const dayError = (day: DayState) => {
  if (day.isClosed) return '';
  const sorted = [...day.slots].sort((a, b) => a.open.localeCompare(b.open));
  if (sorted.some((s) => !s.open || !s.close)) return 'Heure manquante';
  if (sorted.some((s) => s.open >= s.close)) return 'Une plage se termine avant de commencer';
  for (let i = 1; i < sorted.length; i++) {
    if (sorted[i].open < sorted[i - 1].close) return 'Deux plages se chevauchent';
  }
  return '';
};

export default function OpeningHoursManagement() {
  const [hours, setHours] = useState<HoursState | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    loadHours();
  }, []);

  const loadHours = async () => {
    try {
      setIsLoading(true);
      const data = await openingHoursAPI.get();
      const state = {} as HoursState;
      for (const { key } of DAYS) {
        const day = data[key] || {};
        state[key] = {
          isClosed: !!day.isClosed,
          slots: day.slots?.length
            ? day.slots.map((s: TimeSlot) => ({ open: s.open, close: s.close }))
            : [{ open: day.open || '08:00', close: day.close || '18:00' }],
        };
      }
      setHours(state);
    } catch (error) {
      toast.error('Erreur lors du chargement des horaires');
    } finally {
      setIsLoading(false);
    }
  };

  const updateDay = (key: DayKey, update: (day: DayState) => DayState) => {
    if (!hours) return;
    setHours({ ...hours, [key]: update(hours[key]) });
  };

  const updateSlot = (key: DayKey, index: number, field: 'open' | 'close', value: string) =>
    updateDay(key, (day) => ({ ...day, slots: day.slots.map((s, i) => (i === index ? { ...s, [field]: value } : s)) }));

  const removeSlot = (key: DayKey, index: number) =>
    updateDay(key, (day) => ({ ...day, slots: day.slots.filter((_, i) => i !== index) }));

  // Ajoute une plage : une journée continue englobant midi est coupée en matin / après-midi,
  // sinon une nouvelle plage est ajoutée après la dernière.
  const addSlot = (key: DayKey) =>
    updateDay(key, (day) => {
      const sorted = [...day.slots].sort((a, b) => a.open.localeCompare(b.open));
      if (sorted.length === 1 && sorted[0].open < '12:00' && sorted[0].close > '14:00') {
        return { ...day, slots: [{ open: sorted[0].open, close: '12:00' }, { open: '14:00', close: sorted[0].close }] };
      }
      const last = sorted[sorted.length - 1];
      const start = last ? toMinutes(last.close) + 60 : 8 * 60;
      return { ...day, slots: [...sorted, { open: fromMinutes(start), close: fromMinutes(start + 120) }] };
    });

  // Recopie les horaires du lundi (plages comprises) sur mardi → vendredi
  const copyMondayToWeekdays = () => {
    if (!hours) return;
    const copy = () => ({ isClosed: hours.monday.isClosed, slots: hours.monday.slots.map((s) => ({ ...s })) });
    setHours({ ...hours, tuesday: copy(), wednesday: copy(), thursday: copy(), friday: copy() });
    toast.success('Horaires du lundi copiés sur mardi → vendredi');
  };

  const firstError = hours ? DAYS.map(({ key, label }) => (dayError(hours[key]) ? label : '')).find(Boolean) : '';

  const handleSave = async () => {
    if (!hours) return;
    if (firstError) {
      toast.error(`Vérifiez les horaires du ${firstError.toLowerCase()}`);
      return;
    }
    try {
      setIsSaving(true);
      const payload: Record<string, unknown> = {};
      for (const { key } of DAYS) {
        const slots = [...hours[key].slots].sort((a, b) => a.open.localeCompare(b.open));
        payload[key] = { isClosed: hours[key].isClosed, slots, open: slots[0]?.open, close: slots[slots.length - 1]?.close };
      }
      await openingHoursAPI.update(payload);
      toast.success('Horaires enregistrés');
      loadHours();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Erreur lors de la sauvegarde');
    } finally {
      setIsSaving(false);
    }
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
        subtitle="Utilisés partout : site, prise de rendez-vous en ligne et fiche lue par Google. Ajoutez une plage pour une pause déjeuner."
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
        <AdminCard className="max-w-4xl overflow-hidden">
          <div className="hidden grid-cols-[130px_140px_1fr] gap-4 border-b border-gray-100 bg-gray-50/60 px-5 py-2.5 text-[11px] font-semibold uppercase tracking-wider text-gray-400 sm:grid">
            <span>Jour</span>
            <span>Statut</span>
            <span>Plages horaires</span>
          </div>
          <ul className="divide-y divide-gray-100">
            {DAYS.map(({ key, label }) => {
              const day = hours[key];
              const error = dayError(day);
              return (
                <li key={key} className="grid grid-cols-1 items-start gap-3 px-5 py-4 sm:grid-cols-[130px_140px_1fr] sm:gap-4">
                  <span className="font-semibold sm:pt-2">{label}</span>
                  <label className="flex w-fit cursor-pointer items-center gap-3 sm:pt-2">
                    <input
                      type="checkbox"
                      checked={!day.isClosed}
                      onChange={(e) => updateDay(key, (d) => ({ ...d, isClosed: !e.target.checked }))}
                      className="peer sr-only"
                    />
                    <span className="relative h-6 w-11 rounded-full bg-gray-300 transition-colors after:absolute after:left-0.5 after:top-0.5 after:h-5 after:w-5 after:rounded-full after:bg-white after:shadow after:transition-transform peer-checked:bg-emerald-500 peer-checked:after:translate-x-5" />
                    <span className={`text-sm font-medium ${day.isClosed ? 'text-gray-400' : 'text-emerald-700'}`}>
                      {day.isClosed ? 'Fermé' : 'Ouvert'}
                    </span>
                  </label>

                  {day.isClosed ? (
                    <span className="text-sm text-gray-400 sm:pt-2">—</span>
                  ) : (
                    <div>
                      <div className="flex flex-col gap-2">
                        {day.slots.map((slot, index) => (
                          <div key={index} className="flex flex-wrap items-center gap-2">
                            <input
                              type="time"
                              value={slot.open}
                              onChange={(e) => updateSlot(key, index, 'open', e.target.value)}
                              className={`${adminInput} w-[118px] font-medium tabular-nums`}
                              aria-label={`${label}, plage ${index + 1} : ouverture`}
                            />
                            <span className="text-gray-400">→</span>
                            <input
                              type="time"
                              value={slot.close}
                              onChange={(e) => updateSlot(key, index, 'close', e.target.value)}
                              className={`${adminInput} w-[118px] font-medium tabular-nums`}
                              aria-label={`${label}, plage ${index + 1} : fermeture`}
                            />
                            {day.slots.length > 1 && (
                              <button
                                type="button"
                                onClick={() => removeSlot(key, index)}
                                className="flex h-9 w-9 items-center justify-center rounded-lg text-gray-400 transition hover:bg-red-50 hover:text-red-600"
                                aria-label={`Retirer la plage ${index + 1} du ${label.toLowerCase()}`}
                                title="Retirer cette plage"
                              >
                                <X className="h-4 w-4" />
                              </button>
                            )}
                          </div>
                        ))}
                      </div>
                      <div className="mt-2 flex flex-wrap items-center gap-3">
                        {day.slots.length < MAX_SLOTS && (
                          <button
                            type="button"
                            onClick={() => addSlot(key)}
                            className="inline-flex items-center gap-1.5 rounded-md px-1.5 py-1 text-[13px] font-semibold text-gray-500 transition hover:bg-gray-100 hover:text-ink"
                          >
                            <Plus className="h-3.5 w-3.5" />
                            {day.slots.length === 1 ? 'Ajouter une coupure / plage' : 'Ajouter une plage'}
                          </button>
                        )}
                        {error && <span className="text-[13px] font-medium text-red-600">{error}</span>}
                      </div>
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
