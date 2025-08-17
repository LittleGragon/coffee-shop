'use client';

import * as React from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  Link as MuiLink,
  Container,
  IconButton,
  Menu as MuiMenu,
  MenuItem
} from '@mui/material';
import CoffeeIcon from '@mui/icons-material/Coffee';
import MenuIcon from '@mui/icons-material/Menu';
import { usePathname } from 'next/navigation';

const NAV_LINKS = [
  { href: '/', label: 'Home' },
  { href: '/menu', label: 'Menu' },
  { href: '/inventory', label: 'Inventory' },
  { href: '/orders', label: 'Orders' },
  { href: '/reservations', label: 'Reservations' },
];

export default function Navigation() {
  const pathname = usePathname();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const openMenu = (e: React.MouseEvent<HTMLElement>) => setAnchorEl(e.currentTarget);
  const closeMenu = () => setAnchorEl(null);

  const isActive = (href: string) => pathname === href;

  return (
    <AppBar position="sticky" color="primary" sx={{ borderBottom: 1, borderColor: 'divider' }}>
      <Toolbar sx={{ display: 'flex', alignItems: 'center' }}>
        <Container maxWidth="lg" sx={{ display: 'flex', alignItems: 'center', gap: 2, px: { xs: 2, sm: 3 } }}>
          {/* Brand */}
          <MuiLink href="/" color="inherit" underline="none" sx={{ display: 'flex', alignItems: 'center' }}>
            <CoffeeIcon sx={{ mr: 1 }} style={{ fontSize: 24, width: '1em', height: '1em' }} />
            <Typography variant="h6" component="span" sx={{ fontWeight: 600, letterSpacing: 0.2, whiteSpace: 'nowrap' }}>
              Coffee Shop Buddy
            </Typography>
          </MuiLink>

          <Box sx={{ flexGrow: 1 }} />

          {/* Desktop nav */}
          <Box
            sx={{
              display: { xs: 'none', sm: 'flex' },
              columnGap: 2,
              '& > * + *': { ml: 2 }
            }}
          >
            {NAV_LINKS.map((link) => (
              <MuiLink
                key={link.href}
                href={link.href}
                color="inherit"
                underline="none"
                aria-current={isActive(link.href) ? 'page' : undefined}
                sx={{
                  position: 'relative',
                  fontWeight: 500,
                  fontSize: '0.9375rem',
                  px: 1.5,
                  py: 1,
                  borderRadius: 1,
                  transition: 'background-color .2s ease, color .2s ease',
                  bgcolor: isActive(link.href) ? 'primary.dark' : 'transparent',
                  color: isActive(link.href) ? 'primary.contrastText' : 'inherit',
                  '&:hover': { bgcolor: 'primary.main', color: 'primary.contrastText' },
                  '&::after': {
                    content: '""',
                    position: 'absolute',
                    left: 12,
                    right: 12,
                    bottom: 6,
                    height: 2,
                    borderRadius: 1,
                    backgroundColor: 'currentColor',
                    transform: isActive(link.href) ? 'scaleX(1)' : 'scaleX(0)',
                    transformOrigin: 'left',
                    transition: 'transform .2s ease'
                  },
                  '&:hover::after': { transform: 'scaleX(1)' },
                  '&:focus-visible': {
                    outline: '2px solid',
                    outlineColor: 'primary.contrastText',
                    outlineOffset: 2,
                    borderRadius: 1
                  }
                }}
              >
                {link.label}
              </MuiLink>
            ))}
          </Box>

          {/* Mobile nav (hamburger) */}
          <Box sx={{ display: { xs: 'flex', sm: 'none' } }}>
            <IconButton
              color="inherit"
              aria-label="open navigation menu"
              onClick={openMenu}
              size="large"
              sx={{ ml: 1 }}
            >
              <MenuIcon />
            </IconButton>
            <MuiMenu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={closeMenu}
              anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
              transformOrigin={{ vertical: 'top', horizontal: 'right' }}
              keepMounted
            >
              {NAV_LINKS.map((link) => (
                <MenuItem key={link.href} onClick={closeMenu} selected={isActive(link.href)}>
                  <MuiLink
                    href={link.href}
                    color="inherit"
                    underline="none"
                    aria-current={isActive(link.href) ? 'page' : undefined}
                    sx={{
                      display: 'block',
                      width: '100%',
                      fontWeight: isActive(link.href) ? 600 : 500,
                      py: 0.5
                    }}
                  >
                    {link.label}
                  </MuiLink>
                </MenuItem>
              ))}
            </MuiMenu>
          </Box>
        </Container>
      </Toolbar>
    </AppBar>
  );
}