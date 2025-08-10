import CloseIcon from '@mui/icons-material/Close';
import DeleteIcon from '@mui/icons-material/Delete';
import RemoveShoppingCartIcon from '@mui/icons-material/RemoveShoppingCart';
import ShoppingCartCheckoutIcon from '@mui/icons-material/ShoppingCartCheckout';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
// Material UI imports
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { Link } from 'react-router-dom';
import { useCartStore } from '@/stores/cart-store';

interface ShoppingCartProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ShoppingCart({ open, onOpenChange }: ShoppingCartProps) {
  const { items, removeFromCart, updateQuantity, clearCart } = useCartStore();

  const total = items.reduce((acc, item) => acc + item.price * item.quantity, 0);

  const handleClose = () => {
    onOpenChange(false);
  };

  const handleQuantityChange = (id: string, value: string) => {
    const quantity = parseInt(value);
    if (!Number.isNaN(quantity) && quantity > 0) {
      updateQuantity(id, quantity);
    }
  };

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={handleClose}
      PaperProps={{
        sx: {
          width: { xs: '100%', sm: 400 },
          maxWidth: '100%',
          bgcolor: '#f8f5f0', // cream color
        },
      }}
    >
      <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
        {/* Header */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            p: 2,
            borderBottom: '1px solid rgba(0, 0, 0, 0.12)',
          }}
        >
          <Typography variant="h6" color="primary">
            Shopping Cart
          </Typography>
          <IconButton onClick={handleClose} edge="end">
            <CloseIcon />
          </IconButton>
        </Box>

        {/* Cart Items */}
        <Box
          sx={{
            flexGrow: 1,
            overflowY: 'auto',
            p: 2,
          }}
        >
          {items.length === 0 ? (
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                height: '100%',
                gap: 2,
              }}
            >
              <RemoveShoppingCartIcon sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
              <Typography color="text.secondary">Your cart is empty.</Typography>
              <Button
                variant="contained"
                onClick={handleClose}
                sx={{
                  bgcolor: '#8a9a5b', // sage green
                  color: '#5d4037', // coffee brown
                  '&:hover': {
                    bgcolor: 'rgba(138, 154, 91, 0.9)',
                  },
                }}
              >
                Continue Shopping
              </Button>
            </Box>
          ) : (
            <Box>
              {items.map((item, index) => (
                <Box key={item.id}>
                  {index > 0 && <Divider sx={{ my: 2 }} />}
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', py: 1 }}>
                    <Box sx={{ display: 'flex', gap: 2 }}>
                      <Box
                        component="img"
                        src={item.image}
                        alt={item.name}
                        sx={{
                          width: 64,
                          height: 64,
                          borderRadius: 1,
                          objectFit: 'cover',
                        }}
                      />
                      <Box>
                        <Typography variant="subtitle1" sx={{ color: '#5d4037' }}>
                          {item.name}
                        </Typography>
                        <Typography variant="body2" sx={{ color: 'rgba(93, 64, 55, 0.8)' }}>
                          ${item.price.toFixed(2)}
                        </Typography>
                      </Box>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <TextField
                        type="number"
                        size="small"
                        inputProps={{ min: 1, style: { textAlign: 'center' } }}
                        value={item.quantity}
                        onChange={(e) => handleQuantityChange(item.id, e.target.value)}
                        sx={{ width: 60 }}
                      />
                      <IconButton
                        size="small"
                        onClick={() => removeFromCart(item.id)}
                        color="error"
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Box>
                  </Box>
                </Box>
              ))}
            </Box>
          )}
        </Box>

        {/* Footer with total and checkout button */}
        {items.length > 0 && (
          <Box
            sx={{
              p: 2,
              borderTop: '1px solid rgba(0, 0, 0, 0.12)',
              bgcolor: '#f8f5f0', // cream color
            }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
              <Typography variant="h6" sx={{ color: '#5d4037' }}>
                Total:
              </Typography>
              <Typography variant="h6" sx={{ color: '#5d4037' }}>
                ${total.toFixed(2)}
              </Typography>
            </Box>

            <Button
              component={Link}
              to="/checkout"
              variant="contained"
              fullWidth
              startIcon={<ShoppingCartCheckoutIcon />}
              onClick={handleClose}
              sx={{
                mb: 1,
                bgcolor: '#8a9a5b', // sage green
                color: '#5d4037', // coffee brown
                '&:hover': {
                  bgcolor: 'rgba(138, 154, 91, 0.9)',
                },
              }}
            >
              Checkout
            </Button>

            <Button
              variant="outlined"
              fullWidth
              startIcon={<RemoveShoppingCartIcon />}
              onClick={clearCart}
              sx={{
                borderColor: 'rgba(93, 64, 55, 0.5)',
                color: '#5d4037',
                '&:hover': {
                  borderColor: '#5d4037',
                  bgcolor: 'rgba(93, 64, 55, 0.04)',
                },
              }}
            >
              Clear Cart
            </Button>
          </Box>
        )}
      </Box>
    </Drawer>
  );
}
