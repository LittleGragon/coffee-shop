'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { MenuItem } from '@/types/models';
import MenuItemForm from '@/app/components/MenuItemForm';

interface EditMenuItemClientProps {
  id: string;
}

export default function EditMenuItemClient({ id }: EditMenuItemClientProps) {
  const router = useRouter();
  const [menuItem, setMenuItem] = useState<MenuItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchMenuItem = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/menu/${id}`);
        
        if (!response.ok) {
          throw new Error(`Failed to fetch menu item: ${response.statusText}`);
        }
        
        const data = await response.json();
        setMenuItem(data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
        console.error('Error fetching menu item:', err);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchMenuItem();
    }
  }, [id]);

  const handleSubmit = async (formData: Partial<MenuItem>) => {
    try {
      setIsSubmitting(true);
      const response = await fetch(`/api/menu/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error(`Failed to update menu item: ${response.statusText}`);
      }

      // Navigate back to the menu page after successful update
      router.push('/menu');
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      console.error('Error updating menu item:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    router.push('/menu');
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Edit Menu Item</h1>
        <Link 
          href="/menu"
          className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 px-4 rounded"
        >
          Back to Menu
        </Link>
      </div>

      {loading && (
        <div className="text-center py-8">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gray-900 mb-2"></div>
          <p>Loading menu item...</p>
        </div>
      )}

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          <p>{error}</p>
        </div>
      )}

      {!loading && !error && menuItem && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <MenuItemForm 
            initialData={menuItem}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
            isSubmitting={isSubmitting}
          />
        </div>
      )}
    </div>
  );
}