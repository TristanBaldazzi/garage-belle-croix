'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useAuthStore } from '@/lib/store';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { Lock, Mail } from 'lucide-react';
import { adminButton, adminInput, adminLabel } from './admin/ui';

interface LoginForm {
  email: string;
  password: string;
}

export default function AdminLogin() {
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuthStore();
  const router = useRouter();
  const { register, handleSubmit, formState: { errors } } = useForm<LoginForm>();

  const onSubmit = async (data: LoginForm) => {
    setIsLoading(true);
    try {
      await login(data.email, data.password);
      toast.success('Connexion réussie');
      router.push('/admin');
    } catch (error: any) {
      toast.error(error.message || 'Erreur de connexion');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="grid min-h-screen bg-white lg:grid-cols-2">
      {/* Visuel de marque */}
      <div className="relative hidden overflow-hidden bg-ink lg:block">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/images/hero-atelier.jpg" alt="" className="absolute inset-0 h-full w-full object-cover opacity-40" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/60 to-ink/30" />
        <div className="absolute -top-6 right-16 flex h-[45%] gap-3" aria-hidden="true">
          <span className="block w-8 -skew-x-[22deg] bg-brand" />
          <span className="block w-8 -skew-x-[22deg] bg-brand-dark" />
          <span className="block w-8 -skew-x-[22deg] bg-brand-deeper" />
        </div>
        <div className="relative flex h-full flex-col justify-between p-12 text-white">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo/logo-belle-croix-horizontal-white.svg" alt="Garage de la Belle Croix" className="h-11 w-fit" />
          <div>
            <p className="font-display text-6xl font-extrabold uppercase italic leading-[0.9]">
              Espace
              <br />
              <span className="text-brand">garage.</span>
            </p>
            <p className="mt-4 max-w-sm text-white/60">Rendez-vous, devis, messages, offres et horaires du site, au même endroit.</p>
          </div>
        </div>
      </div>

      {/* Formulaire */}
      <div className="flex items-center justify-center bg-[#F5F5F3] p-6 lg:bg-white">
        <div className="w-full max-w-sm">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo/logo-belle-croix-horizontal-navy.svg" alt="Garage de la Belle Croix" className="mx-auto mb-10 h-10 lg:hidden" />
          <h1 className="font-display text-4xl font-extrabold uppercase italic leading-none">Connexion</h1>
          <p className="mt-2 text-sm text-gray-500">Accès réservé à l’équipe du garage.</p>

          <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-5">
            <div>
              <label htmlFor="email" className={adminLabel}>E-mail</label>
              <div className="relative">
                <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <input
                  id="email"
                  type="email"
                  autoComplete="username"
                  {...register('email', { required: 'Email requis' })}
                  className={`${adminInput} h-11 pl-9`}
                  placeholder="vous@exemple.fr"
                />
              </div>
              {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email.message}</p>}
            </div>

            <div>
              <label htmlFor="password" className={adminLabel}>Mot de passe</label>
              <div className="relative">
                <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <input
                  id="password"
                  type="password"
                  autoComplete="current-password"
                  {...register('password', { required: 'Mot de passe requis' })}
                  className={`${adminInput} h-11 pl-9`}
                  placeholder="••••••••"
                />
              </div>
              {errors.password && <p className="mt-1 text-xs text-red-600">{errors.password.message}</p>}
            </div>

            <button type="submit" disabled={isLoading} className={`${adminButton('accent')} h-11 w-full`}>
              {isLoading ? 'Connexion…' : 'Se connecter'}
            </button>
          </form>

          <a href="/" className="mt-8 block text-center text-sm text-gray-500 hover:text-ink">← Retour au site</a>
        </div>
      </div>
    </div>
  );
}
