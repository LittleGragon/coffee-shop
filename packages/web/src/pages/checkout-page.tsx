import { useCartStore } from '@/stores/cart-store';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

export function CheckoutPage() {
  const { items, totalPrice, clearCart } = useCartStore();
  const navigate = useNavigate();

  const handlePlaceOrder = (event: React.FormEvent) => {
    event.preventDefault();
    toast.success('Your order has been placed successfully!');
    clearCart();
    navigate('/');
  };

  if (items.length === 0) {
    return (
      <div className="container mx-auto py-12 px-4 text-center">
        <h1 className="text-3xl font-bold mb-4">Your cart is empty</h1>
        <p className="text-lg mb-8">Add some items to your cart before checking out.</p>
        <Button onClick={() => navigate('/menu')}>Return to Menu</Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-12 px-4 max-w-2xl">
      <h1 className="text-4xl font-bold text-center mb-8">Checkout</h1>
      <Card>
        <CardHeader>
          <CardTitle>Order Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1">
              <AccordionTrigger>View Items ({items.length})</AccordionTrigger>
              <AccordionContent>
                <div className="space-y-4">
                  {items.map((item) => (
                    <div key={item.id} className="flex justify-between items-center">
                      <div>
                        <p className="font-semibold">{item.name} (x{item.quantity})</p>
                        <p className="text-sm text-muted-foreground">${item.price.toFixed(2)}</p>
                      </div>
                      <p className="font-semibold">${(item.price * item.quantity).toFixed(2)}</p>
                    </div>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
          <div className="flex justify-between items-center mt-6 pt-6 border-t">
            <p className="text-xl font-bold">Total</p>
            <p className="text-xl font-bold">${totalPrice().toFixed(2)}</p>
          </div>
        </CardContent>
      </Card>

      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Your Details</CardTitle>
        </CardHeader>
        <form onSubmit={handlePlaceOrder}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input id="name" placeholder="Enter your full name" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="pickup-time">Preferred Pickup Time</Label>
              <Input id="pickup-time" type="time" required />
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full">Place Order</Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}