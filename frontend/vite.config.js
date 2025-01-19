import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api": {
        target: process.env.VITE_API_URL || "http://localhost:7000", // Ensure this is a valid URL
        changeOrigin: true,
        secure: false, // Set to true if your backend uses HTTPS
      },
    },
  },
  define: {
    "process.env": process.env,
  },
});
