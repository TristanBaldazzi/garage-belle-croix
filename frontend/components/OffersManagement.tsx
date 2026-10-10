'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { offersAPI, getOfferImageUrl } from '@/lib/api';
import toast from 'react-hot-toast';
import { format } from 'date-fns';
import { Plus, Edit, Trash2, X, Save, Package, Image as ImageIcon, Upload, Check } from 'lucide-react';
import Image from 'next/image';
import { AdminCard, AdminPageHeader, AdminSpinner, Badge, EmptyState, IconButton, adminButton, adminInput, adminLabel } from './admin/ui';

interface Offer {
  _id: string;
  title: string;
  description: string;
  price: number;
  originalPrice?: number;
  isPromotion: boolean;
  promotionPercentage?: number;
  isActive: boolean;
  category: string;
  image?: string;
  validUntil?: string | null;
  createdAt: string;
}

interface OfferForm {
  title: string;
  description: string;
  price: number;
  originalPrice?: number;
  category: string;
  isActive: boolean;
  image?: string;
  oldImage?: string;
  validUntil?: string;
}

export default function OffersManagement() {
  const [offers, setOffers] = useState<Offer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingOffer, setEditingOffer] = useState<Offer | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const { register, handleSubmit, formState: { errors }, reset, setValue, watch } = useForm<OfferForm>({
    defaultValues: {
      isActive: true
    }
  });

  const categories = [
    { value: 'entretien', label: 'Entretien' },
    { value: 'reparation', label: 'Réparation' },
    { value: 'pneu', label: 'Pneus' },
    { value: 'vidange', label: 'Vidange' },
    { value: 'autre', label: 'Autre' },
  ];


  useEffect(() => {
    loadOffers();
  }, []);

  const loadOffers = async () => {
    try {
      setIsLoading(true);
      const data = await offersAPI.getAllAdmin();
      setOffers(data);
    } catch (error) {
      toast.error('Erreur lors du chargement des offres');
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = async (data: OfferForm) => {
    try {
      setIsUploading(true);
      // Garde l'image actuelle, sauf si elle a été retirée dans le formulaire (aperçu vidé)
      let imageUrl = imagePreview ? editingOffer?.image || '' : '';
      if (!imagePreview && editingOffer?.image) {
        data.oldImage = editingOffer.image;
      }

      // Upload image if a new one is selected
      if (selectedImage) {
        const uploadResult = await offersAPI.uploadImage(selectedImage);
        imageUrl = uploadResult.imageUrl;
        
        // If editing and had an old image, mark it for deletion
        if (editingOffer?.image) {
          data.oldImage = editingOffer.image;
        }
      }

      const offerData = {
        ...data,
        image: imageUrl,
        validUntil: data.validUntil || null
      };

      if (editingOffer) {
        await offersAPI.update(editingOffer._id, offerData);
        toast.success('Offre mise à jour');
      } else {
        await offersAPI.create(offerData);
        toast.success('Offre créée');
      }
      
      reset();
      setEditingOffer(null);
      setSelectedImage(null);
      setImagePreview(null);
      setIsCategoryOpen(false);
      setShowForm(false);
      loadOffers();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Erreur lors de la sauvegarde');
    } finally {
      setIsUploading(false);
    }
  };

  const handleEdit = (offer: Offer) => {
    setEditingOffer(offer);
    setValue('title', offer.title);
    setValue('description', offer.description);
    setValue('price', offer.price);
    setValue('originalPrice', offer.originalPrice || 0);
    setValue('category', offer.category);
    setValue('isActive', offer.isActive);
    setValue('validUntil', offer.validUntil ? offer.validUntil.slice(0, 10) : '');
    setImagePreview(offer.image ? getOfferImageUrl(offer.image) : null);
    setSelectedImage(null);
    setIsCategoryOpen(false);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette offre ?')) return;
    
    try {
      await offersAPI.delete(id);
      toast.success('Offre supprimée');
      loadOffers();
    } catch (error) {
      toast.error('Erreur lors de la suppression');
    }
  };

  const handleNewOffer = () => {
    reset({ isActive: true });
    setEditingOffer(null);
    setSelectedImage(null);
    setImagePreview(null);
    setIsCategoryOpen(false);
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingOffer(null);
    setSelectedImage(null);
    setImagePreview(null);
    setIsCategoryOpen(false);
    reset();
  };

  const categoryLabel = (value: string) => categories.find((c) => c.value === value)?.label || value;

  return (
    <div>
      <AdminPageHeader
        title="Offres"
        subtitle="Les promotions affichées sur l’accueil et la page Offres du site."
        actions={
          !showForm && (
            <button onClick={handleNewOffer} className={adminButton('accent')}>
              <Plus className="h-4 w-4" /> Nouvelle offre
            </button>
          )
        }
      />

      {showForm && (
        <AdminCard className="mb-6">
          <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
            <h3 className="font-semibold">{editingOffer ? 'Modifier l’offre' : 'Nouvelle offre'}</h3>
            <IconButton icon={X} label="Fermer" onClick={closeForm} />
          </div>
          <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 gap-6 p-6 lg:grid-cols-3">
            <div className="space-y-5 lg:col-span-2">
              <div>
                <label className={adminLabel}>Titre *</label>
                <input type="text" {...register('title', { required: 'Titre requis' })} className={adminInput} placeholder="Ex : Vidange + filtre à huile" />
                {errors.title && <p className="mt-1 text-xs text-red-600">{errors.title.message}</p>}
              </div>

              <div>
                <label className={adminLabel}>Catégorie *</label>
                <input type="hidden" {...register('category', { required: 'Catégorie requise' })} />
                <div className="flex flex-wrap gap-2">
                  {categories.map((category) => {
                    const active = watch('category') === category.value;
                    return (
                      <button
                        key={category.value}
                        type="button"
                        onClick={() => setValue('category', category.value, { shouldValidate: true })}
                        className={`flex items-center gap-1.5 rounded-lg border px-3 py-2 text-sm font-medium transition-colors ${
                          active ? 'border-ink bg-ink text-white' : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                        }`}
                      >
                        {active && <Check className="h-3.5 w-3.5" />}
                        {category.label}
                      </button>
                    );
                  })}
                </div>
                {errors.category && <p className="mt-1 text-xs text-red-600">{errors.category.message}</p>}
              </div>

              <div>
                <label className={adminLabel}>Description *</label>
                <textarea
                  rows={4}
                  {...register('description', { required: 'Description requise' })}
                  className={`${adminInput} h-auto resize-none py-2.5`}
                  placeholder="Ce qui est inclus, conditions…"
                />
                {errors.description && <p className="mt-1 text-xs text-red-600">{errors.description.message}</p>}
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div>
                  <label className={adminLabel}>Prix (€) *</label>
                  <input type="number" step="0.01" {...register('price', { required: 'Prix requis', min: 0 })} className={adminInput} />
                  <p className="mt-1 text-xs text-gray-400">0 = affiché « Offert »</p>
                </div>
                <div>
                  <label className={adminLabel}>Prix barré (€)</label>
                  <input type="number" step="0.01" {...register('originalPrice', { min: 0 })} className={adminInput} />
                  <p className="mt-1 text-xs text-gray-400">Vide si pas de promo</p>
                </div>
                <div>
                  <label className={adminLabel}>Valable jusqu’au</label>
                  <input type="date" {...register('validUntil')} className={adminInput} />
                  <p className="mt-1 text-xs text-gray-400">Masquée après cette date</p>
                </div>
              </div>

              <label className="flex w-fit cursor-pointer items-center gap-3">
                <input type="checkbox" {...register('isActive')} className="peer sr-only" />
                <span className="relative h-6 w-11 rounded-full bg-gray-300 transition-colors after:absolute after:left-0.5 after:top-0.5 after:h-5 after:w-5 after:rounded-full after:bg-white after:shadow after:transition-transform peer-checked:bg-emerald-500 peer-checked:after:translate-x-5" />
                <span className="text-sm font-medium">{watch('isActive') ? 'Visible sur le site' : 'Masquée du site'}</span>
              </label>
            </div>

            <div>
              <label className={adminLabel}>Photo</label>
              {imagePreview ? (
                <div className="relative aspect-[16/10] overflow-hidden rounded-lg border border-gray-200">
                  <Image src={imagePreview} alt="Aperçu" fill className="object-cover" />
                  <button
                    type="button"
                    onClick={() => {
                      setImagePreview(null);
                      setSelectedImage(null);
                    }}
                    className="absolute right-2 top-2 rounded-lg bg-black/70 p-1.5 text-white transition hover:bg-black"
                    aria-label="Retirer la photo"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ) : (
                <label className="flex aspect-[16/10] cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-200 bg-gray-50 px-4 text-center transition hover:border-gray-300 hover:bg-gray-100">
                  <Upload className="mb-2 h-6 w-6 text-gray-400" />
                  <span className="text-sm font-medium text-gray-700">Ajouter une photo</span>
                  <span className="mt-1 text-xs text-gray-400">PNG, JPG, WEBP · 5 Mo max</span>
                  <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
                </label>
              )}
              <p className="mt-2 text-xs text-gray-400">Sans photo, une image adaptée à la catégorie est utilisée.</p>
            </div>

            <div className="flex gap-2 border-t border-gray-100 pt-5 lg:col-span-3">
              <button type="submit" disabled={isUploading} className={adminButton('primary')}>
                <Save className="h-4 w-4" />
                {isUploading ? 'Enregistrement…' : editingOffer ? 'Enregistrer' : 'Créer l’offre'}
              </button>
              <button type="button" onClick={closeForm} className={adminButton('secondary')}>
                Annuler
              </button>
            </div>
          </form>
        </AdminCard>
      )}

      <AdminCard className="overflow-hidden">
        {isLoading ? (
          <AdminSpinner label="Chargement des offres…" />
        ) : offers.length === 0 ? (
          <EmptyState icon={Package} title="Aucune offre" text="Créez une première offre pour l’afficher sur le site." />
        ) : (
          <ul className="divide-y divide-gray-100">
            {offers.map((offer) => {
              const expired = !!offer.validUntil && new Date(offer.validUntil) < new Date(new Date().toDateString());
              return (
                <li key={offer._id} className="flex flex-col gap-4 px-5 py-4 sm:flex-row sm:items-center">
                  <div className="relative h-16 w-24 flex-shrink-0 overflow-hidden rounded-lg bg-gray-100">
                    {offer.image ? (
                      <Image src={getOfferImageUrl(offer.image)} alt="" fill sizes="96px" className="object-cover" />
                    ) : (
                      <span className="flex h-full items-center justify-center">
                        <ImageIcon className="h-5 w-5 text-gray-300" />
                      </span>
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="truncate font-semibold">{offer.title}</p>
                      <Badge tone="neutral">{categoryLabel(offer.category)}</Badge>
                      {!offer.isActive ? (
                        <Badge tone="muted">Masquée</Badge>
                      ) : expired ? (
                        <Badge tone="warning">Expirée</Badge>
                      ) : (
                        <Badge tone="success">En ligne</Badge>
                      )}
                    </div>
                    <p className="mt-1 text-sm text-gray-500">
                      {offer.validUntil ? `Jusqu’au ${format(new Date(offer.validUntil), 'dd/MM/yyyy')}` : 'Sans date de fin'}
                      {' · '}créée le {format(new Date(offer.createdAt), 'dd/MM/yyyy')}
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      {offer.isPromotion && offer.originalPrice ? (
                        <p className="text-xs text-gray-400">
                          <span className="line-through">{offer.originalPrice.toFixed(2)} €</span>
                          <span className="ml-1.5 font-semibold text-brand">-{offer.promotionPercentage}%</span>
                        </p>
                      ) : null}
                      <p className="font-display text-2xl font-extrabold italic leading-none">
                        {offer.price === 0 ? 'Offert' : `${offer.price.toFixed(2)} €`}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <IconButton icon={Edit} label="Modifier" onClick={() => handleEdit(offer)} />
                      <IconButton icon={Trash2} label="Supprimer" tone="danger" onClick={() => handleDelete(offer._id)} />
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </AdminCard>
    </div>
  );
}
