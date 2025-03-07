import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth as useOidcAuth } from "react-oidc-context";

// /auth/callback route is automatically created, since it is in the pages folder in next.js
const Callback = () => {
  const auth = useOidcAuth();
  const router = useRouter();

  useEffect(() => {
    console.log("Is authenticated: ", auth.isAuthenticated);
    console.log("Getting to callback...");

    // The library should automatically process the code in the URL.
    if (auth.isAuthenticated) {
      // TODO: remove later, but this can be used to add the token to the storage, etc., and replace the old mechanism of logging in.
      console.log("email: ", auth.user?.profile.email);
      console.log("ID Token: ", auth.user?.id_token);
      console.log("Access Token: ", auth.user?.access_token);
      console.log("Refresh Token: ", auth.user?.refresh_token);

      // Clean up the URL and redirect to the home page or desired page.
      router.replace('/');
    }
  }, [auth, router]);

  return <div>Processing login...</div>;
};

export default Callback;
