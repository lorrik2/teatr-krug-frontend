"use client";

/**
 * Глобальный Error Boundary — перехватывает ошибки в root layout.
 * Должен включать собственные html и body.
 * @see https://nextjs.org/docs/app/building-your-application/routing/error-handling#handling-errors-in-root-layouts
 */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="ru">
      <body className="min-h-screen flex flex-col items-center justify-center px-4 font-sans">
        <div className="text-center max-w-md">
          <h1 className="text-2xl font-semibold text-graphite-900 mb-2">
            Что-то пошло не так
          </h1>
          <p className="text-graphite-600 mb-6">
            Произошла ошибка. Попробуйте обновить страницу или вернуться на
            главную.
          </p>
          <div className="flex gap-4 justify-center">
            <button
              type="button"
              onClick={reset}
              className="px-4 py-2 bg-graphite-900 text-white rounded hover:bg-graphite-700"
            >
              Попробовать снова
            </button>
            <a
              href="/"
              className="px-4 py-2 border border-graphite-300 rounded hover:bg-graphite-50"
            >
              На главную
            </a>
          </div>
        </div>
      </body>
    </html>
  );
}
