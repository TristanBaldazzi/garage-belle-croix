'use client';

import Link from 'next/link';
import { Check, Car, Bike, Disc, PackageOpen, Wrench, Gauge, MessageSquare, type LucideIcon } from 'lucide-react';
import { SITE } from '@/lib/site';

export const inputClass = 'field-input';

// Icône de chaque prestation (ids de SERVICES dans lib/site.ts)
export const SERVICE_ICONS: Record<string, LucideIcon> = {
  pneus: Disc,
  'montage-pneus-client': PackageOpen,
  'entretien-moto': Gauge,
  'mecanique-moto': Wrench,
  'entretien-auto': Gauge,
  'reparation-auto': Wrench,
  autre: MessageSquare,
};

export function Field({
  label,
  htmlFor,
  required,
  error,
  hint,
  children,
}: {
  label: string;
  htmlFor?: string;
  required?: boolean;
  error?: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label htmlFor={htmlFor} className="caps mb-2 block text-[11px] text-ink">
        {label}
        {required && <span className="ml-0.5 text-garage-accent">*</span>}
      </label>
      {children}
      {hint && !error && <p className="mt-1.5 text-xs text-muted">{hint}</p>}
      {error && <p className="mt-1.5 text-sm text-red-600">{error}</p>}
    </div>
  );
}

export function FormStep({ number, title, children }: { number: number; title: string; children: React.ReactNode }) {
  return (
    <fieldset className="space-y-5">
      <legend className="mb-6 flex w-full items-baseline gap-3 border-b border-line pb-3">
        <span className="heading text-outline text-3xl text-brand">{String(number).padStart(2, '0')}</span>
        <span className="heading text-[26px]">{title}</span>
      </legend>
      {children}
    </fieldset>
  );
}

// Choix exclusif sous forme de boutons segmentés (type de véhicule, créneau…)
export function SegmentedChoice<T extends string>({
  value,
  onChange,
  options,
  ariaLabel,
}: {
  value: T;
  onChange: (value: T) => void;
  options: { id: T; label: string; Icon?: LucideIcon; disabled?: boolean; hint?: string }[];
  ariaLabel: string;
}) {
  return (
    <div
      className="grid gap-1 border border-line bg-stone p-1"
      style={{ gridTemplateColumns: `repeat(${options.length}, minmax(0, 1fr))` }}
      role="radiogroup"
      aria-label={ariaLabel}
    >
      {options.map(({ id, label, Icon, disabled, hint }) => (
        <button
          key={id}
          type="button"
          role="radio"
          aria-checked={value === id}
          onClick={() => onChange(id)}
          disabled={disabled}
          title={disabled ? hint : undefined}
          className={`flex h-10 items-center justify-center gap-2 font-display text-[13px] font-bold uppercase tracking-[0.12em] transition-colors ${
            disabled
              ? 'cursor-not-allowed text-ink/25 line-through decoration-1'
              : value === id ? 'bg-ink text-white shadow-sm' : 'text-muted hover:text-ink'
          }`}
        >
          {Icon && <Icon className="h-4 w-4" strokeWidth={1.75} />}
          {label}
        </button>
      ))}
    </div>
  );
}

// Choix exclusif en tuiles (prestation) : remplace le <select> natif, impossible à styler proprement
export function ChoiceTiles<T extends string>({
  value,
  onChange,
  options,
  ariaLabel,
  invalid,
  columns = 2,
}: {
  value: T | '';
  onChange: (value: T) => void;
  options: { id: T; label: string; Icon?: LucideIcon }[];
  ariaLabel: string;
  invalid?: boolean;
  columns?: 2 | 4;
}) {
  return (
    <div
      role="radiogroup"
      aria-label={ariaLabel}
      aria-invalid={invalid || undefined}
      className={`grid grid-cols-1 gap-2 sm:grid-cols-2 ${columns === 4 ? 'lg:grid-cols-4' : ''}`}
    >
      {options.map(({ id, label, Icon }) => {
        const checked = value === id;
        return (
          <button
            key={id}
            type="button"
            role="radio"
            aria-checked={checked}
            onClick={() => onChange(id)}
            className={`group relative flex min-h-[60px] items-center gap-3 border px-4 py-3 text-left transition-colors ${
              checked
                ? 'border-ink bg-ink text-white'
                : `bg-white text-ink hover:border-ink ${invalid ? 'border-red-400' : 'border-line'}`
            }`}
          >
            {Icon && (
              <span
                className={`flex h-9 w-9 flex-shrink-0 items-center justify-center transition-colors ${
                  checked ? 'bg-brand text-white' : 'bg-stone text-brand group-hover:bg-brand group-hover:text-white'
                }`}
              >
                <Icon className="h-[18px] w-[18px]" strokeWidth={2} />
              </span>
            )}
            <span className="flex-1 text-[15px] font-medium leading-snug">{label}</span>
            <span
              className={`flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full border transition-colors ${
                checked ? 'border-brand bg-brand' : 'border-line'
              }`}
            >
              {checked && <Check className="h-3 w-3 text-white" strokeWidth={3} />}
            </span>
          </button>
        );
      })}
    </div>
  );
}

export function VehicleTypeToggle({
  value,
  onChange,
}: {
  value: 'voiture' | 'moto';
  onChange: (value: 'voiture' | 'moto') => void;
}) {
  return (
    <SegmentedChoice
      value={value}
      onChange={onChange}
      ariaLabel="Type de véhicule"
      options={[
        { id: 'voiture', label: 'Voiture', Icon: Car },
        { id: 'moto', label: 'Moto', Icon: Bike },
      ]}
    />
  );
}

// Mention RGPD sous les boutons d'envoi
export function PrivacyNote({ prefix }: { prefix?: string }) {
  return (
    <p className="-mt-8 text-center text-xs leading-relaxed text-muted">
      {prefix && <>{prefix} </>}
      Vos données servent uniquement à traiter votre demande.{' '}
      <Link href="/confidentialite" className="underline underline-offset-2 hover:text-ink">
        Politique de confidentialité
      </Link>
    </p>
  );
}

// Champ invisible anti-robots (voir backend/middleware/formProtection.js)
export function HoneypotField({ register }: { register: any }) {
  return (
    <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
      <label htmlFor="website">Ne pas remplir</label>
      <input id="website" type="text" tabIndex={-1} autoComplete="off" {...register('website')} />
    </div>
  );
}

export function SuccessPanel({
  title,
  message,
  onReset,
}: {
  title: string;
  message: string;
  onReset: () => void;
}) {
  return (
    <div className="py-6 animate-fade-in-up">
      <span className="btn-accent h-14 w-16 px-0">
        <Check className="h-6 w-6" strokeWidth={2.5} />
      </span>
      <h3 className="heading mt-6 text-4xl md:text-5xl">{title}</h3>
      <p className="mt-3 max-w-lg leading-relaxed text-muted">{message}</p>
      <div className="mt-8 flex flex-col gap-4 sm:flex-row">
        <a href={SITE.phoneHref} className="btn-dark">
          Urgent ? {SITE.phone}
        </a>
        <button type="button" onClick={onReset} className="btn-outline-dark">
          Faire une autre demande
        </button>
        <Link href="/" className="btn text-muted hover:text-ink">
          Retour à l'accueil
        </Link>
      </div>
    </div>
  );
}
