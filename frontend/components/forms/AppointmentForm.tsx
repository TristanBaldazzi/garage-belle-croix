'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';

import { appointmentsAPI } from '@/lib/api';
import { SERVICES, getService } from '@/lib/site';
import { useOpeningHours, formatShortTime } from '@/lib/useOpeningHours';
import DayCalendar from './DayCalendar';
import { ChoiceTiles, Field, FormStep, HoneypotField, PrivacyNote, SERVICE_ICONS, SegmentedChoice, SuccessPanel, VehicleTypeToggle, inputClass } from './FormParts';

interface AppointmentFormValues {
  service: string;
  vehicle?: string;
  licensePlate?: string;
  preferredDate: string;
  preferredSlot: 'matin' | 'apres-midi';
  name: string;
  phone: string;
  email?: string;
  message?: string;
  website?: string;
}

// Limite entre le créneau du matin et celui de l'après-midi
const MIDDAY = '12:00';

const DAY_KEYS = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'] as const;

const toDateString = (date: Date) => {
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
};

const parseDate = (value: string) => {
  const [y, m, d] = value.split('-').map(Number);
  return new Date(y, m - 1, d);
};

export default function AppointmentForm({ initialService }: { initialService?: string | null }) {
  const preset = getService(initialService);
  const [vehicleType, setVehicleType] = useState<'voiture' | 'moto'>(preset?.vehicleType || 'voiture');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSent, setIsSent] = useState(false);
  const { hours } = useOpeningHours();

  const { register, handleSubmit, watch, reset, setValue, getValues, formState: { errors } } = useForm<AppointmentFormValues>({
    defaultValues: { service: preset?.id || '', preferredSlot: 'matin' },
  });

  const selectedSlot = watch('preferredSlot');
  const selectedDate = watch('preferredDate');
  const dayHours = selectedDate && hours ? hours[DAY_KEYS[parseDate(selectedDate).getDay()]] : null;

  // Créneaux possibles selon le jour choisi : pas de matin si midi est passé aujourd'hui,
  // pas d'après-midi si le garage ferme à midi (ex. samedi)
  const slots = (() => {
    if (!selectedDate || !dayHours || dayHours.isClosed) return { matin: true, 'apres-midi': true, reason: '' };
    const now = new Date();
    const nowTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    const isToday = selectedDate === toDateString(now);
    const morningOpen = dayHours.open < MIDDAY;
    const matin = morningOpen && (!isToday || nowTime < MIDDAY);
    const afternoon = dayHours.close > MIDDAY;
    let reason = '';
    if (!afternoon) reason = `Le garage ferme à ${formatShortTime(dayHours.close)} ce jour-là : créneau du matin uniquement.`;
    else if (!morningOpen) reason = `Le garage ouvre à ${formatShortTime(dayHours.open)} ce jour-là : créneau de l’après-midi uniquement.`;
    else if (!matin) reason = 'Il est déjà plus de midi : seul l’après-midi est possible aujourd’hui.';
    return { matin, 'apres-midi': afternoon, reason };
  })();

  // Bascule automatiquement sur l'autre créneau si celui choisi n'est plus possible
  useEffect(() => {
    if (!slots[selectedSlot]) {
      const other = selectedSlot === 'matin' ? 'apres-midi' : 'matin';
      if (slots[other]) setValue('preferredSlot', other);
    }
  }, [selectedDate, selectedSlot, slots.matin, slots['apres-midi']]); // eslint-disable-line react-hooks/exhaustive-deps

  const changeVehicleType = (type: 'voiture' | 'moto') => {
    const current = getService(getValues('service'));
    if (current?.vehicleType && current.vehicleType !== type) setValue('service', '');
    setVehicleType(type);
  };

  register('service', { required: 'Choisissez une prestation' });
  register('preferredDate', {
    required: 'Choisissez un jour',
    validate: (value) => (value < toDateString(new Date()) ? 'La date est déjà passée' : true),
  });

  const chooseService = (id: string) => {
    setValue('service', id, { shouldValidate: true });
    const service = getService(id);
    if (service?.vehicleType) setVehicleType(service.vehicleType);
  };

  const onSubmit = async (data: AppointmentFormValues) => {
    setIsSubmitting(true);
    try {
      await appointmentsAPI.create({
        ...data,
        service: getService(data.service)?.label || data.service,
        vehicleType,
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
        title="Demande de rendez-vous envoyée !"
        message="Merci ! Le garage vous rappelle rapidement pour confirmer le jour et l'heure de votre rendez-vous."
        onReset={() => {
          reset({ service: '', preferredSlot: 'matin' });
          setIsSent(false);
        }}
      />
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="relative space-y-12" noValidate>

      <FormStep number={1} title="Votre véhicule et la prestation">
        <Field label="Type de véhicule" required>
          <VehicleTypeToggle value={vehicleType} onChange={changeVehicleType} />
        </Field>
        <Field label="Prestation souhaitée" required error={errors.service?.message}>
          <ChoiceTiles
            value={watch('service')}
            onChange={chooseService}
            ariaLabel="Prestation souhaitée"
            invalid={!!errors.service}
            options={SERVICES.filter((s) => !s.vehicleType || s.vehicleType === vehicleType).map((s) => ({
              id: s.id,
              label: s.label,
              Icon: SERVICE_ICONS[s.id],
            }))}
          />
        </Field>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <Field label="Marque et modèle" htmlFor="vehicle">
            <input
              id="vehicle"
              {...register('vehicle')}
              className={inputClass}
              placeholder={vehicleType === 'moto' ? 'Ex : Yamaha MT-07' : 'Ex : Peugeot 308'}
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
      </FormStep>

      <FormStep number={2} title="Date souhaitée">
        <Field
          label="Jour"
          required
          error={errors.preferredDate?.message}
          hint={dayHours && !dayHours.isClosed ? `Horaires ce jour : ${formatShortTime(dayHours.open)} – ${formatShortTime(dayHours.close)}` : 'Réservable jusqu’à 3 mois à l’avance, jours d’ouverture uniquement'}
        >
          <DayCalendar
            value={selectedDate}
            onChange={(value) => setValue('preferredDate', value, { shouldValidate: true })}
            hours={hours}
            invalid={!!errors.preferredDate}
          />
        </Field>
        <div className="md:max-w-md">
          <Field label="Créneau" required hint={slots.reason || undefined}>
            <SegmentedChoice
              value={selectedSlot}
              onChange={(slot) => setValue('preferredSlot', slot)}
              ariaLabel="Créneau souhaité"
              options={[
                { id: 'matin', label: 'Matin', disabled: !slots.matin, hint: slots.reason },
                { id: 'apres-midi', label: 'Après-midi', disabled: !slots['apres-midi'], hint: slots.reason },
              ]}
            />
          </Field>
        </div>
      </FormStep>

      <FormStep number={3} title="Vos coordonnées">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <Field label="Nom complet" htmlFor="name" required error={errors.name?.message}>
            <input id="name" autoComplete="name" {...register('name', { required: 'Le nom est requis' })} className={inputClass} placeholder="Votre nom" />
          </Field>
          <Field label="Téléphone" htmlFor="phone" required error={errors.phone?.message} hint="Pour vous confirmer le rendez-vous">
            <input
              id="phone"
              type="tel"
              autoComplete="tel"
              {...register('phone', {
                required: 'Le téléphone est requis pour confirmer le rendez-vous',
                pattern: { value: /^[+\d][\d\s.-]{8,}$/, message: 'Numéro invalide' },
              })}
              className={inputClass}
              placeholder="06 12 34 56 78"
            />
          </Field>
        </div>
        <Field label="Email" htmlFor="email" error={errors.email?.message}>
          <input
            id="email"
            type="email"
            autoComplete="email"
            {...register('email', { pattern: { value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i, message: 'Email invalide' } })}
            className={inputClass}
            placeholder="votre@email.com"
          />
        </Field>
        <Field label="Précisions (facultatif)" htmlFor="message">
          <textarea
            id="message"
            rows={4}
            {...register('message')}
            className={`${inputClass} h-auto py-3 resize-none`}
            placeholder="Symptômes, kilométrage, dimension de vos pneus..."
          />
        </Field>
      </FormStep>

      <button
        type="submit"
        disabled={isSubmitting}
        className="btn-accent h-14 w-full text-base"
      >
        {isSubmitting ? 'Envoi en cours...' : 'Demander ce rendez-vous'}
      </button>
      <PrivacyNote prefix="Le rendez-vous est confirmé par le garage par téléphone." />
      <HoneypotField register={register} />
    </form>
  );
}
