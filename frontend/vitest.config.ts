import { defineConfig } from "vitest/config";

import path from "path";

export default defineConfig({
  // Use a plain object if we aren't using the vite plugin
  test: {
    environment: "node",
    globals: true,
    setupFiles: ["./vitest.setup.ts"],
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
