"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false, // Disable retries
      refetchOnMount: false, // Disable refetch when component mounts
      refetchOnWindowFocus: false, // Disable refetch when window gains focus
      refetchOnReconnect: false, // Disable refetch when network reconnects
      refetchInterval: false, // Disable polling
    },
    mutations: {
      retry: false, // Disable mutation retries
    },
  },
});

export default function QueryProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
