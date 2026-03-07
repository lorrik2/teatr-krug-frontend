"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import type { NewsItem } from "@/lib/types";
import styles from "./News.module.css";

const NEWS_ON_MAIN_LIMIT = 5;

export default function News({ newsItems }: { newsItems: NewsItem[] }) {
  if (!newsItems?.length) return null;

  const items = newsItems.slice(0, NEWS_ON_MAIN_LIMIT);

  return (
    <section className={styles.section} id="sobytiya" aria-labelledby="news-title">
      <div className={styles.container}>
        <motion.div
          className={styles.header}
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 id="news-title" className={styles.title}>
            События
          </h2>
        </motion.div>

        <ul className={styles.eventList}>
          {items.map((item, i) => (
            <motion.li
              key={item.id}
              className={styles.eventRow}
              initial={{ opacity: 0, y: 4 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.04 }}
            >
              <Link href={`/sobytiya/${item.slug}`} className={styles.eventLink}>
                <span className={styles.eventTitle}>{item.title}</span>
                <time className={styles.eventDate} dateTime={item.date}>
                  {item.date}
                </time>
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
          <Link href="/sobytiya" className={styles.moreLink}>
            Все события →
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
