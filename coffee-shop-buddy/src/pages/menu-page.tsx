import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { PlusCircle } from 'lucide-react';
import { useCartStore } from '@/stores/cart-store';
import { useToast } from '@/hooks/use-toast';

const menuData = {
  coffee: [
    {
      name: "Espresso",
      description: "A concentrated coffee beverage brewed by forcing hot water under pressure through finely-ground coffee beans.",
      price: "$2.50",
      image: "https://images.unsplash.com/photo-1599399055335-b3e3a7a2a2e9?q=80&w=1974&auto=format&fit=crop",
    },
    {
      name: "Americano",
      description: "A style of coffee prepared by brewing espresso with added hot water, giving it a similar strength to, but different flavor from, traditionally brewed coffee.",
      price: "$3.00",
      image: "https://images.unsplash.com/photo-1546383094-02239b59b39e?q=80&w=1974&auto=format&fit=crop",
    },
    {
      name: "Latte",
      description: "A coffee drink made with espresso and steamed milk, topped with a light layer of foam.",
      price: "$4.00",
      image: "https://images.unsplash.com/photo-1579989993649-595ae7b39863?q=80&w=1974&auto=format&fit=crop",
    },
    {
      name: "Cappuccino",
      description: "An espresso-based coffee drink that originated in Italy, and is traditionally prepared with steamed milk foam.",
      price: "$3.50",
      image: "https://images.unsplash.com/photo-1517256064527-09c73fc73e38?q=80&w=1974&auto=format&fit=crop",
    },
  ],
  pastries: [
    {
      name: "Croissant",
      description: "A buttery, flaky, viennoiserie pastry of Austrian origin, named for its historical crescent shape.",
      price: "$2.75",
      image: "https://images.unsplash.com/photo-1622399949624-5de74aa9553f?q=80&w=1974&auto=format&fit=crop",
    },
    {
      name: "Muffin",
      description: "An individual-sized, baked product. It can refer to two distinct items, a part-raised flatbread and a cupcake-like quickbread.",
      price: "$2.50",
      image: "https://images.unsplash.com/photo-1557087422-241b6f5b34a4?q=80&w=1974&auto=format&fit=crop",
    },
    {
      name: "Scone",
      description: "A single-serving quick bread, usually made of wheat, barley or oatmeal with baking powder as a leavening agent and baked on sheet pans.",
      price: "$3.00",
      image: "https://images.unsplash.com/photo-1608920233966-51c34335483d?q=80&w=1974&auto=format&fit=crop",
    },
  ],
  cakes: [
     {
      name: "Red Velvet Cake",
      description: "A classic red, red-brown, crimson, or scarlet-colored chocolate layer cake, layered with ermine icing.",
      price: "$5.50",
      image: "https://images.unsplash.com/photo-1616541823729-00fe0aacd3be?q=80&w=1974&auto=format&fit=crop",
    },
    {
      name: "Cheesecake",
      description: "A sweet dessert consisting of one or more layers. The main, and thickest, layer consists of a mixture of soft, fresh cheese, eggs, and sugar.",
      price: "$6.00",
      image: "https://images.unsplash.com/photo-1534401219-6951333a2992?q=80&w=1974&auto=format&fit=crop",
    },
  ]
};

const categories = Object.keys(menuData);

export function MenuPage() {
  const { addItem } = useCartStore();
  const { toast } = useToast();

  const handleAddItem = (item) => {
    addItem(item);
    toast({
      title: "Added to cart",
      description: `${item.name} has been added to your cart.`,
    });
  };

  return (
    <div className="container mx-auto px-4 md:px-6 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-coffee-brown">Our Menu</h1>
        <p className="text-lg text-coffee-brown/80 mt-2">Freshly brewed coffee and delicious baked goods, made just for you.</p>
      </div>

      <Tabs defaultValue="coffee" className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-8 bg-sage-green/20">
          {categories.map(category => (
            <TabsTrigger key={category} value={category} className="capitalize">
              {category}
            </TabsTrigger>
          ))}
        </TabsList>
        
        {categories.map(category => (
          <TabsContent key={category} value={category}>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {menuData[category].map(item => (
                <Card key={item.name} className="flex flex-col">
                  <CardHeader>
                    <div className="aspect-video w-full overflow-hidden rounded-md mb-4">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    </div>
                    <CardTitle className="text-coffee-brown">{item.name}</CardTitle>
                  </CardHeader>
                  <CardContent className="flex-grow">
                    <p className="text-coffee-brown/80 text-sm">{item.description}</p>
                  </CardContent>
                  <CardFooter className="flex justify-between items-center">
                    <span className="text-lg font-bold text-coffee-brown">{item.price}</span>
                    <Button variant="ghost" size="icon" onClick={() => handleAddItem(item)}>
                      <PlusCircle className="h-6 w-6 text-sage-green" />
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
