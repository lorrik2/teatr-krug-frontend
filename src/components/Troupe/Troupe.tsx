"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { actors } from "@/lib/mock-data";
import styles from "./Troupe.module.css";

type SortKey = "name" | "rank";

export default function Troupe() {
  const [sort, setSort] = useState<SortKey>("name");
  const sorted = [...actors].sort((a, b) => {
    if (sort === "name") return a.name.localeCompare(b.name);
    const hasRank = (x: typeof a) => (x.rank ? 1 : 0);
    return hasRank(b) - hasRank(a) || a.name.localeCompare(b.name);
  });

  return (
    <section className={styles.section} id="truppa" aria-labelledby="troupe-title">
      <div className={styles.container}>
        <motion.div
          className={styles.header}
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 id="troupe-title" className={styles.title}>
            Труппа
          </h2>
          <p className={styles.subtitle}>
            Актеры и режиссёры театра
          </p>
          <div className={styles.filters}>
            <button
              type="button"
              className={sort === "name" ? styles.filterActive : styles.filterBtn}
              onClick={() => setSort("name")}
            >
              По алфавиту
            </button>
            <button
              type="button"
              className={sort === "rank" ? styles.filterActive : styles.filterBtn}
              onClick={() => setSort("rank")}
            >
              По званиям
            </button>
          </div>
        </motion.div>

        <ul className={styles.troupeGrid}>
          {sorted.map((actor, i) => (
            <motion.li
              key={actor.id}
              className={styles.card}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
            >
              <Link href={`/truppa/${actor.slug}`} className={styles.cardLink}>
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
                  {actor.rank && (
                    <p className={styles.rank}>{actor.rank}</p>
                  )}
                  <p className={styles.role}>{actor.role}</p>
                </div>
              </Link>
            </motion.li>
          ))}
        </ul>

        <motion.div
          className={styles.moreWrap}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <Link href="/truppa" className={styles.moreLink}>
            Вся труппа →
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
