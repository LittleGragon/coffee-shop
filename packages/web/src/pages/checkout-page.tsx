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
import { placeOrder } from '@/lib/api';

export function CheckoutPage() {
  const { items, totalPrice, clearCart } = useCartStore();
  const navigate = useNavigate();
  const [isPaymentDialogOpen, setPaymentDialogOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [customerName, setCustomerName] = useState('');
  const [pickupTime, setPickupTime] = useState('');

  const handlePlaceOrder = (event: React.FormEvent) => {
    event.preventDefault();
    const form = event.target as HTMLFormElement;
    const formData = new FormData(form);
    setCustomerName(formData.get('name') as string);
    setPickupTime(formData.get('pickup-time') as string);
    setPaymentDialogOpen(true);
  };

  const handlePaymentSimulation = async () => {
    setIsProcessing(true);
    
    try {
      // Prepare order data
      const orderData = {
        customer_name: customerName,
        items: items.map(item => ({
          id: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity
        })),
        order_type: 'takeout',
        notes: `Pickup time: ${pickupTime}`,
        payment_method: 'wechat_pay'
      };

      // Place the order
      const result = await placeOrder(orderData);
      
      if (result.success) {
        setIsProcessing(false);
        setPaymentDialogOpen(false);
        toast.success('Your order has been placed successfully!', {
          description: `Order #${result.order.id.substring(0, 8)} - Total: $${result.order.total_amount.toFixed(2)}`
        });
        clearCart();
        navigate('/membership'); // Navigate to membership to see order history
      } else {
        throw new Error(result.message || 'Failed to place order');
      }
    } catch (error) {
      setIsProcessing(false);
      console.error('Order placement failed:', error);
      toast.error('Order Failed', {
        description: (error as Error).message || 'There was a problem placing your order.'
      });
    }
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
              <Input id="name" name="name" placeholder="Enter your full name" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="pickup-time">Preferred Pickup Time</Label>
              <Input id="pickup-time" name="pickup-time" type="time" required />
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
            <div className="text-center">
              <p className="font-semibold">Order Total: ${totalPrice().toFixed(2)}</p>
              <p className="text-sm text-muted-foreground">Customer: {customerName}</p>
            </div>
          </div>
          <Button onClick={handlePaymentSimulation} disabled={isProcessing} className="w-full">
            {isProcessing ? 'Processing Payment...' : 'Simulate Successful Payment'}
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  );
}