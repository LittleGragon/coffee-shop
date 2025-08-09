import { ShoppingCart, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useCartStore } from '@/stores/cart-store';
import { ShoppingCart as ShoppingCartSidebar } from '@/components/cart/shopping-cart';
import { Logo } from './logo';
import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';

const navLinks = [
  { href: '/menu', label: 'Menu' },
  { href: '/cakes', label: 'Cakes' },
  { href: '/reservations', label: 'Reservations' },
  { href: '/membership', label: 'Membership' },
];

export function Header() {
  const [isCartOpen, setCartOpen] = useState(false);
  const [isMenuOpen, setMenuOpen] = useState(false);
  const { items } = useCartStore();
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `transition-colors hover:text-foreground/80 ${
      isActive ? 'text-foreground' : 'text-foreground/60'
    }`;

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center">
          <div className="mr-4 hidden md:flex">
            <div className="mr-6 flex items-center space-x-2">
              <Link to="/" className="flex items-center gap-2">
                <Logo />
              </Link>
            </div>
            <nav className="flex items-center space-x-6 text-sm font-medium">
              {navLinks.map((link) => (
                <NavLink
                  key={link.label}
                  to={link.href}
                  className={navLinkClass}
                >
                  {link.label}
                </NavLink>
              ))}
            </nav>
          </div>

          <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
            <div className="md:hidden">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setMenuOpen(!isMenuOpen)}
              >
                {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                <span className="sr-only">Toggle Menu</span>
              </Button>
            </div>
            <div className="flex-1 md:flex-grow-0 md:hidden">
              <Link to="/" className="flex items-center gap-2">
                <Logo />
              </Link>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="relative"
              onClick={() => setCartOpen(true)}
            >
              <ShoppingCart className="h-6 w-6" />
              {totalItems > 0 && (
                <Badge
                  variant="secondary"
                  className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full p-2 text-xs"
                >
                  {totalItems}
                </Badge>
              )}
              <span className="sr-only">Open Cart</span>
            </Button>
          </div>
        </div>
        {isMenuOpen && (
          <div className="md:hidden">
            <nav className="flex flex-col items-start space-y-4 p-4">
              {navLinks.map((link) => (
                <NavLink
                  key={link.label}
                  to={link.href}
                  className={navLinkClass}
                  onClick={() => setMenuOpen(false)}
                >
                  {link.label}
                </NavLink>
              ))}
            </nav>
          </div>
        )}
      </header>
      <ShoppingCartSidebar open={isCartOpen} onOpenChange={setCartOpen} />
    </>
  );
}