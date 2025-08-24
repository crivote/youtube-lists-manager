import { A } from "@solidjs/router";
import { Auth } from "~/components/Auth";
import Counter from "~/components/Counter";

export default function Home() {
  return (
    <main class="text-center mx-auto text-gray-700 p-4">
      <h1 class="max-6-xs text-6xl text-sky-700 font-thin uppercase my-16">
        Youtube Lists Manager
      </h1>
      <p class="mt-8">
        This is a simple application to manage your Youtube lists to help you
        practice your music.{" "}
        <A href="/about" class="text-sky-600 hover:underline">
          Know more about this app
        </A>
      </p>
      <p class="my-4">
        <Auth />
      </p>
    </main>
  );
}
