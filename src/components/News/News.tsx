"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { newsItems } from "@/lib/mock-data";
import styles from "./News.module.css";

export default function News() {
  const items = newsItems.slice(0, 3);

  return (
    <section className={styles.section} id="novosti" aria-labelledby="news-title">
      <div className={styles.container}>
        <motion.div
          className={styles.header}
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 id="news-title" className={styles.title}>
            Новости и блог
          </h2>
          <p className={styles.subtitle}>
            Анонсы, рецензии, творческие вечера и экскурсии
          </p>
        </motion.div>

        <ul className={styles.newsGrid}>
          {items.map((item, i) => (
            <motion.li
              key={item.id}
              className={styles.card}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
            >
              <Link href={`/novosti/${item.slug}`} className={styles.cardLink}>
                <div className={styles.imageWrap}>
                  <Image
                    src={item.image}
                    alt=""
                    width={600}
                    height={400}
                    className={styles.image}
                  />
                  <span className={styles.category}>{item.category}</span>
                </div>
                <div className={styles.body}>
                  <time className={styles.date} dateTime={item.date}>
                    {item.date}
                  </time>
                  <h3 className={styles.cardTitle}>{item.title}</h3>
                  <p className={styles.excerpt}>{item.excerpt}</p>
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
          <Link href="/novosti" className={styles.moreLink}>
            Все новости →
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
