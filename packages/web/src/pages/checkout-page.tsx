import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
// Material UI components
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import CircularProgress from '@mui/material/CircularProgress';
import Container from '@mui/material/Container';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { apiClient } from '@/lib/api-client';
import { useCartStore } from '@/stores/cart-store';
import type { CreateOrderRequest } from '../../../shared/src/api-types';

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
      // Calculate total amount
      const totalAmount = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

      // Transform cart items to API format
      const orderItems = items.map((item) => ({
        menu_item_id: item.id,
        quantity: item.quantity,
        price_at_time: item.price,
      }));

      // Prepare order data using the shared type
      const orderData: CreateOrderRequest = {
        user_id: null, // Anonymous order
        total_amount: totalAmount,
        status: 'pending',
        order_type: 'takeout',
        customer_name: customerName,
        notes: `Pickup time: ${pickupTime}`,
        payment_method: 'wechat_pay',
        items: orderItems,
      };

      // Place the order using the API client
      const result = await apiClient.orders.create(orderData);

      // Order successful
      setIsProcessing(false);
      setPaymentDialogOpen(false);
      toast.success('Your order has been placed successfully!', {
        description: `Order #${result.id.substring(0, 8)} - Total: $${result.total_amount.toFixed(2)}`,
      });
      clearCart();
      navigate('/membership'); // Navigate to membership to see order history
    } catch (error) {
      setIsProcessing(false);
      // Order placement error handling
      toast.error('Order Failed', {
        description: (error as Error).message || 'There was a problem placing your order.',
      });
    }
  };

  if (items.length === 0) {
    return (
      <Container maxWidth="md" sx={{ py: 8, textAlign: 'center' }}>
        <Typography variant="h4" component="h1" gutterBottom fontWeight="bold">
          Your cart is empty
        </Typography>
        <Typography variant="body1" paragraph sx={{ mb: 4 }}>
          Add some items to your cart before checking out.
        </Typography>
        <Button variant="contained" color="primary" onClick={() => navigate('/menu')}>
          Return to Menu
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 8 }}>
      <Typography variant="h3" component="h1" align="center" gutterBottom fontWeight="bold">
        Checkout
      </Typography>

      <Card sx={{ mb: 4 }}>
        <CardHeader title="Order Summary" />
        <CardContent>
          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography>View Items ({items.length})</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {items.map((item) => (
                  <Box
                    key={item.id}
                    sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                  >
                    <Box>
                      <Typography fontWeight="medium">
                        {item.name} (x{item.quantity})
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        ${item.price.toFixed(2)}
                      </Typography>
                    </Box>
                    <Typography fontWeight="medium">
                      ${(item.price * item.quantity).toFixed(2)}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </AccordionDetails>
          </Accordion>

          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              mt: 3,
              pt: 3,
              borderTop: 1,
              borderColor: 'divider',
            }}
          >
            <Typography variant="h6" fontWeight="bold">
              Total
            </Typography>
            <Typography variant="h6" fontWeight="bold">
              ${totalPrice().toFixed(2)}
            </Typography>
          </Box>
        </CardContent>
      </Card>

      <Card>
        <CardHeader title="Your Details" />
        <form onSubmit={handlePlaceOrder}>
          <CardContent>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  id="name"
                  name="name"
                  label="Full Name"
                  placeholder="Enter your full name"
                  fullWidth
                  required
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  id="pickup-time"
                  name="pickup-time"
                  label="Preferred Pickup Time"
                  type="time"
                  fullWidth
                  required
                  variant="outlined"
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
            </Grid>
          </CardContent>
          <CardActions sx={{ p: 2 }}>
            <Button type="submit" variant="contained" color="primary" fullWidth>
              Place Order
            </Button>
          </CardActions>
        </form>
      </Card>

      <Dialog
        open={isPaymentDialogOpen}
        onClose={() => !isProcessing && setPaymentDialogOpen(false)}
      >
        <DialogTitle>WeChat Pay</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Scan the QR code with WeChat to complete your payment.
          </DialogContentText>
          <Box
            sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', my: 3, gap: 2 }}
          >
            <img
              src="https://placehold.co/250x250/png?text=Scan+Me"
              alt="WeChat Pay QR Code"
              style={{ maxWidth: '100%', height: 'auto' }}
            />
            <Typography variant="body2" color="text.secondary">
              This is a simulation. Click the button below to proceed.
            </Typography>
            <Box sx={{ textAlign: 'center', mt: 2 }}>
              <Typography fontWeight="medium">Order Total: ${totalPrice().toFixed(2)}</Typography>
              <Typography variant="body2" color="text.secondary">
                Customer: {customerName}
              </Typography>
            </Box>
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2, pt: 0 }}>
          <Button
            onClick={handlePaymentSimulation}
            disabled={isProcessing}
            variant="contained"
            color="primary"
            fullWidth
            startIcon={isProcessing ? <CircularProgress size={20} color="inherit" /> : null}
          >
            {isProcessing ? 'Processing Payment...' : 'Simulate Successful Payment'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
