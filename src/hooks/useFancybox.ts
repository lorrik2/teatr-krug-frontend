"use client";

import { useState, useEffect, useMemo } from "react";

const EMPTY_OPTIONS = {};

export default function useFancybox(options: Record<string, unknown> = EMPTY_OPTIONS) {
  const [root, setRoot] = useState<HTMLElement | null>(null);
  const opts = useMemo(
    () => (Object.keys(options).length === 0 ? EMPTY_OPTIONS : options),
    [options]
  );

  useEffect(() => {
    if (!root) return;

    let cancelled = false;
    let bound = false;

    void (async () => {
      await import("@fancyapps/ui/dist/fancybox/fancybox.css");
      const { Fancybox } = await import("@fancyapps/ui");
      if (cancelled || !root) return;
      Fancybox.bind(root, "[data-fancybox]", opts);
      bound = true;
    })();

    return () => {
      cancelled = true;
      void import("@fancyapps/ui").then(({ Fancybox }) => {
        if (bound) Fancybox.unbind(root, "[data-fancybox]");
      });
    };
  }, [root, opts]);

  return [setRoot] as const;
}
