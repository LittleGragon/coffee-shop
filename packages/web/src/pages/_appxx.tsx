import { AppProps } from 'next/app';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Toaster } from 'sonner';
import { useEffect } from 'react';
import theme from '@/theme';

export default function App({ Component, pageProps }: AppProps) {
//   useEffect(() => {
//     // Remove the server-side injected CSS
//     const jssStyles = document.querySelector('#jss-server-side');
//     if (jssStyles && jssStyles.parentElement) {
//       jssStyles.parentElement.removeChild(jssStyles);
//     }
//   }, []);

  return (
    <>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Component {...pageProps} />
        <Toaster position="top-right" richColors />
      </ThemeProvider>
    </>
  );
}
