import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth as useOidcAuth } from "react-oidc-context";

// /auth/logout route is automatically created, since it is in the pages folder in next.js
const Logout = () => {
  const auth = useOidcAuth();
  const router = useRouter();
  const hasAuthCode = Boolean(router.query.code);

  useEffect(() => {
    console.log("Is authenticated: ", auth.isAuthenticated);
    console.log("Getting to logout...");

    // When the user logs out, redirect back to the login/signup page
    // Only redirect if there is no authentication code in the URL
    if (!auth.isAuthenticated && !hasAuthCode) {
      // Use AWS Cognito library to redirect to the Managed Login page to handle login/register
      auth.signinRedirect();
    }
  }, [auth, router]);

  return <div>Processing logout...</div>;
};

export default Logout;
