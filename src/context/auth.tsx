import { createContext, createSignal, useContext, JSX } from "solid-js";
import { googleAuthService } from "../services/google-oauth/facade";

// Tipos necesarios
interface UserProfile {
  names: [{ displayName: string }];
  emailAddresses: [{ value: string }];
  photos: [{ url: string }];
}

interface AuthContextValue {
  isAuthenticated: () => boolean;
  userProfile: () => UserProfile | null;
  initAuth: (elementId: string) => void;
  handleAuthResponse: (response: any) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue>();

export function AuthProvider(props: { children: JSX.Element }) {
  const [userProfile, setUserProfile] = createSignal<UserProfile | null>(null);

  const handleAuthResponse = async (response: any) => {
    const authResponse = await googleAuthService.exchangeCodeForTokens(
      response.credential
    );
    if (authResponse) {
      setUserProfile(authResponse.userProfile);
    }
  };

  const value: AuthContextValue = {
    isAuthenticated: () => !!localStorage.getItem("google_access_token"),
    userProfile: userProfile,
    initAuth: (elementId: string) => {
      googleAuthService.initializeAuth(elementId, handleAuthResponse);
    },
    handleAuthResponse,
    logout: async () => {
      await googleAuthService.logout();
      setUserProfile(null);
    },
  };

  return (
    <AuthContext.Provider value={value}>{props.children}</AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth debe usarse dentro de un AuthProvider");
  }
  return context;
};
