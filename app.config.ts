import { defineConfig } from "@solidjs/start/config";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  vite: {
    plugins: [tailwindcss()],
  },
  securityHeaders: {
    "Content-Security-Policy": [
      "default-src 'self'",
      "script-src 'self' https://apis.google.com https://www.gstatic.com",
      "connect-src 'self' https://accounts.google.com https://apis.google.com",
      "img-src 'self' data: https://lh3.googleusercontent.com",
      "style-src 'self' 'unsafe-inline'",
      "frame-src https://accounts.google.com",
    ].join("; "),
  },
});
