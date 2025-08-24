import { jwtDecode } from "jwt-decode";

declare global {
  interface Window {
    google: {
      accounts: {
        id: {
          initialize: (config: {
            client_id: string;
            callback: (response: any) => void;
          }) => void;
          renderButton: (element: HTMLElement | null, options: any) => void;
          prompt: () => void;
        };
      };
    };
  }
}

export type GoogleJWT = {
  email: string;
  name: string;
  picture: string;
  exp: number;
};

const CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

function handleCredentialResponse(response: any) {
  const decoded = jwtDecode<GoogleJWT>(response.credential);
  console.log(decoded);
  localStorage.setItem("user_token", response.credential);
}

// Renderiza el botón de Google Sign-In
export function renderGoogleButton(elementId: string) {
  window.google.accounts.id.initialize({
    client_id: CLIENT_ID,
    callback: handleCredentialResponse,
  });
  window.google.accounts.id.renderButton(
    document.getElementById(elementId),
    { theme: "outline", size: "large" } // Opciones del botón
  );
  window.google.accounts.id.prompt(); // Opcional: muestra el prompt automáticamente
}
