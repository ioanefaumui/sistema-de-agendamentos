"use client";

import { createContext, useContext, useState, ReactNode } from "react";

interface AuthContextProps {
  token: string | null;
  role: string | null;
  setToken: (token: string | null) => void;
  setRole: (role: string | null) => void;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
  initialToken?: string | null;
  initialRole?: string | null;
}

export function AuthProvider({
  children,
  initialToken = null,
  initialRole = null,
}: AuthProviderProps) {
  const [token, setToken] = useState<string | null>(initialToken);
  const [role, setRole] = useState<string | null>(initialRole);

  return (
    <AuthContext.Provider value={{ token, role, setToken, setRole }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
