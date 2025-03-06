import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { useAuth } from 'react-oidc-context';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const auth = useAuth();
  const router = useRouter();
  const hasAuthCode = Boolean(router.query.code);

  useEffect(() => {
    // Only redirect if there is no authentication code in the URL
    if (!auth.isAuthenticated && !hasAuthCode) {
      auth.signinRedirect();
    }
  }, [auth.isAuthenticated, hasAuthCode]);

  if (auth.isLoading) {
    return <div>Loading...</div>;
  }

  if (auth.error) {
    return <div>Encountering error... {auth.error.message}</div>;
  }

  return auth.isAuthenticated ? <>{children}</> : null;
};

export default ProtectedRoute;
