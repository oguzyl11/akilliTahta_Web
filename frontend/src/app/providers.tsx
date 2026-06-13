// =============================================================================
// Providers — React Query + Toast
// =============================================================================

'use client';

import React, { useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 5 * 60 * 1000, // 5 dakika
            retry: 1,
            refetchOnWindowFocus: false,
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#1e293b',
            color: '#e2e8f0',
            border: '1px solid rgba(99, 102, 241, 0.2)',
            borderRadius: '12px',
            fontSize: '14px',
          },
          success: {
            iconTheme: {
              primary: '#10b981',
              secondary: '#0a0e1a',
            },
          },
          error: {
            iconTheme: {
              primary: '#ef4444',
              secondary: '#0a0e1a',
            },
          },
        }}
      />
    </QueryClientProvider>
  );
}
