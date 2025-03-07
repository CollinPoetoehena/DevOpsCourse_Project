import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { useAuth as useOidcAuth } from "react-oidc-context";

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const auth = useOidcAuth();
  const router = useRouter();
  const hasAuthCode = Boolean(router.query.code);

  useEffect(() => {
    if (!!!auth.isAuthenticated) {
        // checkAuth();
        console.log("In protected route getting to !!!auth");
    }
    console.log("Getting to protected route...");

    // Only redirect if there is no authentication code in the URL
    if (!auth.isAuthenticated && !hasAuthCode) {
      // Use AWS Cognito library to redirect to the Managed Login page to handle login/register
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
