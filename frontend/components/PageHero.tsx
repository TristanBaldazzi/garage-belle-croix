import Image from 'next/image';
import { RedStripes } from '@/components/HeroContact';

interface PageHeroProps {
  eyebrow: string;
  title: string;
  accent?: string;
  subtitle?: string;
  image?: string;
  children?: React.ReactNode;
}

// En-tête sombre des pages internes, même langage que le hero d'accueil
export default function PageHero({ eyebrow, title, accent, subtitle, image = '/images/hero-atelier.jpg', children }: PageHeroProps) {
  return (
    <section className="clip-hero relative -mb-px overflow-hidden bg-ink text-white">
      <Image src={image} alt="" fill priority sizes="100vw" className="object-cover object-center opacity-30" />
      <div className="absolute inset-0 bg-gradient-to-r from-ink via-ink/90 to-ink/40" />
      <RedStripes className="absolute -top-4 right-[6%] hidden h-[75%] md:flex" />

      <div className="container-site relative pb-20 pt-14 md:pb-28 md:pt-20">
        <p className="eyebrow text-white/70">{eyebrow}</p>
        <h1 className="heading mt-5 max-w-4xl text-[46px] sm:text-6xl md:text-[80px]">
          {title}
          {accent && (
            <>
              <br />
              <span className="text-brand">{accent}</span>
            </>
          )}
        </h1>
        {subtitle && <p className="mt-6 max-w-2xl text-lg leading-relaxed text-white/60">{subtitle}</p>}
        {children}
      </div>
    </section>
  );
}
