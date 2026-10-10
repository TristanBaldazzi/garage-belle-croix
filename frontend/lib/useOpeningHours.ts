import { useState, useEffect } from 'react';
import { openingHoursAPI } from './api';
import { WEEK_KEYS, formatDaySlots, getOpeningStatus, type DayHours, type OpeningHours } from './hours';

export { formatShortTime, type OpeningStatus } from './hours';

const DAYS = [
  { key: 'monday', label: 'Lundi', short: 'Lun' },
  { key: 'tuesday', label: 'Mardi', short: 'Mar' },
  { key: 'wednesday', label: 'Mercredi', short: 'Mer' },
  { key: 'thursday', label: 'Jeudi', short: 'Jeu' },
  { key: 'friday', label: 'Vendredi', short: 'Ven' },
  { key: 'saturday', label: 'Samedi', short: 'Sam' },
  { key: 'sunday', label: 'Dimanche', short: 'Dim' },
] as const;

// Valeurs par défaut si l'API ne répond pas
const FALLBACK_HOURS: OpeningHours = {
  monday: { open: '08:00', close: '18:00', isClosed: false },
  tuesday: { open: '08:00', close: '18:00', isClosed: false },
  wednesday: { open: '08:00', close: '18:00', isClosed: false },
  thursday: { open: '08:00', close: '18:00', isClosed: false },
  friday: { open: '08:00', close: '18:00', isClosed: false },
  saturday: { open: '08:00', close: '12:00', isClosed: false },
  sunday: { open: '08:00', close: '18:00', isClosed: true },
};

export function useOpeningHours() {
  const [hours, setHours] = useState<OpeningHours | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadHours = async () => {
      try {
        const data = await openingHoursAPI.get();
        setHours(data);
      } catch (error) {
        console.error('Error loading opening hours:', error);
        setHours(FALLBACK_HOURS);
      } finally {
        setIsLoading(false);
      }
    };
    loadHours();
  }, []);

  // '8h – 12h · 14h – 18h' (toutes les plages du jour)
  const formatDayHours = (day: DayHours) => formatDaySlots(day);

  const getFormattedHours = () => {
    if (!hours) return [];
    const todayKey = WEEK_KEYS[new Date().getDay()];

    return DAYS.map((day) => {
      const dayHours = hours[day.key];
      const formatted = formatDaySlots(dayHours);
      return {
        ...day,
        hours: formatted,
        shortHours: formatted,
        isClosed: dayHours.isClosed,
        isToday: day.key === todayKey,
      };
    });
  };

  // Grouper les jours consécutifs aux horaires identiques (Lun – Ven · 8h – 12h · 14h – 18h)
  const getGroupedHours = () => {
    const groups: Array<{ label: string; hours: string; shortHours: string; days: string[] }> = [];

    getFormattedHours().forEach((day) => {
      const last = groups[groups.length - 1];
      if (last && last.hours === day.hours) {
        last.days.push(day.short);
      } else {
        groups.push({ label: day.label, hours: day.hours, shortHours: day.shortHours, days: [day.short] });
      }
    });

    return groups.map((group) => ({
      ...group,
      label: group.days.length > 1 ? `${group.days[0]} - ${group.days[group.days.length - 1]}` : group.label,
    }));
  };

  const getStatus = () => getOpeningStatus(hours);

  return {
    hours,
    getStatus,
    isLoading,
    formatDayHours,
    getFormattedHours,
    getGroupedHours,
  };
}
