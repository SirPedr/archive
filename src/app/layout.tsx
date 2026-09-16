import type { Metadata } from "next";
import type { ReactNode } from "react";

import { StyleXAssets } from "./dev-stylex-inject.client";
import "./globals.css";

export const metadata: Metadata = {
  title: "Archive",
  description: "A private, source-grounded tabletop rules workspace.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <StyleXAssets />
      </head>
      <body>{children}</body>
    </html>
  );
}
