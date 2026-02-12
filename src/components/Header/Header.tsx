"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { navLinks } from "@/lib/mock-data";
import styles from "./Header.module.css";

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const headerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (mobileOpen && headerRef.current && !headerRef.current.contains(event.target as Node)) {
        event.preventDefault();
        event.stopPropagation();
        setMobileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [mobileOpen]);

  return (
    <header ref={headerRef} className={styles.header}>
      <div className={styles.container}>
        <Link href="/" className={styles.logo} aria-label="На главную">
          <Image
            src="/logo/лого круг.png"
            alt="Драматический театр Круг"
            width={140}
            height={48}
            className={styles.logoImg}
            priority
          />
        </Link>

        <nav className={styles.nav} aria-label="Основное меню">
          <ul className={styles.navList}>
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className={styles.navLink}>
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className={styles.actions}>
          <Link href="/afisha#tickets" className={styles.ticketBtn}>
            Купить билет
          </Link>
        </div>

        <button
          type="button"
          className={styles.burger}
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-expanded={mobileOpen}
          aria-label="Открыть меню"
        >
          <span className={styles.burgerLine} />
          <span className={styles.burgerLine} />
          <span className={styles.burgerLine} />
        </button>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            className={styles.mobileMenu}
            initial={{ opacity: 0, maxHeight: 0 }}
            animate={{ opacity: 1, maxHeight: 520 }}
            exit={{ opacity: 0, maxHeight: 0 }}
            transition={{ duration: 0.2 }}
          >
            <ul className={styles.mobileList}>
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className={styles.mobileLink}
                    onClick={() => setMobileOpen(false)}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  href="/afisha#tickets"
                  className={styles.mobileTicketBtn}
                  onClick={() => setMobileOpen(false)}
                >
                  Купить билет
                </Link>
              </li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
