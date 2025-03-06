import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useAuth as useOidcAuth } from "react-oidc-context";
import { useAuth } from "@/AuthContext";
import { useNotification } from "./useNotification";
import { Role } from "../types";

function useAuthentication() {
  const router = useRouter();
  const auth = useOidcAuth();

  const { onSuccess, onError } = useNotification();
  const { setIsAuthenticated, setRole } = useAuth();

  const [loading, setLoading] = useState<boolean>(false);
  const [loadingAuth, setLoadingAuth] = useState<boolean>(true);
  const [isAuth, setIsAuth] = useState<boolean>(false);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    if (auth.isAuthenticated) {
      setToken(auth.user?.access_token || null);
      setIsAuthenticated(true);
      setIsAuth(true);
      setRole(Role.user); // Update this based on your role logic
      setLoadingAuth(false);
    } else {
      setIsAuthenticated(false);
      setIsAuth(false);
      setRole(Role.user);
      setLoadingAuth(false);
    }
  }, [auth.isAuthenticated]);

  const login = async () => {
    try {
      setLoading(true);
      await auth.signinRedirect();
    } catch (error) {
      console.error('Authentication failed:', error);
      setIsAuthenticated(false);
      onError('Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await auth.signoutRedirect();
      setIsAuthenticated(false);
      setToken(null);
      setRole(Role.user);
      onSuccess('Logged out successfully');
    } catch (error) {
      console.log(error);
    }
  };

  const checkAuth = async () => {
    setLoadingAuth(true);
    if (!auth.isAuthenticated) {
      setIsAuthenticated(false);
      setLoadingAuth(false);
      return;
    }
    try {
      setToken(auth.user?.access_token || null);
      setIsAuthenticated(true);
      setIsAuth(true);
      setRole(Role.user); // Update this based on your role logic
    } catch (error) {
      setToken(null);
      setIsAuthenticated(false);
      setIsAuth(false);
      setRole(Role.user);
    } finally {
      setLoadingAuth(false);
      setLoading(false);
    }
  };

  return { login, logout, checkAuth, isAuth, loading, loadingAuth, token };
}

export default useAuthentication;