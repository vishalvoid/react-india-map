import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
  },
  // Improve TypeScript resolution for importing from dist
  resolve: {
    alias: {
      "@": "/src",
    },
  },
});
