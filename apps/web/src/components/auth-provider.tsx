"use client";

import { AuthProvider } from "@/context";
import React from "react";

interface ProvidersProps {
  children: React.ReactNode;
  token: string | null;
  role: string | null;
}

export function Providers({ children, token, role }: ProvidersProps) {
  return (
    <AuthProvider initialToken={token} initialRole={role}>
      {children}
    </AuthProvider>
  );
}
