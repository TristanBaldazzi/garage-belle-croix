import Header from '@/components/Header';
import Footer from '@/components/Footer';
import PageHero from '@/components/PageHero';
import { LEGAL } from '@/lib/site';

// Gabarit des pages légales : hero + texte en colonne lisible
export default function LegalPage({
  eyebrow,
  title,
  accent,
  children,
}: {
  eyebrow: string;
  title: string;
  accent?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <PageHero eyebrow={eyebrow} title={title} accent={accent} subtitle={`Dernière mise à jour : ${LEGAL.lastUpdate}`} />
      <section className="py-14 md:py-20">
        <div className="container-site">
          <article className="mx-auto max-w-3xl space-y-12 text-[16px] leading-relaxed text-ink/80">{children}</article>
        </div>
      </section>
      <Footer />
    </div>
  );
}

export function LegalSection({ index, title, children }: { index: number; title: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="flex items-baseline gap-4 border-b border-line pb-3">
        <span className="heading text-outline text-3xl text-brand">{String(index).padStart(2, '0')}</span>
        <span className="heading text-[28px] text-ink">{title}</span>
      </h2>
      <div className="mt-5 space-y-4 [&_a]:font-semibold [&_a]:text-brand [&_a:hover]:underline [&_li]:ml-5 [&_li]:list-disc [&_li]:pl-1 [&_strong]:text-ink [&_ul]:space-y-2">
        {children}
      </div>
    </section>
  );
}

// Tableau « libellé / valeur » pour l'identification
export function InfoList({ items }: { items: [string, React.ReactNode][] }) {
  return (
    <dl className="divide-y divide-line border-y border-line">
      {items.map(([label, value]) => (
        <div key={label} className="grid grid-cols-1 gap-1 py-3 sm:grid-cols-3 sm:gap-4">
          <dt className="caps pt-1 text-muted">{label}</dt>
          <dd className="text-ink sm:col-span-2">{value}</dd>
        </div>
      ))}
    </dl>
  );
}
