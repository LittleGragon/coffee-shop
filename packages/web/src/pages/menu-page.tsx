import { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { api } from '@/lib/api';
import { useCartStore, MenuItem } from '@/stores/cart-store';
import { Search } from 'lucide-react';

interface CategoryStats {
  name: string;
  count: number;
  availableCount: number;
}

export const MenuPage = () => {
  const [categories, setCategories] = useState<string[]>([]);
  const [categoryStats, setCategoryStats] = useState<CategoryStats[]>([]);
  const [activeTab, setActiveTab] = useState<string>('all');
  const [allMenuItems, setAllMenuItems] = useState<MenuItem[]>([]);
  const [filteredItems, setFilteredItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const { addToCart } = useCartStore();

  const handleAddToCart = (item: MenuItem) => {
    addToCart(item);
    toast.success(`${item.name} has been added to your cart.`);
  };

  // Fetch categories and menu items
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        // Fetch categories from database
        const categoriesResponse = await fetch('http://localhost:3000/api/categories');
        const categoriesData = await categoriesResponse.json();
        
        console.log('Categories data:', categoriesData); // Debug log
        
        // Create category lookup map (id -> name)
        const categoryMap = new Map();
        let categoryNames: string[] = [];
        
        if (Array.isArray(categoriesData)) {
          categoriesData.forEach((cat: any) => {
            if (cat && cat.id && cat.name) {
              categoryMap.set(cat.id, cat.name);
              categoryNames.push(cat.name);
            }
          });
        } else {
          // Fallback to hardcoded categories if API fails
          categoryNames = ['Hot Beverages', 'Cold Beverages', 'Pastries', 'Sandwiches', 'Desserts', 'Snacks'];
          categoryNames.forEach((name, index) => {
            categoryMap.set(index + 1, name);
          });
        }
        
        setCategories(categoryNames);

        // Fetch all menu items
        const menuResponse = await api.getMenuItems();
        const availableItems = menuResponse.filter((item: any) => item.is_available !== false);
        
        // Transform data to match frontend expectations
        const transformedItems = availableItems.map((item: any) => ({
          id: item.id,
          name: item.name,
          category: categoryMap.get(item.category_id) || 'Uncategorized',
          price: parseFloat(item.price),
          description: item.description,
          image: item.image_url || null,
          is_available: item.is_available
        }));
        
        setAllMenuItems(transformedItems);

        // Calculate category statistics
        const stats = categoryNames.map((category: string) => {
          const categoryItems = transformedItems.filter((item: MenuItem) => item.category === category);
          return {
            name: category,
            count: categoryItems.length,
            availableCount: categoryItems.filter((item: MenuItem) => item.is_available !== false).length
          };
        });
        setCategoryStats(stats);

        // Set default active tab to first category or 'all'
        if (categoryNames.length > 0) {
          setActiveTab('all');
        }
      } catch (error) {
        console.error('Failed to fetch data:', error);
        toast.error('Failed to load menu data');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Filter items based on active tab and search criteria
  useEffect(() => {
    let items = [...allMenuItems];

    // Filter by category
    if (activeTab !== 'all') {
      items = items.filter(item => item.category === activeTab);
    }

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      items = items.filter(item => 
        item.name.toLowerCase().includes(query) ||
        (item.description && item.description.toLowerCase().includes(query))
      );
    }

    // Sort items alphabetically by name (default sorting)
    items.sort((a, b) => a.name.localeCompare(b.name));

    setFilteredItems(items);
  }, [allMenuItems, activeTab, searchQuery]);

  const totalItems = allMenuItems.length;

  return (
    <div className="container mx-auto py-6 px-4 max-w-7xl">
      {/* Mobile-first header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl md:text-4xl font-bold mb-2">Our Menu</h1>
        <p className="text-gray-600 text-sm md:text-base">
          Discover our carefully crafted selection of beverages and treats
        </p>
      </div>

      {/* Search Controls - Mobile First */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search menu items..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Loading our delicious menu...</p>
        </div>
      ) : (
        <>
          {/* Category Tabs - Mobile Scrollable */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <div className="relative mb-6">
              <TabsList className="w-full justify-start overflow-x-auto scrollbar-hide md:justify-center">
                <TabsTrigger key="all" value="all" className="flex-shrink-0">
                  <span className="mr-2">All Items</span>
                  <Badge variant="secondary" className="ml-1">
                    {totalItems}
                  </Badge>
                </TabsTrigger>
                {categories.map((category) => {
                  const stats = categoryStats.find(s => s.name === category);
                  return (
                    <TabsTrigger key={category} value={category} className="flex-shrink-0">
                      <span className="mr-2">{category}</span>
                      <Badge variant="secondary" className="ml-1">
                        {stats?.availableCount || 0}
                      </Badge>
                    </TabsTrigger>
                  );
                })}
              </TabsList>
            </div>

            {/* Results Summary */}
            <div className="flex justify-between items-center mb-6 text-sm text-gray-600">
              <span>
                {activeTab === 'all' 
                  ? `Showing ${filteredItems.length} of ${totalItems} items`
                  : `${filteredItems.length} items in ${activeTab}`
                }
                {searchQuery && ` matching "${searchQuery}"`}
              </span>
              {(activeTab !== 'all' || searchQuery) && (
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => {
                    setActiveTab('all');
                    setSearchQuery('');
                  }}
                >
                  Clear filters
                </Button>
              )}
            </div>

            {/* Menu Items Grid - Mobile First */}
            <TabsContent value="all" className="mt-0">
              {filteredItems.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">☕</div>
                  <h3 className="text-xl font-semibold mb-2">No items found</h3>
                  <p className="text-gray-600 mb-4">
                    {searchQuery 
                      ? `No items match "${searchQuery}" in ${activeTab === 'all' ? 'any category' : activeTab}`
                      : `No items available in ${activeTab === 'all' ? 'any category' : activeTab}`
                    }
                  </p>
                  {(activeTab !== 'all' || searchQuery) && (
                    <Button 
                      variant="outline"
                      onClick={() => {
                        setActiveTab('all');
                        setSearchQuery('');
                      }}
                    >
                      View all items
                    </Button>
                  )}
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
                  {filteredItems.map((item) => (
                    <Card key={item.id} className="overflow-hidden hover:shadow-lg transition-shadow duration-200">
                      <CardHeader className="p-0">
                        <div className="relative">
                          <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
                            {item.image && item.image !== 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDMwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIzMDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjRjNGNEY2Ii8+Cjx0ZXh0IHg9IjE1MCIgeT0iMTAwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIiBmaWxsPSIjOUI5QjlCIiBmb250LWZhbWlseT0iQXJpYWwsIHNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMTQiPk5vIEltYWdlPC90ZXh0Pgo8L3N2Zz4K' ? (
                              <img 
                                src={item.image} 
                                alt={item.name} 
                                className="w-full h-48 object-cover"
                                onError={(e) => {
                                  const target = e.target as HTMLImageElement;
                                  target.style.display = 'none';
                                  const parent = target.parentElement;
                                  if (parent && !parent.querySelector('.fallback-text')) {
                                    const fallback = document.createElement('div');
                                    fallback.className = 'fallback-text text-gray-500 text-sm';
                                    fallback.textContent = 'No Image Available';
                                    parent.appendChild(fallback);
                                  }
                                }}
                              />
                            ) : (
                              <span className="text-gray-500 text-sm">No Image Available</span>
                            )}
                          </div>
                          <Badge 
                            variant="secondary" 
                            className="absolute top-2 right-2 bg-white/90 text-gray-700"
                          >
                            {item.category}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start mb-2">
                          <CardTitle className="text-lg leading-tight">{item.name}</CardTitle>
                          <span className="text-lg font-bold text-primary ml-2">
                            ${item.price.toFixed(2)}
                          </span>
                        </div>
                        {item.description && (
                          <p className="text-sm text-gray-600 line-clamp-2">
                            {item.description}
                          </p>
                        )}
                      </CardContent>
                      <CardFooter className="p-4 pt-0">
                        <Button 
                          className="w-full" 
                          onClick={() => handleAddToCart(item)}
                          size="sm"
                        >
                          Add to Cart
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>

            {categories.map((category) => (
              <TabsContent key={category} value={category} className="mt-0">
                {filteredItems.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="text-6xl mb-4">☕</div>
                    <h3 className="text-xl font-semibold mb-2">No items found</h3>
                    <p className="text-gray-600 mb-4">
                      {searchQuery 
                        ? `No items match "${searchQuery}" in ${category}`
                        : `No items available in ${category}`
                      }
                    </p>
                    <Button 
                      variant="outline"
                      onClick={() => {
                        setActiveTab('all');
                        setSearchQuery('');
                      }}
                    >
                      View all items
                    </Button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
                    {filteredItems.map((item) => (
                      <Card key={item.id} className="overflow-hidden hover:shadow-lg transition-shadow duration-200">
                        <CardHeader className="p-0">
                          <div className="relative">
                            <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
                              {item.image && item.image !== 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDMwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIzMDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjRjNGNEY2Ii8+Cjx0ZXh0IHg9IjE1MCIgeT0iMTAwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIiBmaWxsPSIjOUI5QjlCIiBmb250LWZhbWlseT0iQXJpYWwsIHNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMTQiPk5vIEltYWdlPC90ZXh0Pgo8L3N2Zz4K' ? (
                                <img 
                                  src={item.image} 
                                  alt={item.name} 
                                  className="w-full h-48 object-cover"
                                  onError={(e) => {
                                    const target = e.target as HTMLImageElement;
                                    target.style.display = 'none';
                                    const parent = target.parentElement;
                                    if (parent && !parent.querySelector('.fallback-text')) {
                                      const fallback = document.createElement('div');
                                      fallback.className = 'fallback-text text-gray-500 text-sm';
                                      fallback.textContent = 'No Image Available';
                                      parent.appendChild(fallback);
                                    }
                                  }}
                                />
                              ) : (
                                <span className="text-gray-500 text-sm">No Image Available</span>
                              )}
                            </div>
                            <Badge 
                              variant="secondary" 
                              className="absolute top-2 right-2 bg-white/90 text-gray-700"
                            >
                              {item.category}
                            </Badge>
                          </div>
                        </CardHeader>
                        <CardContent className="p-4">
                          <div className="flex justify-between items-start mb-2">
                            <CardTitle className="text-lg leading-tight">{item.name}</CardTitle>
                            <span className="text-lg font-bold text-primary ml-2">
                              ${item.price.toFixed(2)}
                            </span>
                          </div>
                          {item.description && (
                            <p className="text-sm text-gray-600 line-clamp-2">
                              {item.description}
                            </p>
                          )}
                        </CardContent>
                        <CardFooter className="p-4 pt-0">
                          <Button 
                            className="w-full" 
                            onClick={() => handleAddToCart(item)}
                            size="sm"
                          >
                            Add to Cart
                          </Button>
                        </CardFooter>
                      </Card>
                    ))}
                  </div>
                )}
              </TabsContent>
            ))}
          </Tabs>
        </>
      )}
    </div>
  );
};