"use client";

import { useState, useEffect } from "react";
import { Fancybox } from "@fancyapps/ui";

import "@fancyapps/ui/dist/fancybox/fancybox.css";

export default function useFancybox(options: Record<string, unknown> = {}) {
  const [root, setRoot] = useState<HTMLElement | null>(null);

  useEffect(() => {
    if (root) {
      Fancybox.bind(root, "[data-fancybox]", options);
      return () => Fancybox.unbind(root, "[data-fancybox]");
    }
  }, [root]);

  return [setRoot] as const;
}
