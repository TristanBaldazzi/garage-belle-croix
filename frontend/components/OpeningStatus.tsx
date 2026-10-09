import type { OpeningStatus as Status } from '@/lib/useOpeningHours';

// Pastille « Ouvert · ferme à 18h30 » / « Fermé · ouvre demain à 8h »
export default function OpeningStatus({ status, className = '' }: { status: Status | null; className?: string }) {
  if (!status) return null;

  return (
    <p className={`caps flex items-center gap-2 ${className}`}>
      <span className="relative flex h-2 w-2">
        {status.isOpen && <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />}
        <span className={`relative inline-flex h-2 w-2 rounded-full ${status.isOpen ? 'bg-emerald-400' : 'bg-brand'}`} />
      </span>
      <span className="font-bold">{status.isOpen ? 'Ouvert' : 'Fermé'}</span>
      {status.label && <span className="opacity-60">· {status.label}</span>}
    </p>
  );
}
