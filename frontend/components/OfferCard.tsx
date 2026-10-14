import Link from 'next/link';
import Image from 'next/image';
import { Clock, Tag, ArrowRight } from 'lucide-react';
import { getOfferImageUrl } from '@/lib/api';

export interface Offer {
  _id: string;
  title: string;
  description: string;
  price: number;
  originalPrice?: number | null;
  isPromotion?: boolean;
  promotionPercentage?: number;
  category: string;
  image?: string;
  validUntil?: string | null;
}

// Photo utilisée quand l'offre n'a pas d'image propre
const FALLBACK_IMAGES: Record<string, string> = {
  vidange: '/images/offre-vidange.jpg',
  pneu: '/images/offre-pneus.jpg',
  reparation: '/images/offre-freinage.jpg',
  entretien: '/images/service-entretien.jpg',
  autre: '/images/hero-atelier.jpg',
};

const CATEGORY_LABELS: Record<string, string> = {
  vidange: 'Vidange',
  pneu: 'Pneus',
  reparation: 'Réparation',
  entretien: 'Entretien',
  autre: 'Atelier',
};

export const formatPrice = (value: number) =>
  `${Number.isInteger(value) ? value : value.toFixed(2).replace('.', ',')} €`;

const formatValidUntil = (date: string) =>
  new Date(date)
    .toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })
    .toUpperCase();

export default function OfferCard({ offer, className = '' }: { offer: Offer; className?: string }) {
  const image = offer.image ? getOfferImageUrl(offer.image) : FALLBACK_IMAGES[offer.category] || FALLBACK_IMAGES.autre;
  const hasDiscount = !!offer.originalPrice && offer.originalPrice > offer.price;
  const badge = offer.price === 0 ? 'Offert' : formatPrice(offer.price);

  return (
    <article className={`group flex flex-col border border-white/10 bg-ink-800 ${className}`}>
      <div className="relative aspect-[16/10] overflow-hidden bg-ink-700">
        <Image
          src={image}
          alt={offer.title}
          fill
          sizes="(min-width: 1024px) 380px, (min-width: 768px) 50vw, 85vw"
          className="object-cover opacity-80 transition duration-500 group-hover:scale-[1.03] group-hover:opacity-100"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink-800 via-ink-800/10 to-transparent" />
        <span className="caps absolute left-4 top-4 bg-ink px-3 py-2 text-[10px] text-white">Offre du moment</span>
        {hasDiscount && offer.promotionPercentage ? (
          <span className="caps absolute right-4 top-4 bg-white px-2.5 py-2 text-[10px] text-ink">-{offer.promotionPercentage} %</span>
        ) : null}
        <span className="btn-accent heading pointer-events-none absolute bottom-4 left-5 h-auto px-5 py-2 text-[34px] tracking-normal">
          {badge}
        </span>
      </div>

      <div className="flex flex-1 flex-col p-6">
        <p className="caps flex items-center gap-2 text-white/50">
          {offer.validUntil ? (
            <>
              <Clock className="h-3.5 w-3.5 text-brand" strokeWidth={2.25} />
              Jusqu’au {formatValidUntil(offer.validUntil)}
            </>
          ) : (
            <>
              <Tag className="h-3.5 w-3.5 text-brand" strokeWidth={2.25} />
              {CATEGORY_LABELS[offer.category] || 'Atelier'}
            </>
          )}
        </p>
        <h3 className="heading mt-3 text-[28px] text-white">{offer.title}</h3>
        <p className="mt-3 line-clamp-3 flex-1 text-[15px] leading-relaxed text-white/55">{offer.description}</p>

        <div className="mt-6 flex items-center justify-between gap-4 border-t border-white/10 pt-5">
          <span className="text-sm text-white/45">
            {hasDiscount ? (
              <>
                au lieu de <span className="line-through">{formatPrice(offer.originalPrice!)}</span>
              </>
            ) : (
              CATEGORY_LABELS[offer.category] || 'Atelier'
            )}
          </span>
          <Link href={`/contact#offer=${offer._id}`} className="btn-accent h-10 px-5 text-[12px]">
            J’en profite
            <ArrowRight className="h-3.5 w-3.5" strokeWidth={2.5} />
          </Link>
        </div>
      </div>
    </article>
  );
}
