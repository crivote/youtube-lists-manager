import { Router } from "@solidjs/router";
import { FileRoutes } from "@solidjs/start/router";
import { Suspense } from "solid-js";
import Nav from "./components/Nav";
import { AuthProvider } from "./context/auth";
import "./app.css";

export default function App() {
  return (
    <AuthProvider>
      <Router
        root={(props) => (
          <>
            <Nav />
            <Suspense>{props.children}</Suspense>
          </>
        )}
      >
        <FileRoutes />
      </Router>
    </AuthProvider>
  );
}
