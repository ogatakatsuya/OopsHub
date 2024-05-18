"use client";

import { CacheProvider } from "@chakra-ui/next-js";
import { ChakraProvider } from "@chakra-ui/react";
import { AuthProvider } from "./auth_provider/AuthProvider";
import { initializeFirebaseApp } from "./firebase";

export function Providers({ children }: { children: React.ReactNode }) {
  initializeFirebaseApp();
  return (
    <CacheProvider>
      <ChakraProvider>
        <AuthProvider>{children}</AuthProvider>
      </ChakraProvider>
    </CacheProvider>
  );
}
