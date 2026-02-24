import type { Metadata } from "next";
import Link from "next/link";
import OptimizedImage from "@/components/OptimizedImage";
import { getNewsItems } from "@/lib/cms-data";
import styles from "../styles/Page.module.css";

export const metadata: Metadata = {
  title: "События — Драматический театр «Круг»",
  description:
    "Анонсы творческих вечеров, рецензии, экскурсии по театру, блог.",
};

export default async function EventsPage() {
  const newsItems = await getNewsItems();
  return (
    <div className={styles.wrap}>
      <header className={styles.header}>
        <h1 className={styles.h1}>События</h1>
        <p className={styles.lead}>
          Анонсы, рецензии, встречи с актерами и экскурсии
        </p>
      </header>

      <section className={styles.section}>
        <ul className={styles.newsGrid}>
          {newsItems.map((item) => (
            <li key={item.id} className={styles.newsCard}>
              <Link
                href={`/sobytiya/${item.slug}`}
                className={styles.newsCardLink}
              >
                <div className={styles.newsImageWrap}>
                  <OptimizedImage
                    src={item.image}
                    alt=""
                    width={600}
                    height={400}
                    className={styles.newsImage}
                    effect="blur"
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
