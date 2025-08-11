import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import { useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import { AuthModal } from './components/AuthModal';
import { FloatingCartButton } from './components/cart/FloatingCartButton';
import { ShoppingCart } from './components/cart/shopping-cart';
import { Footer } from './components/layout/footer';
import { Header } from './components/layout/header';
import { ToastProvider } from './components/ToastProvider';
import { AuthContext, useAuthState } from './hooks/useAuth';
import { CakeCustomizationPage } from './pages/cake-customization-page';
import { CheckoutPage } from './pages/checkout-page';
import { HomePage } from './pages/home-page';
import { MembershipPage } from './pages/membership-page';
import { MenuPage } from './pages/menu-page';
import { ReservationPage } from './pages/reservation-page';
import { useCartDrawerStore } from './stores/cart-drawer-store';

function App() {
  const authState = useAuthState();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const { isOpen, close } = useCartDrawerStore();

  return (
    <AuthContext.Provider value={authState}>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          minHeight: '100vh',
        }}
      >
        <Header onAuthClick={() => setIsAuthModalOpen(true)} />
        <Box component="main" sx={{ flexGrow: 1 }}>
          <Container maxWidth="lg" sx={{ py: 3 }}>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/menu" element={<MenuPage />} />
              <Route path="/cakes" element={<CakeCustomizationPage />} />
              <Route path="/reservations" element={<ReservationPage />} />
              <Route path="/membership" element={<MembershipPage />} />
              <Route path="/checkout" element={<CheckoutPage />} />
            </Routes>
          </Container>
        </Box>
        <Footer />
        <FloatingCartButton />
        <ToastProvider />

        <ShoppingCart open={isOpen} onOpenChange={close} />

        <AuthModal
          isOpen={isAuthModalOpen}
          onClose={() => setIsAuthModalOpen(false)}
          onLogin={authState.login}
        />
      </Box>
    </AuthContext.Provider>
  );
}

export default App;
