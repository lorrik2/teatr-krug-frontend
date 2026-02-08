import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { newsItems } from "@/lib/mock-data";
import styles from "../styles/Page.module.css";

export const metadata: Metadata = {
  title: "Новости — Камерный театр",
  description: "Анонсы творческих вечеров, рецензии, экскурсии по театру, блог.",
};

export default function NewsPage() {
  return (
    <div className={styles.wrap}>
      <header className={styles.header}>
        <h1 className={styles.h1}>Новости и блог</h1>
        <p className={styles.lead}>
          Анонсы, рецензии, встречи с актерами и экскурсии
        </p>
      </header>

      <section className={styles.section}>
        <ul className={styles.newsGrid}>
          {newsItems.map((item) => (
            <li key={item.id} className={styles.newsCard}>
              <Link href={`/novosti/${item.slug}`} className={styles.newsCardLink}>
                <div className={styles.newsImageWrap}>
                  <Image
                    src={item.image}
                    alt=""
                    width={600}
                    height={400}
                    className={styles.newsImage}
                  />
                  <span className={styles.newsCategory}>{item.category}</span>
                </div>
                <div className={styles.newsBody}>
                  <time className={styles.newsDate} dateTime={item.date}>
                    {item.date}
                  </time>
                  <h2 className={styles.newsTitle}>{item.title}</h2>
                  <p className={styles.newsExcerpt}>{item.excerpt}</p>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
