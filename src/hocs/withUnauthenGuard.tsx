import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { useAuthentication } from "@/hooks/auth/useAuthentication";

export function withUnauthenGuard<P extends object>(Component: React.FC<P>) {
  function WithUnauthenGuard<T>(props: T & P) {
    const router = useRouter();
    const { isAuthenticated, isUserLoading, user } = useAuthentication();

    useEffect(() => {
      if (isAuthenticated && user) {
        router.replace("/admin-back-office");
      }
    }, [isAuthenticated, isUserLoading, user]);

    if (!isAuthenticated && !isUserLoading) {
      return <Component {...props} />;
    }

    return null;
  }

  return WithUnauthenGuard;
}
