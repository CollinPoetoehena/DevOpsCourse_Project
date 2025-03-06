import { useRouter } from 'next/router';
import type { AppProps } from 'next/app';
import { AnimatePresence } from 'framer-motion';
import { Toaster } from 'react-hot-toast';

import '../styles/tailwind.css';
import '../styles/globals.css';

import Navbar from '@/components/navbar';
import ProtectedRoute from '@/components/ProtectedRoute';
import UnProtectedRoute from '@/components/UnProtectedRoute';

import { CarProvider } from '@/CarContext';
import { GarageProvider } from '@/GarageContext';
import { ReservationProvider } from '@/ReservationContext';
import { AuthProvider } from '@/AuthContext';
import { VehicleProvider } from '@/VehicleContext';

// TODO: change to different more pretty format later, now just test this
import { AuthProvider as OidcAuthProvider } from 'react-oidc-context';
const cognitoAuthConfig = {
  // Authority is the static url, but then with the region replaced and after the / the ID of the User pool
  authority: "https://cognito-idp.eu-central-1.amazonaws.com/eu-central-1_VVebgtNmw",
  client_id: "3q7iimb5obea8ik0bb1aiv2bao",
  // Must be present in callback_urls specified, otherwise it errors with something like "redirect_mismatch" 
  // Uses specific page for the callback to handle the callback after the login/signup
  redirect_uri: "http://localhost:3000/auth/callback",
  response_type: "code",
  scope: "phone openid email",
};


const App = ({ Component, pageProps }: AppProps) => {
  // const auth = useAuth();
  const router = useRouter();

  const isAuthPage = router.pathname.startsWith('/auth/');

  const signOutRedirect = () => {
    const clientId = "6rlmcfmgb4e8nr9i867ibu65c7";
    const logoutUri = "<logout uri>";
    const cognitoDomain = "https://eu-central-1xkvvo9drh.auth.eu-central-1.amazoncognito.com";
    window.location.href = `${cognitoDomain}/logout?client_id=${clientId}&logout_uri=${encodeURIComponent(logoutUri)}`;
  };

  return (
    <>
    <OidcAuthProvider {...cognitoAuthConfig}>
      <AnimatePresence>
          <GarageProvider>
            <CarProvider>
              <VehicleProvider>
                <ReservationProvider>
                  <AuthProvider>
                    <Toaster position="bottom-left" />
                    {isAuthPage ? (
                      <>
                        <UnProtectedRoute>
                          <Component {...pageProps} />
                        </UnProtectedRoute>
                      </>
                    ) : (
                      <>
                        <ProtectedRoute>
                          <Navbar />
                          <Component {...pageProps} />
                        </ProtectedRoute>
                      </>
                    )}
                  </AuthProvider>
                </ReservationProvider>
              </VehicleProvider>
            </CarProvider>
          </GarageProvider>
        </AnimatePresence>
      </OidcAuthProvider>
      {/* <AuthProvider {...cognitoAuthConfig}>
        <AnimatePresence>
          <GarageProvider>
            <CarProvider>
              <VehicleProvider>
                <ReservationProvider>
                  <Toaster position="bottom-left" />
                  {isAuthPage ? (
                    <>
                      <UnProtectedRoute>
                        <Component {...pageProps} />
                      </UnProtectedRoute>
                    </>
                  ) : (
                    <>
                      <ProtectedRoute>
                        <Navbar />
                        <Component {...pageProps} />
                      </ProtectedRoute>
                    </>
                  )}
                </ReservationProvider>
              </VehicleProvider>
            </CarProvider>
          </GarageProvider>
        </AnimatePresence>
      </AuthProvider> */}
    </>
  );
};

export default App;

