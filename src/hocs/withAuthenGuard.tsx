import { Spin } from "antd";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { useAuthentication } from "@/hooks/auth/useAuthentication";

export function withAuthenGuard<P extends object>(Component: React.FC<P>) {
  function WithAuthenGuard<T>(props: T & P) {
    const router = useRouter();
    const { isAuthenticated, isUserLoading } = useAuthentication();

    useEffect(() => {
      if (!isAuthenticated && !isUserLoading) {
        router.replace("/admin-back-office/login");
      }
    }, [isAuthenticated, isUserLoading]);

    if (isAuthenticated) {
      return <Component {...props} />;
    }

    return (
      <div className="all-center my-[48px]">
        <Spin size="large" />
      </div>
    );
  }

  return WithAuthenGuard;
}
