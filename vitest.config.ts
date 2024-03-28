import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "path";
import { config } from "dotenv";
export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    env: {
      ...config({
        path: "./.env.test",
      }).parsed,
    },
  },

  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
