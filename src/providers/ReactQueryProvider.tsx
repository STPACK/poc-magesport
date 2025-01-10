"use client";

import { QueryClientProvider } from "@tanstack/react-query";
import { QueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";

export function ReactQueryProvider({ children }: React.PropsWithChildren) {
  const queryClientOptions = {
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: false,
        retry: false,
        throwOnError: (error: Error) => {
          if (error instanceof AxiosError) {
            return (
              error.response?.status === 404 || error.response?.status === 500
            );
          }
          return false;
        },
      },
    },
  };
  const queryClient = new QueryClient(queryClientOptions);
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
