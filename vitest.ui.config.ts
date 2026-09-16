import react from "@vitejs/plugin-react";
import { defineProject } from "vitest/config";

export default defineProject({
  plugins: [react()],
  resolve: {
    alias: {
      "@screens": new URL("./src/screens", import.meta.url).pathname,
    },
  },
  test: {
    name: "ui",
    environment: "jsdom",
    include: ["test/ui/**/*.test.tsx"],
    setupFiles: ["./test/ui/setup.ts"],
  },
});
