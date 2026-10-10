'use client';

import type { LucideIcon } from 'lucide-react';

// Briques visuelles communes du back-office : en-têtes, cartes, boutons, badges, filtres, états vides.

export function AdminPageHeader({
  title,
  subtitle,
  actions,
}: {
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
}) {
  return (
    <div className="mb-6 flex flex-col gap-4 md:mb-8 md:flex-row md:items-end md:justify-between">
      <div>
        <h2 className="font-display text-[34px] font-extrabold uppercase italic leading-none tracking-[-0.01em] text-ink">{title}</h2>
        {subtitle && <p className="mt-2 text-sm text-gray-500">{subtitle}</p>}
      </div>
      {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
    </div>
  );
}

export function AdminCard({ className = '', children }: { className?: string; children: React.ReactNode }) {
  return <div className={`rounded-xl border border-gray-200/80 bg-white shadow-[0_1px_2px_rgba(16,24,40,0.04)] ${className}`}>{children}</div>;
}

type ButtonVariant = 'primary' | 'accent' | 'secondary' | 'ghost' | 'danger' | 'success';

const BUTTON_STYLES: Record<ButtonVariant, string> = {
  primary: 'bg-ink text-white hover:bg-ink-700',
  accent: 'bg-brand text-white hover:bg-garage-accent-dark',
  secondary: 'border border-gray-200 bg-white text-ink hover:border-gray-300 hover:bg-gray-50',
  ghost: 'text-gray-600 hover:bg-gray-100 hover:text-ink',
  danger: 'border border-red-200 bg-white text-red-600 hover:bg-red-50',
  success: 'bg-emerald-600 text-white hover:bg-emerald-700',
};

export function adminButton(variant: ButtonVariant = 'primary', size: 'sm' | 'md' = 'md') {
  return `inline-flex items-center justify-center gap-2 rounded-lg font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${
    size === 'sm' ? 'h-9 px-3 text-[13px]' : 'h-10 px-4 text-sm'
  } ${BUTTON_STYLES[variant]}`;
}

export function IconButton({
  icon: Icon,
  label,
  onClick,
  tone = 'default',
}: {
  icon: LucideIcon;
  label: string;
  onClick: () => void;
  tone?: 'default' | 'danger';
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={label}
      aria-label={label}
      className={`flex h-9 w-9 items-center justify-center rounded-lg border transition-colors ${
        tone === 'danger'
          ? 'border-red-200 text-red-600 hover:bg-red-50'
          : 'border-gray-200 text-gray-600 hover:bg-gray-50 hover:text-ink'
      }`}
    >
      <Icon className="h-4 w-4" />
    </button>
  );
}

type BadgeTone = 'neutral' | 'new' | 'warning' | 'success' | 'muted' | 'brand' | 'info';

const BADGE_STYLES: Record<BadgeTone, string> = {
  neutral: 'bg-gray-100 text-gray-700',
  new: 'bg-ink text-white',
  warning: 'bg-amber-50 text-amber-700 ring-1 ring-inset ring-amber-200',
  success: 'bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-200',
  muted: 'bg-gray-100 text-gray-500',
  brand: 'bg-red-50 text-brand ring-1 ring-inset ring-red-200',
  info: 'bg-sky-50 text-sky-700 ring-1 ring-inset ring-sky-200',
};

export function Badge({ tone = 'neutral', children }: { tone?: BadgeTone; children: React.ReactNode }) {
  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold ${BADGE_STYLES[tone]}`}>
      {children}
    </span>
  );
}

export function FilterTabs<T extends string>({
  value,
  onChange,
  options,
}: {
  value: T;
  onChange: (value: T) => void;
  options: { id: T; label: string; count?: number }[];
}) {
  return (
    <div className="inline-flex rounded-lg border border-gray-200 bg-white p-1">
      {options.map((option) => (
        <button
          key={option.id}
          type="button"
          onClick={() => onChange(option.id)}
          className={`flex items-center gap-2 rounded-md px-3 py-1.5 text-[13px] font-semibold transition-colors ${
            value === option.id ? 'bg-ink text-white' : 'text-gray-500 hover:text-ink'
          }`}
        >
          {option.label}
          {option.count !== undefined && option.count > 0 && (
            <span className={`rounded-full px-1.5 text-[11px] ${value === option.id ? 'bg-white/15' : 'bg-gray-100'}`}>{option.count}</span>
          )}
        </button>
      ))}
    </div>
  );
}

export function EmptyState({ icon: Icon, title, text }: { icon: LucideIcon; title: string; text?: string }) {
  return (
    <div className="flex flex-col items-center px-6 py-14 text-center">
      <span className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">
        <Icon className="h-6 w-6 text-gray-400" />
      </span>
      <p className="mt-4 font-semibold text-ink">{title}</p>
      {text && <p className="mt-1 max-w-xs text-sm text-gray-500">{text}</p>}
    </div>
  );
}

export function AdminSpinner({ label = 'Chargement…' }: { label?: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-16 text-sm text-gray-500">
      <span className="h-8 w-8 animate-spin rounded-full border-2 border-gray-200 border-t-brand" />
      {label}
    </div>
  );
}

export function DetailField({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="mb-1 text-[11px] font-semibold uppercase tracking-wider text-gray-400">{label}</p>
      <div className="text-sm text-ink">{children}</div>
    </div>
  );
}

export const adminInput =
  'h-10 w-full rounded-lg border border-gray-200 bg-white px-3 text-sm text-ink placeholder:text-gray-400 transition focus:border-ink focus:outline-none focus:ring-2 focus:ring-ink/10';

export const adminLabel = 'mb-1.5 block text-[13px] font-semibold text-gray-700';

// Sur mobile, la fiche détaillée est sous la liste : on y fait défiler après une sélection
export function scrollToDetailOnMobile() {
  if (typeof window === 'undefined' || window.innerWidth >= 1024) return;
  setTimeout(() => document.getElementById('admin-detail')?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 50);
}
