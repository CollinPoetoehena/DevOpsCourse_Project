import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from 'react-oidc-context';

// /auth/callback route is automatically created, since it is in the pages folder in next.js
const Callback = () => {
  const auth = useAuth();
  const router = useRouter();

  useEffect(() => {
    // The library should automatically process the code in the URL.
    if (auth.isAuthenticated) {
      // Clean up the URL and redirect to the home page or desired page.
      router.replace('/');
    }
  }, [auth, router]);

  return <div>Processing login...</div>;
};

export default Callback;
