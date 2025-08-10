import { Toaster as SonnerToaster } from 'sonner';

export function ToastProvider() {
  return (
    <SonnerToaster
      position="top-right"
      toastOptions={{
        style: {
          marginBottom: '70px', // Add space at the bottom to avoid overlapping with the cart button
        },
      }}
    />
  );
}
