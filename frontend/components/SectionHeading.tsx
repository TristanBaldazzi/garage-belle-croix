interface SectionHeadingProps {
  index: number;
  total: number;
  eyebrow: string;
  title: string;
  accent?: string;
  dark?: boolean;
  className?: string;
}

// En-tête de section : grand numéro détouré « 01 /05 », sur-titre, titre en deux temps
export default function SectionHeading({ index, total, eyebrow, title, accent, dark, className = '' }: SectionHeadingProps) {
  return (
    <div className={`relative ${className}`}>
      <p className="flex items-baseline gap-2">
        <span className="heading text-outline text-[56px] text-brand md:text-[72px]">{String(index).padStart(2, '0')}</span>
        <span className={`heading text-lg ${dark ? 'text-white/40' : 'text-ink/35'}`}>/{String(total).padStart(2, '0')}</span>
      </p>
      <p className={`eyebrow mt-3 ${dark ? 'text-white/60' : 'text-muted'}`}>{eyebrow}</p>
      <h2 className={`heading mt-4 text-[38px] sm:text-5xl md:text-[56px] ${dark ? 'text-white' : 'text-ink'}`}>
        {title}
        {accent && (
          <>
            <br />
            <span className="text-brand">{accent}</span>
          </>
        )}
      </h2>
    </div>
  );
}

// Mot géant en filigrane derrière une section
export function GhostWord({ word, dark, className = '' }: { word: string; dark?: boolean; className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={`heading pointer-events-none absolute select-none whitespace-nowrap text-[120px] leading-none md:text-[220px] ${
        dark ? 'text-white/[0.035]' : 'text-ghost'
      } ${className}`}
    >
      {word}
    </span>
  );
}
