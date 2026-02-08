import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { performances } from "@/lib/mock-data";
import TicketsBlock from "@/components/TicketsBlock";
import styles from "../styles/Page.module.css";

export const metadata: Metadata = {
  title: "Афиша — Драматический театр «Круг»",
  description: "Репертуар спектаклей текущего сезона. Даты, время, возрастной рейтинг. Купить билеты онлайн.",
};

export default function AfishaPage() {
  return (
    <div className={styles.wrap}>
      <header className={styles.header}>
        <h1 className={styles.h1}>Афиша</h1>
        <p className={styles.lead}>Репертуар текущего сезона. Выберите спектакль и дату.</p>
      </header>

      <section className={styles.section}>
        <ul className={styles.cardsGrid}>
          {performances.map((play) => (
            <li key={play.id} className={styles.card}>
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
                  <h2 className={styles.cardTitle}>{play.title}</h2>
                  <p className={styles.meta}>
                    {play.date} · {play.time}
                    {play.duration && ` · ${play.duration}`}
                  </p>
                  <p className={styles.genre}>{play.genre}</p>
                  <p className={styles.desc}>{play.description}</p>
                  <span className={styles.btnDetail}>Подробнее</span>
                </div>
              </Link>
              <Link href="#tickets" className={styles.btnTicket}>
                Купить билет
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <TicketsBlock />
    </div>
  );
}
