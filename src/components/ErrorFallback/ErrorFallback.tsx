"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";

interface ErrorFallbackProps {
  /** При ошибке — возможность повторить попытку */
  onRetry?: () => void;
}

/**
 * Одна реализация для 404 и runtime-ошибок.
 * Используется в not-found.tsx и error.tsx.
 */
export default function ErrorFallback({ onRetry }: ErrorFallbackProps) {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 py-16">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
      >
        <Image
          src="/404.png"
          alt="404"
          width={380}
          height={280}
          className="mx-auto object-contain"
          priority
          unoptimized
        />
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.4 }}
        className="mt-6 text-center"
      >
        <p className="font-posterama text-xl italic text-graphite-700 md:text-2xl">
          Антракт! Этой страницы нет в репертуаре.
        </p>
        <p className="mt-2 text-sm text-graphite-500">
          Возможно, спектакль уже снят с афиши, вы перешли по старой ссылке или
          страница недоступна к просмотру.
        </p>
        <div className="mt-6 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          {onRetry && (
            <button
              type="button"
              onClick={onRetry}
              className="btn-ticket inline-flex"
            >
              Попробовать снова
            </button>
          )}
          <Link
            href="/"
            className={onRetry ? "btn-ticket-outline inline-flex" : "btn-ticket inline-flex"}
          >
            Вернуться в зал
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
