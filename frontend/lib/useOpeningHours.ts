import { useState, useEffect } from 'react';
import { openingHoursAPI } from './api';

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

// Index = Date.getDay() (0 = dimanche)
const WEEK_KEYS: (keyof OpeningHours)[] = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
const WEEK_LABELS = ['dimanche', 'lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi'];

const toMinutes = (time: string) => {
  const [h, m] = time.split(':').map(Number);
  return h * 60 + (m || 0);
};

// '08:00' -> '8h', '18:30' -> '18h30'
export const formatShortTime = (time: string) => {
  if (!time) return '';
  const [h, m] = time.split(':');
  return `${Number(h)}h${m === '00' ? '' : m}`;
};

export interface OpeningStatus {
  isOpen: boolean;
  label: string;
}

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
        // Valeurs par défaut en cas d'erreur
        setHours({
          monday: { open: '08:00', close: '18:00', isClosed: false },
          tuesday: { open: '08:00', close: '18:00', isClosed: false },
          wednesday: { open: '08:00', close: '18:00', isClosed: false },
          thursday: { open: '08:00', close: '18:00', isClosed: false },
          friday: { open: '08:00', close: '18:00', isClosed: false },
          saturday: { open: '08:00', close: '12:00', isClosed: false },
          sunday: { open: '08:00', close: '18:00', isClosed: true },
        });
      } finally {
        setIsLoading(false);
      }
    };
    loadHours();
  }, []);

  const formatTime = (time: string) => {
    if (!time) return '';
    const [hours, minutes] = time.split(':');
    return `${hours}h${minutes}`;
  };

  const formatDayHours = (day: DayHours) => {
    if (day.isClosed) return 'Fermé';
    return `${formatTime(day.open)} - ${formatTime(day.close)}`;
  };

  const getFormattedHours = () => {
    if (!hours) return [];
    
    const days = [
      { key: 'monday', label: 'Lundi', short: 'Lun' },
      { key: 'tuesday', label: 'Mardi', short: 'Mar' },
      { key: 'wednesday', label: 'Mercredi', short: 'Mer' },
      { key: 'thursday', label: 'Jeudi', short: 'Jeu' },
      { key: 'friday', label: 'Vendredi', short: 'Ven' },
      { key: 'saturday', label: 'Samedi', short: 'Sam' },
      { key: 'sunday', label: 'Dimanche', short: 'Dim' },
    ];

    const todayKey = WEEK_KEYS[new Date().getDay()];

    return days.map(day => {
      const dayHours = hours[day.key as keyof OpeningHours];
      return {
        ...day,
        hours: formatDayHours(dayHours),
        shortHours: dayHours.isClosed ? 'Fermé' : `${formatShortTime(dayHours.open)} – ${formatShortTime(dayHours.close)}`,
        isClosed: dayHours.isClosed,
        isToday: day.key === todayKey,
      };
    });
  };

  // Grouper les jours avec les mêmes horaires
  const getGroupedHours = () => {
    const formatted = getFormattedHours();
    const groups: Array<{ label: string; hours: string; shortHours: string; days: string[] }> = [];
    
    formatted.forEach(day => {
      const existingGroup = groups.find(g => g.hours === day.hours);
      if (existingGroup) {
        existingGroup.days.push(day.short);
      } else {
        groups.push({
          label: day.label,
          hours: day.hours,
          shortHours: day.shortHours,
          days: [day.short],
        });
      }
    });

    return groups.map(group => ({
      ...group,
      label: group.days.length > 1 
        ? `${group.days[0]} - ${group.days[group.days.length - 1]}`
        : group.label,
    }));
  };

  // Ouvert maintenant ? Sinon, prochaine ouverture
  const getStatus = (): OpeningStatus | null => {
    if (!hours) return null;
    const now = new Date();
    const dayIndex = now.getDay();
    const minutes = now.getHours() * 60 + now.getMinutes();
    const today = hours[WEEK_KEYS[dayIndex]];

    if (!today.isClosed && minutes >= toMinutes(today.open) && minutes < toMinutes(today.close)) {
      return { isOpen: true, label: `Ferme à ${formatShortTime(today.close)}` };
    }

    for (let offset = 0; offset < 7; offset++) {
      const index = (dayIndex + offset) % 7;
      const day = hours[WEEK_KEYS[index]];
      if (day.isClosed) continue;
      if (offset === 0 && minutes >= toMinutes(day.open)) continue;
      const when = offset === 0 ? '' : offset === 1 ? 'demain ' : `${WEEK_LABELS[index]} `;
      return { isOpen: false, label: `Ouvre ${when}à ${formatShortTime(day.open)}` };
    }
    return { isOpen: false, label: '' };
  };

  return {
    hours,
    getStatus,
    isLoading,
    formatTime,
    formatDayHours,
    getFormattedHours,
    getGroupedHours,
  };
}



