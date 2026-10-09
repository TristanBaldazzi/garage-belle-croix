import type { Metadata } from 'next';
import { pageMetadata } from '@/lib/seo';
import Link from 'next/link';
import LegalPage, { LegalSection, InfoList } from '@/components/LegalPage';
import { SITE, LEGAL } from '@/lib/site';

export const metadata: Metadata = pageMetadata({
  path: '/mentions-legales',
  title: 'Mentions légales et conditions d’utilisation',
  description: 'Mentions légales, éditeur, hébergeur et conditions d’utilisation du site du Garage de la Belle Croix à Ennery.',
});

export default function MentionsLegalesPage() {
  const editor: [string, React.ReactNode][] = [
    ['Raison sociale', LEGAL.companyName],
    ['Forme juridique', LEGAL.legalForm],
    ...(LEGAL.shareCapital ? [['Capital social', LEGAL.shareCapital] as [string, React.ReactNode]] : []),
    ['Siège social', `${SITE.street}, ${SITE.postalCode} ${SITE.city}, France`],
    ['SIREN', LEGAL.siren],
    ['SIRET', LEGAL.siret],
    ['Immatriculation', LEGAL.rcs],
    ['Activité (NAF)', LEGAL.naf],
    ['Téléphone', <span key="tel"><a href={SITE.phoneHref}>{SITE.phone}</a> · <a href={SITE.phone2Href}>{SITE.phone2}</a></span>],
    ['E-mail', <a key="mail" href={`mailto:${SITE.email}`}>{SITE.email}</a>],
    ['Directeur de la publication', LEGAL.director],
  ];

  return (
    <LegalPage eyebrow="Informations légales" title="Mentions légales" accent="& conditions.">
      <LegalSection index={1} title="Éditeur du site">
        <p>
          Le site <strong>{SITE.url.replace('https://', '')}</strong> est édité par :
        </p>
        <InfoList items={editor} />
      </LegalSection>

      <LegalSection index={2} title="Hébergement">
        {LEGAL.host.name ? (
          <InfoList
            items={[
              ['Hébergeur', LEGAL.host.name],
              ...(LEGAL.host.address ? [['Adresse', LEGAL.host.address] as [string, React.ReactNode]] : []),
              ...(LEGAL.host.website
                ? [['Site web', <a key="host" href={LEGAL.host.website} target="_blank" rel="noopener noreferrer">{LEGAL.host.website.replace(/^https?:\/\//, '')}</a>] as [string, React.ReactNode]]
                : []),
            ]}
          />
        ) : (
          <p>Les informations relatives à l’hébergeur du site peuvent être obtenues sur simple demande à {SITE.email}.</p>
        )}
      </LegalSection>

      <LegalSection index={3} title="Conception et réalisation">
        <p>
          Site conçu et réalisé par{' '}
          <a href="https://makemydesign.fr" target="_blank" rel="noopener noreferrer">Make My Design</a>.
        </p>
      </LegalSection>

      <LegalSection index={4} title="Conditions d’utilisation">
        <p>
          L’accès au site et son utilisation impliquent l’acceptation des présentes conditions. Le garage peut les
          modifier à tout moment ; la version en vigueur est celle publiée sur cette page.
        </p>
        <ul>
          <li>
            <strong>Devis et rendez-vous en ligne.</strong> Les demandes envoyées via les formulaires ne constituent ni
            une commande ni une réservation ferme. Un rendez-vous n’est confirmé qu’après rappel du garage. Le devis
            définitif est établi après examen du véhicule et accepté par le client avant toute intervention.
          </li>
          <li>
            <strong>Offres et tarifs.</strong> Les offres affichées sont valables dans la limite de la durée indiquée
            et des stocks disponibles. Les prix sont indiqués en euros TTC, à titre indicatif ; seul le devis signé
            fait foi.
          </li>
          <li>
            <strong>Informations.</strong> Le garage s’efforce de tenir à jour les informations du site (horaires,
            prestations, prix) sans pouvoir garantir l’absence d’erreur ou d’omission. En cas de doute, appelez le{' '}
            <a href={SITE.phoneHref}>{SITE.phone}</a>.
          </li>
          <li>
            <strong>Usage du site.</strong> Il est interdit d’utiliser les formulaires à des fins abusives,
            frauduleuses ou publicitaires, ou de tenter de porter atteinte au bon fonctionnement du site.
          </li>
        </ul>
      </LegalSection>

      <LegalSection index={5} title="Propriété intellectuelle">
        <p>
          La structure du site, ses textes, son identité graphique et son logo sont la propriété de {LEGAL.companyName}{' '}
          ou de ses partenaires. Toute reproduction, représentation ou adaptation, totale ou partielle, sans
          autorisation écrite préalable est interdite.
        </p>
        <p>
          Certaines photographies proviennent de la banque d’images Unsplash et sont utilisées conformément à la
          licence Unsplash. Le logo GB Motors est la propriété de son titulaire et reproduit dans le cadre du
          partenariat.
        </p>
      </LegalSection>

      <LegalSection index={6} title="Responsabilité et liens">
        <p>
          Le garage ne saurait être tenu responsable des dommages résultant d’une interruption du site, d’un
          dysfonctionnement technique ou de l’utilisation des informations qui y figurent.
        </p>
        <p>
          Le site contient des liens vers des sites tiers (Google Maps, Waze, GB Motors…). Le garage n’exerce aucun
          contrôle sur leur contenu et décline toute responsabilité à leur égard.
        </p>
      </LegalSection>

      <LegalSection index={7} title="Données personnelles">
        <p>
          Le traitement de vos données personnelles est détaillé dans notre{' '}
          <Link href="/confidentialite">politique de confidentialité</Link>.
        </p>
      </LegalSection>

      <LegalSection index={8} title="Droit applicable">
        <p>
          Les présentes mentions sont régies par le droit français. En cas de litige, et à défaut de résolution
          amiable, les tribunaux compétents sont ceux du ressort du siège social. Le consommateur peut également
          recourir gratuitement à un médiateur de la consommation.
        </p>
      </LegalSection>
    </LegalPage>
  );
}
