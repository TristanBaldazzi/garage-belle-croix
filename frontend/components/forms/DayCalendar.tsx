'use client';

import { useMemo, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { lastClose, nowTime, type DayHours as SharedDayHours } from '@/lib/hours';

type DayHours = SharedDayHours;

// Index = Date.getDay() (0 = dimanche)
const DAY_KEYS = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'] as const;
const WEEKDAYS = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];

export const toDateString = (date: Date) => {
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
};

const startOfDay = (date: Date) => new Date(date.getFullYear(), date.getMonth(), date.getDate());
const monthIndex = (date: Date) => date.getFullYear() * 12 + date.getMonth();

// Calendrier mensuel : seuls les jours d'ouverture, de aujourd'hui à +maxMonths, sont sélectionnables
export default function DayCalendar({
  value,
  onChange,
  hours,
  invalid,
  maxMonths = 3,
}: {
  value?: string;
  onChange: (value: string) => void;
  hours: { [K in (typeof DAY_KEYS)[number]]: DayHours } | null;
  invalid?: boolean;
  maxMonths?: number;
}) {
  const today = startOfDay(new Date());
  const maxDate = new Date(today.getFullYear(), today.getMonth() + maxMonths, today.getDate());

  const isSelectable = (date: Date) => {
    if (!hours || date < today || date > maxDate) return false;
    const day = hours[DAY_KEYS[date.getDay()]];
    if (!day || day.isClosed) return false;
    // Aujourd'hui n'est proposé que si le garage n'a pas encore fermé (fin de la dernière plage)
    if (date.getTime() === today.getTime()) return nowTime() < (lastClose(day) || '00:00');
    return true;
  };

  // Premier jour réservable : sert à ouvrir le calendrier sur le bon mois
  const firstSelectable = useMemo(() => {
    const cursor = new Date(today);
    for (let i = 0; i < 400 && cursor <= maxDate; i++) {
      if (isSelectable(cursor)) return new Date(cursor);
      cursor.setDate(cursor.getDate() + 1);
    }
    return today;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hours]);

  const [visibleMonth, setVisibleMonth] = useState<Date | null>(null);
  const month = visibleMonth || (value ? new Date(`${value}T00:00:00`) : firstSelectable);
  const first = new Date(month.getFullYear(), month.getMonth(), 1);
  const daysInMonth = new Date(month.getFullYear(), month.getMonth() + 1, 0).getDate();
  const leadingBlanks = (first.getDay() + 6) % 7;

  const canGoPrev = monthIndex(first) > monthIndex(today);
  const canGoNext = monthIndex(first) < monthIndex(maxDate);
  const goToMonth = (offset: number) => setVisibleMonth(new Date(first.getFullYear(), first.getMonth() + offset, 1));

  const monthLabel = first.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' });

  return (
    <div className={`border bg-white ${invalid ? 'border-red-400' : 'border-line'}`}>
      <div className="flex items-center justify-between border-b border-line px-2 py-2">
        <button
          type="button"
          onClick={() => goToMonth(-1)}
          disabled={!canGoPrev}
          aria-label="Mois précédent"
          className="flex h-10 w-10 items-center justify-center text-ink transition-colors hover:bg-stone disabled:cursor-not-allowed disabled:text-ink/20 disabled:hover:bg-transparent"
        >
          <ChevronLeft className="h-5 w-5" strokeWidth={2} />
        </button>
        <p className="heading text-[22px] first-letter:uppercase" aria-live="polite">
          {monthLabel}
        </p>
        <button
          type="button"
          onClick={() => goToMonth(1)}
          disabled={!canGoNext}
          aria-label="Mois suivant"
          className="flex h-10 w-10 items-center justify-center text-ink transition-colors hover:bg-stone disabled:cursor-not-allowed disabled:text-ink/20 disabled:hover:bg-transparent"
        >
          <ChevronRight className="h-5 w-5" strokeWidth={2} />
        </button>
      </div>

      <div className="p-2 sm:p-3">
        <div className="grid grid-cols-7 gap-1 pb-1">
          {WEEKDAYS.map((day) => (
            <span key={day} className="caps py-1.5 text-center text-[10px] text-muted">
              {day}
            </span>
          ))}
        </div>

        {!hours ? (
          <div className="grid grid-cols-7 gap-1">
            {Array.from({ length: 35 }).map((_, i) => (
              <div key={i} className="h-11 animate-pulse bg-stone sm:h-12" />
            ))}
          </div>
        ) : (
          <div role="radiogroup" aria-label="Jour souhaité" className="grid grid-cols-7 gap-1">
            {Array.from({ length: leadingBlanks }).map((_, i) => (
              <span key={`blank-${i}`} />
            ))}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const date = new Date(first.getFullYear(), first.getMonth(), i + 1);
              const dateValue = toDateString(date);
              const selectable = isSelectable(date);
              const checked = value === dateValue;
              const isToday = date.getTime() === today.getTime();
              return (
                <button
                  key={dateValue}
                  type="button"
                  role="radio"
                  aria-checked={checked}
                  disabled={!selectable}
                  aria-label={date.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })}
                  onClick={() => onChange(dateValue)}
                  className={`relative flex h-11 items-center justify-center font-display text-[17px] font-bold transition-colors sm:h-12 ${
                    checked
                      ? 'bg-ink text-white'
                      : selectable
                        ? 'bg-stone text-ink hover:bg-ink hover:text-white'
                        : 'cursor-not-allowed text-ink/20'
                  }`}
                >
                  {i + 1}
                  {isToday && (
                    <span className={`absolute bottom-1.5 h-1 w-1 rounded-full ${checked ? 'bg-white' : 'bg-brand'}`} />
                  )}
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
