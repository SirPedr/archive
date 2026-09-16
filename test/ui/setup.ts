import "@testing-library/jest-dom/vitest";

import { cleanup } from "@testing-library/react";
import { setupServer } from "msw/node";
import { afterAll, afterEach, beforeAll, vi } from "vitest";

vi.mock("@stylexjs/stylex", () => ({
  create: <Styles>(styles: Styles) => styles,
  defineVars: <Variables>(variables: Variables) => variables,
  props: () => ({}),
}));

export const server = setupServer();

beforeAll(() => {
  server.listen({ onUnhandledRequest: "error" });
});

afterEach(() => {
  cleanup();
  server.resetHandlers();
});

afterAll(() => {
  server.close();
});
