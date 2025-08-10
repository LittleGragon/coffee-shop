// Material UI imports
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import Checkbox from '@mui/material/Checkbox';
import Container from '@mui/material/Container';
import Divider from '@mui/material/Divider';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormGroup from '@mui/material/FormGroup';
import FormLabel from '@mui/material/FormLabel';
import Grid from '@mui/material/Grid';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Paper from '@mui/material/Paper';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import Select from '@mui/material/Select';
import { styled } from '@mui/material/styles';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { useState } from 'react';
import { toast } from 'sonner';
import { submitCakeOrder } from '@/lib/api';
import { useCartStore } from '@/stores/cart-store';

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

const fontOptions = [
  { id: 'serif', name: 'Elegant', fontFamily: 'serif' },
  { id: 'sans-serif', name: 'Modern', fontFamily: 'sans-serif' },
  { id: 'cursive', name: 'Fancy', fontFamily: 'cursive' },
  { id: 'monospace', name: 'Classic', fontFamily: 'monospace' },
];

type Cake = {
  size: (typeof customizationOptions.sizes)[0];
  flavor: (typeof customizationOptions.flavors)[0];
  frosting: (typeof customizationOptions.frostings)[0];
  toppings: string[];
  message: string;
  font: (typeof fontOptions)[0];
};

const ColorCircle = styled('div')(({ theme }) => ({
  width: 48,
  height: 48,
  borderRadius: '50%',
  border: `1px solid ${theme.palette.divider}`,
  margin: '0 auto 8px auto',
}));

export function CakeCustomizationPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [cake, setCake] = useState<Cake>({
    size: customizationOptions.sizes[0],
    flavor: customizationOptions.flavors[0],
    frosting: customizationOptions.frostings[0],
    toppings: [],
    message: '',
    font: fontOptions[0],
  });

  const { addToCart } = useCartStore();

  const handleNext = () => setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1));
  const handleBack = () => setCurrentStep((prev) => Math.max(prev - 1, 0));

  const calculatePrice = () => {
    let total = cake.size.price + cake.flavor.price;
    cake.toppings.forEach((toppingId) => {
      const topping = customizationOptions.toppings.find((t) => t.id === toppingId);
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

      // Consider the order successful if we have a message or orderId
      if (result.message || result.orderId) {
        const cakeName = `Custom ${cake.size.name} Cake`;
        const cakeId = `custom-cake-${Date.now()}`;

        addToCart({
          id: cakeId,
          name: cakeName,
          category: 'Cakes',
          price: finalPrice,
          image: `https://placehold.co/100x100/d4a373/ffffff?text=Custom+Cake`,
        });

        toast.success('Custom Cake Added!', {
          description: `${cakeName} has been added to your cart.`,
        });
      } else {
        toast.error('Order Failed', {
          description: result.message || 'There was a problem submitting your cake order.',
        });
      }
    } catch (_error: unknown) {
      // Error logging would go to a proper logging service in production
      toast.error('Order Failed', {
        description: 'An unexpected error occurred. Please try again later.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSizeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newSize = customizationOptions.sizes.find((s) => s.id === event.target.value);
    if (newSize) setCake({ ...cake, size: newSize });
  };

  // This function is not used directly as we're using the inline version in the Select component
  const _handleFlavorChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    const newFlavor = customizationOptions.flavors.find((f) => f.id === event.target.value);
    if (newFlavor) setCake({ ...cake, flavor: newFlavor });
  };

  const handleFrostingChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newFrosting = customizationOptions.frostings.find((f) => f.id === event.target.value);
    if (newFrosting) setCake({ ...cake, frosting: newFrosting });
  };

  const handleToppingChange =
    (toppingId: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
      const newToppings = event.target.checked
        ? [...cake.toppings, toppingId]
        : cake.toppings.filter((id) => id !== toppingId);
      setCake({ ...cake, toppings: newToppings });
    };

  const handleFontChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newFont = fontOptions.find((f) => f.id === event.target.value);
    if (newFont) setCake({ ...cake, font: newFont });
  };

  const renderStepContent = () => {
    switch (steps[currentStep].id) {
      case 'size':
        return (
          <FormControl component="fieldset" fullWidth>
            <RadioGroup value={cake.size.id} onChange={handleSizeChange}>
              {customizationOptions.sizes.map((s) => (
                <Paper
                  key={s.id}
                  elevation={cake.size.id === s.id ? 3 : 1}
                  sx={{
                    mb: 2,
                    borderColor: cake.size.id === s.id ? 'secondary.main' : 'divider',
                    borderWidth: 1,
                    borderStyle: 'solid',
                    bgcolor: cake.size.id === s.id ? 'rgba(138, 154, 91, 0.1)' : 'background.paper',
                  }}
                >
                  <FormControlLabel
                    value={s.id}
                    control={<Radio />}
                    label={
                      <Box
                        sx={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          width: '100%',
                          alignItems: 'center',
                        }}
                      >
                        <Typography>{s.name}</Typography>
                        <Typography color="primary" fontWeight="bold">
                          ${s.price.toFixed(2)}
                        </Typography>
                      </Box>
                    }
                    sx={{
                      width: '100%',
                      m: 0,
                      p: 2,
                    }}
                  />
                </Paper>
              ))}
            </RadioGroup>
          </FormControl>
        );
      case 'flavor':
        return (
          <FormControl fullWidth>
            <InputLabel id="flavor-select-label">Cake Flavor</InputLabel>
            <Select
              labelId="flavor-select-label"
              id="flavor-select"
              value={cake.flavor.id}
              label="Cake Flavor"
              onChange={(e) => {
                const newFlavor = customizationOptions.flavors.find((f) => f.id === e.target.value);
                if (newFlavor) setCake({ ...cake, flavor: newFlavor });
              }}
            >
              {customizationOptions.flavors.map((f) => (
                <MenuItem key={f.id} value={f.id}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                    <Typography>{f.name}</Typography>
                    <Typography color="primary">
                      {f.price > 0 ? `+$${f.price.toFixed(2)}` : 'Included'}
                    </Typography>
                  </Box>
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        );
      case 'frosting':
        return (
          <FormControl component="fieldset" fullWidth>
            <RadioGroup value={cake.frosting.id} onChange={handleFrostingChange}>
              <Grid container spacing={2}>
                {customizationOptions.frostings.map((f) => (
                  <Grid item xs={12} sm={4} key={f.id}>
                    <Paper
                      elevation={cake.frosting.id === f.id ? 3 : 1}
                      sx={{
                        p: 2,
                        textAlign: 'center',
                        borderColor: cake.frosting.id === f.id ? 'secondary.main' : 'divider',
                        borderWidth: 1,
                        borderStyle: 'solid',
                        bgcolor:
                          cake.frosting.id === f.id
                            ? 'rgba(138, 154, 91, 0.1)'
                            : 'background.paper',
                      }}
                    >
                      <FormControlLabel
                        value={f.id}
                        control={<Radio sx={{ display: 'none' }} />}
                        label={
                          <Box
                            sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}
                          >
                            <ColorCircle style={{ backgroundColor: f.color }} />
                            <Typography variant="body2">{f.name}</Typography>
                          </Box>
                        }
                        sx={{ m: 0, width: '100%' }}
                      />
                    </Paper>
                  </Grid>
                ))}
              </Grid>
            </RadioGroup>
          </FormControl>
        );
      case 'toppings':
        return (
          <FormGroup>
            {customizationOptions.toppings.map((t) => (
              <Paper
                key={t.id}
                elevation={cake.toppings.includes(t.id) ? 3 : 1}
                sx={{
                  mb: 2,
                  borderColor: cake.toppings.includes(t.id) ? 'secondary.main' : 'divider',
                  borderWidth: 1,
                  borderStyle: 'solid',
                  bgcolor: cake.toppings.includes(t.id)
                    ? 'rgba(138, 154, 91, 0.1)'
                    : 'background.paper',
                }}
              >
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={cake.toppings.includes(t.id)}
                      onChange={handleToppingChange(t.id)}
                    />
                  }
                  label={
                    <Box
                      sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        width: '100%',
                        alignItems: 'center',
                      }}
                    >
                      <Typography>{t.name}</Typography>
                      <Typography color="primary" fontWeight="medium">
                        +${t.price.toFixed(2)}
                      </Typography>
                    </Box>
                  }
                  sx={{ width: '100%', m: 0, p: 2 }}
                />
              </Paper>
            ))}
          </FormGroup>
        );
      case 'message':
        return (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <TextField
              label="Cake Message"
              placeholder="Happy Birthday!"
              value={cake.message}
              onChange={(e) => setCake({ ...cake, message: e.target.value })}
              fullWidth
              variant="outlined"
            />

            <Box>
              <FormLabel component="legend" sx={{ mb: 2 }}>
                Choose a Font Style
              </FormLabel>
              <RadioGroup value={cake.font.id} onChange={handleFontChange}>
                <Grid container spacing={2}>
                  {fontOptions.map((font) => (
                    <Grid item xs={6} key={font.id}>
                      <Paper
                        elevation={cake.font.id === font.id ? 3 : 1}
                        sx={{
                          p: 2,
                          textAlign: 'center',
                          borderColor: cake.font.id === font.id ? 'secondary.main' : 'divider',
                          borderWidth: 1,
                          borderStyle: 'solid',
                          bgcolor:
                            cake.font.id === font.id
                              ? 'rgba(138, 154, 91, 0.1)'
                              : 'background.paper',
                        }}
                      >
                        <FormControlLabel
                          value={font.id}
                          control={<Radio sx={{ display: 'none' }} />}
                          label={
                            <Typography style={{ fontFamily: font.fontFamily }} variant="h6">
                              {font.name}
                            </Typography>
                          }
                          sx={{ m: 0, width: '100%' }}
                        />
                      </Paper>
                    </Grid>
                  ))}
                </Grid>
              </RadioGroup>
            </Box>
          </Box>
        );
      default:
        return null;
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      <Box sx={{ textAlign: 'center', mb: 6 }}>
        <Typography variant="h3" component="h1" color="primary" gutterBottom fontWeight="bold">
          Design Your Custom Cake
        </Typography>
        <Typography variant="h6" color="text.secondary">
          Create a unique cake for any occasion.
        </Typography>
      </Box>

      <Grid container spacing={4}>
        <Grid item xs={12} md={8}>
          <Card elevation={3}>
            <CardHeader
              title={
                <Box
                  sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                >
                  <Typography variant="h5" component="h2">
                    {steps[currentStep].title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Step {currentStep + 1} of {steps.length}
                  </Typography>
                </Box>
              }
            />
            <CardContent sx={{ minHeight: 300 }}>{renderStepContent()}</CardContent>
          </Card>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
            <Button variant="outlined" onClick={handleBack} disabled={currentStep === 0}>
              Back
            </Button>
            {currentStep < steps.length - 1 ? (
              <Button variant="contained" onClick={handleNext} color="secondary">
                Next
              </Button>
            ) : (
              <Button
                variant="contained"
                onClick={handleAddToCart}
                disabled={isSubmitting}
                color="secondary"
              >
                {isSubmitting ? 'Adding to Cart...' : 'Add to Cart'}
              </Button>
            )}
          </Box>
        </Grid>

        <Grid item xs={12} md={4}>
          <Box sx={{ position: 'sticky', top: 24 }}>
            <Card elevation={3}>
              <CardHeader title="Your Creation" />
              <CardContent>
                <Box
                  sx={{
                    aspectRatio: '1/1',
                    width: '100%',
                    bgcolor: 'grey.100',
                    borderRadius: 2,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mb: 3,
                    position: 'relative',
                    overflow: 'hidden',
                  }}
                >
                  {/* Cake Preview */}
                  <Box
                    sx={{
                      position: 'relative',
                      width: '80%',
                      height: '80%',
                    }}
                  >
                    <Box
                      sx={{
                        position: 'absolute',
                        bottom: 0,
                        width: '100%',
                        height: '100%',
                        borderRadius: '50%',
                        backgroundColor: cake.frosting.color,
                        transform: `scale(${0.7 + customizationOptions.sizes.findIndex((s) => s.id === cake.size.id) * 0.15})`,
                      }}
                    />
                    {cake.toppings.includes('chocolate-drip') && (
                      <Box
                        sx={{
                          position: 'absolute',
                          top: 0,
                          width: '100%',
                          height: '33%',
                          bgcolor: '#4B2E2A',
                          borderTopLeftRadius: '50%',
                          borderTopRightRadius: '50%',
                          maskImage: 'url(/drip.svg)',
                          maskSize: 'cover',
                        }}
                      />
                    )}
                    {cake.toppings.includes('sprinkles') && (
                      <Box
                        sx={{
                          position: 'absolute',
                          inset: 0,
                          width: '100%',
                          height: '100%',
                          backgroundImage: 'url(/sprinkles.svg)',
                          backgroundSize: 'contain',
                        }}
                      />
                    )}
                    {cake.message && (
                      <Box
                        sx={{
                          position: 'absolute',
                          top: '50%',
                          left: '50%',
                          transform: 'translate(-50%, -50%)',
                          textAlign: 'center',
                          bgcolor: 'rgba(255, 255, 255, 0.5)',
                          px: 1,
                          py: 0.5,
                          borderRadius: 1,
                          maxWidth: '80%',
                          wordBreak: 'break-word',
                        }}
                        style={{ fontFamily: cake.font.fontFamily }}
                      >
                        <Typography variant="body2" color="primary">
                          {cake.message}
                        </Typography>
                      </Box>
                    )}
                  </Box>
                </Box>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <Typography variant="h6" color="primary">
                    Summary
                  </Typography>
                  <Typography variant="body2">Size: {cake.size.name}</Typography>
                  <Typography variant="body2">Flavor: {cake.flavor.name}</Typography>
                  <Typography variant="body2">Frosting: {cake.frosting.name}</Typography>
                  <Typography variant="body2">
                    Toppings:{' '}
                    {cake.toppings
                      .map((t) => customizationOptions.toppings.find((opt) => opt.id === t)?.name)
                      .join(', ') || 'None'}
                  </Typography>
                  {cake.message && <Typography variant="body2">Font: {cake.font.name}</Typography>}
                  <Divider sx={{ my: 2 }} />
                  <Box
                    sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                  >
                    <Typography variant="h6" fontWeight="bold">
                      Total:
                    </Typography>
                    <Typography variant="h6" fontWeight="bold" color="primary">
                      ${calculatePrice().toFixed(2)}
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
}
