import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth as useOidcAuth } from "react-oidc-context";
import useAuthentication from '@/lib/hooks/useAuthentication';

// /auth/callback route is automatically created, since it is in the pages folder in next.js
const Callback = () => {
  const auth = useOidcAuth();
  const { handleLogin } = useAuthentication();
  const router = useRouter();

  useEffect(() => {
    console.log("Is authenticated: ", auth.isAuthenticated);
    console.log("Getting to callback...");

    // The library should automatically process the code in the URL received after logging in.
    // If the user is authenticated now, handle the login further.
    if (auth.isAuthenticated) {

      // Handle the login further
      handleLogin();
    }
  }, [auth, router]);

  return <div>Processing login...</div>;
};

export default Callback;
