import type { Metadata } from "next";
import { repertoirePerformances } from "@/lib/mock-data";
import { PerformanceCard } from "@/components/PerformanceCard";
import styles from "../styles/Page.module.css";

export const metadata: Metadata = {
  title: "Репертуар — Драматический театр «Круг»",
  description:
    "Полный репертуар театра: все спектакли с фото и описанием. Классика и современные постановки.",
};

export default function RepertuarPage() {
  return (
    <div className={styles.wrap}>
      <header className={styles.header}>
        <h1 className={styles.h1}>Репертуар</h1>
        <p className={styles.lead}>
          Все спектакли театра — с фото и описанием. Те, что сейчас идут,
          отмечены в афише.
        </p>
      </header>

      <ul className={styles.cardsGrid}>
        {repertoirePerformances.map((play) => (
          <PerformanceCard key={play.id} play={play} variant="repertuar" />
        ))}
      </ul>
    </div>
  );
}
