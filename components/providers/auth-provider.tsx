"use client";

import { authClient } from "@/lib/auth-client";
import { Shield } from "lucide-react";
import Link from "next/link";
import { createContext, useContext, ReactNode } from "react";

type AuthContextType = {
  data: ReturnType<typeof authClient.useSession>["data"];
  isPending: boolean;
  error: ReturnType<typeof authClient.useSession>["error"];
  refetch: ReturnType<typeof authClient.useSession>["refetch"];
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const { data, isPending, error, refetch } = authClient.useSession();

  return (
    <AuthContext.Provider
      value={{
        data: data,
        isPending,
        error,
        refetch,
      }}
    >
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
