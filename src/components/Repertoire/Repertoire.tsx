"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { performances } from "@/lib/mock-data";
import styles from "./Repertoire.module.css";

const MOBILE_BREAKPOINT = 768;

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
};

const item = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0 },
};

export default function Repertoire() {
  const [dateFilter, setDateFilter] = useState<string>("all");
  const [expanded, setExpanded] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const dates = ["all", ...Array.from(new Set(performances.map((p) => p.date)))];
  const filtered =
    dateFilter === "all"
      ? performances
      : performances.filter((p) => p.date === dateFilter);

  useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`);
    const update = () => setIsMobile(mql.matches);
    update();
    mql.addEventListener("change", update);
    return () => mql.removeEventListener("change", update);
  }, []);

  return (
    <section className={styles.section} id="afisha-block">
      <div className={styles.container}>
        <motion.div
          className={styles.header}
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className={styles.title}>Афиша</h2>
          <p className={styles.subtitle}>Репертуар текущего сезона</p>
          <div className={styles.filters}>
            <label htmlFor="date-filter" className="sr-only">
              Фильтр по дате
            </label>
            <select
              id="date-filter"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className={styles.select}
            >
              <option value="all">Все даты</option>
              {dates.filter((d) => d !== "all").map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>
        </motion.div>

        <div
          className={`${styles.cardsWrap} ${isMobile && !expanded ? styles.cardsWrapCollapsed : styles.cardsWrapExpanded}`}
        >
          <motion.ul
            className={styles.cardsGrid}
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
          >
            {filtered.map((play) => (
              <motion.li key={play.id} className={styles.card} variants={item}>
                <Link href={`/afisha/${play.slug}`} className={styles.cardLink}>
                  <div className={styles.posterWrap}>
                    <Image
                      src={play.poster}
                      alt={play.title}
                      width={400}
                      height={560}
                      className={styles.poster}
                    />
                    <span className={styles.age}>{play.ageRating}</span>
                  </div>
                  <div className={styles.body}>
                    <h3 className={styles.cardTitle}>{play.title}</h3>
                    <p className={styles.meta}>
                      {play.date} · {play.time}
                    </p>
                    <p className={styles.genre}>{play.genre}</p>
                    <p className={styles.desc}>{play.description}</p>
                    <div className={styles.buttons}>
                      <span className={styles.btnDetail}>Подробнее</span>
                      <Link
                        href="/afisha#tickets"
                        className={styles.btnTicket}
                        onClick={(e) => e.stopPropagation()}
                      >
                        Купить билет
                      </Link>
                    </div>
                  </div>
                </Link>
              </motion.li>
            ))}
          </motion.ul>

          {/* На мобильном: градиент и «Показать ещё» / «Вся афиша» */}
          <div
            className={`${styles.fadeOverlay} ${isMobile && !expanded ? styles.fadeOverlayVisible : styles.fadeOverlayHidden}`}
            aria-hidden={!(isMobile && !expanded)}
          >
            <div className={styles.fadeCta}>
              <button
                type="button"
                className={styles.fadeBtn}
                onClick={() => setExpanded(true)}
              >
                Показать ещё
              </button>
              <Link href="/afisha" className={styles.fadeLink}>
                Вся афиша →
              </Link>
            </div>
          </div>
        </div>

        <motion.div
          className={styles.moreWrap}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          style={isMobile && !expanded ? { display: "none" } : undefined}
        >
          <Link href="/afisha" className={styles.moreLink}>
            Вся афиша →
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
