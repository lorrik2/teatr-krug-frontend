"use client";

import ErrorFallback from "@/components/ErrorFallback";

/**
 * Error Boundary — перехватывает runtime-ошибки (client + server).
 * @see https://nextjs.org/docs/app/building-your-application/routing/error-handling
 */
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  if (process.env.NODE_ENV === "development") {
    console.error("Error boundary caught:", error);
  }
  return <ErrorFallback onRetry={reset} />;
}
