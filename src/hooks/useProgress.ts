"use client";

import { useCallback, useState } from "react";
import { useMotionValue, animate } from "framer-motion";

type ProgressState = "idle" | "in-progress" | "completing" | "complete";

export function useProgress() {
  const value = useMotionValue(0);
  const [state, setState] = useState<ProgressState>("idle");

  const start = useCallback(() => {
    setState("in-progress");
    value.set(0);
    animate(value, 0.92, {
      duration: 8,
      ease: [0.25, 0.1, 0.25, 1],
    });
  }, [value]);

  const done = useCallback(() => {
    setState("completing");
    animate(value, 1, {
      duration: 0.2,
      ease: "easeOut",
    }).then(() => {
      setState("complete");
    });
  }, [value]);

  const reset = useCallback(() => {
    value.set(0);
    setState("idle");
  }, [value]);

  return { start, done, reset, state, value };
}
