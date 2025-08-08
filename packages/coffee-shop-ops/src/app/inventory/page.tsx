'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { InventoryItem } from '@/types/models';

export default function InventoryPage() {
  const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Filter states
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [lowStockFilter, setLowStockFilter] = useState<boolean>(false);
  const [categories, setCategories] = useState<string[]>([]);
  
  // Fetch inventory items
  useEffect(() => {
    const fetchInventoryData = async () => {
      try {
        setLoading(true);
        
        // Construct URL with query parameters if filters are applied
        let url = '/api/inventory';
        const params = new URLSearchParams();
        
        if (categoryFilter !== 'all') {
          params.append('category', categoryFilter);
        }
        
        if (lowStockFilter) {
          params.append('lowStock', 'true');
        }
        
        if (params.toString()) {
          url += `?${params.toString()}`;
        }
        
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error('Failed to fetch inventory items');
        }
        
        const data = await response.json();
        setInventoryItems(data);
        
        // Extract unique categories
        const uniqueCategories = [...new Set(data.map((item: InventoryItem) => item.category))];
        setCategories(uniqueCategories.sort());
        
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
        console.error('Error fetching inventory data:', err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchInventoryData();
  }, [categoryFilter, lowStockFilter]);
  
  // Check if an item is low on stock
  const isLowStock = (item: InventoryItem) => {
    return item.current_stock <= item.minimum_stock;
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Inventory Management</h1>
        <Link 
          href="/"
          className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 px-4 rounded"
        >
          Back to Home
        </Link>
      </div>
      
      {/* Filters */}
      <div className="bg-gray-100 p-4 rounded-lg mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="category-filter" className="block text-sm font-medium text-gray-700 mb-1">
              Filter by Category:
            </label>
            <select
              id="category-filter"
              className="w-full p-2 pl-3 pr-10 border border-gray-300 rounded-md text-gray-800 appearance-none bg-white bg-no-repeat bg-right"
              style={{ backgroundImage: "url(\"data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3E%3Cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3E%3C/svg%3E\")", backgroundSize: "1.5em 1.5em" }}
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
            >
              <option value="all">All Categories</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>
          
          <div className="flex items-center">
            <input
              id="low-stock-filter"
              type="checkbox"
              className="h-4 w-4 text-[#6f4e37] focus:ring-[#6f4e37] border-gray-300 rounded"
              checked={lowStockFilter}
              onChange={(e) => setLowStockFilter(e.target.checked)}
            />
            <label htmlFor="low-stock-filter" className="ml-2 block text-sm text-gray-700">
              Show only low stock items
            </label>
          </div>
        </div>
      </div>
      
      {/* Loading and Error States */}
      {loading && (
        <div className="text-center py-8">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gray-900 mb-2"></div>
          <p>Loading inventory items...</p>
        </div>
      )}
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          <p>{error}</p>
        </div>
      )}
      
      {/* Inventory Items Table */}
      {!loading && !error && (
        <>
          <div className="flex justify-between items-center mb-4">
            <p className="text-gray-600">
              Showing {inventoryItems.length} inventory items
            </p>
            <Link 
              href="/inventory/new"
              className="bg-[#6f4e37] hover:bg-[#5d4230] text-white font-semibold py-2 px-4 rounded"
            >
              Add New Item
            </Link>
          </div>
          
          {inventoryItems.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white border border-gray-200 rounded-lg overflow-hidden">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      SKU
                    </th>
                    <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Category
                    </th>
                    <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Current Stock
                    </th>
                    <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Min Stock
                    </th>
                    <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Cost
                    </th>
                    <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {inventoryItems.map((item) => (
                    <tr 
                      key={item.id} 
                      className={`hover:bg-gray-50 ${isLowStock(item) ? 'bg-yellow-50' : ''}`}
                    >
                      <td className="py-4 px-4 whitespace-nowrap">
                        {item.name}
                      </td>
                      <td className="py-4 px-4 whitespace-nowrap font-mono text-sm">
                        {item.sku}
                      </td>
                      <td className="py-4 px-4 whitespace-nowrap">
                        {item.category}
                      </td>
                      <td className="py-4 px-4 whitespace-nowrap">
                        <span className={isLowStock(item) ? 'text-red-600 font-semibold' : ''}>
                          {item.current_stock} {item.unit}
                        </span>
                      </td>
                      <td className="py-4 px-4 whitespace-nowrap">
                        {item.minimum_stock} {item.unit}
                      </td>
                      <td className="py-4 px-4 whitespace-nowrap">
                        ${parseFloat(item.cost_per_unit.toString()).toFixed(2)}/{item.unit}
                      </td>
                      <td className="py-4 px-4 whitespace-nowrap">
                        <div className="flex space-x-2">
                          <Link 
                            href={`/inventory/${item.id}`}
                            className="text-blue-600 hover:text-blue-800"
                          >
                            Edit
                          </Link>
                          <Link 
                            href={`/inventory/${item.id}/transactions`}
                            className="text-green-600 hover:text-green-800"
                          >
                            Transactions
                          </Link>
                          <button 
                            className="text-[#6f4e37] hover:text-[#5d4230]"
                            onClick={() => {
                              // This would be implemented with a modal in a real application
                              alert(`Restock functionality for ${item.name} would open a modal`);
                            }}
                          >
                            Restock
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-8 bg-white rounded-lg border border-gray-200">
              <p className="text-gray-500">No inventory items found matching your criteria.</p>
            </div>
          )}
        </>
      )}
    </div>
  );
}