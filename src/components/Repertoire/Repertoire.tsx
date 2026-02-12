"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { performances } from "@/lib/mock-data";
import { PerformanceCard } from "@/components/PerformanceCard";
import styles from "./Repertoire.module.css";

const AFISHA_ON_MAIN_LIMIT = 3;

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
  const nearestInAfisha = performances
    .filter((p) => p.inAfisha !== false)
    .slice(0, AFISHA_ON_MAIN_LIMIT);

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
        </motion.div>

        <div className={styles.cardsWrap}>
          <motion.ul
            className={styles.cardsGrid}
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
          >
            {nearestInAfisha.map((play) => (
              <PerformanceCard
                key={play.id}
                play={play}
                variant="afisha"
                animated
                variants={item}
                compact
              />
            ))}
          </motion.ul>
        </div>

        <motion.div
          className={styles.moreWrap}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <Link href="/afisha" className={styles.moreLink}>
            Вся афиша →
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
