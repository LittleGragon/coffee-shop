import { useCartStore } from '@/stores/cart-store';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter } from '@/components/ui/sheet';
import { Trash2, X } from 'lucide-react';

interface ShoppingCartProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ShoppingCart({ open, onOpenChange }: ShoppingCartProps) {
  const { items, removeItem, updateQuantity, clearCart } = useCartStore();

  const total = items.reduce((acc, item) => acc + item.price * item.quantity, 0);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="flex w-full flex-col pr-0 sm:max-w-lg bg-cream">
        <SheetHeader className="px-6">
          <SheetTitle className="text-coffee-brown">Shopping Cart</SheetTitle>
        </SheetHeader>
        
        <div className="flex-1 overflow-y-auto px-6">
          {items.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center gap-4">
              <p className="text-coffee-brown/80">Your cart is empty.</p>
              <Button onClick={() => onOpenChange(false)} className="bg-sage-green text-coffee-brown hover:bg-sage-green/90">
                Continue Shopping
              </Button>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {items.map(item => (
                <div key={item.name} className="flex items-center justify-between py-4">
                  <div className="flex items-center gap-4">
                    <img src={item.image} alt={item.name} className="h-16 w-16 rounded-md object-cover" />
                    <div>
                      <h4 className="font-semibold text-coffee-brown">{item.name}</h4>
                      <p className="text-sm text-coffee-brown/80">${item.price.toFixed(2)}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <Input
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={(e) => updateQuantity(item.name, parseInt(e.target.value))}
                      className="h-8 w-16 text-center"
                    />
                    <Button variant="ghost" size="icon" onClick={() => removeItem(item.name)}>
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        
        {items.length > 0 && (
          <SheetFooter className="bg-cream p-6">
            <div className="w-full space-y-4">
              <div className="flex justify-between font-bold text-lg text-coffee-brown">
                <span>Total:</span>
                <span>${total.toFixed(2)}</span>
              </div>
              <Button className="w-full bg-sage-green text-coffee-brown hover:bg-sage-green/90">
                Checkout
              </Button>
              <Button variant="outline" className="w-full" onClick={clearCart}>
                Clear Cart
              </Button>
            </div>
          </SheetFooter>
        )}
      </SheetContent>
    </Sheet>
  );
}