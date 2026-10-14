'use client';

import { Suspense } from 'react';
import { useLinkParam } from '@/lib/useLinkParam';
import RequestPageShell from '@/components/RequestPageShell';
import QuoteForm from '@/components/forms/QuoteForm';
import LoadingSpinner from '@/components/LoadingSpinner';

function QuoteFormWithParams() {
  const service = useLinkParam('service');
  // key : le formulaire repart de zéro une fois le service lu dans l'ancre (après hydratation)
  return <QuoteForm key={service ?? ''} initialService={service} />;
}

export default function DevisPage() {
  return (
    <RequestPageShell
      eyebrow="Devis gratuit"
      title="Votre devis,"
      accent="sans surprise."
      subtitle="Entretien, réparation, pneus ou vidange : décrivez votre besoin, on vous répond rapidement avec un prix clair."
      highlights={['Gratuit et sans engagement', 'Prix détaillé pièce par pièce', 'Réponse rapide']}
      image="/images/service-reparation.jpg"
      alternate="rendez-vous"
    >
      <Suspense fallback={<div className="flex justify-center py-12"><LoadingSpinner size="medium" /></div>}>
        <QuoteFormWithParams />
      </Suspense>
    </RequestPageShell>
  );
}
