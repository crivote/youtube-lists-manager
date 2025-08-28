import { Icon } from "solid-heroicons";
import { userCircle } from "solid-heroicons/outline";
import { onMount, Show } from "solid-js";
import { useAuth } from "~/context/auth";

export function Auth() {
  const auth = useAuth();

  onMount(() => {
    auth.initAuth("google-signin-btn");
  });

  return (
    <div>
      <Show
        when={auth.isAuthenticated()}
        fallback={
          <div class="p-4 bg-gray-50 rounded-lg shadow-sm">
            <p class="text-center mb-4 text-gray-700">
              To manage your Youtube lists, please sign in with your Google
              account
              <Icon
                path={userCircle}
                class="inline-block w-8 h-8 text-gray-400"
              />
              .
            </p>
            <div class="w-64 mx-auto" id="google-signin-btn"></div>
          </div>
        }
      >
        <div>
          <p>Bienvenido {auth.userProfile()?.names[0].displayName}</p>
          <button onClick={() => auth.logout()}>Cerrar sesión</button>
        </div>
      </Show>
    </div>
  );
}
