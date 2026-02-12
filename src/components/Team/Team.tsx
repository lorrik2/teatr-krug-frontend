"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { actors } from "@/lib/mock-data";
import styles from "./Team.module.css";

const MOBILE_BREAKPOINT = 768;

type SortKey = "name" | "rank";

export default function Team() {
  const [sort, setSort] = useState<SortKey>("name");
  const [expanded, setExpanded] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const sorted = [...actors].sort((a, b) => {
    if (sort === "name") return a.name.localeCompare(b.name);
    const hasRank = (x: typeof a) => (x.rank ? 1 : 0);
    return hasRank(b) - hasRank(a) || a.name.localeCompare(b.name);
  });

  useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`);
    const update = () => setIsMobile(mql.matches);
    update();
    mql.addEventListener("change", update);
    return () => mql.removeEventListener("change", update);
  }, []);

  return (
    <section
      className={styles.section}
      id="team"
      aria-labelledby="team-title"
    >
      <div className={styles.container}>
        <motion.div
          className={styles.header}
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 id="team-title" className={styles.title}>
            Команда
          </h2>
          <p className={styles.subtitle}>Актеры и режиссёры театра</p>
          <div className={styles.filters}>
            <button
              type="button"
              className={
                sort === "name" ? styles.filterActive : styles.filterBtn
              }
              onClick={() => setSort("name")}
            >
              По алфавиту
            </button>
            <button
              type="button"
              className={
                sort === "rank" ? styles.filterActive : styles.filterBtn
              }
              onClick={() => setSort("rank")}
            >
              По званиям
            </button>
          </div>
        </motion.div>

        <div
          className={`${styles.cardsWrap} ${
            isMobile && !expanded
              ? styles.cardsWrapCollapsed
              : styles.cardsWrapExpanded
          }`}
        >
          <ul className={styles.teamGrid}>
            {sorted.map((actor, i) => (
              <motion.li
                key={actor.id}
                className={styles.card}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
              >
                <Link href={`/team/${actor.slug}`} className={styles.cardLink}>
                  <div className={styles.photoWrap}>
                    <Image
                      src={actor.photo}
                      alt={actor.name}
                      width={400}
                      height={500}
                      className={styles.photo}
                    />
                  </div>
                  <div className={styles.body}>
                    <h3 className={styles.name}>{actor.name}</h3>
                    {actor.rank && <p className={styles.rank}>{actor.rank}</p>}
                    <p className={styles.role}>{actor.role}</p>
                  </div>
                </Link>
              </motion.li>
            ))}
          </ul>

          <div
            className={`${styles.fadeOverlay} ${
              isMobile && !expanded
                ? styles.fadeOverlayVisible
                : styles.fadeOverlayHidden
            }`}
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
              <Link href="/team" className={styles.fadeLink}>
                Вся команда →
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
          <Link href="/team" className={styles.moreLink}>
            Вся команда →
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
