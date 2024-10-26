"use client";

import { useRouter } from "next/navigation";
import { createContext, useEffect, useState } from "react";
import { onAuthStateChanged, User, signOut } from "firebase/auth";

import { auth } from "@/lib/firebase";

interface AuthenticationContextType {
  user: User | null;
  isAuthenticated: boolean;
  isUserLoading: boolean;
  logout: () => Promise<void>;
}

export const AuthenticationContext = createContext<AuthenticationContextType>(
  {} as AuthenticationContextType
);

export function AuthenticationProvider({ children }: React.PropsWithChildren) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const logout = async () => {
    await signOut(auth);
    router.push("/admin-back-office/login"); // Redirect to the login page after logout
  };

  return (
    <AuthenticationContext.Provider
      value={{
        user,
        isUserLoading: loading,
        isAuthenticated: !!user,
        logout,
      }}
    >
      {children}
    </AuthenticationContext.Provider>
  );
}
