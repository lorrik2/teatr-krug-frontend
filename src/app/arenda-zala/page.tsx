import type { Metadata } from "next";
import Link from "next/link";
import GalleryLightbox from "@/components/GalleryLightbox";
import styles from "../styles/Page.module.css";

export const metadata: Metadata = {
  title: "Аренда зала — Драматический театр «Круг»",
  description:
    "Аренда зрительного зала и помещений театра для мероприятий, концертов, показов.",
};

const galleryImages = [
  { src: "/fon/8.jpg", alt: "Фасад театра" },
  { src: "/fon/12.jpg", alt: "Зрительный зал" },
  { src: "/fon/13.jpg", alt: "Фойе" },
  { src: "/fon/22.jpg", alt: "Гримёрки" },
  { src: "/fon/6.jpg", alt: "Зал" },
  { src: "/fon/7.jpg", alt: "Закулисье" },
];

export default function ArendaZalaPage() {
  return (
    <div className={styles.wrap}>
      <nav className={styles.breadcrumbs} aria-label="Хлебные крошки">
        <Link href="/">Главная</Link>
        <span className={styles.breadcrumbsSep}>→</span>
        <span>Аренда зала</span>
      </nav>

      <header className={styles.header}>
        <h1 className={styles.h1}>Аренда зала</h1>
        <p className={styles.lead}>
          Зрительный зал и помещения театра для ваших мероприятий
        </p>
      </header>

      <section className={styles.contentSection}>
        <h2 className={styles.h2}>Условия аренды</h2>
        <p>
          Драматический театр «Круг» предлагает в аренду зрительный зал и
          сопутствующие помещения для проведения спектаклей, концертов,
          презентаций, корпоративных мероприятий и творческих проектов.
        </p>
        <p>
          Зал рассчитан на 120 зрителей. В наличии профессиональное
          сценическое оборудование, световая и звуковая аппаратура. Фойе
          подходит для фуршетов и выставок.
        </p>
      </section>

      <section
        id="gallery"
        className={`${styles.contentSection} ${styles.contentSectionWide}`}
      >
        <h2 className={styles.h2}>Фотографии зала и помещений</h2>
        <GalleryLightbox
          images={galleryImages}
          variant="grid"
          limit={4}
          moreLabel="Смотреть ещё"
          galleryId="arenda-zala-photos"
        />
      </section>

      <section className={styles.contentSection}>
        <h2 className={styles.h2}>Как забронировать</h2>
        <p>
          По вопросам аренды обращайтесь в администрацию театра по телефону
          или электронной почте. Указаны на странице{" "}
          <Link href="/kontakty" className={styles.galleryLink}>
            Контакты
          </Link>
          .
        </p>
      </section>
    </div>
  );
}
