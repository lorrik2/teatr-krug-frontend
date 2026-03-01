import type { Metadata } from "next";
import Link from "next/link";
import GalleryLightbox from "@/components/GalleryLightbox";
import { getOTeatrePageData } from "@/lib/cms-data";
import styles from "../styles/Page.module.css";

export const metadata: Metadata = {
  title: "О театре — Драматический театр «Круг»",
  description:
    "История здания и труппы, миссия, художественный руководитель, фотогалерея.",
};

export default async function AboutPage() {
  const data = await getOTeatrePageData();
  const historyParagraphs = (data.historyText ?? "")
    .split(/\n\n+/)
    .filter((p) => p.trim());
  const missionParagraphs = (data.missionText ?? "")
    .split(/\n\n+/)
    .filter((p) => p.trim());
  const galleryPreview =
    (data.galleryImages ?? []).length > 0
      ? (data.galleryImages ?? [])
      : [
          { src: "/fon/8.jpg", alt: "Фасад театра" },
          { src: "/fon/12.jpg", alt: "Зрительный зал" },
          { src: "/fon/13.jpg", alt: "Фойе" },
          { src: "/fon/22.jpg", alt: "Гримёрки" },
        ];
  return (
    <div className={styles.wrap}>
      <nav className={styles.breadcrumbs} aria-label="Хлебные крошки">
        <Link href="/">Главная</Link>
        <span className={styles.breadcrumbsSep}>→</span>
        <span>О театре</span>
      </nav>
      <header className={styles.header}>
        <h1 className={styles.h1}>{data.title || "О театре"}</h1>
        <p className={styles.lead}>{data.lead || ""}</p>
      </header>

      <section className={styles.contentSection}>
        <h2 className={styles.h2}>История</h2>
        {historyParagraphs.length > 0 ? (
          historyParagraphs.map((p, i) => <p key={i}>{p}</p>)
        ) : (
          <p>
            Драматический театр «Круг» основан в 2010 году. Здание — бывший
            особняк XIX века в центре города — было передано под театр и
            реконструировано с сохранением исторического облика.
          </p>
        )}
      </section>

      <section className={styles.contentSection}>
        <h2 className={styles.h2}>Миссия</h2>
        {missionParagraphs.length > 0 ? (
          missionParagraphs.map((p, i) => <p key={i}>{p}</p>)
        ) : (
          <p>
            Мы верим, что театр — это живое искусство, которое говорит с
            каждым зрителем на его языке.
          </p>
        )}
      </section>

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
    </div>
  );
}
