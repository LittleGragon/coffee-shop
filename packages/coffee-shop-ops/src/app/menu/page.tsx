'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { MenuItem } from '@/types/models';

export default function MenuPage() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Filter states
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortOption, setSortOption] = useState<string>('default');
  
  // Fetch menu items and categories
  useEffect(() => {
    const fetchMenuData = async () => {
      try {
        setLoading(true);
        
        // Fetch menu items
        const itemsResponse = await fetch('/api/menu');
        if (!itemsResponse.ok) {
          throw new Error('Failed to fetch menu items');
        }
        const itemsData = await itemsResponse.json();
        setMenuItems(itemsData);
        
        // Fetch categories
        const categoriesResponse = await fetch('/api/menu/categories');
        if (!categoriesResponse.ok) {
          throw new Error('Failed to fetch categories');
        }
        const categoriesData = await categoriesResponse.json();
        setCategories(categoriesData);
        
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
        console.error('Error fetching menu data:', err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchMenuData();
  }, []);
  
  // Filter and sort menu items
  const filteredAndSortedItems = menuItems
    .filter(item => {
      // Filter by category
      if (selectedCategory !== 'all' && item.category !== selectedCategory) {
        return false;
      }
      
      // Filter by search query
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        return (
          item.name.toLowerCase().includes(query) ||
          (item.description && item.description.toLowerCase().includes(query))
        );
      }
      
      return true;
    })
    .sort((a, b) => {
      // Sort based on selected option
      switch (sortOption) {
        case 'name-asc':
          return a.name.localeCompare(b.name);
        case 'name-desc':
          return b.name.localeCompare(a.name);
        case 'price-asc':
          return parseFloat(a.price.toString()) - parseFloat(b.price.toString());
        case 'price-desc':
          return parseFloat(b.price.toString()) - parseFloat(a.price.toString());
        default:
          // Default sorting by category and then name
          return a.category === b.category
            ? a.name.localeCompare(b.name)
            : a.category.localeCompare(b.category);
      }
    });
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Coffee Shop Menu</h1>
        <Link 
          href="/"
          className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 px-4 rounded"
        >
          Back to Home
        </Link>
      </div>
      
      {/* Filters */}
      <div className="bg-gray-100 p-4 rounded-lg mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label htmlFor="category-filter" className="block text-sm font-medium text-gray-700 mb-1">
              Filter by Category:
            </label>
            <select
              id="category-filter"
              className="w-full p-2 pl-3 pr-10 border border-gray-300 rounded-md text-gray-800 appearance-none bg-white bg-no-repeat bg-right"
              style={{ backgroundImage: "url(\"data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3E%3Cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3E%3C/svg%3E\")", backgroundSize: "1.5em 1.5em" }}
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <option value="all">All Categories</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label htmlFor="search-input" className="block text-sm font-medium text-gray-700 mb-1">
              Search:
            </label>
            <input
              id="search-input"
              type="text"
              className="w-full p-2 border border-gray-300 rounded-md text-gray-800"
              placeholder="Search menu items..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <div>
            <label htmlFor="sort-by" className="block text-sm font-medium text-gray-700 mb-1">
              Sort by:
            </label>
            <select
              id="sort-by"
              className="w-full p-2 pl-3 pr-10 border border-gray-300 rounded-md text-gray-800 appearance-none bg-white bg-no-repeat bg-right"
              style={{ backgroundImage: "url(\"data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3E%3Cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3E%3C/svg%3E\")", backgroundSize: "1.5em 1.5em" }}
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
            >
              <option value="default">Default</option>
              <option value="name-asc">Name (A-Z)</option>
              <option value="name-desc">Name (Z-A)</option>
              <option value="price-asc">Price (Low to High)</option>
              <option value="price-desc">Price (High to Low)</option>
            </select>
          </div>
        </div>
      </div>
      
      {/* Loading and Error States */}
      {loading && (
        <div className="text-center py-8">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gray-900 mb-2"></div>
          <p>Loading menu items...</p>
        </div>
      )}
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          <p>{error}</p>
        </div>
      )}
      
      {/* Menu Items */}
      {!loading && !error && (
        <>
          <p className="mb-4 text-gray-600">
            Showing {filteredAndSortedItems.length} of {menuItems.length} items
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAndSortedItems.map((item) => (
              <div 
                key={item.id} 
                className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200"
              >
                {item.image_url && (
                  <div className="h-48 overflow-hidden">
                    <img 
                      src={item.image_url} 
                      alt={item.name} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                
                <div className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h2 className="text-xl font-semibold text-gray-800">{item.name}</h2>
                    <span className="text-lg font-bold text-gray-700">
                      ${parseFloat(item.price.toString()).toFixed(2)}
                    </span>
                  </div>
                  
                  <p className="text-gray-600 mb-3">
                    {item.description || 'No description available'}
                  </p>
                  
                  <div className="flex flex-wrap gap-2">
                    <span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700">
                      {item.category}
                    </span>
                    
                    <span className={`inline-block rounded-full px-3 py-1 text-sm font-semibold ${
                      item.is_available 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {item.is_available ? 'Available' : 'Unavailable'}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {filteredAndSortedItems.length === 0 && (
            <div className="text-center py-8">
              <p className="text-gray-500">No menu items found matching your criteria.</p>
            </div>
          )}
        </>
      )}
    </div>
  );
}