// Icons
import FacebookIcon from '@mui/icons-material/Facebook';
import InstagramIcon from '@mui/icons-material/Instagram';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import LocalCafeIcon from '@mui/icons-material/LocalCafe';
import TwitterIcon from '@mui/icons-material/Twitter';
// Material UI imports
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { Link as RouterLink } from 'react-router-dom';

const footerLinks = [
  {
    title: 'Company',
    links: [
      { name: 'About Us', href: '/about' },
      { name: 'Careers', href: '/careers' },
      { name: 'News', href: '/news' },
      { name: 'Contact', href: '/contact' },
    ],
  },
  {
    title: 'Services',
    links: [
      { name: 'Catering', href: '/catering' },
      { name: 'Wholesale', href: '/wholesale' },
      { name: 'Gift Cards', href: '/gift-cards' },
      { name: 'Loyalty Program', href: '/membership' },
    ],
  },
  {
    title: 'Support',
    links: [
      { name: 'FAQ', href: '/faq' },
      { name: 'Shipping', href: '/shipping' },
      { name: 'Returns', href: '/returns' },
      { name: 'Privacy Policy', href: '/privacy' },
    ],
  },
];

export function Footer() {
  return (
    <Box
      component="footer"
      sx={{
        bgcolor: 'primary.main',
        color: 'white',
        py: 6,
        mt: 'auto',
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          {/* Logo and description */}
          <Grid item xs={12} md={4}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <LocalCafeIcon sx={{ mr: 1 }} />
              <Typography variant="h6" component="div" fontWeight="bold">
                Coffee Shop Buddy
              </Typography>
            </Box>
            <Typography variant="body2" sx={{ mb: 2 }}>
              Serving the finest coffee and pastries since 2010. Our mission is to provide an
              exceptional coffee experience in a warm and welcoming environment.
            </Typography>
            <Stack direction="row" spacing={1}>
              <IconButton color="inherit" aria-label="Facebook">
                <FacebookIcon />
              </IconButton>
              <IconButton color="inherit" aria-label="Twitter">
                <TwitterIcon />
              </IconButton>
              <IconButton color="inherit" aria-label="Instagram">
                <InstagramIcon />
              </IconButton>
              <IconButton color="inherit" aria-label="LinkedIn">
                <LinkedInIcon />
              </IconButton>
            </Stack>
          </Grid>

          {/* Links */}
          {footerLinks.map((section) => (
            <Grid item xs={12} sm={4} md={2} key={section.title}>
              <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                {section.title}
              </Typography>
              <Box component="ul" sx={{ listStyle: 'none', p: 0, m: 0 }}>
                {section.links.map((link) => (
                  <Box component="li" key={link.name} sx={{ mb: 1 }}>
                    <Link
                      component={RouterLink}
                      to={link.href}
                      color="inherit"
                      underline="hover"
                      sx={{ fontSize: '0.875rem' }}
                    >
                      {link.name}
                    </Link>
                  </Box>
                ))}
              </Box>
            </Grid>
          ))}

          {/* Contact info */}
          <Grid item xs={12} sm={4} md={2}>
            <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
              Contact Us
            </Typography>
            <Typography variant="body2" paragraph>
              123 Coffee Street
              <br />
              Seattle, WA 98101
            </Typography>
            <Typography variant="body2" paragraph>
              (555) 123-4567
              <br />
              info@coffeeshopbuddy.com
            </Typography>
          </Grid>
        </Grid>

        <Divider sx={{ my: 4, borderColor: 'rgba(255, 255, 255, 0.2)' }} />

        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            justifyContent: 'space-between',
            alignItems: { xs: 'center', sm: 'flex-start' },
          }}
        >
          <Typography variant="body2" sx={{ mb: { xs: 2, sm: 0 } }}>
            © {new Date().getFullYear()} Coffee Shop Buddy. All rights reserved.
          </Typography>
          <Box sx={{ display: 'flex', gap: 3 }}>
            <Link color="inherit" underline="hover" component={RouterLink} to="/terms">
              <Typography variant="body2">Terms of Service</Typography>
            </Link>
            <Link color="inherit" underline="hover" component={RouterLink} to="/privacy">
              <Typography variant="body2">Privacy Policy</Typography>
            </Link>
            <Link color="inherit" underline="hover" component={RouterLink} to="/cookies">
              <Typography variant="body2">Cookie Policy</Typography>
            </Link>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}
