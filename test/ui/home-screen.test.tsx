import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { HomeScreen } from "@screens/home";

describe("HomeScreen", () => {
  it("presents Archive identity through semantic page landmarks", () => {
    render(<HomeScreen />);

    expect(screen.getByRole("banner")).toHaveTextContent("Archive");
    expect(screen.getByRole("main")).toBeInTheDocument();
    expect(
      screen.getByRole("heading", {
        level: 1,
        name: "Every ruling, traced back to the page it came from.",
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("complementary", { name: "Foundation status" }),
    ).toHaveTextContent(
      "Product capabilities will appear only when they are ready",
    );
  });

  it("does not advertise controls that are not implemented", () => {
    render(<HomeScreen />);

    expect(screen.queryByRole("button")).not.toBeInTheDocument();
    expect(screen.queryByRole("link")).not.toBeInTheDocument();
    expect(screen.queryByRole("textbox")).not.toBeInTheDocument();
    expect(screen.queryByRole("navigation")).not.toBeInTheDocument();
  });

  it("keeps the complete reading order at a narrow viewport", () => {
    Object.defineProperty(window, "innerWidth", {
      configurable: true,
      value: 320,
    });

    render(<HomeScreen />);

    const main = screen.getByRole("main");
    expect(main).toHaveTextContent("Private rules workspace");
    expect(main).toHaveTextContent(
      "Every ruling, traced back to the page it came from.",
    );
    expect(main).toHaveTextContent("Current state");
  });
});
