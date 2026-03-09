"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence, useTransform } from "framer-motion";
import { useProgress } from "@/hooks/useProgress";
import styles from "./NavigationProgress.module.css";

/**
 * Глобальный индикатор загрузки при переходах между страницами.
 * Показывает прогресс-бар сверху экрана при клике на внутренние ссылки.
 */
export default function NavigationProgress() {
  const { start, done, reset, state, value } = useProgress();
  const pathname = usePathname();
  const prevPathname = useRef(pathname);
  const isNavigating = useRef(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Слушаем клики по внутренним ссылкам
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const link = target.closest('a[href^="/"]');
      if (!link) return;
      if (link.getAttribute("target") === "_blank") return;
      if (link.getAttribute("href")?.startsWith("//")) return;

      const href = link.getAttribute("href") || "";
      if (href === "#" || href.startsWith("#")) return;

      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      isNavigating.current = true;
      start();
      timeoutRef.current = setTimeout(() => {
        if (isNavigating.current) {
          isNavigating.current = false;
          done();
        }
        timeoutRef.current = null;
      }, 3000);
    };

    document.addEventListener("click", handleClick, true);
    return () => {
      document.removeEventListener("click", handleClick, true);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [start, done]);

  // При смене pathname завершаем анимацию
  useEffect(() => {
    if (prevPathname.current !== pathname && isNavigating.current) {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
      isNavigating.current = false;
      done();
    }
    prevPathname.current = pathname;
  }, [pathname, done]);

  const width = useTransform(value, (v) => `${v * 100}%`);

  return (
    <AnimatePresence onExitComplete={reset}>
      {state !== "idle" && state !== "complete" && (
        <motion.div
          className={styles.bar}
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          aria-hidden
        >
          <motion.div className={styles.fill} style={{ width }} />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
