import type { Metadata } from 'next';
import { pageMetadata } from '@/lib/seo';
import Link from 'next/link';
import LegalPage, { LegalSection, InfoList } from '@/components/LegalPage';
import { SITE, LEGAL } from '@/lib/site';

export const metadata: Metadata = pageMetadata({
  path: '/confidentialite',
  title: 'Politique de confidentialité',
  description: 'Comment le Garage de la Belle Croix collecte, utilise et protège vos données personnelles (RGPD).',
});

export default function ConfidentialitePage() {
  return (
    <LegalPage eyebrow="Vos données" title="Politique de" accent="confidentialité.">
      <p className="text-lg">
        Nous collectons uniquement les données nécessaires pour vous répondre et prendre en charge votre véhicule.
        Elles ne sont ni vendues, ni louées, ni utilisées à des fins publicitaires.
      </p>

      <LegalSection index={1} title="Responsable du traitement">
        <InfoList
          items={[
            ['Responsable', `${LEGAL.companyName} (${LEGAL.legalForm}), SIRET ${LEGAL.siret}`],
            ['Adresse', `${SITE.street}, ${SITE.postalCode} ${SITE.city}`],
            ['Représentant', LEGAL.director],
            ['Contact', <a key="mail" href={`mailto:${SITE.email}`}>{SITE.email}</a>],
          ]}
        />
      </LegalSection>

      <LegalSection index={2} title="Données collectées">
        <p>Via les formulaires de contact, de devis et de rendez-vous, nous recueillons :</p>
        <ul>
          <li><strong>Identité et coordonnées :</strong> nom, adresse e-mail, numéro de téléphone.</li>
          <li>
            <strong>Véhicule :</strong> type (voiture ou moto), marque et modèle, plaque d’immatriculation, dimensions
            et nombre de pneus le cas échéant.
          </li>
          <li>
            <strong>Votre demande :</strong> prestation souhaitée, offre concernée, date et créneau préférés, message
            libre.
          </li>
        </ul>
        <p>
          Les champs obligatoires sont signalés par un astérisque. Merci de ne pas indiquer dans le message libre de
          données sensibles (santé, opinions, etc.).
        </p>
      </LegalSection>

      <LegalSection index={3} title="Finalités et bases légales">
        <ul>
          <li>
            <strong>Répondre à vos demandes</strong> de contact, établir un devis et organiser un rendez-vous —
            mesures précontractuelles prises à votre demande (art. 6.1.b RGPD).
          </li>
          <li>
            <strong>Suivre la relation client</strong> et les interventions réalisées — exécution du contrat et
            obligations légales (facturation, garantie).
          </li>
          <li>
            <strong>Sécuriser le site</strong> (protection anti-spam des formulaires, limitation des requêtes) et{' '}
            <strong>mesurer sa fréquentation</strong> — intérêt légitime du garage (art. 6.1.f RGPD).
          </li>
        </ul>
      </LegalSection>

      <LegalSection index={4} title="Destinataires">
        <p>
          Vos données sont destinées uniquement au personnel du garage. Elles peuvent être traitées, pour le seul
          compte du garage, par ses prestataires techniques : l’hébergeur du site et de la base de données, le
          service d’envoi d’e-mails, et Make My Design pour la maintenance du site et la mesure d’audience. Ces
          prestataires sont tenus à la confidentialité et ne peuvent pas utiliser vos données pour leur propre
          compte.
        </p>
      </LegalSection>

      <LegalSection index={5} title="Durée de conservation">
        <ul>
          <li>
            <strong>Demandes sans suite</strong> (contact, devis, rendez-vous) : 3 ans à compter du dernier échange.
          </li>
          <li>
            <strong>Clients :</strong> pendant la relation commerciale puis 3 ans ; les pièces comptables (factures)
            sont conservées 10 ans conformément au Code de commerce.
          </li>
          <li>
            <strong>Données techniques de sécurité</strong> (journaux de connexion) : 12 mois maximum.
          </li>
        </ul>
      </LegalSection>

      <LegalSection index={6} title="Cookies et mesure d’audience">
        <p>Le site n’utilise aucun cookie publicitaire. Il fait appel à :</p>
        <ul>
          <li>
            <strong>Un outil de mesure d’audience</strong> fourni par Make My Design, qui comptabilise les pages vues
            de façon statistique afin d’améliorer le site.
          </li>
          <li>
            <strong>Une carte Google Maps intégrée</strong> sur la page d’accueil. Lorsqu’elle s’affiche, Google peut
            déposer ses propres cookies, régis par la{' '}
            <a href="https://policies.google.com/privacy?hl=fr" target="_blank" rel="noopener noreferrer">
              politique de confidentialité de Google
            </a>
            .
          </li>
          <li>
            <strong>Un cookie technique de session</strong>, réservé à l’espace d’administration du garage,
            strictement nécessaire à son fonctionnement.
          </li>
        </ul>
        <p>Vous pouvez à tout moment bloquer ou supprimer les cookies depuis les réglages de votre navigateur.</p>
      </LegalSection>

      <LegalSection index={7} title="Sécurité">
        <p>
          Les échanges avec le site sont chiffrés (HTTPS). L’accès aux demandes est limité au personnel du garage
          via un espace protégé par mot de passe, et les formulaires disposent d’une protection contre les envois
          automatisés.
        </p>
      </LegalSection>

      <LegalSection index={8} title="Vos droits">
        <p>
          Conformément au RGPD et à la loi Informatique et Libertés, vous disposez d’un droit d’accès, de
          rectification, d’effacement, de limitation et d’opposition au traitement de vos données, ainsi que d’un
          droit à la portabilité et du droit de définir des directives relatives à leur sort après votre décès.
        </p>
        <p>
          Pour les exercer, écrivez à <a href={`mailto:${SITE.email}`}>{SITE.email}</a> ou par courrier à{' '}
          {LEGAL.companyName}, {SITE.street}, {SITE.postalCode} {SITE.city}. Nous répondons dans un délai d’un mois.
        </p>
        <p>
          Si vous estimez que vos droits ne sont pas respectés, vous pouvez introduire une réclamation auprès de la
          CNIL (<a href="https://www.cnil.fr" target="_blank" rel="noopener noreferrer">cnil.fr</a>).
        </p>
      </LegalSection>

      <p className="border-t border-line pt-6 text-sm text-muted">
        Voir aussi nos <Link href="/mentions-legales" className="font-semibold text-brand hover:underline">mentions légales et conditions d’utilisation</Link>.
      </p>
    </LegalPage>
  );
}
