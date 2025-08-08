import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import ThemeRegistry from './theme';
import { AppBar, Toolbar, Typography, Container, Box, Link as MuiLink } from '@mui/material';
import CoffeeIcon from '@mui/icons-material/Coffee';
import ErrorBoundary from './components/ErrorBoundary';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Coffee Shop Buddy - Next.js Edition',
  description: 'A coffee shop management system built with Next.js',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeRegistry>
          <AppBar position="static" color="primary" elevation={2} square>
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
          <Box component="main" sx={{ minHeight: 'calc(100vh - 128px)' }}>
            <ErrorBoundary>
              {children}
            </ErrorBoundary>
          </Box>
          <Box component="footer" sx={{ py: 3, px: 2, mt: 'auto', backgroundColor: 'background.paper', borderTop: 1, borderColor: 'divider' }}>
            <Container maxWidth="lg">
              <Typography variant="body2" color="text.secondary" align="center">
                © 2025 Coffee Shop Buddy - Next.js Edition
              </Typography>
            </Container>
          </Box>
        </ThemeRegistry>
      </body>
    </html>
  );
}