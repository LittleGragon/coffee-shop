'use client';

import Link from 'next/link';
import {
  Container,
  Typography,
  Box,
  Card,
  CardHeader,
  CardActionArea,
  Grid,
  Avatar
} from '@mui/material';
import {
  MenuBook as MenuIcon,
  Inventory as InventoryIcon,
  ShoppingCart as OrdersIcon,
  EventSeat as ReservationsIcon
} from '@mui/icons-material';

export default function Home() {
  return (
    <Container className="home-container" maxWidth="lg" sx={{ py: { xs: 6, md: 8 } }}>
      <Box sx={{ textAlign: 'center', mb: { xs: 6, md: 8 } }}>
        <Typography component="h1" gutterBottom sx={{ typography: { xs: 'h4', sm: 'h3', md: 'h2' }, fontWeight: 'bold' }}>
          Welcome to Coffee Shop Buddy
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          Manage your coffee shop operations with ease
        </Typography>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={4} lg={3}>
          <Card className="home-card"
            elevation={2}
            sx={{
              height: '100%',
              border: '1px solid',
              borderColor: 'divider',
              transition: 'box-shadow 0.2s',
              '&:hover': {
                boxShadow: 6
              }
            }}
          >
            <CardActionArea component={Link} href="/menu" sx={{ height: '100%' }}>
              <CardHeader
                avatar={
                  <Avatar variant="rounded" sx={{ bgcolor: 'primary.light', color: 'primary.dark', width: 40, height: 40 }}>
                    <MenuIcon fontSize="small" />
                  </Avatar>
                }
                title="Menu"
                subheader="Browse our delicious coffee and food offerings."
                titleTypographyProps={{ variant: 'h6' }}
                subheaderTypographyProps={{ variant: 'body2', color: 'text.secondary' }}
                sx={{ py: 3, px: 3 }}
              />
            </CardActionArea>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={4} lg={3}>
          <Card className="home-card"
            elevation={2}
            sx={{
              height: '100%',
              border: '1px solid',
              borderColor: 'divider',
              transition: 'box-shadow 0.2s',
              '&:hover': {
                boxShadow: 6
              }
            }}
          >
            <CardActionArea component={Link} href="/inventory" sx={{ height: '100%' }}>
              <CardHeader
                avatar={
                  <Avatar variant="rounded" sx={{ bgcolor: 'primary.light', color: 'primary.dark', width: 40, height: 40 }}>
                    <InventoryIcon fontSize="small" />
                  </Avatar>
                }
                title="Inventory"
                subheader="Manage your inventory and track stock levels."
                titleTypographyProps={{ variant: 'h6' }}
                subheaderTypographyProps={{ variant: 'body2', color: 'text.secondary' }}
                sx={{ py: 3, px: 3 }}
              />
            </CardActionArea>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={4} lg={3}>
          <Card className="home-card"
            elevation={2}
            sx={{
              height: '100%',
              border: '1px solid',
              borderColor: 'divider',
              transition: 'box-shadow 0.2s',
              '&:hover': {
                boxShadow: 6
              }
            }}
          >
            <CardActionArea component={Link} href="/orders" sx={{ height: '100%' }}>
              <CardHeader
                avatar={
                  <Avatar variant="rounded" sx={{ bgcolor: 'primary.light', color: 'primary.dark', width: 40, height: 40 }}>
                    <OrdersIcon fontSize="small" />
                  </Avatar>
                }
                title="Orders"
                subheader="View and manage customer orders."
                titleTypographyProps={{ variant: 'h6' }}
                subheaderTypographyProps={{ variant: 'body2', color: 'text.secondary' }}
                sx={{ py: 3, px: 3 }}
              />
            </CardActionArea>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={4} lg={3}>
          <Card className="home-card"
            elevation={2}
            sx={{
              height: '100%',
              border: '1px solid',
              borderColor: 'divider',
              transition: 'box-shadow 0.2s',
              '&:hover': {
                boxShadow: 6
              }
            }}
          >
            <CardActionArea component={Link} href="/reservations" sx={{ height: '100%' }}>
              <CardHeader
                avatar={
                  <Avatar variant="rounded" sx={{ bgcolor: 'primary.light', color: 'primary.dark', width: 40, height: 40 }}>
                    <ReservationsIcon fontSize="small" />
                  </Avatar>
                }
                title="Reservations"
                subheader="Manage table reservations and bookings."
                titleTypographyProps={{ variant: 'h6' }}
                subheaderTypographyProps={{ variant: 'body2', color: 'text.secondary' }}
                sx={{ py: 3, px: 3 }}
              />
            </CardActionArea>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
}