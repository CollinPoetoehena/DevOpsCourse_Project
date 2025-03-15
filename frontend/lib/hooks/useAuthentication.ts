import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useAuth as useOidcAuth } from "react-oidc-context";
import { useAuth } from "@/AuthContext";
import { useNotification } from "./useNotification";
import { Role } from "../types";
import config from "../config";

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
      // Set role to the role of the user from the authentication
      extractRoleFromCognitoUserProfile();
      setLoadingAuth(false);
    } else {
      setIsAuthenticated(false);
      setIsAuth(false);
      setRole(Role.user);
      setLoadingAuth(false);
    }
  }, [auth.isAuthenticated]);

  // Handle login after redirect to AWS Cognito
  const handleLogin = async () => {
    try {
      setLoading(true);
      // auth object should now have the user object in it, which contains the token
      const token = auth.user?.access_token ? auth.user?.access_token : "";
      localStorage.setItem('token', token);
      setToken(token);
      setIsAuth(true);
      setIsAuthenticated(true);
      // // Clean up the URL and redirect to the home page
      router.replace('/');
      onSuccess('Logged in successfully');
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
      localStorage.removeItem('token')

      setIsAuthenticated(false);
      setToken(null);
      // Set role to user when logging out
      setRole(Role.user);
      // Sign out
      signOutRedirect();

      onSuccess('Logged out successfully');
    } catch (error) {
      console.log(error);
    }
  };

  // Custom signout redirect for AWS Cognito
  const signOutRedirect = () => {
    const clientId = config.cognitoClientId;
    const logoutUri = config.cognitoLogoutUri;
    const cognitoDomain = config.cognitoDomain;
    window.location.href = `${cognitoDomain}/logout?client_id=${clientId}&logout_uri=${encodeURIComponent(logoutUri)}`;
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
      // Set role to the role of the user from the authentication
      extractRoleFromCognitoUserProfile();
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

  // Custom function to extract the user role from the user profile from the AWS Cognito auth object
  const extractRoleFromCognitoUserProfile = () => {
    // Extract groups from auth.user object
    const userGroups: string[] = auth.user?.profile["cognito:groups"] as string[] || [];

    // Set role based on groups (give admin preference by checking that one first)
    // If not admin or maintainer, then set to user
    if (userGroups.includes("admin")) {
      setRole(Role.admin);
    } else if (userGroups.includes("maintainer")) {
      setRole(Role.maintainer);
    } else {
      setRole(Role.user);
    }
  };

  return { handleLogin, logout, checkAuth, isAuth, loading, loadingAuth, token };
}

export default useAuthentication;
