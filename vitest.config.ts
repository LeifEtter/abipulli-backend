import { defineConfig } from "vitest/config";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [tsconfigPaths()],
  test: {
    include: ["vitest/**/*.test.ts"],
    environment: "node",
    setupFiles: ["./vitest.setup.ts"],
  },
});
