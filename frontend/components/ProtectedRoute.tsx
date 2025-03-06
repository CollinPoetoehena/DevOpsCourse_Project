import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { useAuth } from 'react-oidc-context';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const auth = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!auth.isAuthenticated) {
      auth.signinRedirect();
    }
  }, [auth.isAuthenticated]);

  if (auth.isLoading) {
    return <div>Loading...</div>;
  }

  if (auth.error) {
    return <div>Encountering error... {auth.error.message}</div>;
  }

  return auth.isAuthenticated ? <>{children}</> : null;
};

export default ProtectedRoute;