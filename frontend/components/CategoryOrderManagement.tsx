'use client';

import { useState, useEffect } from 'react';
import { categoriesAPI } from '@/lib/api';
import toast from 'react-hot-toast';
import { ArrowUp, ArrowDown, GripVertical, Save } from 'lucide-react';

interface Category {
  _id?: string;
  category: string;
  order: number;
  label: string;
}

export default function CategoryOrderManagement() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      setIsLoading(true);
      const data = await categoriesAPI.getAll();
      setCategories(data);
    } catch (error) {
      toast.error('Erreur lors du chargement des catégories');
    } finally {
      setIsLoading(false);
    }
  };

  const moveCategory = (index: number, direction: 'up' | 'down') => {
    const newCategories = [...categories];
    const newIndex = direction === 'up' ? index - 1 : index + 1;

    if (newIndex < 0 || newIndex >= newCategories.length) return;

    // Swap items
    [newCategories[index], newCategories[newIndex]] = [newCategories[newIndex], newCategories[index]];

    // Update orders to match new positions
    newCategories.forEach((cat, idx) => {
      cat.order = idx + 1;
    });

    setCategories(newCategories);
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      await categoriesAPI.updateOrder(categories);
      toast.success('Ordre des catégories sauvegardé');
    } catch (error) {
      toast.error('Erreur lors de la sauvegarde');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="text-center py-12">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
        <p className="mt-4 text-gray-600">Chargement...</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-6 mb-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-2xl font-black mb-2">Ordre des catégories</h3>
          <p className="text-gray-600">Définissez l'ordre d'affichage des catégories sur le site</p>
        </div>
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="flex items-center gap-2 bg-black text-white px-6 py-3 font-black rounded-lg hover:bg-gray-800 transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50"
        >
          <Save className="w-5 h-5" />
          {isSaving ? 'Sauvegarde...' : 'Sauvegarder'}
        </button>
      </div>

      <div className="space-y-3">
        {categories.map((category, index) => (
          <div
            key={category.category}
            className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg border-2 border-gray-200 hover:border-black transition-all"
          >
            <div className="flex items-center gap-2 flex-shrink-0">
              <GripVertical className="w-5 h-5 text-gray-400" />
              <span className="text-sm font-black text-gray-500 w-8">#{index + 1}</span>
            </div>
            
            <div className="flex-1">
              <p className="font-black text-lg text-black">{category.label}</p>
              <p className="text-sm text-gray-500">{category.category}</p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => moveCategory(index, 'up')}
                disabled={index === 0}
                className="p-2 bg-white border-2 border-gray-300 rounded-lg hover:border-black transition disabled:opacity-30 disabled:cursor-not-allowed"
                title="Déplacer vers le haut"
              >
                <ArrowUp className="w-5 h-5" />
              </button>
              <button
                onClick={() => moveCategory(index, 'down')}
                disabled={index === categories.length - 1}
                className="p-2 bg-white border-2 border-gray-300 rounded-lg hover:border-black transition disabled:opacity-30 disabled:cursor-not-allowed"
                title="Déplacer vers le bas"
              >
                <ArrowDown className="w-5 h-5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

