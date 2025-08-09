import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import ThemeRegistry from './theme';
import { Container, Box, Typography } from '@mui/material';
import Navigation from './components/Navigation';
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
          <Navigation />
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
