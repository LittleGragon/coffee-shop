'use client';

import * as React from 'react';
import { ReactNode } from 'react';
import { useServerInsertedHTML } from 'next/navigation';
import { CacheProvider } from '@emotion/react';
import createCache from '@emotion/cache';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

// App theme (unchanged)
const theme = createTheme({
  palette: {
    primary: {
      main: '#6b4226',
      light: '#8c6242',
      dark: '#4a2e1a',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#d4a76a',
      light: '#e3c195',
      dark: '#b38a4d',
      contrastText: '#000000',
    },
    background: {
      default: '#f9f5f0',
      paper: '#ffffff',
    },
    text: {
      primary: '#333333',
      secondary: '#666666',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h1: { fontWeight: 500 },
    h2: { fontWeight: 500 },
    h3: { fontWeight: 500 },
    h4: { fontWeight: 500 },
    h5: { fontWeight: 500 },
    h6: { fontWeight: 500 },
  },
  components: {
    MuiButton: {
      styleOverrides: { root: { textTransform: 'none', borderRadius: 8 } },
    },
    MuiPaper: {
      styleOverrides: { root: { borderRadius: 8 } },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          borderRadius: 0,
          boxShadow:
            '0px 2px 4px -1px rgba(0,0,0,0.2), 0px 4px 5px 0px rgba(0,0,0,0.14), 0px 1px 10px 0px rgba(0,0,0,0.12)',
        },
      },
    },
    MuiCssBaseline: {
      styleOverrides: { body: { scrollbarGutter: 'stable' } },
    },
  },
  cssVariables: true,
});

export default function ThemeRegistry({ children }: { children: ReactNode }) {
  // Per-request Emotion cache with server injection support
  const [emotionCache] = React.useState(() => {
    const cache = createCache({ key: 'mui', prepend: true });
    // Enable Emotion compat mode for better SSR compatibility
    (cache as any).compat = true;

    // Intercept insert to collect critical CSS for SSR
    let insertedCSS: string[] = [];
    const prevInsert = cache.insert;
    cache.insert = (...args: any[]) => {
      // args: (selector, serialized, sheet, shouldCache)
      const serialized = args[1];
      if (!cache.inserted[serialized.name]) {
        insertedCSS.push(`.${serialized.name}{${serialized.styles}}`);
      }
      return (prevInsert as any)(...args);
    };

    // Provide a flush method to consume collected CSS
    (cache as any).flush = () => {
      const css = insertedCSS.join('');
      insertedCSS = [];
      return css;
    };

    return cache;
  });

  // Inject collected styles during SSR to avoid hydration mismatch
  useServerInsertedHTML(() => {
    const css = (emotionCache as any).flush();
    if (!css) return null;

    const names = Object.keys(emotionCache.inserted).join(' ');
    return (
      <style
        data-emotion={`${emotionCache.key} ${names}`}
        dangerouslySetInnerHTML={{ __html: css }}
      />
    );
  });

  return (
    <CacheProvider value={emotionCache}>
      <ThemeProvider theme={theme}>
        <CssBaseline enableColorScheme />
        {children}
      </ThemeProvider>
    </CacheProvider>
  );
}