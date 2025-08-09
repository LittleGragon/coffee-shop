'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface InventoryFormData {
  name: string;
  sku: string;
  category: string;
  current_stock: number;
  minimum_stock: number;
  cost_per_unit: number;
  unit: string;
  supplier: string;
  description: string;
}

export default function NewInventoryPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [formData, setFormData] = useState<InventoryFormData>({
    name: '',
    sku: '',
    category: '',
    current_stock: 0,
    minimum_stock: 0,
    cost_per_unit: 0,
    unit: '',
    supplier: '',
    description: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? parseFloat(value) || 0 : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/inventory', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create inventory item');
      }

      // Redirect to inventory list on success
      router.push('/inventory');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      console.error('Error creating inventory item:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Add New Inventory Item</h1>
        <Link 
          href="/inventory"
          className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 px-4 rounded"
        >
          Back to Inventory
        </Link>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          <p>{error}</p>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-md p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Item Name */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Item Name *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                required
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#6f4e37] focus:border-transparent"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Enter item name"
              />
            </div>

            {/* SKU */}
            <div>
              <label htmlFor="sku" className="block text-sm font-medium text-gray-700 mb-1">
                SKU *
              </label>
              <input
                type="text"
                id="sku"
                name="sku"
                required
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#6f4e37] focus:border-transparent font-mono"
                value={formData.sku}
                onChange={handleInputChange}
                placeholder="Enter SKU (e.g., COFFEE-001)"
              />
            </div>

            {/* Category */}
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                Category *
              </label>
              <select
                id="category"
                name="category"
                required
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#6f4e37] focus:border-transparent"
                value={formData.category}
                onChange={handleInputChange}
              >
                <option value="">Select a category</option>
                <option value="Coffee Beans">Coffee Beans</option>
                <option value="Tea">Tea</option>
                <option value="Dairy">Dairy</option>
                <option value="Syrups">Syrups</option>
                <option value="Pastries">Pastries</option>
                <option value="Supplies">Supplies</option>
                <option value="Equipment">Equipment</option>
                <option value="Other">Other</option>
              </select>
            </div>

            {/* Unit */}
            <div>
              <label htmlFor="unit" className="block text-sm font-medium text-gray-700 mb-1">
                Unit *
              </label>
              <select
                id="unit"
                name="unit"
                required
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#6f4e37] focus:border-transparent"
                value={formData.unit}
                onChange={handleInputChange}
              >
                <option value="">Select a unit</option>
                <option value="kg">Kilograms (kg)</option>
                <option value="g">Grams (g)</option>
                <option value="lbs">Pounds (lbs)</option>
                <option value="oz">Ounces (oz)</option>
                <option value="L">Liters (L)</option>
                <option value="ml">Milliliters (ml)</option>
                <option value="pcs">Pieces (pcs)</option>
                <option value="boxes">Boxes</option>
                <option value="bags">Bags</option>
              </select>
            </div>

            {/* Current Stock */}
            <div>
              <label htmlFor="current_stock" className="block text-sm font-medium text-gray-700 mb-1">
                Current Stock *
              </label>
              <input
                type="number"
                id="current_stock"
                name="current_stock"
                required
                min="0"
                step="0.01"
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#6f4e37] focus:border-transparent"
                value={formData.current_stock}
                onChange={handleInputChange}
                placeholder="0"
              />
            </div>

            {/* Minimum Stock */}
            <div>
              <label htmlFor="minimum_stock" className="block text-sm font-medium text-gray-700 mb-1">
                Minimum Stock *
              </label>
              <input
                type="number"
                id="minimum_stock"
                name="minimum_stock"
                required
                min="0"
                step="0.01"
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#6f4e37] focus:border-transparent"
                value={formData.minimum_stock}
                onChange={handleInputChange}
                placeholder="0"
              />
            </div>

            {/* Cost per Unit */}
            <div>
              <label htmlFor="cost_per_unit" className="block text-sm font-medium text-gray-700 mb-1">
                Cost per Unit ($) *
              </label>
              <input
                type="number"
                id="cost_per_unit"
                name="cost_per_unit"
                required
                min="0"
                step="0.01"
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#6f4e37] focus:border-transparent"
                value={formData.cost_per_unit}
                onChange={handleInputChange}
                placeholder="0.00"
              />
            </div>

            {/* Supplier */}
            <div>
              <label htmlFor="supplier" className="block text-sm font-medium text-gray-700 mb-1">
                Supplier
              </label>
              <input
                type="text"
                id="supplier"
                name="supplier"
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#6f4e37] focus:border-transparent"
                value={formData.supplier}
                onChange={handleInputChange}
                placeholder="Enter supplier name"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              rows={3}
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#6f4e37] focus:border-transparent"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Enter item description (optional)"
            />
          </div>

          {/* Submit Button */}
          <div className="flex justify-end space-x-4">
            <Link
              href="/inventory"
              className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-3 px-6 rounded"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={loading}
              className="bg-[#6f4e37] hover:bg-[#5d4230] disabled:bg-gray-400 text-white font-semibold py-3 px-6 rounded"
            >
              {loading ? 'Creating...' : 'Create Item'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}