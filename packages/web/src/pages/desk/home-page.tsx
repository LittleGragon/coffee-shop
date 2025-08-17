import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import { useRouter } from 'next/router';

export default function HomePage() {
  const router = useRouter();

  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      <Box sx={{ textAlign: 'center', mb: 6 }}>
        <Typography variant="h3" component="h1" color="primary" gutterBottom fontWeight="bold">
          Coffee Shop Buddy
        </Typography>
        <Typography variant="h6" color="text.secondary">
          Your daily dose of bliss
        </Typography>
      </Box>

      <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mb: 4 }}>
        <Button 
          variant="contained" 
          color="primary"
          onClick={() => router.push('/menu')}
        >
          View Menu
        </Button>
        <Button 
          variant="outlined" 
          color="secondary"
          onClick={() => router.push('/checkout')}
        >
          Checkout
        </Button>
      </Box>

      <Box sx={{ textAlign: 'center', mt: 8 }}>
        <Typography variant="body1">
          Welcome to Coffee Shop Buddy, where we serve the finest coffee and pastries.
        </Typography>
      </Box>
    </Container>
  );
}