// Declara la variable global 'google'
declare const google: GoogleAccounts;

// Define la estructura de la API de Google Identity Services para un tipado más estricto
// Esto es opcional, pero recomendado para tener autocompletado y seguridad de tipos
interface GoogleAccounts {
  accounts: {
    id: {
      initialize: (options: {
        client_id: string;
        scope: string;
        ux_mode: string;
        callback: (response: any) => void;
      }) => void;
      renderButton: (
        element: HTMLElement,
        options: { theme: string; size: string }
      ) => void;
      prompt: () => void;
      revoke: (callback: (response: any) => void) => void;
    };
    // Puedes añadir otros servicios si los usas, como 'gsi'
  };
}
