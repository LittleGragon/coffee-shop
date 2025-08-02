import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { submitCakeOrder } from '@/lib/api';
import { useCartStore } from '@/stores/cart-store';
import { useToast } from '@/hooks/use-toast';
// import { motion, AnimatePresence } from 'framer-motion'; // Temporarily disabled for debugging

const customizationOptions = {
  sizes: [
    { id: '6-inch', name: '6-inch (Serves 6-8)', price: 30 },
    { id: '8-inch', name: '8-inch (Serves 10-12)', price: 45 },
    { id: '10-inch', name: '10-inch (Serves 15-20)', price: 60 },
  ],
  flavors: [
    { id: 'vanilla', name: 'Classic Vanilla', price: 0 },
    { id: 'chocolate', name: 'Rich Chocolate', price: 5 },
    { id: 'red-velvet', name: 'Red Velvet', price: 7 },
  ],
  frostings: [
    { id: 'buttercream', name: 'Vanilla Buttercream', color: '#F7F0E3' },
    { id: 'chocolate', name: 'Chocolate Ganache', color: '#4B2E2A' },
    { id: 'cream-cheese', name: 'Cream Cheese Frosting', color: '#FCF8F3' },
  ],
  toppings: [
    { id: 'sprinkles', name: 'Rainbow Sprinkles', price: 2 },
    { id: 'chocolate-drip', name: 'Chocolate Drip', price: 5 },
    { id: 'fresh-berries', name: 'Fresh Berries', price: 8 },
  ],
};

const steps = [
  { id: 'size', title: 'Choose a Size' },
  { id: 'flavor', title: 'Select a Flavor' },
  { id: 'frosting', title: 'Pick a Frosting' },
  { id: 'toppings', title: 'Add Toppings' },
  { id: 'message', title: 'Personalize It' },
];

type Cake = {
  size: typeof customizationOptions.sizes[0];
  flavor: typeof customizationOptions.flavors[0];
  frosting: typeof customizationOptions.frostings[0];
  toppings: string[];
  message: string;
};

export function CakeCustomizationPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [cake, setCake] = useState<Cake>({
    size: customizationOptions.sizes[0],
    flavor: customizationOptions.flavors[0],
    frosting: customizationOptions.frostings[0],
    toppings: [],
    message: '',
  });

  const { addItem } = useCartStore();
  const { toast } = useToast();

  const handleNext = () => setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1));
  const handleBack = () => setCurrentStep((prev) => Math.max(prev - 1, 0));

  const calculatePrice = () => {
    let total = cake.size.price + cake.flavor.price;
    cake.toppings.forEach(toppingId => {
      const topping = customizationOptions.toppings.find(t => t.id === toppingId);
      if (topping) total += topping.price;
    });
    return total;
  };

  const handleAddToCart = async () => {
    setIsSubmitting(true);
    const finalPrice = calculatePrice();
    const cakeDetails = {
      ...cake,
      price: finalPrice,
    };

    try {
      const result = await submitCakeOrder(cakeDetails);
      if (result.success) {
        const cakeName = `Custom ${cake.size.name} Cake`;
        addItem({
          name: cakeName,
          price: finalPrice,
          image: '/placeholder.svg?width=100&height=100',
        });
        toast({
          title: "Custom Cake Added!",
          description: `${cakeName} has been added to your cart. Order ID: ${result.orderId}`,
        });
      } else {
        toast({
          title: "Order Failed",
          description: "There was a problem submitting your cake order. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Failed to submit cake order:", error);
      toast({
        title: "Order Failed",
        description: "An unexpected error occurred. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStepContent = () => {
    switch (steps[currentStep].id) {
      case 'size':
        return (
          <RadioGroup value={cake.size.id} onValueChange={(id) => {
            const newSize = customizationOptions.sizes.find(s => s.id === id);
            if (newSize) setCake({ ...cake, size: newSize });
          }}>
            {customizationOptions.sizes.map(s => (
              <Label key={s.id} className="flex items-center gap-4 p-4 border rounded-md cursor-pointer hover:bg-sage-green/10 has-[:checked]:bg-sage-green/20 has-[:checked]:border-sage-green">
                <RadioGroupItem value={s.id} />
                <span>{s.name} - ${s.price.toFixed(2)}</span>
              </Label>
            ))}
          </RadioGroup>
        );
      case 'flavor':
        return (
          <Select value={cake.flavor.id} onValueChange={(id) => {
            const newFlavor = customizationOptions.flavors.find(f => f.id === id);
            if (newFlavor) setCake({ ...cake, flavor: newFlavor });
          }}>
            <SelectTrigger><SelectValue placeholder="Select a flavor" /></SelectTrigger>
            <SelectContent>
              {customizationOptions.flavors.map(f => (
                <SelectItem key={f.id} value={f.id}>{f.name} (+${f.price.toFixed(2)})</SelectItem>
              ))}
            </SelectContent>
          </Select>
        );
      case 'frosting':
        return (
          <RadioGroup value={cake.frosting.id} onValueChange={(id) => {
            const newFrosting = customizationOptions.frostings.find(f => f.id === id);
            if (newFrosting) setCake({ ...cake, frosting: newFrosting });
          }}>
            <div className="grid grid-cols-3 gap-4">
            {customizationOptions.frostings.map(f => (
              <Label key={f.id} className="flex flex-col items-center gap-2 p-4 border rounded-md cursor-pointer hover:bg-sage-green/10 has-[:checked]:bg-sage-green/20 has-[:checked]:border-sage-green">
                <RadioGroupItem value={f.id} className="sr-only" />
                <div className="w-12 h-12 rounded-full border" style={{ backgroundColor: f.color }}></div>
                <span className="text-sm">{f.name}</span>
              </Label>
            ))}
            </div>
          </RadioGroup>
        );
      case 'toppings':
        return (
          <div className="space-y-2">
            {customizationOptions.toppings.map(t => (
              <Label key={t.id} className="flex items-center gap-4 p-4 border rounded-md cursor-pointer hover:bg-sage-green/10 has-[:checked]:bg-sage-green/20 has-[:checked]:border-sage-green">
                <Checkbox
                  checked={cake.toppings.includes(t.id)}
                  onCheckedChange={(checked) => {
                    const newToppings = checked
                      ? [...cake.toppings, t.id]
                      : cake.toppings.filter(id => id !== t.id);
                    setCake({ ...cake, toppings: newToppings });
                  }}
                />
                <span>{t.name} (+${t.price.toFixed(2)})</span>
              </Label>
            ))}
          </div>
        );
      case 'message':
        return <Input placeholder="Happy Birthday!" value={cake.message} onChange={(e) => setCake({ ...cake, message: e.target.value })} />;
      default:
        return null;
    }
  };

  return (
    <div className="container mx-auto px-4 md:px-6 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-coffee-brown">Design Your Custom Cake</h1>
        <p className="text-lg text-coffee-brown/80 mt-2">Create a unique cake for any occasion.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="text-coffee-brown">{steps[currentStep].title}</CardTitle>
                <span className="text-sm text-coffee-brown/80">Step {currentStep + 1} of {steps.length}</span>
              </div>
            </CardHeader>
            <CardContent className="min-h-[200px]">
              {/* <AnimatePresence mode="wait">
                <motion.div
                  key={currentStep}
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  transition={{ duration: 0.3 }}
                > */}
                  {renderStepContent()}
                {/* </motion.div>
              </AnimatePresence> */}
            </CardContent>
          </Card>
          <div className="flex justify-between mt-8">
            <Button variant="outline" onClick={handleBack} disabled={currentStep === 0}>Back</Button>
            {currentStep < steps.length - 1 ? (
              <Button onClick={handleNext} className="bg-sage-green text-coffee-brown hover:bg-sage-green/90">Next</Button>
            ) : (
              <Button onClick={handleAddToCart} className="bg-sage-green text-coffee-brown hover:bg-sage-green/90" disabled={isSubmitting}>
                {isSubmitting ? 'Submitting...' : 'Add to Cart'}
              </Button>
            )}
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="sticky top-24">
            <Card>
              <CardHeader>
                <CardTitle className="text-coffee-brown">Your Creation</CardTitle>
              </CardHeader>
              <CardContent>
                  <div className="aspect-square w-full bg-gray-100 rounded-md flex items-center justify-center mb-4">
                  {/* Cake Preview */}
                  <div className="relative w-4/5 h-4/5">
                    <div className="absolute bottom-0 w-full h-full rounded-t-full" style={{ backgroundColor: cake.frosting.color, transform: `scale(${0.7 + (customizationOptions.sizes.findIndex(s => s.id === cake.size.id) * 0.15)})` }}></div>
                    {cake.toppings.includes('chocolate-drip') && <div className="absolute top-0 w-full h-1/3 bg-coffee-brown rounded-t-full" style={{ maskImage: 'url(/drip.svg)', maskSize: 'cover' }}></div>}
                    {cake.toppings.includes('sprinkles') && <div className="absolute inset-0 w-full h-full bg-contain" style={{ backgroundImage: 'url(/sprinkles.svg)' }}></div>}
                    {cake.message && <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center text-xs text-coffee-brown font-serif">{cake.message}</div>}
                  </div>
                </div>
                <div className="space-y-2">
                  <h3 className="font-semibold text-coffee-brown">Summary</h3>
                  <p className="text-sm text-coffee-brown/80">Size: {cake.size.name}</p>
                  <p className="text-sm text-coffee-brown/80">Flavor: {cake.flavor.name}</p>
                  <p className="text-sm text-coffee-brown/80">Frosting: {cake.frosting.name}</p>
                  <p className="text-sm text-coffee-brown/80">Toppings: {cake.toppings.map(t => customizationOptions.toppings.find(opt => opt.id === t)?.name).join(', ') || 'None'}</p>
                  <div className="pt-4 border-t mt-4 flex justify-between items-center">
                    <span className="text-lg font-bold text-coffee-brown">Total:</span>
                    <span className="text-lg font-bold text-coffee-brown">${calculatePrice().toFixed(2)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}