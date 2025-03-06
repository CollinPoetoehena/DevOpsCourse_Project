import { createContext, useContext, ReactNode, useState } from 'react';
import { Role } from './lib/types';

interface AuthContextProps {
  isAuthenticated: boolean | null;
  setIsAuthenticated: (isAuth: boolean) => void;
  role: Role;
  setRole: (role: Role) => void;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [role, setRole] = useState<Role>(Role.user);

  return (
    <AuthContext.Provider value={{ isAuthenticated, setIsAuthenticated, role, setRole }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};


// Potential new AuthContext: TODO:
// import { AuthProvider as OidcAuthProvider, useAuth as useOidcAuth } from 'react-oidc-context';
// import { ReactNode } from 'react';
// import { Role } from './lib/types';
// import config from "./lib/config";

// interface AuthContextProps {
//   isAuthenticated: boolean | null;
//   setIsAuthenticated: (isAuth: boolean) => void;
//   role: Role;
//   setRole: (role: Role) => void;
// }

// export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
//   return (
//     // Wrap app in OidcAuthProvider (AWS Cognito auth provider) to allow authentication with Cognito */
//     <OidcAuthProvider {...config.cognito}>
//       {children}
//     </OidcAuthProvider>
//   );
// };

// export const useAuth = () => {
//   const auth = useOidcAuth();
//   return {
//     isAuthenticated: auth.isAuthenticated,
//     setIsAuthenticated: (isAuth: boolean) => {
//       if (isAuth) {
//         auth.signinRedirect();
//       } else {
//         auth.signoutRedirect();
//       }
//     },
//     role: Role.user, // Update this based on your role logic
//     setRole: (role: Role) => {
//       // Implement role setting logic if needed
//     },
//   };
// };