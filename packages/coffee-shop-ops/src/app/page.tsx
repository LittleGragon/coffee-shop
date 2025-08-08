'use client';

import Link from 'next/link';
import { 
  Container, 
  Typography, 
  Box, 
  Grid, 
  Card, 
  CardContent, 
  CardActionArea
} from '@mui/material';
import TestErrorBoundary from './components/TestErrorBoundary';
import {
  MenuBook as MenuIcon,
  Inventory as InventoryIcon,
  ShoppingCart as OrdersIcon,
  EventSeat as ReservationsIcon
} from '@mui/icons-material';

export default function Home() {
  return (
    <Container maxWidth="lg" sx={{ py: 8 }}>
      <Box sx={{ textAlign: 'center', mb: 8 }}>
        <Typography variant="h2" component="h1" fontWeight="bold" gutterBottom>
          Welcome to Coffee Shop Buddy
        </Typography>
        <Typography variant="h5" color="text.secondary">
          Manage your coffee shop operations with ease
        </Typography>
      </Box>

      <Grid container spacing={4}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card 
            elevation={2} 
            sx={{ 
              height: '100%', 
              transition: 'transform 0.2s, box-shadow 0.2s',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: 6
              }
            }}
          >
            <CardActionArea component={Link} href="/menu" sx={{ height: '100%' }}>
              <CardContent sx={{ textAlign: 'center', p: 4 }}>
                <MenuIcon sx={{ fontSize: 60, mb: 2, color: 'primary.main' }} />
                <Typography variant="h5" component="h2" gutterBottom>
                  Menu
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Browse our delicious coffee and food offerings.
                </Typography>
              </CardContent>
            </CardActionArea>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card 
            elevation={2} 
            sx={{ 
              height: '100%', 
              transition: 'transform 0.2s, box-shadow 0.2s',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: 6
              }
            }}
          >
            <CardActionArea component={Link} href="/inventory" sx={{ height: '100%' }}>
              <CardContent sx={{ textAlign: 'center', p: 4 }}>
                <InventoryIcon sx={{ fontSize: 60, mb: 2, color: 'primary.main' }} />
                <Typography variant="h5" component="h2" gutterBottom>
                  Inventory
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Manage your inventory and track stock levels.
                </Typography>
              </CardContent>
            </CardActionArea>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card 
            elevation={2} 
            sx={{ 
              height: '100%', 
              transition: 'transform 0.2s, box-shadow 0.2s',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: 6
              }
            }}
          >
            <CardActionArea component={Link} href="/orders" sx={{ height: '100%' }}>
              <CardContent sx={{ textAlign: 'center', p: 4 }}>
                <OrdersIcon sx={{ fontSize: 60, mb: 2, color: 'primary.main' }} />
                <Typography variant="h5" component="h2" gutterBottom>
                  Orders
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  View and manage customer orders.
                </Typography>
              </CardContent>
            </CardActionArea>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card 
            elevation={2} 
            sx={{ 
              height: '100%', 
              transition: 'transform 0.2s, box-shadow 0.2s',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: 6
              }
            }}
          >
            <CardActionArea component={Link} href="/reservations" sx={{ height: '100%' }}>
              <CardContent sx={{ textAlign: 'center', p: 4 }}>
                <ReservationsIcon sx={{ fontSize: 60, mb: 2, color: 'primary.main' }} />
                <Typography variant="h5" component="h2" gutterBottom>
                  Reservations
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Manage table reservations and bookings.
                </Typography>
              </CardContent>
            </CardActionArea>
          </Card>
        </Grid>
      </Grid>
      
      {/* Test Error Boundary - Remove in production */}
      <TestErrorBoundary />
    </Container>
  );
}