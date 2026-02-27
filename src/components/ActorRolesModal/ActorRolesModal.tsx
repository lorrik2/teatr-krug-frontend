"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import OptimizedImage from "@/components/OptimizedImage";
import type { ActorPerformanceRole } from "@/lib/actor-utils";
import styles from "./ActorRolesModal.module.css";

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
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (isOpen) {
      dialog.showModal();
      document.body.style.overflow = "hidden";
    } else {
      dialog.close();
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    const handleBackdropClick = (e: MouseEvent) => {
      if (dialogRef.current && e.target === dialogRef.current) onClose();
    };
    window.addEventListener("keydown", handleEscape);
    const dialog = dialogRef.current;
    dialog?.addEventListener("click", handleBackdropClick);
    return () => {
      window.removeEventListener("keydown", handleEscape);
      dialog?.removeEventListener("click", handleBackdropClick);
    };
  }, [onClose]);

  if (!isOpen) return null;

  return (
    <dialog ref={dialogRef} className={styles.dialog} aria-label="Роли актёра">
      <div className={styles.content}>
        <button
          type="button"
          className={styles.closeBtn}
          onClick={onClose}
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
                width={120}
                height={120}
                className={styles.photo}
                effect="blur"
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
      </div>
    </dialog>
  );
}
