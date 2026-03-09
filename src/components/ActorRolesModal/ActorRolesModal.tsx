"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import OptimizedImage from "@/components/OptimizedImage";
import type { ActorPerformanceRole } from "@/lib/actor-utils";
import styles from "./ActorRolesModal.module.css";

const backdropVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
  exit: { opacity: 0 },
};

const contentVariants = {
  hidden: { opacity: 0, scale: 0.95, y: 12 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { type: "spring", damping: 25, stiffness: 300 },
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    y: 12,
    transition: { duration: 0.15 },
  },
};

interface ActorRolesModalProps {
  name: string;
  photo?: string;
  role?: string;
  performanceRoles: ActorPerformanceRole[];
  onClose: () => void;
  isOpen: boolean;
}

export default function ActorRolesModal({
  name,
  photo,
  role,
  performanceRoles,
  onClose,
  isOpen,
}: ActorRolesModalProps) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const [isExiting, setIsExiting] = useState(false);
  const showContent = isOpen && !isExiting;
  const isOverlayVisible = isOpen || isExiting;

  useEffect(() => {
    if (isOverlayVisible) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOverlayVisible]);

  const handleClose = useCallback(() => {
    setIsExiting((prev) => {
      if (prev) return prev;
      return true;
    });
  }, []);

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === overlayRef.current) handleClose();
  };

  const handleExitComplete = useCallback(() => {
    setIsExiting(false);
    onClose();
  }, [onClose]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleClose();
    };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [handleClose]);

  return (
    <AnimatePresence onExitComplete={handleExitComplete}>
      {showContent && (
        <motion.div
          key="actor-modal"
          ref={overlayRef}
          className={styles.overlay}
          role="dialog"
          aria-modal="true"
          aria-label="Роли актёра"
          initial="hidden"
          animate="visible"
          exit="exit"
          variants={backdropVariants}
          transition={{ duration: 0.2 }}
          onClick={handleBackdropClick}
        >
          <motion.div
            className={styles.content}
            variants={contentVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={(e) => e.stopPropagation()}
          >
          <button
            type="button"
            className={styles.closeBtn}
            onClick={handleClose}
            aria-label="Закрыть"
          >
            ×
          </button>
          <div className={styles.header}>
            <div className={styles.photoWrap}>
            {photo ? (
              <OptimizedImage
                src={photo}
                alt={name || "Актёр"}
                width={400}
                height={500}
                className={styles.photo}
                style={{ objectFit: "contain", objectPosition: "top" }}
                skipShimmer
              />
            ) : (
              <span className={styles.placeholder}>{(name || "?")[0]}</span>
              )}
            </div>
            <div className={styles.info}>
            <h3 className={styles.name}>{name || "Актёр"}</h3>
              {role && <p className={styles.rank}>{role}</p>}
            </div>
          </div>
          {performanceRoles.length > 0 ? (
            <div className={styles.rolesBlock}>
              <h4 className={styles.rolesTitle}>Роли в спектаклях</h4>
              <ul className={styles.rolesList}>
                {performanceRoles.map((r, i) => (
                  <li key={i} className={styles.roleItem}>
                    <Link
                      href={`/repertuar/${r.slug}`}
                      className={styles.roleLink}
                      onClick={onClose}
                    >
                      <span className={styles.roleName}>{r.role}</span>
                      <span className={styles.performanceTitle}>
                        «{r.title}»
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <p className={styles.noRoles}>Роли пока не добавлены.</p>
          )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
