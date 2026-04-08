import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "next/link": path.resolve(__dirname, "next/link.tsx"),
      "next/navigation": path.resolve(__dirname, "next/navigation.tsx"),
    },
  },
  build: {
    outDir: "dist",
    emptyOutDir: true,
  },
});
