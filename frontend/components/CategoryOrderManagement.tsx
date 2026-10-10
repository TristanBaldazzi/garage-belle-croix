'use client';

import { useState, useEffect } from 'react';
import { categoriesAPI } from '@/lib/api';
import toast from 'react-hot-toast';
import { ArrowUp, ArrowDown, Save } from 'lucide-react';
import { AdminCard, AdminPageHeader, AdminSpinner, adminButton } from './admin/ui';

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
      <AdminCard>
        <AdminSpinner />
      </AdminCard>
    );
  }

  return (
    <div>
      <AdminPageHeader
        title="Ordre des catégories"
        subtitle="L’ordre dans lequel les catégories d’offres s’affichent sur la page Offres."
        actions={
          <button onClick={handleSave} disabled={isSaving} className={adminButton('accent')}>
            <Save className="h-4 w-4" />
            {isSaving ? 'Enregistrement…' : 'Enregistrer'}
          </button>
        }
      />

      <AdminCard className="max-w-2xl overflow-hidden">
        <ol className="divide-y divide-gray-100">
          {categories.map((category, index) => (
            <li key={category.category} className="flex items-center gap-4 px-5 py-3.5">
              <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-gray-100 font-display text-lg font-extrabold italic text-gray-500">
                {index + 1}
              </span>
              <p className="flex-1 font-medium">{category.label}</p>
              <div className="flex gap-1.5">
                <button
                  onClick={() => moveCategory(index, 'up')}
                  disabled={index === 0}
                  className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 text-gray-600 transition hover:bg-gray-50 hover:text-ink disabled:cursor-not-allowed disabled:opacity-30"
                  title="Monter"
                  aria-label={`Monter ${category.label}`}
                >
                  <ArrowUp className="h-4 w-4" />
                </button>
                <button
                  onClick={() => moveCategory(index, 'down')}
                  disabled={index === categories.length - 1}
                  className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 text-gray-600 transition hover:bg-gray-50 hover:text-ink disabled:cursor-not-allowed disabled:opacity-30"
                  title="Descendre"
                  aria-label={`Descendre ${category.label}`}
                >
                  <ArrowDown className="h-4 w-4" />
                </button>
              </div>
            </li>
          ))}
        </ol>
      </AdminCard>
    </div>
  );
}
