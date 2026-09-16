import { cloudflareTest } from "@cloudflare/vitest-plugin";
import { defineProject } from "vitest/config";

export default defineProject({
  plugins: [
    cloudflareTest({
      main: "./dist/server/index.js",
      wrangler: { configPath: "./dist/server/wrangler.json" },
    }),
  ],
  test: {
    name: "worker",
    include: ["test/worker/**/*.test.ts"],
    setupFiles: ["./test/worker/setup.ts"],
  },
});
