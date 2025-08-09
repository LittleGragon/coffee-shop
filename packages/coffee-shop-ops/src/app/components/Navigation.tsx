'use client';

import { AppBar, Toolbar, Typography, Box, Link as MuiLink } from '@mui/material';
import CoffeeIcon from '@mui/icons-material/Coffee';

export default function Navigation() {
  return (
    <AppBar position="static" color="primary">
      <Toolbar>
        <CoffeeIcon sx={{ mr: 1 }} />
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Coffee Shop Buddy
        </Typography>
        <Box sx={{ display: 'flex', gap: 3 }}>
          <MuiLink href="/" color="inherit" underline="hover" sx={{ fontWeight: 500 }}>Home</MuiLink>
          <MuiLink href="/menu" color="inherit" underline="hover" sx={{ fontWeight: 500 }}>Menu</MuiLink>
          <MuiLink href="/inventory" color="inherit" underline="hover" sx={{ fontWeight: 500 }}>Inventory</MuiLink>
          <MuiLink href="/orders" color="inherit" underline="hover" sx={{ fontWeight: 500 }}>Orders</MuiLink>
          <MuiLink href="/reservations" color="inherit" underline="hover" sx={{ fontWeight: 500 }}>Reservations</MuiLink>
        </Box>
      </Toolbar>
    </AppBar>
  );
}