import * as stylex from "@stylexjs/stylex";

import { colors, space, type } from "../tokens.stylex";

const styles = stylex.create({
  page: {
    backgroundColor: colors.canvas,
    color: colors.ink,
    display: "grid",
    fontFamily: type.sans,
    gridTemplateRows: "auto 1fr",
    minHeight: "100dvh",
    overflowX: "hidden",
  },
  header: {
    alignItems: "center",
    borderBottomColor: colors.line,
    borderBottomStyle: "solid",
    borderBottomWidth: "1px",
    display: "flex",
    justifyContent: "space-between",
    paddingBlock: "1.25rem",
    paddingInline: space.page,
  },
  brand: {
    color: colors.ink,
    fontSize: "1rem",
    fontWeight: 750,
    letterSpacing: "-0.03em",
  },
  state: {
    color: colors.muted,
    fontFamily: type.mono,
    fontSize: "0.75rem",
    letterSpacing: "0.06em",
    textTransform: "uppercase",
  },
  main: {
    alignItems: "end",
    display: "grid",
    gap: space.section,
    gridTemplateColumns: {
      default: "minmax(0, 1.7fr) minmax(16rem, 0.7fr)",
      "@media (max-width: 48rem)": "minmax(0, 1fr)",
    },
    paddingBlock: space.section,
    paddingInline: space.page,
    width: "100%",
  },
  introduction: {
    display: "grid",
    gap: "1.5rem",
    maxWidth: "58rem",
    minWidth: 0,
  },
  eyebrow: {
    color: colors.accent,
    fontFamily: type.mono,
    fontSize: "0.75rem",
    fontWeight: 650,
    letterSpacing: "0.08em",
    textTransform: "uppercase",
  },
  title: {
    fontSize: "clamp(3rem, 8.5vw, 8.5rem)",
    fontWeight: 650,
    letterSpacing: "-0.07em",
    lineHeight: 0.88,
    maxWidth: "10ch",
    textWrap: "balance",
  },
  summary: {
    color: colors.muted,
    fontSize: "clamp(1rem, 1.6vw, 1.25rem)",
    lineHeight: 1.6,
    maxWidth: "38rem",
    textWrap: "pretty",
  },
  status: {
    alignSelf: "end",
    backgroundColor: colors.surface,
    borderColor: colors.line,
    borderRadius: "1rem",
    borderStyle: "solid",
    borderWidth: "1px",
    display: "grid",
    gap: "1.75rem",
    minWidth: 0,
    padding: "clamp(1.25rem, 3vw, 2rem)",
  },
  statusLabel: {
    color: colors.accent,
    fontFamily: type.mono,
    fontSize: "0.75rem",
    fontWeight: 650,
    letterSpacing: "0.08em",
    textTransform: "uppercase",
  },
  statusText: {
    color: colors.ink,
    fontSize: "1rem",
    lineHeight: 1.55,
  },
  rule: {
    backgroundColor: colors.accentSoft,
    height: "0.25rem",
    width: "3rem",
  },
});

export function HomeScreen() {
  return (
    <div {...stylex.props(styles.page)}>
      <header {...stylex.props(styles.header)}>
        <span {...stylex.props(styles.brand)}>Archive</span>
        <span {...stylex.props(styles.state)}>Foundation</span>
      </header>
      <main {...stylex.props(styles.main)}>
        <section
          {...stylex.props(styles.introduction)}
          aria-labelledby="foundation-title"
        >
          <p {...stylex.props(styles.eyebrow)}>Private rules workspace</p>
          <h1 {...stylex.props(styles.title)} id="foundation-title">
            Every ruling, traced back to the page it came from.
          </h1>
          <p {...stylex.props(styles.summary)}>
            Archive is preparing a focused place for tabletop groups to organize
            trusted material and reason from it with clear citations.
          </p>
        </section>
        <aside {...stylex.props(styles.status)} aria-label="Foundation status">
          <div {...stylex.props(styles.rule)} aria-hidden="true" />
          <p {...stylex.props(styles.statusLabel)}>Current state</p>
          <p {...stylex.props(styles.statusText)}>
            The application foundation is available. Product capabilities will
            appear only when they are ready to use.
          </p>
        </aside>
      </main>
    </div>
  );
}
