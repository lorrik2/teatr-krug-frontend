import type { Metadata } from "next";
import Link from "next/link";
import AfishaContent from "./AfishaContent";
import { getPerformances } from "@/lib/cms-data";
import { canonicalUrl } from "@/lib/site-config";
import styles from "../styles/Page.module.css";

export const metadata: Metadata = {
  title: "Афиша — Драматический театр «Круг»",
  description:
    "Репертуар спектаклей текущего сезона. Даты, время, возрастной рейтинг. Купить билеты онлайн.",
  alternates: { canonical: canonicalUrl("/afisha") },
  openGraph: {
    type: "website",
    locale: "ru_RU",
    url: canonicalUrl("/afisha"),
    siteName: "Драматический театр «Круг»",
    title: "Афиша — Драматический театр «Круг»",
    description: "Репертуар спектаклей текущего сезона. Даты, время, возрастной рейтинг. Купить билеты онлайн.",
    images: [{ url: "/logo/logoLayout.png", width: 1200, height: 630, alt: "Афиша театра Круг" }],
  },
  twitter: { card: "summary_large_image", title: "Афиша — Драматический театр «Круг»" },
};

export default async function AfishaPage() {
  const performances = (await getPerformances().catch(() => [])) ?? [];
  return (
    <div className={styles.wrap}>
      <nav className={styles.breadcrumbs} aria-label="Хлебные крошки">
        <Link href="/">Главная</Link>
        <span className={styles.breadcrumbsSep}>→</span>
        <span>Афиша</span>
      </nav>
      <header className={styles.header}>
        <h1 className={styles.h1}>Афиша</h1>
        <p className={styles.lead}>Выберите спектакль и дату.</p>
      </header>

      <AfishaContent performances={performances} />
    </div>
  );
}
