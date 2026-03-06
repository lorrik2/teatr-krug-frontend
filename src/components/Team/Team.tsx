"use client";

import Link from "next/link";
import OptimizedImage from "@/components/OptimizedImage";
import { motion } from "framer-motion";
import type { Actor } from "@/lib/mock-data";
import { hasActorCardContent } from "@/lib/actor-utils";
import styles from "./Team.module.css";

export default function Team({ actors }: { actors: Actor[] }) {
  const leadership = actors.filter(
    (a) =>
      a.role.toLowerCase().includes("режиссёр") ||
      (a.rank && a.rank.includes("Художественный руководитель")),
  );
  const director = leadership[0];
  if (!director) {
    return (
      <section className={styles.section} id="team" aria-labelledby="team-title">
        <div className={styles.container}>
          <motion.div
            className={styles.header}
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 id="team-title" className={styles.title}>
              Художественный руководитель и режиссёр
            </h2>
          </motion.div>
          <p className={styles.emptyMessage}>
            Информация о художественном руководителе скоро появится.
          </p>
          <div className={styles.moreWrap}>
            <Link href="/team" className={styles.moreLink}>
              Вся команда →
            </Link>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className={styles.section} id="team" aria-labelledby="team-title">
      <div className={styles.container}>
        <motion.div
          className={styles.header}
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 id="team-title" className={styles.title}>
            Художественный руководитель и режиссёр
          </h2>
        </motion.div>

        <div className={styles.cardsWrap}>
          <ul className={styles.teamGrid}>
            <motion.li
              key={director.id}
              className={styles.card}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              {hasActorCardContent(director) ? (
                <Link
                  href={`/team/${director.slug}`}
                  className={`${styles.cardLink} ${styles.cardLinkClickable}`}
                >
                  <div className={styles.photoWrap}>
                    <OptimizedImage
                      src={director.photo}
                      alt={director.name}
                      width={400}
                      height={500}
                      className={styles.photo}
                      style={{ objectFit: "contain", objectPosition: "top" }}
                      priority
                      skipShimmer
                    />
                  </div>
                  <div className={styles.body}>
                    <h3 className={styles.name}>{director.name}</h3>
                    {director.rank && <p className={styles.rank}>{director.rank}</p>}
                    <p className={styles.role}>{director.role}</p>
                    <span className={styles.detailBtn}>Подробнее</span>
                  </div>
                </Link>
              ) : (
                <div className={styles.cardStatic}>
                  <div className={styles.photoWrap}>
                    <OptimizedImage
                      src={director.photo}
                      alt={director.name}
                      width={400}
                      height={500}
                      className={styles.photo}
                      style={{ objectFit: "contain", objectPosition: "top" }}
                      priority
                      skipShimmer
                    />
                  </div>
                  <div className={styles.body}>
                    <h3 className={styles.name}>{director.name}</h3>
                    {director.rank && <p className={styles.rank}>{director.rank}</p>}
                    <p className={styles.role}>{director.role}</p>
                  </div>
                </div>
              )}
            </motion.li>
          </ul>
        </div>

        <motion.div
          className={styles.moreWrap}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <Link href="/team" className={styles.moreLink}>
            Вся команда →
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
