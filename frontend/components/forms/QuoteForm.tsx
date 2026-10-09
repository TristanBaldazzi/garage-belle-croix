'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { Info } from 'lucide-react';
import { quotesAPI } from '@/lib/api';
import { SERVICES, getService } from '@/lib/site';
import { ChoiceTiles, Field, FormStep, HoneypotField, PrivacyNote, SERVICE_ICONS, SegmentedChoice, SuccessPanel, VehicleTypeToggle, inputClass } from './FormParts';

interface QuoteFormValues {
  service: string;
  vehicle?: string;
  licensePlate?: string;
  tireSize?: string;
  tireQuantity?: string;
  name: string;
  email: string;
  phone?: string;
  message?: string;
  website?: string;
}

export default function QuoteForm({ initialService }: { initialService?: string | null }) {
  const preset = getService(initialService);
  const [vehicleType, setVehicleType] = useState<'voiture' | 'moto'>(preset?.vehicleType || 'voiture');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSent, setIsSent] = useState(false);

  const { register, handleSubmit, watch, reset, setValue, getValues, formState: { errors } } = useForm<QuoteFormValues>({
    defaultValues: { service: preset?.id || '', tireQuantity: '4' },
  });

  const selectedService = getService(watch('service'));

  const changeVehicleType = (type: 'voiture' | 'moto') => {
    const current = getService(getValues('service'));
    if (current?.vehicleType && current.vehicleType !== type) setValue('service', '');
    setVehicleType(type);
  };

  register('service', { required: 'Choisissez une prestation' });

  const chooseService = (id: string) => {
    setValue('service', id, { shouldValidate: true });
    const service = getService(id);
    if (service?.vehicleType) setVehicleType(service.vehicleType);
  };

  const onSubmit = async (data: QuoteFormValues) => {
    setIsSubmitting(true);
    const serviceLabel = selectedService?.label || data.service;
    try {
      await quotesAPI.create({
        name: data.name,
        email: data.email,
        phone: data.phone,
        licensePlate: data.licensePlate,
        service: serviceLabel,
        vehicleType,
        vehicle: data.vehicle,
        tireSize: selectedService?.isTire ? data.tireSize : undefined,
        tireQuantity: selectedService?.isTire ? data.tireQuantity : undefined,
        message: data.message?.trim() || `Demande de devis : ${serviceLabel}`,
        website: data.website,
      });
      setIsSent(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Erreur lors de l'envoi. Vous pouvez aussi nous appeler.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSent) {
    return (
      <SuccessPanel
        title="Demande de devis envoyée !"
        message="Merci ! Nous étudions votre demande et revenons vers vous rapidement avec un prix."
        onReset={() => {
          reset({ service: '', tireQuantity: '4' });
          setIsSent(false);
        }}
      />
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="relative space-y-12" noValidate>

      <FormStep number={1} title="Votre besoin">
        <Field label="Type de véhicule" required>
          <VehicleTypeToggle value={vehicleType} onChange={changeVehicleType} />
        </Field>
        <Field label="Prestation" required error={errors.service?.message}>
          <ChoiceTiles
            value={watch('service')}
            onChange={chooseService}
            ariaLabel="Prestation"
            invalid={!!errors.service}
            options={SERVICES.filter((s) => !s.vehicleType || s.vehicleType === vehicleType).map((s) => ({
              id: s.id,
              label: s.label,
              Icon: SERVICE_ICONS[s.id],
            }))}
          />
        </Field>

        {selectedService?.isTire && (
          <div className="space-y-4 border-l-[3px] border-brand bg-stone p-5 animate-fade-in">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-2">
                <Field label="Dimension des pneus" htmlFor="tireSize" error={errors.tireSize?.message}>
                  <input
                    id="tireSize"
                    {...register('tireSize', {
                      required: selectedService.id === 'pneus' ? 'Indiquez la dimension pour un prix exact' : false,
                    })}
                    className={`${inputClass} font-mono`}
                    placeholder={vehicleType === 'moto' ? 'Ex : 180/55 ZR17' : 'Ex : 205/55 R16 91V'}
                  />
                </Field>
              </div>
              <Field label="Nombre de pneus">
                <SegmentedChoice
                  value={watch('tireQuantity') || '4'}
                  onChange={(n) => setValue('tireQuantity', n)}
                  ariaLabel="Nombre de pneus"
                  options={(['1', '2', '3', '4'] as const).map((n) => ({ id: n, label: n }))}
                />
              </Field>
            </div>
            <p className="flex items-start gap-2 text-sm text-muted">
              <Info className="w-4 h-4 mt-0.5 flex-shrink-0" />
              La dimension est inscrite sur le flanc du pneu (ex : 205/55 R16 91V).
              {selectedService.id === 'montage-pneus-client' && ' Vous avez acheté vos pneus en ligne ou ailleurs ? Nous les montons.'}
            </p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <Field label="Marque et modèle" htmlFor="vehicle">
            <input
              id="vehicle"
              {...register('vehicle')}
              className={inputClass}
              placeholder={vehicleType === 'moto' ? 'Ex : Honda CB500F' : 'Ex : Renault Clio IV'}
            />
          </Field>
          <Field label="Immatriculation" htmlFor="licensePlate">
            <input
              id="licensePlate"
              {...register('licensePlate', {
                onChange: (e) => { e.target.value = e.target.value.toUpperCase(); },
              })}
              className={`${inputClass} uppercase font-mono`}
              placeholder="AB-123-CD"
              maxLength={10}
            />
          </Field>
        </div>
        <Field label="Détails de la demande" htmlFor="message">
          <textarea
            id="message"
            rows={4}
            {...register('message')}
            className={`${inputClass} h-auto py-3 resize-none`}
            placeholder="Décrivez votre besoin : bruit, voyant allumé, kilométrage, marque de pneus souhaitée..."
          />
        </Field>
      </FormStep>

      <FormStep number={2} title="Vos coordonnées">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <Field label="Nom complet" htmlFor="name" required error={errors.name?.message}>
            <input id="name" autoComplete="name" {...register('name', { required: 'Le nom est requis' })} className={inputClass} placeholder="Votre nom" />
          </Field>
          <Field label="Téléphone" htmlFor="phone">
            <input id="phone" type="tel" autoComplete="tel" {...register('phone')} className={inputClass} placeholder="06 12 34 56 78" />
          </Field>
        </div>
        <Field label="Email" htmlFor="email" required error={errors.email?.message} hint="Nous vous envoyons le devis par email">
          <input
            id="email"
            type="email"
            autoComplete="email"
            {...register('email', {
              required: "L'email est requis",
              pattern: { value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i, message: 'Email invalide' },
            })}
            className={inputClass}
            placeholder="votre@email.com"
          />
        </Field>
      </FormStep>

      <button
        type="submit"
        disabled={isSubmitting}
        className="btn-accent h-14 w-full text-base"
      >
        {isSubmitting ? 'Envoi en cours...' : 'Recevoir mon devis gratuit'}
      </button>
      <PrivacyNote />
      <HoneypotField register={register} />
    </form>
  );
}
