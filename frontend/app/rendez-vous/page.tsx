'use client';

import { Suspense } from 'react';
import { useLinkParam } from '@/lib/useLinkParam';
import RequestPageShell from '@/components/RequestPageShell';
import AppointmentForm from '@/components/forms/AppointmentForm';
import LoadingSpinner from '@/components/LoadingSpinner';

function AppointmentFormWithParams() {
  const service = useLinkParam('service');
  // key : le formulaire repart de zéro une fois le service lu dans l'ancre (après hydratation)
  return <AppointmentForm key={service ?? ''} initialService={service} />;
}

export default function RendezVousPage() {
  return (
    <RequestPageShell
      eyebrow="Rendez-vous en ligne"
      title="Prenez"
      accent="rendez-vous."
      subtitle="Choisissez votre prestation et le jour qui vous arrange. On vous rappelle pour confirmer le créneau."
      highlights={['Toutes marques', 'Créneaux rapides', 'Sans engagement']}
      image="/images/service-entretien.jpg"
      alternate="devis"
    >
      <Suspense fallback={<div className="flex justify-center py-12"><LoadingSpinner size="medium" /></div>}>
        <AppointmentFormWithParams />
      </Suspense>
    </RequestPageShell>
  );
}
