import OffresContent from '@/components/OffresContent';
import { getOffersByCategory } from '@/lib/server-data';
import { SITE } from '@/lib/site';

export default async function OffresPage() {
  const offersByCategory = await getOffersByCategory();
  const offers = offersByCategory.flatMap((group) => group.offers);

  // Liste des offres pour Google (prix, validité)
  const offersJsonLd = offers.length
    ? {
        '@context': 'https://schema.org',
        '@type': 'ItemList',
        name: 'Offres du moment',
        itemListElement: offers.map((offer, index) => ({
          '@type': 'ListItem',
          position: index + 1,
          item: {
            '@type': 'Offer',
            name: offer.title,
            description: offer.description,
            price: offer.price,
            priceCurrency: 'EUR',
            url: `${SITE.url}/contact?offer=${offer._id}`,
            ...(offer.validUntil && { validThrough: offer.validUntil }),
            seller: { '@id': `${SITE.url}/#garage` },
          },
        })),
      }
    : null;

  return (
    <>
      {offersJsonLd && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(offersJsonLd) }} />
      )}
      <OffresContent initialOffersByCategory={offersByCategory.length ? offersByCategory : undefined} />
    </>
  );
}
