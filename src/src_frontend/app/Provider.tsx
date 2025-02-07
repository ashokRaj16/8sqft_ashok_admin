"use client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { useState } from "react";

interface ProviderProps {
  children: React.ReactNode; // The children to be rendered within the ChakraProvider component.  // The ChakraProvider component is a provider for Chakra UI's theme and components. It makes the theme and components accessible to all child components.  // The theme prop is the Chakra UI theme object.  // The children prop is the JSX or React elements to be rendered within the ChakraProvider component.  // The ChakraProvider component is used to wrap your application and provide the necessary Chakra UI context.  // The ChakraProvider component is used to wrap your application and provide the necessary Chakra UI context.  // The ChakraProvider component is used to wrap your application and provide the necessary Chakra UI context.  // The ChakraProvider component is used to wrap your application and provide the necessary Chakra UI context.  // The ChakraProvider component is used to wrap
}
export default function ProviderComponent({ children }: ProviderProps) {
  const [queryClient] = useState(() => new QueryClient());
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
