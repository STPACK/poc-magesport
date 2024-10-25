"use client";

import { onAuthStateChanged, User } from "firebase/auth";
import { createContext, useEffect, useState } from "react";

import { auth } from "@/lib/firebase";

interface AuthenticationContextType {
  user: User | null;
  isAuthenticated: boolean;
  isUserLoading: boolean;
  logOut: () => Promise<void>;
}

export const AuthenticationContext = createContext<AuthenticationContextType>(
  {} as AuthenticationContextType
);

export function AuthenticationProvider({ children }: React.PropsWithChildren) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <AuthenticationContext.Provider
      value={{
        user,
        isUserLoading: loading,
        isAuthenticated: !!user,
        logOut: async () => {},
      }}
    >
      {children}
    </AuthenticationContext.Provider>
  );
}
