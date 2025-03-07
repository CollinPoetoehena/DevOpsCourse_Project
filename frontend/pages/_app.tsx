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
import config from "../lib/config";

const App = ({ Component, pageProps }: AppProps) => {
  const router = useRouter();

  const isAuthPage = router.pathname.startsWith('/auth/');

  return (
    <>
    {/* Wrap the components in the AuthProvider for authentication (this includes the AWS Cognito AuthProvider, see AuthContext.tsx) */}
    <OidcAuthProvider {...config.cognitoAuthConfig}>
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

