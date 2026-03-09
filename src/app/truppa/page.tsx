import type { Metadata } from "next";
import Link from "next/link";
import { getActors, getRepertoirePerformances } from "@/lib/cms-data";
import TeamGrid from "@/components/Team/TeamGrid";
import { canonicalUrl, OG_LOGO } from "@/lib/site-config";
import styles from "../team/TeamPage.module.css";

export async function generateMetadata(): Promise<Metadata> {
  const actors = await getActors().catch(() => []);
  const ogImage = actors[0]?.photo
    ? { url: actors[0].photo, width: 1200, height: 630, alt: actors[0].name || "Команда театра Круг" }
    : { ...OG_LOGO, alt: "Команда театра Круг" };
  return {
    title: "Команда — Драматический театр «Круг»",
    description: "Актеры и режиссёры театра. Биографии, роли, фото.",
    alternates: { canonical: canonicalUrl("/truppa") },
    openGraph: {
      type: "website",
      locale: "ru_RU",
      url: canonicalUrl("/truppa"),
      siteName: "Драматический театр «Круг»",
      title: "Команда — Драматический театр «Круг»",
      description: "Актеры и режиссёры театра. Биографии, роли, фото.",
      images: [ogImage],
    },
    twitter: { card: "summary_large_image", title: "Команда — Драматический театр «Круг»" },
  };
}

export default async function TroupePage() {
  const [actors, performances] = await Promise.all([
    getActors(),
    getRepertoirePerformances(),
  ]);
  return (
    <div className={styles.wrap}>
      <nav className={styles.breadcrumbs} aria-label="Хлебные крошки">
        <Link href="/">Главная</Link>
        <span className={styles.breadcrumbsSep}>→</span>
        <span>Команда</span>
      </nav>
      <header className={styles.header}>
        <h1 className={styles.title}>Команда</h1>
        <p className={styles.subtitle}>Актеры и режиссёры театра</p>
      </header>

      <section className={styles.section}>
        <TeamGrid actors={actors} performances={performances} />
      </section>
    </div>
  );
}
