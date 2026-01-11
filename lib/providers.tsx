'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';
import { AmbientSoundProvider } from './AmbientSoundProvider';
import { ToastProvider } from './ToastProvider';

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: { staleTime: 1000 * 60 },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      <AmbientSoundProvider>
        <ToastProvider>
          {children}
        </ToastProvider>
      </AmbientSoundProvider>
    </QueryClientProvider>
  );
}
