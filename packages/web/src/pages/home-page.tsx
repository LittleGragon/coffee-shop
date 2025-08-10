import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import MobileStepper from '@mui/material/MobileStepper';
import Paper from '@mui/material/Paper';
import { styled } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { WishlistButton } from '@/components/WishlistButton';

// Fallback featured products if API fails
// Define product type
interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  wishlist_count?: number;
}

const fallbackProducts: Product[] = [
  {
    id: '1',
    name: 'Classic Cappuccino',
    price: 3.5,
    image:
      'https://images.unsplash.com/photo-1517256064527-09c73fc73e38?q=80&w=1974&auto=format&fit=crop',
  },
  {
    id: '2',
    name: 'Chocolate Croissant',
    price: 2.75,
    image:
      'https://images.unsplash.com/photo-1622399949624-5de74aa9553f?q=80&w=1974&auto=format&fit=crop',
  },
  {
    id: '3',
    name: 'Iced Latte',
    price: 4.0,
    image:
      'https://images.unsplash.com/photo-1579989993649-595ae7b39863?q=80&w=1974&auto=format&fit=crop',
  },
  {
    id: '4',
    name: 'Red Velvet Cake',
    price: 5.5,
    image:
      'https://images.unsplash.com/photo-1616541823729-00fe0aacd3be?q=80&w=1974&auto=format&fit=crop',
  },
];

const HeroSection = styled(Box)(() => ({
  position: 'relative',
  height: '500px',
  width: '100%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: 'white',
  overflow: 'hidden',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundImage:
      'url(https://images.unsplash.com/photo-1559925393-8be0ec4767c8?q=80&w=2070&auto=format&fit=crop)',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    filter: 'brightness(0.5)',
    zIndex: -1,
  },
}));

const ProductCard = styled(Card)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  transition: 'transform 0.3s ease-in-out',
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: theme.shadows[8],
  },
}));

const FeatureBox = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  textAlign: 'center',
  backgroundColor: 'rgba(163, 177, 138, 0.2)', // sage-green with opacity
  borderRadius: theme.shape.borderRadius,
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
}));

export function HomePage() {
  const [popularItems, setPopularItems] = useState(fallbackProducts);
  const [_loading, setLoading] = useState(true);
  const [activeStep, setActiveStep] = useState(0);
  const navigate = useNavigate();
  const maxSteps = popularItems.length;

  useEffect(() => {
    const fetchPopularItems = async () => {
      try {
        const response = await fetch('/api/wishlist/top?limit=4');
        if (response.ok) {
          const data = await response.json();
          if (Array.isArray(data) && data.length > 0) {
            // Transform data to match our component needs
            const transformedItems = data.map((item) => ({
              id: item.id,
              name: item.name,
              price: parseFloat(item.price),
              image:
                item.image_url ||
                `https://images.unsplash.com/photo-1517256064527-09c73fc73e38?q=80&w=1974&auto=format&fit=crop`,
              wishlist_count: item.wishlist_count,
            }));
            setPopularItems(transformedItems);
          }
        }
      } catch (_error) {
        // Error would be logged to a proper logging service in production
      } finally {
        setLoading(false);
      }
    };

    fetchPopularItems();
  }, []);

  const handleNext = () => {
    setActiveStep((prevActiveStep) => (prevActiveStep + 1) % maxSteps);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => (prevActiveStep - 1 + maxSteps) % maxSteps);
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 8, py: 6 }}>
      {/* Hero Section */}
      <HeroSection>
        <Box
          sx={{
            zIndex: 1,
            textAlign: 'center',
            px: 2,
            maxWidth: 'md',
            mx: 'auto',
          }}
        >
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <Typography variant="h2" component="h1" gutterBottom fontWeight="bold">
              Your Daily Dose of Bliss
            </Typography>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <Typography variant="h6" paragraph>
              Discover artisanal coffee, freshly baked pastries, and custom cakes made with love.
            </Typography>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <Button
              variant="contained"
              color="secondary"
              size="large"
              sx={{ mt: 3 }}
              onClick={() => navigate('/menu')}
            >
              Order Now
            </Button>
          </motion.div>
        </Box>
      </HeroSection>

      {/* Popular Items Section */}
      <Container maxWidth="lg">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <Typography
            variant="h4"
            component="h2"
            align="center"
            gutterBottom
            color="primary"
            sx={{ mb: 4 }}
          >
            Most Popular Items
          </Typography>

          {/* Desktop View - Grid */}
          <Box sx={{ display: { xs: 'none', md: 'block' } }}>
            <Grid container spacing={3}>
              {popularItems.map((product) => (
                <Grid key={product.id} xs={12} sm={6} md={3}>
                  <ProductCard elevation={3}>
                    <CardMedia
                      component="img"
                      height="200"
                      image={product.image}
                      alt={product.name}
                    />
                    <CardContent sx={{ flexGrow: 1 }}>
                      <Typography variant="h6" component="h3">
                        {product.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        ${product.price.toFixed(2)}
                      </Typography>
                      {product.wishlist_count && (
                        <Typography variant="caption" color="text.secondary">
                          {product.wishlist_count} people like this
                        </Typography>
                      )}
                    </CardContent>
                    <CardActions sx={{ justifyContent: 'space-between', px: 2, pb: 2 }}>
                      <Button size="small" color="primary">
                        Add to Cart
                      </Button>
                      <WishlistButton menuItemId={product.id} size="small" showCount={true} />
                    </CardActions>
                  </ProductCard>
                </Grid>
              ))}
            </Grid>
          </Box>

          {/* Mobile View - Simple Carousel */}
          <Box sx={{ display: { xs: 'block', md: 'none' }, maxWidth: 400, mx: 'auto' }}>
            <ProductCard elevation={3}>
              <CardMedia
                component="img"
                height="200"
                image={popularItems[activeStep].image}
                alt={popularItems[activeStep].name}
              />
              <CardContent>
                <Typography variant="h6" component="h3">
                  {popularItems[activeStep].name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  ${popularItems[activeStep].price.toFixed(2)}
                </Typography>
                {popularItems[activeStep].wishlist_count && (
                  <Typography variant="caption" color="text.secondary">
                    {popularItems[activeStep].wishlist_count} people like this
                  </Typography>
                )}
              </CardContent>
              <CardActions sx={{ justifyContent: 'space-between', px: 2, pb: 2 }}>
                <Button size="small" color="primary">
                  Add to Cart
                </Button>
                <WishlistButton
                  menuItemId={popularItems[activeStep].id}
                  size="small"
                  showCount={true}
                />
              </CardActions>
            </ProductCard>
            <MobileStepper
              steps={maxSteps}
              position="static"
              activeStep={activeStep}
              sx={{ mt: 2 }}
              nextButton={
                <Button size="small" onClick={handleNext} endIcon={<KeyboardArrowRight />}>
                  Next
                </Button>
              }
              backButton={
                <Button size="small" onClick={handleBack} startIcon={<KeyboardArrowLeft />}>
                  Back
                </Button>
              }
            />
          </Box>
        </motion.div>
      </Container>

      {/* Features Section */}
      <Container maxWidth="lg">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
        >
          <Grid container spacing={4}>
            <Grid xs={12} md={6}>
              <FeatureBox elevation={2}>
                <Typography variant="h5" component="h3" color="primary" gutterBottom>
                  Design Your Dream Cake
                </Typography>
                <Typography variant="body1" paragraph color="text.secondary">
                  Create a custom cake for any occasion.
                </Typography>
                <Button variant="contained" color="secondary" onClick={() => navigate('/cakes')}>
                  Design Your Cake
                </Button>
              </FeatureBox>
            </Grid>
            <Grid xs={12} md={6}>
              <FeatureBox elevation={2}>
                <Typography variant="h5" component="h3" color="primary" gutterBottom>
                  Book a Table
                </Typography>
                <Typography variant="body1" paragraph color="text.secondary">
                  Reserve your spot for a cozy in-store experience.
                </Typography>
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={() => alert('Table Booking coming soon!')}
                >
                  Book a Table
                </Button>
              </FeatureBox>
            </Grid>
          </Grid>
        </motion.div>
      </Container>
    </Box>
  );
}
