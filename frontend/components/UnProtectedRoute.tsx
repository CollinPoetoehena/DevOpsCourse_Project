import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useAuth as useOidcAuth } from "react-oidc-context";

const UnProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const auth = useOidcAuth();
  const router = useRouter();
  const [isAuth, setIsAuth] = useState<boolean | null>(null);

  useEffect(() => {
    // No need to checkAuth() here, will otherwise lead to having to click logout twice before actual logout

    console.log("Getting to unprotected route...");
    if (auth.isAuthenticated) {
      router.push('/');
    } else if (auth.isAuthenticated === false) {
      setIsAuth(true);
    }
  }, [auth.isAuthenticated]);

  return isAuth ? <>{children}</> : null;
};

export default UnProtectedRoute;