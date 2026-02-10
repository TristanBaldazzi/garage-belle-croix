'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { contactsAPI, quotesAPI, offersAPI } from '@/lib/api';
import toast from 'react-hot-toast';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import LoadingSpinner from '@/components/LoadingSpinner';
import { Send, Phone, Mail, MapPin, Clock, Tag } from 'lucide-react';
import { useOpeningHours } from '@/lib/useOpeningHours';

interface ContactForm {
  name: string;
  email: string;
  phone?: string;
  subject?: string;
  licensePlate?: string;
  message: string;
}

function ContactFormContent() {
  const searchParams = useSearchParams();
  const offerId = searchParams.get('offer');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [offer, setOffer] = useState<any>(null);
  const [isLoadingOffer, setIsLoadingOffer] = useState(false);
  const { register, handleSubmit, formState: { errors }, reset, setValue } = useForm<ContactForm>();
  const { getGroupedHours, isLoading: isLoadingHours } = useOpeningHours();
  const groupedHours = getGroupedHours();

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
          offerId: offerId
        });
        toast.success('Votre demande de devis a été envoyée avec succès !');
      } else {
        await contactsAPI.create(data);
        toast.success('Votre message a été envoyé avec succès !');
      }
      reset();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Erreur lors de l\'envoi');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Page Header */}
      <section className="bg-gradient-to-br from-black via-gray-900 to-black text-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-4">
              {offerId ? 'Demande de devis' : 'Contactez-nous'}
            </h1>
            <p className="text-xl text-gray-300">
              {offerId 
                ? 'Remplissez le formulaire pour obtenir un devis personnalisé'
                : 'Une question ? Un devis ? N\'hésitez pas à nous contacter'
              }
            </p>
            {isLoadingOffer ? (
              <div className="mt-6 flex justify-center">
                <LoadingSpinner size="medium" showText={false} />
              </div>
            ) : offer && (
              <div className="mt-6 inline-flex items-center gap-3 bg-white/10 backdrop-blur-sm px-6 py-3 rounded-lg border border-white/20">
                <Tag className="w-5 h-5" />
                <span className="font-bold">{offer.title}</span>
                {offer.price && (
                  <span className="text-gray-300">- {offer.price.toFixed(2)}€</span>
                )}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 max-w-7xl mx-auto">
            {/* Contact Info */}
            <div className="lg:col-span-1 space-y-8">
              <div>
                <h2 className="text-2xl font-bold mb-6">Informations de contact</h2>
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-black rounded-lg flex items-center justify-center flex-shrink-0">
                      <Phone className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-bold mb-1">Téléphone</h3>
                      <p className="text-gray-600">0609369490</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-black rounded-lg flex items-center justify-center flex-shrink-0">
                      <Mail className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-bold mb-1">Email</h3>
                      <p className="text-gray-600">contact@garage-belle-croix.fr</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-black rounded-lg flex items-center justify-center flex-shrink-0">
                      <MapPin className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-bold mb-1">Adresse</h3>
                      <p className="text-gray-600">1 Rue inore Fabbri<br />57365 Ennery</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-black rounded-lg flex items-center justify-center flex-shrink-0">
                      <Clock className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-bold mb-1">Horaires</h3>
                      {isLoadingHours ? (
                        <div className="flex items-center gap-2">
                          <LoadingSpinner size="small" showText={false} />
                          <p className="text-gray-600 text-sm">Chargement...</p>
                        </div>
                      ) : (
                        <p className="text-gray-600 text-sm">
                          {groupedHours.map((group, index) => (
                            <span key={index}>
                              {group.label}: {group.hours}
                              {index < groupedHours.length - 1 && <br />}
                            </span>
                          ))}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-lg p-8 border border-gray-200">
                <h2 className="text-2xl font-bold mb-6">
                  {offerId ? 'Formulaire de demande de devis' : 'Envoyez-nous un message'}
                </h2>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="name" className="block text-sm font-bold mb-2">
                        Nom complet *
                      </label>
                      <input
                        type="text"
                        id="name"
                        {...register('name', { required: 'Le nom est requis' })}
                        className="w-full border-2 border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-black focus:border-black transition"
                        placeholder="Votre nom"
                      />
                      {errors.name && (
                        <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
                      )}
                    </div>

                    <div>
                      <label htmlFor="email" className="block text-sm font-bold mb-2">
                        Email *
                      </label>
                      <input
                        type="email"
                        id="email"
                        {...register('email', { 
                          required: 'L\'email est requis',
                          pattern: {
                            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                            message: 'Email invalide'
                          }
                        })}
                        className="w-full border-2 border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-black focus:border-black transition"
                        placeholder="votre@email.com"
                      />
                      {errors.email && (
                        <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="phone" className="block text-sm font-bold mb-2">
                        Téléphone
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        {...register('phone')}
                        className="w-full border-2 border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-black focus:border-black transition"
                        placeholder="0609369490"
                      />
                    </div>

                    {offerId && (
                      <div>
                        <label htmlFor="licensePlate" className="block text-sm font-bold mb-2">
                          Plaque d'immatriculation *
                        </label>
                        <input
                          type="text"
                          id="licensePlate"
                          {...register('licensePlate', { 
                            required: offerId ? 'La plaque d\'immatriculation est requise' : false,
                            onChange: (e) => {
                              e.target.value = e.target.value.toUpperCase().replace(/\s/g, '');
                            }
                          })}
                          className="w-full border-2 border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-black focus:border-black transition uppercase font-mono"
                          placeholder="AB-123-CD"
                          style={{ textTransform: 'uppercase' }}
                          maxLength={9}
                        />
                        {errors.licensePlate && (
                          <p className="text-red-500 text-sm mt-1">{errors.licensePlate.message}</p>
                        )}
                      </div>
                    )}

                    {!offerId && (
                      <div>
                        <label htmlFor="subject" className="block text-sm font-bold mb-2">
                          Sujet
                        </label>
                        <input
                          type="text"
                          id="subject"
                          {...register('subject')}
                          className="w-full border-2 border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-black focus:border-black transition"
                          placeholder="Sujet de votre message"
                        />
                      </div>
                    )}
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-sm font-bold mb-2">
                      Message *
                    </label>
                    <textarea
                      id="message"
                      rows={6}
                      {...register('message', { required: 'Le message est requis' })}
                      className="w-full border-2 border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-black focus:border-black transition resize-none"
                      placeholder="Votre message..."
                    />
                    {errors.message && (
                      <p className="text-red-500 text-sm mt-1">{errors.message.message}</p>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="group w-full bg-black text-white py-4 font-bold text-lg rounded-lg hover:bg-gray-800 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
                  >
                    {isSubmitting ? (
                      'Envoi en cours...'
                    ) : (
                      <>
                        Envoyer le message
                        <Send className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

export default function ContactPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-white">
        <Header />
        <div className="flex items-center justify-center min-h-[60vh]">
          <LoadingSpinner size="large" />
        </div>
        <Footer />
      </div>
    }>
      <ContactFormContent />
    </Suspense>
  );
}
