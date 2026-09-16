import { exports } from "cloudflare:workers";
import { describe, expect, it } from "vitest";

describe("public liveness route", () => {
  it("returns only the stable healthy status contract", async () => {
    const response = await exports.default.fetch(
      "http://archive.test/api/health",
    );
    const body: unknown = await response.json();

    expect(response.status).toBe(200);
    expect(response.headers.get("content-type")).toMatch(/^application\/json/);
    expect(body).toEqual({ status: "ok" });
  });
});
