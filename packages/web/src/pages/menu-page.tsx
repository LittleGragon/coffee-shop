import { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { fetchMenuItems } from '@/lib/api';
import { useCartStore, MenuItem } from '@/stores/cart-store';

type MenuCategory = 'coffee' | 'tea' | 'pastries';

export const MenuPage = () => {
  const [activeTab, setActiveTab] = useState<MenuCategory>('coffee');
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCartStore();

  const handleAddToCart = (item: MenuItem) => {
    addToCart(item);
    toast.success(`${item.name} has been added to your cart.`);
  };

  useEffect(() => {
    const loadMenuItems = async () => {
      setLoading(true);
      try {
        const items = await fetchMenuItems(activeTab);
        setMenuItems(items);
      } catch (error) {
        console.error(`Failed to fetch ${activeTab} menu items:`, error);
      } finally {
        setLoading(false);
      }
    };

    loadMenuItems();
  }, [activeTab]);

  return (
    <div className="container mx-auto py-12 px-4">
      <h1 className="text-4xl font-bold text-center mb-8">Our Menu</h1>
      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as MenuCategory)} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="coffee">Coffee</TabsTrigger>
          <TabsTrigger value="tea">Tea</TabsTrigger>
          <TabsTrigger value="pastries">Pastries</TabsTrigger>
        </TabsList>
        <TabsContent value={activeTab}>
          {loading ? (
            <div className="text-center py-8">Loading items...</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-8">
              {menuItems.map((item) => (
                <Card key={item.id} className="overflow-hidden">
                  <CardHeader className="p-0">
                    <img src={item.image} alt={item.name} className="w-full h-48 object-cover" />
                  </CardHeader>
                  <CardContent className="p-4">
                    <CardTitle className="text-xl mb-2">{item.name}</CardTitle>
                    <p className="text-lg font-semibold">${item.price.toFixed(2)}</p>
                  </CardContent>
                  <CardFooter className="p-4">
                    <Button className="w-full" onClick={() => handleAddToCart(item)}>Add to Cart</Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

