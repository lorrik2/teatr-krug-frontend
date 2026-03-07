import type { Metadata } from "next";
import Link from "next/link";
import GalleryLightbox from "@/components/GalleryLightbox";
import { getOTeatrePageData } from "@/lib/cms-data";
import { canonicalUrl, OG_LOGO } from "@/lib/site-config";
import styles from "../styles/Page.module.css";

export async function generateMetadata(): Promise<Metadata> {
  const data = await getOTeatrePageData();
  const ogImage = data.galleryImages?.[0]?.src
    ? { url: data.galleryImages[0].src, width: 1200, height: 630, alt: "О театре Круг" }
    : { ...OG_LOGO, alt: "О театре Круг" };
  return {
    title: "О театре — Драматический театр «Круг»",
    description:
      "История здания и труппы, миссия, художественный руководитель, фотогалерея.",
    alternates: { canonical: canonicalUrl("/o-teatre") },
    openGraph: {
      type: "website",
      locale: "ru_RU",
      url: canonicalUrl("/o-teatre"),
      siteName: "Драматический театр «Круг»",
      title: "О театре — Драматический театр «Круг»",
      description:
        "История здания и труппы, миссия, художественный руководитель, фотогалерея.",
      images: [ogImage],
    },
    twitter: {
      card: "summary_large_image",
      title: "О театре — Драматический театр «Круг»",
    },
  };
}

function textToParagraphs(text: string): string[] {
  return text.split(/\n\n+/).filter((p) => p.trim());
}

export default async function AboutPage() {
  const data = await getOTeatrePageData();
  const aboutParagraphs = textToParagraphs(data.lead ?? "");
  const historyParagraphs = textToParagraphs(data.historyText ?? "");
  const missionParagraphs = textToParagraphs(data.missionText ?? "");
  const galleryPreview = data.galleryImages ?? [];
  return (
    <div className={styles.wrap}>
      <nav className={styles.breadcrumbs} aria-label="Хлебные крошки">
        <Link href="/">Главная</Link>
        <span className={styles.breadcrumbsSep}>→</span>
        <span>О театре</span>
      </nav>
      <header className={styles.header}>
        <h1 className={styles.h1}>{data.title || "О театре"}</h1>
      </header>

      {aboutParagraphs.length > 0 && (
        <section className={styles.contentSection}>
          {aboutParagraphs.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </section>
      )}

      {historyParagraphs.length > 0 && (
        <section className={styles.contentSection}>
          <h2 className={styles.h2}>История</h2>
          {historyParagraphs.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </section>
      )}

      {missionParagraphs.length > 0 && (
        <section className={styles.contentSection}>
          <h2 className={styles.h2}>Миссия</h2>
          {missionParagraphs.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </section>
      )}

      {galleryPreview.length > 0 && (
        <section
          id="gallery"
          className={`${styles.contentSection} ${styles.contentSectionWide}`}
        >
          <h2 className={styles.h2}>Фотогалерея</h2>
          <GalleryLightbox
            images={galleryPreview}
            variant="row"
            moreLink={{
              href: "/o-teatre/fotogalereya",
              label: "Смотреть все фото →",
            }}
          />
        </section>
      )}
    </div>
  );
}
