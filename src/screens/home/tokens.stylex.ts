import * as stylex from "@stylexjs/stylex";

export const colors = stylex.defineVars({
  canvas: "#f2f4f1",
  surface: "#ffffff",
  ink: "#162019",
  muted: "#5d685f",
  line: "#cfd7d0",
  accent: "#116149",
  accentSoft: "#dcebe4",
});

export const type = stylex.defineVars({
  sans: "ui-sans-serif, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
  mono: "ui-monospace, 'SFMono-Regular', Consolas, monospace",
});

export const space = stylex.defineVars({
  page: "clamp(1rem, 4vw, 4rem)",
  section: "clamp(3rem, 10vw, 8rem)",
  gap: "clamp(1.25rem, 3vw, 2.5rem)",
});
