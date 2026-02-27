"use client";

import Link from "next/link";
import OptimizedImage from "@/components/OptimizedImage";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { navItems, DEFAULT_TICKETS_URL, type NavItem } from "@/lib/mock-data";
import styles from "./Header.module.css";

function isDropdown(
  item: NavItem,
): item is { label: string; items: { href: string; label: string }[] } {
  return "items" in item;
}

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [mobileExpanded, setMobileExpanded] = useState<string | null>(null);
  const headerRef = useRef<HTMLElement>(null);

  const toggleMobileGroup = (label: string) => {
    setMobileExpanded((prev) => (prev === label ? null : label));
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        mobileOpen &&
        headerRef.current &&
        !headerRef.current.contains(event.target as Node)
      ) {
        event.preventDefault();
        event.stopPropagation();
        setMobileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [mobileOpen]);

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
      setMobileExpanded(null);
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  return (
    <header ref={headerRef} className={styles.header}>
      <div className={styles.container}>
        <Link href="/" className={styles.logo} aria-label="На главную">
          <OptimizedImage
            src="/logo/logoNoLayout.png"
            alt="Драматический театр Круг"
            width={280}
            height={100}
            className={styles.logoImg}
            priority
            effect="blur"
          />
        </Link>

        <nav className={styles.nav} aria-label="Основное меню">
          <ul className={styles.navList}>
            {navItems.map((item) => {
              if (isDropdown(item)) {
                return (
                  <li
                    key={item.label}
                    className={styles.navItemDropdown}
                    onMouseEnter={() => setOpenDropdown(item.label)}
                    onMouseLeave={() => setOpenDropdown(null)}
                  >
                    <button
                      type="button"
                      className={styles.navLink}
                      aria-expanded={openDropdown === item.label}
                      aria-haspopup="true"
                    >
                      {item.label}
                      <span className={styles.dropdownChevron} aria-hidden>
                        ▼
                      </span>
                    </button>
                    <AnimatePresence>
                      {openDropdown === item.label && (
                        <motion.ul
                          className={styles.dropdown}
                          initial={{ opacity: 0, y: -4 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -4 }}
                          transition={{ duration: 0.15 }}
                          role="menu"
                        >
                          {item.items.map((sub) => (
                            <li key={sub.href} role="none">
                              <Link
                                href={sub.href}
                                className={styles.dropdownLink}
                                role="menuitem"
                              >
                                {sub.label}
                              </Link>
                            </li>
                          ))}
                        </motion.ul>
                      )}
                    </AnimatePresence>
                  </li>
                );
              }
              return (
                <li key={item.href}>
                  <Link href={item.href} className={styles.navLink}>
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className={styles.actions}>
          <Link
            href={DEFAULT_TICKETS_URL}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.ticketBtn}
          >
            Купить билет
          </Link>
        </div>

        <button
          type="button"
          className={`${styles.burger} ${mobileOpen ? styles.burgerOpen : ""}`}
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-expanded={mobileOpen}
          aria-label={mobileOpen ? "Закрыть меню" : "Открыть меню"}
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
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            <ul className={styles.mobileList}>
              {navItems.map((item) => {
                if (isDropdown(item)) {
                  const isExpanded = mobileExpanded === item.label;
                  return (
                    <li key={item.label} className={styles.mobileGroup}>
                      <button
                        type="button"
                        className={styles.mobileGroupTitle}
                        onClick={() => toggleMobileGroup(item.label)}
                        aria-expanded={isExpanded}
                        aria-controls={`mobile-submenu-${item.label}`}
                      >
                        {item.label}
                        <span
                          className={`${styles.mobileChevron} ${isExpanded ? styles.mobileChevronOpen : ""}`}
                          aria-hidden
                        >
                          ▼
                        </span>
                      </button>
                      <AnimatePresence>
                        {isExpanded && (
                          <motion.ul
                            id={`mobile-submenu-${item.label}`}
                            className={styles.mobileSublist}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.2 }}
                          >
                            {item.items.map((sub) => (
                              <li key={sub.href}>
                                <Link
                                  href={sub.href}
                                  className={styles.mobileSublink}
                                  onClick={() => setMobileOpen(false)}
                                >
                                  {sub.label}
                                </Link>
                              </li>
                            ))}
                          </motion.ul>
                        )}
                      </AnimatePresence>
                    </li>
                  );
                }
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={styles.mobileLink}
                      onClick={() => setMobileOpen(false)}
                    >
                      {item.label}
                    </Link>
                  </li>
                );
              })}
              <li>
                <Link
                  href={DEFAULT_TICKETS_URL}
                  target="_blank"
                  rel="noopener noreferrer"
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
