// Calculs sur les horaires d'ouverture (plages multiples : horaires coupés possibles).
// Fonctions pures, utilisables côté serveur comme dans le navigateur.

export interface TimeSlot {
  open: string; // 'HH:MM'
  close: string;
}

export interface DayHours {
  open: string;
  close: string;
  isClosed: boolean;
  slots?: TimeSlot[];
}

export type DayKey = 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';
export type OpeningHours = Record<DayKey, DayHours>;

// Index = Date.getDay() (0 = dimanche)
export const WEEK_KEYS: DayKey[] = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
const WEEK_LABELS = ['dimanche', 'lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi'];

// Limite entre le créneau du matin et celui de l'après-midi (prise de rendez-vous)
export const MIDDAY = '12:00';

export const toMinutes = (time: string) => {
  const [h, m] = time.split(':').map(Number);
  return h * 60 + (m || 0);
};

export const nowTime = (date = new Date()) =>
  `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;

// '08:00' -> '8h', '18:30' -> '18h30'
export const formatShortTime = (time: string) => {
  if (!time) return '';
  const [h, m] = time.split(':');
  return `${Number(h)}h${m === '00' ? '' : m}`;
};

// Plages d'un jour, triées ; les anciennes données (open/close seuls) donnent une plage unique
export const getSlots = (day?: DayHours | null): TimeSlot[] => {
  if (!day || day.isClosed) return [];
  const slots = day.slots && day.slots.length ? day.slots : [{ open: day.open, close: day.close }];
  return [...slots].filter((s) => s.open && s.close).sort((a, b) => a.open.localeCompare(b.open));
};

// '8h – 12h · 14h – 18h' ou 'Fermé'
export const formatDaySlots = (day?: DayHours | null) => {
  const slots = getSlots(day);
  if (!slots.length) return 'Fermé';
  return slots.map((s) => `${formatShortTime(s.open)} – ${formatShortTime(s.close)}`).join(' · ');
};

// Fin de la dernière plage du jour (pour savoir si le garage est encore ouvert plus tard)
export const lastClose = (day?: DayHours | null) => {
  const slots = getSlots(day);
  return slots.length ? slots[slots.length - 1].close : null;
};

export interface OpeningStatus {
  isOpen: boolean;
  label: string;
}

// Ouvert maintenant ? Sinon, prochaine (ré)ouverture
export const getOpeningStatus = (hours: OpeningHours | null, date = new Date()): OpeningStatus | null => {
  if (!hours) return null;
  const dayIndex = date.getDay();
  const time = nowTime(date);
  const todaySlots = getSlots(hours[WEEK_KEYS[dayIndex]]);

  const current = todaySlots.find((s) => time >= s.open && time < s.close);
  if (current) return { isOpen: true, label: `Ferme à ${formatShortTime(current.close)}` };

  // Pause du midi : une plage commence plus tard aujourd'hui
  const laterToday = todaySlots.find((s) => s.open > time);
  if (laterToday) {
    const hasOpenedToday = todaySlots.some((s) => s.close <= time);
    return { isOpen: false, label: `${hasOpenedToday ? 'Rouvre' : 'Ouvre'} à ${formatShortTime(laterToday.open)}` };
  }

  for (let offset = 1; offset <= 7; offset++) {
    const index = (dayIndex + offset) % 7;
    const slots = getSlots(hours[WEEK_KEYS[index]]);
    if (!slots.length) continue;
    const when = offset === 1 ? 'demain ' : `${WEEK_LABELS[index]} `;
    return { isOpen: false, label: `Ouvre ${when}à ${formatShortTime(slots[0].open)}` };
  }
  return { isOpen: false, label: '' };
};

// Créneaux de rendez-vous possibles pour un jour donné.
// Matin : une plage commence avant midi (et, aujourd'hui, midi n'est pas passé).
// Après-midi : une plage se termine après midi.
export const getAppointmentSlots = (day: DayHours | null | undefined, isToday: boolean, date = new Date()) => {
  const slots = getSlots(day);
  const time = nowTime(date);
  const morningOpen = slots.some((s) => s.open < MIDDAY);
  const afternoonOpen = slots.some((s) => s.close > MIDDAY);
  const matin = morningOpen && (!isToday || time < MIDDAY);
  const apresMidi = afternoonOpen && (!isToday || time < (lastClose(day) || '00:00'));
  return { matin, apresMidi, morningOpen, afternoonOpen };
};
