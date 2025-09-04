// src/main.tsx
import { createRoot } from 'react-dom/client';
// import { BrowserRouter } from 'react-router-dom';
import Root from './router/index.tsx';
import './index.css';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
import { Toaster } from 'sonner';

// import { AuthProvider } from './contexts/auth-context.tsx';


const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: 2, retryDelay: 1000 } },
});

createRoot(document.getElementById('root')!).render(
  // <BrowserRouter> {/* Add BrowserRouter here */}
  <QueryClientProvider client={queryClient}>
    <Root />
    <Toaster richColors position="top-right" style={
      {
        "--error-bg": "#fef2f2",
        "--error-text": "#7f1d1d",
        "--error-border": "#fecaca",
      } as React.CSSProperties
    } />
  </QueryClientProvider>
  // </BrowserRouter>
);