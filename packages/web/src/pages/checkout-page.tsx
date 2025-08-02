import { useState } from 'react';
import { useCartStore } from '@/stores/cart-store';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

export function CheckoutPage() {
  const { items, totalPrice, clearCart } = useCartStore();
  const navigate = useNavigate();
  const [isPaymentDialogOpen, setPaymentDialogOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const handlePlaceOrder = (event: React.FormEvent) => {
    event.preventDefault();
    setPaymentDialogOpen(true);
  };

  const handlePaymentSimulation = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setPaymentDialogOpen(false);
      toast.success('Your order has been placed successfully!');
      clearCart();
      navigate('/');
    }, 3000); // Simulate a 3-second payment processing time
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

      <Dialog open={isPaymentDialogOpen} onOpenChange={setPaymentDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>WeChat Pay</DialogTitle>
            <DialogDescription>
              Scan the QR code with WeChat to complete your payment.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col items-center justify-center p-4 space-y-4">
            <img
              src="https://placehold.co/250x250/png?text=Scan+Me"
              alt="WeChat Pay QR Code"
            />
            <p className="text-sm text-muted-foreground">
              This is a simulation. Click the button below to proceed.
            </p>
          </div>
          <Button onClick={handlePaymentSimulation} disabled={isProcessing} className="w-full">
            {isProcessing ? 'Processing...' : 'Simulate Successful Payment'}
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  );
}