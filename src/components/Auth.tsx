import { onMount, createSignal, createEffect } from "solid-js";
import { GoogleJWT, renderGoogleButton } from "../auth";
import { Icon } from "solid-heroicons";
import { userCircle } from "solid-heroicons/solid";
import { jwtDecode } from "jwt-decode";

declare var gapi: any;

const CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;
const API_KEY = import.meta.env.VITE_YOUTUBE_API_KEY;
const DISCOVERY_DOCS = [
  "https://www.googleapis.com/discovery/v1/apis/youtube/v3/rest",
];
const SCOPES =
  "https://www.googleapis.com/auth/youtube https://www.googleapis.com/auth/youtube.force-ssl";

const [isSignedIn, setIsSignedIn] = createSignal(false);
const [userName, setUserName] = createSignal("");

function handleCredentialResponse(response: any) {
  const decoded = jwtDecode<GoogleJWT>(response.credential);
  console.log(decoded);
  setIsSignedIn(true);
  setUserName(decoded.name);
  localStorage.setItem("user_token", response.credential);
}

function handleSignoutClick() {
  localStorage.removeItem("user_token");
  setIsSignedIn(false);
  setUserName("");
  // Puedes usar la función de Google para cerrar la sesión si lo necesitas
  // google.accounts.id.prompt();
}

export function Auth() {
  onMount(() => {
    const localToken = localStorage.getItem("user_token");
    let decoded: GoogleJWT | null = null;
    if (localToken) {
      decoded = jwtDecode<GoogleJWT>(localToken);
    }
    if (decoded) {
      setIsSignedIn(true);
      setUserName(decoded.name);
    } else {
      renderGoogleButton("google-signin-btn");
    }
  });

  return (
    <div class="p-4 bg-gray-50 rounded-lg shadow-sm">
      <p class="text-center mb-4 text-gray-700">
        To manage your Youtube lists, please sign in with your Google account
        <Icon path={userCircle} class="inline-block w-8 h-8 text-gray-400" />.
      </p>
      <div class="w-64 mx-auto" id="google-signin-btn"></div>
    </div>
  );
}
