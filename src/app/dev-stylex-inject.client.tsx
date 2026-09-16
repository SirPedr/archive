"use client";

import { useEffect } from "react";

function DevelopmentStyleXAssets() {
  useEffect(() => {
    if (import.meta.env.DEV) {
      void import("virtual:stylex:runtime");
    }
  }, []);

  return <link href="/virtual:stylex.css" rel="stylesheet" />;
}

export function StyleXAssets() {
  return import.meta.env.DEV ? <DevelopmentStyleXAssets /> : null;
}
