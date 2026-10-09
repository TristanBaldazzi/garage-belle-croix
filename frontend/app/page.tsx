import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import LocationMap from '@/components/LocationMap';
import OffersPreview from '@/components/OffersPreview';
import SectionHeading, { GhostWord } from '@/components/SectionHeading';
import HeroContact, { HeroStatus, RedStripes } from '@/components/HeroContact';
import { SITE } from '@/lib/site';
import { pageMetadata } from '@/lib/seo';
import { getOffersByCategory } from '@/lib/server-data';
import { ArrowRight, ArrowUpRight, Phone, FileText, Tag, Zap, Gauge, Wrench, Disc, Droplet } from 'lucide-react';

export const metadata: Metadata = pageMetadata({
  path: '/',
  title: 'Garage de la Belle Croix - Garage automobile à Ennery (Metz-Thionville)',
  absoluteTitle: true,
  description:
    'Garage automobile indépendant à Ennery, entre Metz et Thionville : entretien, réparation, freinage, pneus et vidange toutes marques. Devis gratuit, prix annoncé avant d’ouvrir le capot. 06 09 36 94 90.',
  shareTitle: 'Garage de la Belle Croix - La mécanique, sans détour',
});

const TOTAL_SECTIONS = 5;

const PROMISES = [
  { Icon: FileText, title: 'Devis gratuit', text: 'Estimation claire avant toute intervention.' },
  { Icon: Tag, title: 'Prix transparents', text: 'Pas de ligne surprise sur la facture.' },
  { Icon: Zap, title: 'Intervention rapide', text: 'Des créneaux rapides, votre voiture ne dort pas au garage.' },
];

const SERVICES = [
  {
    Icon: Gauge,
    title: 'Entretien',
    text: 'Révision constructeur, niveaux, filtres, courroie. Carnet tamponné, garantie préservée.',
    image: '/images/service-entretien.jpg',
    href: '/rendez-vous?service=entretien-auto',
  },
  {
    Icon: Wrench,
    title: 'Réparation',
    text: 'Freinage, embrayage, distribution, diagnostic électronique. On trouve, on explique, on répare.',
    image: '/images/service-reparation.jpg',
    href: '/devis?service=reparation-auto',
  },
  {
    Icon: Disc,
    title: 'Pneus',
    text: 'Montage, équilibrage, géométrie. Été, hiver ou 4 saisons, toutes marques.',
    image: '/images/service-pneus.jpg',
    href: '/devis?service=pneus',
  },
  {
    Icon: Droplet,
    title: 'Vidange',
    text: 'Huile adaptée à votre moteur, filtre neuf, indicateur remis à zéro. Rapide et propre.',
    image: '/images/service-vidange.jpg',
    href: '/rendez-vous?service=entretien-auto',
  },
];

const REASONS = [
  {
    title: 'Expertise reconnue',
    text: 'Toutes marques, diagnostic électronique, et des mécaniciens qui expliquent ce qu’ils font.',
  },
  {
    title: 'Prix transparents',
    text: 'Le devis est détaillé pièce par pièce. Si quelque chose change, on vous appelle avant.',
  },
  {
    title: 'Service rapide',
    text: 'Prise en charge rapide, véhicule rendu à l’heure dite. On vous prévient dès qu’il est prêt.',
  },
];

export default async function Home() {
  const offersByCategory = await getOffersByCategory();
  // Liste vide si l'API ne répond pas : le composant recharge alors côté navigateur
  const initialOffers = offersByCategory.length ? offersByCategory.flatMap((group) => group.offers) : undefined;

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Hero */}
      <section className="clip-hero relative -mb-px overflow-hidden bg-ink text-white">
        <Image
          src="/images/hero-atelier.jpg"
          alt="Mécanicien au travail sur un moteur, à l’atelier"
          fill
          priority
          sizes="100vw"
          className="object-cover object-[70%_center] opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-ink via-ink/85 to-ink/20" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-transparent to-ink/40" />
        <RedStripes className="absolute -top-4 right-[6%] hidden h-[62%] md:flex" />

        <div className="container-site relative flex min-h-[calc(100svh-68px)] flex-col justify-center pb-24 pt-14 md:min-h-[680px] md:pb-32 lg:min-h-[calc(100vh-84px)] lg:max-h-[880px]">
          <div className="lg:hidden">
            <HeroStatus />
          </div>
          <p className="eyebrow mt-8 text-white/70 lg:mt-0">Garage indépendant · Ennery (57)</p>
          <h1 className="heading mt-6 text-hero">
            La mécanique,
            <br />
            <span className="text-brand">sans détour.</span>
          </h1>
          <p className="mt-7 max-w-[520px] text-lg leading-relaxed text-white/65">
            Entretien, réparation, pneus et vidange entre Metz et Thionville. Devis gratuit, prix annoncé avant
            d’ouvrir le capot.
          </p>
          <div className="mt-10 flex flex-col gap-4 sm:flex-row">
            <a href={SITE.phoneHref} className="btn-accent h-14 px-8">
              <Phone className="h-4 w-4" strokeWidth={2.25} />
              Appeler le garage
            </a>
            <Link href="/offres" className="btn-outline-light h-14 px-8">
              Voir nos offres
              <ArrowRight className="h-4 w-4" strokeWidth={2.25} />
            </Link>
          </div>

          <div className="absolute bottom-24 right-5 hidden md:right-10 lg:block">
            <HeroContact />
          </div>
        </div>
      </section>

      {/* Engagements */}
      <section className="bg-white">
        <div className="container-site">
          <ul className="grid grid-cols-1 divide-y divide-line border-b border-line py-4 md:grid-cols-3 md:divide-x md:divide-y-0 md:py-12">
            {PROMISES.map(({ Icon, title, text }) => (
              <li key={title} className="flex items-center gap-5 py-5 md:px-8 md:py-0 md:first:pl-0">
                <span className="btn-accent h-12 w-14 flex-shrink-0 px-0">
                  <Icon className="h-5 w-5" strokeWidth={2} />
                </span>
                <span>
                  <span className="heading block text-[22px]">{title}</span>
                  <span className="mt-1 block text-[15px] leading-snug text-muted">{text}</span>
                </span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Services */}
      <section id="services" className="relative scroll-mt-24 overflow-hidden bg-white py-20 md:py-28">
        <GhostWord word="Atelier" className="-right-6 top-10 md:-right-10 md:top-12" />

        <div className="container-site relative">
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <SectionHeading index={1} total={TOTAL_SECTIONS} eyebrow="Nos services" title="Tout pour votre voiture," accent="au même endroit." />
            <Link href="/devis" className="link-arrow">
              Tous les services <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="mt-14 grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-6 lg:grid-cols-4">
            {SERVICES.map(({ Icon, title, text, image, href }, index) => (
              <Link
                key={title}
                href={href}
                className="group flex border border-line bg-white transition-shadow duration-300 hover:shadow-[0_24px_50px_-28px_rgba(11,11,12,0.35)] sm:flex-col"
              >
                <div className="relative w-28 flex-shrink-0 overflow-hidden bg-stone sm:aspect-[4/3] sm:w-auto">
                  <Image
                    src={image}
                    alt={`${title} automobile au Garage de la Belle Croix à Ennery`}
                    fill
                    sizes="(min-width: 1024px) 300px, (min-width: 640px) 50vw, 112px"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="flex flex-1 flex-col p-5 sm:p-6">
                  <div className="flex items-center justify-between">
                    <Icon className="h-6 w-6 text-brand" strokeWidth={2} />
                    <span className="heading text-lg text-ink/30">{String(index + 1).padStart(2, '0')}</span>
                  </div>
                  <h3 className="heading mt-3 text-[26px] sm:mt-5 sm:text-[30px]">{title}</h3>
                  <p className="mt-2 flex-1 text-[15px] leading-relaxed text-muted">{text}</p>
                  <span className="link-arrow mt-5">
                    En savoir plus
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <OffersPreview index={2} total={TOTAL_SECTIONS} initialOffers={initialOffers} />

      {/* Pourquoi nous */}
      <section id="presentation" className="scroll-mt-24 bg-white py-20 md:py-32">
        <div className="container-site grid grid-cols-1 items-center gap-14 lg:grid-cols-12 lg:gap-20">
          <div className="relative mx-auto w-full max-w-md lg:col-span-5 lg:max-w-none">
            <div className="absolute -bottom-4 -left-4 h-full w-full border-2 border-brand md:-bottom-6 md:-left-6" />
            <div className="relative aspect-[4/5] overflow-hidden bg-stone">
              <Image
                src="/images/atelier-pont.jpg"
                alt="Mécanicien sous un véhicule sur le pont élévateur"
                fill
                sizes="(min-width: 1024px) 480px, 90vw"
                className="object-cover"
              />
            </div>
          </div>

          <div className="lg:col-span-7">
            <SectionHeading index={3} total={TOTAL_SECTIONS} eyebrow="Pourquoi nous" title="Du travail propre." accent="Et on vous dit tout." />

            <ol className="mt-12 border-t border-line">
              {REASONS.map((reason, index) => (
                <li key={reason.title} className="grid grid-cols-[64px_1fr] gap-4 border-b border-line py-7 md:grid-cols-[96px_1fr]">
                  <span className="heading text-outline text-5xl text-brand md:text-6xl">{String(index + 1).padStart(2, '0')}</span>
                  <div>
                    <h3 className="heading text-[26px] md:text-[30px]">{reason.title}</h3>
                    <p className="mt-2 max-w-lg text-[15px] leading-relaxed text-muted">{reason.text}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      {/* Partenaire */}
      <section className="relative overflow-hidden bg-ink bg-hatch py-20 text-white md:py-24">
        <RedStripes className="absolute -bottom-10 -left-16 hidden h-40 opacity-30 md:flex" />
        <div className="container-site relative grid grid-cols-1 items-center gap-12 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <SectionHeading index={4} total={TOTAL_SECTIONS} eyebrow="Partenaire officiel" title="GB Motors" dark />
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-white/60">
              Un partenariat qui élargit ce qu’on peut vous proposer : plus de choix, plus de solutions, le même
              interlocuteur.
            </p>
          </div>
          <div className="lg:col-span-5">
            <a
              href="https://gbmotors.lu"
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/logo/gb-motors-white.svg"
                alt="Logo GB Motors"
                width={1576}
                height={720}
                className="h-16 w-auto opacity-85 transition-opacity group-hover:opacity-100 md:h-20"
              />
            </a>
            <a href="https://gbmotors.lu" target="_blank" rel="noopener noreferrer" className="link-arrow mt-4 flex w-fit">
              gbmotors.lu <ArrowUpRight className="h-4 w-4" />
            </a>
          </div>
        </div>
      </section>

      <LocationMap index={5} total={TOTAL_SECTIONS} />

      <Footer />
    </div>
  );
}
