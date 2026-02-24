"use client";

import { useState, useEffect, useMemo } from "react";
import { Fancybox } from "@fancyapps/ui";

import "@fancyapps/ui/dist/fancybox/fancybox.css";

const EMPTY_OPTIONS = {};

export default function useFancybox(options: Record<string, unknown> = EMPTY_OPTIONS) {
  const [root, setRoot] = useState<HTMLElement | null>(null);
  const opts = useMemo(
    () => (Object.keys(options).length === 0 ? EMPTY_OPTIONS : options),
    [options]
  );

  useEffect(() => {
    if (root) {
      Fancybox.bind(root, "[data-fancybox]", opts);
      return () => Fancybox.unbind(root, "[data-fancybox]");
    }
  }, [root, opts]);

  return [setRoot] as const;
}
