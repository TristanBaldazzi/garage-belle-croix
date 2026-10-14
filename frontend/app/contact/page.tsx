'use client';

import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useLinkParam } from '@/lib/useLinkParam';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { ArrowRight } from 'lucide-react';
import { contactsAPI, quotesAPI, offersAPI } from '@/lib/api';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import LoadingSpinner from '@/components/LoadingSpinner';
import RequestPageShell from '@/components/RequestPageShell';
import { formatPrice } from '@/components/OfferCard';
import { Field, FormStep, HoneypotField, PrivacyNote, SuccessPanel, inputClass } from '@/components/forms/FormParts';

interface ContactForm {
  name: string;
  email: string;
  phone?: string;
  subject?: string;
  licensePlate?: string;
  message: string;
  website?: string;
}

function ContactFormContent() {
  const offerId = useLinkParam('offer');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSent, setIsSent] = useState(false);
  const [offer, setOffer] = useState<any>(null);
  const [isLoadingOffer, setIsLoadingOffer] = useState(false);
  const { register, handleSubmit, formState: { errors }, reset, setValue } = useForm<ContactForm>();

  useEffect(() => {
    if (offerId) {
      loadOffer();
    }
  }, [offerId]);

  const loadOffer = async () => {
    setIsLoadingOffer(true);
    try {
      const offerData = await offersAPI.getById(offerId!);
      setOffer(offerData);
      setValue('message', `Bonjour,\n\nJe souhaite obtenir un devis pour l'offre : ${offerData.title}\n\n`);
    } catch (error) {
      toast.error('Erreur lors du chargement de l\'offre');
    } finally {
      setIsLoadingOffer(false);
    }
  };

  const onSubmit = async (data: ContactForm) => {
    setIsSubmitting(true);
    try {
      if (offerId) {
        await quotesAPI.create({
          name: data.name,
          email: data.email,
          phone: data.phone,
          licensePlate: data.licensePlate!,
          message: data.message,
          offerId: offerId,
          website: data.website
        });
      } else {
        await contactsAPI.create(data);
      }
      reset();
      setIsSent(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Erreur lors de l\'envoi');
    } finally {
      setIsSubmitting(false);
    }
  };

  const offerBadge = offerId && (
    <div className="mt-8">
      {isLoadingOffer ? (
        <LoadingSpinner size="small" showText={false} />
      ) : offer && (
        <div className="inline-flex flex-wrap items-center gap-x-5 gap-y-2 border border-white/15 bg-white/5 px-5 py-3">
          <span className="caps text-white/50">Offre</span>
          <span className="heading text-2xl">{offer.title}</span>
          <span className="btn-accent heading pointer-events-none h-auto px-4 py-1 text-xl tracking-normal">
            {offer.price === 0 ? 'Offert' : formatPrice(offer.price)}
          </span>
        </div>
      )}
    </div>
  );

  return (
    <RequestPageShell
      eyebrow={offerId ? 'Demande de devis' : 'Contact'}
      title={offerId ? 'J’en profite,' : 'Une question ?'}
      accent={offerId ? 'on vous rappelle.' : 'On vous répond.'}
      image={offerId ? '/images/offre-vidange.jpg' : '/images/atelier-pont.jpg'}
      subtitle={offerId
        ? 'Remplissez le formulaire, nous revenons vers vous rapidement avec un devis personnalisé.'
        : 'Une question sur une prestation ou un tarif ? Écrivez-nous ou appelez directement le garage.'}
      headerExtra={offerBadge}
      alternate="rendez-vous"
    >
      {isSent ? (
        <SuccessPanel
          title={offerId ? 'Demande de devis envoyée' : 'Message envoyé'}
          message="Merci ! Nous vous répondons dans les meilleurs délais."
          onReset={() => setIsSent(false)}
        />
      ) : (
        <>
          {!offerId && (
            <div className="mb-10 grid grid-cols-1 gap-px overflow-hidden border border-line bg-line sm:grid-cols-2">
              {[
                { href: '/rendez-vous', title: 'Prendre rendez-vous', text: 'Choisissez un jour et un créneau' },
                { href: '/devis', title: 'Demander un devis', text: 'Pneus, moto, entretien, réparation' },
              ].map((item) => (
                <Link key={item.href} href={item.href} className="group flex items-center justify-between gap-4 bg-stone/60 px-5 py-4 transition-colors hover:bg-stone">
                  <span>
                    <span className="heading block text-xl">{item.title}</span>
                    <span className="block text-sm text-muted">{item.text}</span>
                  </span>
                  <ArrowRight className="h-4 w-4 flex-shrink-0 text-brand transition-transform group-hover:translate-x-1" />
                </Link>
              ))}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="relative space-y-12">
            <FormStep number={1} title="Vos coordonnées">
              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                <Field label="Nom complet" htmlFor="name" required error={errors.name?.message}>
                  <input
                    type="text"
                    id="name"
                    autoComplete="name"
                    {...register('name', { required: 'Le nom est requis' })}
                    className={inputClass}
                    placeholder="Votre nom"
                  />
                </Field>
                <Field label="Email" htmlFor="email" required error={errors.email?.message}>
                  <input
                    type="email"
                    id="email"
                    autoComplete="email"
                    {...register('email', {
                      required: 'L\'email est requis',
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: 'Email invalide'
                      }
                    })}
                    className={inputClass}
                    placeholder="votre@email.com"
                  />
                </Field>
              </div>
              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                <Field label="Téléphone" htmlFor="phone">
                  <input
                    type="tel"
                    id="phone"
                    autoComplete="tel"
                    {...register('phone')}
                    className={inputClass}
                    placeholder="06 12 34 56 78"
                  />
                </Field>
                {offerId ? (
                  <Field label="Plaque d'immatriculation" htmlFor="licensePlate" required error={errors.licensePlate?.message}>
                    <input
                      type="text"
                      id="licensePlate"
                      {...register('licensePlate', {
                        required: 'La plaque d\'immatriculation est requise',
                        onChange: (e) => {
                          e.target.value = e.target.value.toUpperCase().replace(/\s/g, '');
                        }
                      })}
                      className={`${inputClass} font-mono uppercase`}
                      placeholder="AB-123-CD"
                      maxLength={9}
                    />
                  </Field>
                ) : (
                  <Field label="Sujet" htmlFor="subject">
                    <input
                      type="text"
                      id="subject"
                      {...register('subject')}
                      className={inputClass}
                      placeholder="Sujet de votre message"
                    />
                  </Field>
                )}
              </div>
            </FormStep>

            <FormStep number={2} title="Votre message">
              <Field label="Message" htmlFor="message" required error={errors.message?.message}>
                <textarea
                  id="message"
                  rows={6}
                  {...register('message', { required: 'Le message est requis' })}
                  className={`${inputClass} h-auto resize-none py-3`}
                  placeholder="Votre message…"
                />
              </Field>
            </FormStep>

            <button type="submit" disabled={isSubmitting} className="btn-accent h-14 w-full text-base">
              {isSubmitting ? 'Envoi en cours…' : offerId ? 'Envoyer ma demande de devis' : 'Envoyer le message'}
            </button>
            <PrivacyNote />
            <HoneypotField register={register} />
          </form>
        </>
      )}
    </RequestPageShell>
  );
}

export default function ContactPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-paper">
        <Header />
        <div className="flex min-h-[60vh] items-center justify-center">
          <LoadingSpinner size="large" />
        </div>
        <Footer />
      </div>
    }>
      <ContactFormContent />
    </Suspense>
  );
}
