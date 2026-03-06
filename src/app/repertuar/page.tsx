import type { Metadata } from "next";
import Link from "next/link";
import { getRepertoirePerformances } from "@/lib/cms-data";
import { PerformanceCard } from "@/components/PerformanceCard";
import { canonicalUrl } from "@/lib/site-config";
import styles from "../styles/Page.module.css";

export const metadata: Metadata = {
  title: "Репертуар — Драматический театр «Круг»",
  description:
    "Полный репертуар театра: все спектакли с фото и описанием. Классика и современные постановки.",
  alternates: { canonical: canonicalUrl("/repertuar") },
  openGraph: {
    type: "website",
    locale: "ru_RU",
    url: canonicalUrl("/repertuar"),
    siteName: "Драматический театр «Круг»",
    title: "Репертуар — Драматический театр «Круг»",
    description: "Полный репертуар театра: все спектакли с фото и описанием. Классика и современные постановки.",
    images: [{ url: "/fon/8.jpg", width: 1200, height: 630, alt: "Репертуар театра Круг" }],
  },
  twitter: { card: "summary_large_image", title: "Репертуар — Драматический театр «Круг»" },
};

export default async function RepertuarPage() {
  const repertoirePerformances = (await getRepertoirePerformances().catch(() => [])) ?? [];
  return (
    <div className={styles.wrap}>
      <nav className={styles.breadcrumbs} aria-label="Хлебные крошки">
        <Link href="/">Главная</Link>
        <span className={styles.breadcrumbsSep}>→</span>
        <span>Репертуар</span>
      </nav>
      <header className={styles.header}>
        <h1 className={styles.h1}>Репертуар</h1>
        <p className={styles.lead}>
          Все спектакли театра — с фото и описанием. Те, что сейчас идут,
          отмечены в афише.
        </p>
      </header>

      {repertoirePerformances.length === 0 ? (
        <p className={styles.emptyMessage}>Нет спектаклей в репертуаре на данный момент.</p>
      ) : (
      <ul className={styles.cardsGrid}>
        {repertoirePerformances.map((play) => (
          <PerformanceCard key={play.id} play={play} variant="repertuar" />
        ))}
      </ul>
      )}
    </div>
  );
}
