// src/services/google-oauth/GoogleAuthService.ts

interface Tokens {
  access_token: string;
  refresh_token?: string;
}

interface UserProfile {
  names: [{ displayName: string }];
  emailAddresses: [{ value: string }];
  photos: [{ url: string }];
}

interface AuthResponse {
  tokens: Tokens;
  userProfile: UserProfile;
}

class GoogleAuthService {
  private static readonly AUTH_ENDPOINT = "/.netlify/functions/exchange-token";
  private client_id: string;
  private scopes: string[];

  constructor(client_id: string, scopes: string[]) {
    this.client_id = client_id;
    this.scopes = scopes;
  }

  public initializeAuth(elementId: string, callback: (response: any) => void) {
    if (typeof google === "undefined" || !google.accounts?.id) {
      console.error("La librería de Google Identity Services no está cargada.");
      return;
    }
    google.accounts.id.initialize({
      client_id: this.client_id,
      scope: this.scopes.join(" "),
      ux_mode: "popup",
      callback: callback,
    });
    google.accounts.id.renderButton(
      document.getElementById(elementId) as HTMLElement,
      { theme: "outline", size: "large" }
    );
  }

  /**
   * Intercambia un código de autorización por tokens y el perfil del usuario.
   */
  public async exchangeCodeForTokens(
    code: string
  ): Promise<AuthResponse | null> {
    try {
      const response = await fetch(GoogleAuthService.AUTH_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code }),
      });
      if (!response.ok) {
        throw new Error("Error al intercambiar el código.");
      }
      const data: AuthResponse = await response.json();
      this.saveTokens(data.tokens);
      return data;
    } catch (error) {
      console.error("Error en exchangeCodeForTokens:", error);
      return null;
    }
  }

  /**
   * Renueva el access_token usando el refresh_token.
   */
  public async refreshAccessToken(): Promise<Tokens | null> {
    const refreshToken = localStorage.getItem("google_refresh_token");
    if (!refreshToken) {
      console.error("No hay refresh token disponible.");
      return null;
    }
    try {
      const response = await fetch(GoogleAuthService.AUTH_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refreshToken }),
      });
      if (!response.ok) {
        throw new Error("Error al renovar el token.");
      }
      const data: Tokens = await response.json();
      this.saveTokens(data);
      return data;
    } catch (error) {
      console.error("Error en refreshAccessToken:", error);
      return null;
    }
  }

  private saveTokens(tokens: Tokens) {
    localStorage.setItem("google_access_token", tokens.access_token);
    if (tokens.refresh_token) {
      localStorage.setItem("google_refresh_token", tokens.refresh_token);
    }
  }
}

export const googleAuthService = new GoogleAuthService(
  import.meta.env.VITE_GOOGLE_CLIENT_ID,
  [
    "https://www.googleapis.com/auth/youtube",
    "https://www.googleapis.com/auth/userinfo.profile",
    "https://www.googleapis.com/auth/userinfo.email",
  ]
);
