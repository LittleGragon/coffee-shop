import { Route, Routes } from 'react-router-dom';
import { Toaster } from '@/components/ui/sonner';
import { Footer } from './components/layout/footer';
import { Header } from './components/layout/header';
import { HomePage } from './pages/home-page';
import { MenuPage } from './pages/menu-page';
import { CakeCustomizationPage } from './pages/cake-customization-page';
import { ReservationPage } from './pages/reservation-page';
import { MembershipPage } from './pages/membership-page';
import { CheckoutPage } from './pages/checkout-page';

function App() {
  return (
    <div className="flex flex-col min-h-screen bg-background font-sans antialiased">
      <Header />
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/menu" element={<MenuPage />} />
          <Route path="/cakes" element={<CakeCustomizationPage />} />
          <Route path="/reservations" element={<ReservationPage />} />
          <Route path="/membership" element={<MembershipPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
        </Routes>
      </main>
      <Footer />
      <Toaster />
    </div>
  );
}

export default App;