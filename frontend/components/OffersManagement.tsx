'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { offersAPI, getOfferImageUrl } from '@/lib/api';
import toast from 'react-hot-toast';
import { format } from 'date-fns';
import { Plus, Edit, Trash2, X, Save, Package, Image as ImageIcon, Upload, ChevronDown, Check, Minus } from 'lucide-react';
import Image from 'next/image';

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

  const selectedCategory = categories.find(cat => cat.value === watch('category'));

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
      let imageUrl = editingOffer?.image || '';

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

  if (isLoading) {
    return (
      <div className="text-center py-12">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
        <p className="mt-4 text-gray-600">Chargement des offres...</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-3xl font-bold mb-2">Gestion des offres</h2>
          <p className="text-gray-600">Créez et gérez vos offres et promotions</p>
        </div>
        <button
          onClick={handleNewOffer}
          className="flex items-center gap-2 bg-black text-white px-6 py-3 font-bold rounded-lg hover:bg-gray-800 transition-all duration-300 shadow-lg hover:shadow-xl"
        >
          <Plus className="w-5 h-5" />
          Nouvelle offre
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-lg shadow-xl border border-gray-200 p-8 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-bold">
              {editingOffer ? 'Modifier l\'offre' : 'Nouvelle offre'}
            </h3>
            <button
              type="button"
              onClick={() => {
                setShowForm(false);
                setEditingOffer(null);
                setSelectedImage(null);
                setImagePreview(null);
                setIsCategoryOpen(false);
                reset();
              }}
              className="text-gray-400 hover:text-gray-600 transition"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold mb-2">Titre *</label>
                <input
                  type="text"
                  {...register('title', { required: 'Titre requis' })}
                  className="w-full border-2 border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-black focus:border-black transition"
                />
                {errors.title && (
                  <p className="text-red-500 text-sm">{errors.title.message}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-black mb-2 uppercase tracking-wide text-gray-700">Catégorie *</label>
                <div className="relative">
                  <input
                    type="hidden"
                    {...register('category', { required: 'Catégorie requise' })}
                  />
                  <button
                    type="button"
                    onClick={() => setIsCategoryOpen(!isCategoryOpen)}
                    className={`w-full border-2 rounded-lg px-4 py-3 pr-10 focus:outline-none focus:ring-2 focus:ring-black transition-all bg-white font-bold text-black cursor-pointer hover:border-gray-300 hover:shadow-sm ${
                      isCategoryOpen ? 'border-black shadow-md' : 'border-gray-200'
                    } ${errors.category ? 'border-red-500' : ''}`}
                  >
                    <div className="flex items-center justify-between">
                      <span className={selectedCategory ? 'text-black' : 'text-gray-400'}>
                        {selectedCategory ? selectedCategory.label : 'Sélectionner une catégorie'}
                      </span>
                      <ChevronDown className={`w-5 h-5 text-gray-500 transition-transform ${isCategoryOpen ? 'rotate-180' : ''}`} />
                    </div>
                  </button>
                  
                  {isCategoryOpen && (
                    <>
                      <div
                        className="fixed inset-0 z-10"
                        onClick={() => setIsCategoryOpen(false)}
                      ></div>
                      <div className="absolute z-20 w-full mt-2 bg-white border-2 border-black rounded-lg shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                        {categories.map((category, index) => (
                          <button
                            key={category.value}
                            type="button"
                            onClick={() => {
                              setValue('category', category.value);
                              setIsCategoryOpen(false);
                            }}
                            className={`w-full px-4 py-3.5 text-left font-bold transition-all flex items-center justify-between group ${
                              watch('category') === category.value
                                ? 'bg-black text-white'
                                : 'text-black hover:bg-gray-50 hover:pl-5'
                            } ${index < categories.length - 1 ? 'border-b border-gray-200' : ''}`}
                          >
                            <span className="transition-all">{category.label}</span>
                            {watch('category') === category.value ? (
                              <Check className="w-5 h-5 text-white" />
                            ) : (
                              <div className="w-5 h-5 opacity-0 group-hover:opacity-100 transition-opacity">
                                <ChevronDown className="w-5 h-5 text-gray-400 rotate-[-90deg]" />
                              </div>
                            )}
                          </button>
                        ))}
                      </div>
                    </>
                  )}
                </div>
                {errors.category && (
                  <p className="text-red-500 text-sm mt-1">{errors.category.message}</p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold mb-2">Description *</label>
              <textarea
                rows={4}
                {...register('description', { required: 'Description requise' })}
                className="w-full border-2 border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-black focus:border-black transition resize-none"
              />
              {errors.description && (
                <p className="text-red-500 text-sm">{errors.description.message}</p>
              )}
            </div>

            {/* Image Upload */}
            <div>
              <label className="block text-sm font-bold mb-2">Image</label>
              <div className="space-y-4">
                {imagePreview && (
                  <div className="relative w-full h-48 rounded-lg overflow-hidden border-2 border-gray-200">
                    <Image
                      src={imagePreview}
                      alt="Preview"
                      fill
                      className="object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setImagePreview(null);
                        setSelectedImage(null);
                      }}
                      className="absolute top-2 right-2 bg-black/70 text-white p-2 rounded-lg hover:bg-black transition"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                )}
                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <Upload className="w-8 h-8 mb-2 text-gray-400" />
                    <p className="mb-2 text-sm text-gray-500">
                      <span className="font-semibold">Cliquez pour uploader</span> ou glissez-déposez
                    </p>
                    <p className="text-xs text-gray-500">PNG, JPG, WEBP (MAX. 5MB)</p>
                  </div>
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={handleImageChange}
                  />
                </label>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-bold mb-2">Prix (€) *</label>
                  <input
                  type="number"
                  step="0.01"
                  {...register('price', { required: 'Prix requis', min: 0 })}
                  className="w-full border-2 border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-black focus:border-black transition"
                />
              </div>
              <div>
                <label className="block text-sm font-bold mb-2">Prix original (€)</label>
                <input
                  type="number"
                  step="0.01"
                  {...register('originalPrice', { min: 0 })}
                  className="w-full border-2 border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-black focus:border-black transition"
                />
                <p className="text-xs text-gray-500 mt-1">Laissez vide si pas de promotion</p>
              </div>
              <div className="flex items-end">
                <div className="w-full">
                  <label className="block text-sm font-black mb-2 uppercase tracking-wide text-gray-700">Statut</label>
                  <label className="relative inline-flex items-center cursor-pointer group">
                    <input
                      type="checkbox"
                      {...register('isActive')}
                      className="sr-only peer"
                    />
                    <div className="w-14 h-7 bg-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-black/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-black shadow-md"></div>
                    <span className="ml-3 text-sm font-black text-gray-700 group-hover:text-black transition-colors">
                      {watch('isActive') ? 'Active' : 'Inactive'}
                    </span>
                  </label>
                </div>
              </div>
            </div>

            <div className="max-w-xs">
              <label className="block text-sm font-bold mb-2">Valable jusqu'au</label>
              <input
                type="date"
                {...register('validUntil')}
                className="w-full border-2 border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-black focus:border-black transition"
              />
              <p className="text-xs text-gray-500 mt-1">Optionnel : l'offre disparaît du site après cette date</p>
            </div>

            <div className="flex gap-4 pt-4">
              <button
                type="submit"
                disabled={isUploading}
                className="flex items-center gap-2 bg-black text-white px-6 py-3 font-bold rounded-lg hover:bg-gray-800 transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Save className="w-5 h-5" />
                {isUploading ? 'Enregistrement...' : (editingOffer ? 'Modifier' : 'Créer')}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setEditingOffer(null);
                  setIsCategoryOpen(false);
                  reset();
                }}
                className="flex items-center gap-2 bg-gray-200 text-black px-6 py-3 font-bold rounded-lg hover:bg-gray-300 transition-all duration-300"
              >
                <X className="w-5 h-5" />
                Annuler
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-black text-white">
              <tr>
                <th className="px-6 py-4 text-left font-bold">Titre</th>
                <th className="px-6 py-4 text-left font-bold">Catégorie</th>
                <th className="px-6 py-4 text-left font-bold">Prix</th>
                <th className="px-6 py-4 text-left font-bold">Promotion</th>
                <th className="px-6 py-4 text-left font-bold">Statut</th>
                <th className="px-6 py-4 text-left font-bold">Date</th>
                <th className="px-6 py-4 text-left font-bold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {offers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                    <Package className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                    <p>Aucune offre pour le moment</p>
                  </td>
                </tr>
              ) : (
                offers.map((offer) => (
                  <tr key={offer._id} className="border-b border-gray-200 hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 font-bold">{offer.title}</td>
                    <td className="px-6 py-4">
                      <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-xs font-semibold uppercase">
                        {offer.category}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        {offer.originalPrice && (
                          <span className="text-gray-400 line-through mr-2">
                            {offer.originalPrice.toFixed(2)}€
                          </span>
                        )}
                        <span className="font-bold text-lg">{offer.price.toFixed(2)}€</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {offer.isPromotion ? (
                        <span className="bg-black text-white px-3 py-1 rounded-lg text-sm font-bold">
                          -{offer.promotionPercentage}%
                        </span>
                      ) : (
                        <div className="flex items-center justify-center w-8 h-8 bg-gray-100 rounded-lg border border-gray-200">
                          <Minus className="w-4 h-4 text-gray-400" strokeWidth={3} />
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                        offer.isActive 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {offer.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {format(new Date(offer.createdAt), 'dd/MM/yyyy')}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEdit(offer)}
                          className="flex items-center gap-1 bg-blue-500 text-white px-3 py-2 rounded-lg text-sm font-bold hover:bg-blue-600 transition-colors"
                        >
                          <Edit className="w-4 h-4" />
                          Modifier
                        </button>
                        <button
                          onClick={() => handleDelete(offer._id)}
                          className="flex items-center gap-1 bg-red-500 text-white px-3 py-2 rounded-lg text-sm font-bold hover:bg-red-600 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                          Supprimer
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

