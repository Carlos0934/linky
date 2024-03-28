"use client";
import { SessionProvider } from "next-auth/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
type ProviderProps = {
  children: React.ReactNode;
};
const queryClient = new QueryClient();

export default function Providers({ children }: ProviderProps) {
  return (
    <SessionProvider>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </SessionProvider>
  );
}
