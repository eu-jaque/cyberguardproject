import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react-swc";
import path from "path";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./src/test/setup.ts"],
    include: ["src/**/*.{test,spec}.{ts,tsx}"],
<<<<<<< HEAD
    reporters: ['default', './src/test/md-reporter.ts'],
=======
    reporters: ['default', './reports/custom-reporter.js'],
>>>>>>> b82ba9e427e2bf52a738cefb711585d300bc66ce
  },
  resolve: {
    alias: { "@": path.resolve(__dirname, "./src") },
  },
});
