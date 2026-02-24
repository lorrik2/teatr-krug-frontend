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
  const sorted = [...leadership].sort((a, b) => a.name.localeCompare(b.name));

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
            {sorted.map((actor, i) => {
              const hasContent = hasActorCardContent(actor);
              const cardContent = (
                <>
                  <div className={styles.photoWrap}>
                    <OptimizedImage
                      src={actor.photo}
                      alt={actor.name}
                      width={400}
                      height={500}
                      className={styles.photo}
                      effect="blur"
                    />
                  </div>
                  <div className={styles.body}>
                    <h3 className={styles.name}>{actor.name}</h3>
                    {actor.rank && <p className={styles.rank}>{actor.rank}</p>}
                    <p className={styles.role}>{actor.role}</p>
                    {hasContent && (
                      <span className={styles.detailBtn}>Подробнее</span>
                    )}
                  </div>
                </>
              );
              return (
                <motion.li
                  key={actor.id}
                  className={styles.card}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                >
                  {hasContent ? (
                    <Link
                      href={`/team/${actor.slug}`}
                      className={`${styles.cardLink} ${styles.cardLinkClickable}`}
                    >
                      {cardContent}
                    </Link>
                  ) : (
                    <div className={styles.cardStatic}>{cardContent}</div>
                  )}
                </motion.li>
              );
            })}
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
