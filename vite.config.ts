import path from "path"
import tailwindcss from "@tailwindcss/vite"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"

// https://vite.dev/config/
export default defineConfig(({ command }) => ({
  base: command === "serve" ? "/" : "/Nike/",
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    // Raise warning limit — the large chunk is the third-party vendor bundle
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks: {
          // Firebase SDK
          "vendor-firebase": ["firebase/app", "firebase/auth"],
          // Supabase SDK
          "vendor-supabase": ["@supabase/supabase-js"],
          // Animation libraries
          "vendor-motion": ["framer-motion", "gsap"],
          // React ecosystem
          "vendor-react": ["react", "react-dom", "react-router-dom"],
        },
      },
    },
  },
}))