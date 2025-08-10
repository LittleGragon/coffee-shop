import { createTheme } from '@mui/material/styles';

// Define custom colors
const coffeeShopColors = {
  coffeeBrown: '#5d4037',
  creamColor: '#f8f5f0',
  sageGreen: '#8a9a5b',
  accentOrange: '#ff9800',
  lightBrown: '#8d6e63',
  darkBrown: '#3e2723',
  lightGray: '#f5f5f5',
  mediumGray: '#9e9e9e',
};

// Create a theme instance
const theme = createTheme({
  palette: {
    primary: {
      main: coffeeShopColors.coffeeBrown,
      light: coffeeShopColors.lightBrown,
      dark: coffeeShopColors.darkBrown,
      contrastText: '#fff',
    },
    secondary: {
      main: coffeeShopColors.sageGreen,
      contrastText: coffeeShopColors.coffeeBrown,
    },
    error: {
      main: '#f44336',
    },
    warning: {
      main: coffeeShopColors.accentOrange,
    },
    info: {
      main: '#2196f3',
    },
    success: {
      main: '#4caf50',
    },
    background: {
      default: coffeeShopColors.creamColor,
      paper: '#fff',
    },
    text: {
      primary: coffeeShopColors.coffeeBrown,
      secondary: coffeeShopColors.lightBrown,
    },
  },
  typography: {
    fontFamily: '"Poppins", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 600,
    },
    h2: {
      fontWeight: 600,
    },
    h3: {
      fontWeight: 600,
    },
    h4: {
      fontWeight: 500,
    },
    h5: {
      fontWeight: 500,
    },
    h6: {
      fontWeight: 500,
    },
    button: {
      textTransform: 'none',
      fontWeight: 500,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          padding: '8px 16px',
        },
        contained: {
          boxShadow: 'none',
          '&:hover': {
            boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.08)',
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.08)',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 8,
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 16,
        },
      },
    },
    MuiFab: {
      styleOverrides: {
        root: {
          boxShadow: '0px 3px 8px rgba(0, 0, 0, 0.15)',
        },
      },
    },
  },
});

export default theme;
