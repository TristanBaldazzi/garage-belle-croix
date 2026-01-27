'use client';

import { useState, useEffect } from 'react';
import { openingHoursAPI } from '@/lib/api';
import toast from 'react-hot-toast';
import { Clock, Save, CheckCircle, XCircle } from 'lucide-react';

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

  if (isLoading) {
    return (
      <div className="text-center py-12">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
        <p className="mt-4 text-gray-600">Chargement des horaires...</p>
      </div>
    );
  }

  if (!hours) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">Erreur lors du chargement des horaires</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-6 mb-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-2xl font-black mb-2">Horaires d'ouverture</h3>
          <p className="text-gray-600">Gérez les horaires d'ouverture du garage</p>
        </div>
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="flex items-center gap-2 bg-black text-white px-6 py-3 font-black rounded-lg hover:bg-gray-800 transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50"
        >
          <Save className="w-5 h-5" />
          {isSaving ? 'Sauvegarde...' : 'Sauvegarder'}
        </button>
      </div>

      <div className="space-y-4">
        {DAYS.map((day) => {
          const dayData = hours[day.key as keyof OpeningHours] as DayHours;
          return (
            <div
              key={day.key}
              className="bg-gray-50 rounded-xl p-6 border-2 border-gray-200 hover:border-black transition-all"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-black to-gray-800 rounded-lg flex items-center justify-center shadow-md">
                    <Clock className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h4 className="text-lg font-black text-black">{day.label}</h4>
                    <p className="text-sm text-gray-500">{day.short}</p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={!dayData.isClosed}
                    onChange={(e) => updateDay(day.key, 'isClosed', !e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-14 h-7 bg-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-black/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-black"></div>
                  <span className="ml-3 text-sm font-bold text-gray-700">
                    {dayData.isClosed ? 'Fermé' : 'Ouvert'}
                  </span>
                </label>
              </div>

              {!dayData.isClosed && (
                <div className="grid grid-cols-2 gap-4 mt-4">
                  <div>
                    <label className="block text-xs font-black text-gray-500 uppercase mb-2">
                      Heure d'ouverture
                    </label>
                    <input
                      type="time"
                      value={dayData.open}
                      onChange={(e) => updateDay(day.key, 'open', e.target.value)}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-black focus:outline-none font-bold text-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-black text-gray-500 uppercase mb-2">
                      Heure de fermeture
                    </label>
                    <input
                      type="time"
                      value={dayData.close}
                      onChange={(e) => updateDay(day.key, 'close', e.target.value)}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-black focus:outline-none font-bold text-lg"
                    />
                  </div>
                </div>
              )}

              {dayData.isClosed && (
                <div className="mt-4 p-4 bg-gray-100 rounded-lg text-center">
                  <p className="text-sm text-gray-500 font-bold">Fermé ce jour</p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

