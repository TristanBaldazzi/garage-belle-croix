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

    return days.map(day => ({
      ...day,
      hours: formatDayHours(hours[day.key as keyof OpeningHours]),
      isClosed: hours[day.key as keyof OpeningHours].isClosed,
    }));
  };

  // Grouper les jours avec les mêmes horaires
  const getGroupedHours = () => {
    const formatted = getFormattedHours();
    const groups: Array<{ label: string; hours: string; days: string[] }> = [];
    
    formatted.forEach(day => {
      const existingGroup = groups.find(g => g.hours === day.hours);
      if (existingGroup) {
        existingGroup.days.push(day.short);
      } else {
        groups.push({
          label: day.label,
          hours: day.hours,
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

  return {
    hours,
    isLoading,
    formatTime,
    formatDayHours,
    getFormattedHours,
    getGroupedHours,
  };
}



