import { setupNetwork } from "@msw/cloudflare";
import { exports } from "cloudflare:workers";
import { afterAll, afterEach, beforeAll } from "vitest";

export const network = setupNetwork();
network.configure({ onUnhandledFrame: "error" });

beforeAll(async () => {
  await exports.default.fetch("http://archive.test/api/health");
  network.enable();
});

afterEach(() => {
  network.resetHandlers();
});

afterAll(() => {
  network.disable();
});
