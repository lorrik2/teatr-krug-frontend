import type { Metadata } from "next";
import Link from "next/link";
import GalleryLightbox from "@/components/GalleryLightbox";
import styles from "../styles/Page.module.css";

export const metadata: Metadata = {
  title: "О театре — Драматический театр «Круг»",
  description:
    "История здания и труппы, миссия, художественный руководитель, фотогалерея.",
};

/** Превью для страницы О театре — первые 4 фото */
const galleryPreview = [
  { src: "/fon/8.jpg", alt: "Фасад театра" },
  { src: "/fon/12.jpg", alt: "Зрительный зал" },
  { src: "/fon/13.jpg", alt: "Фойе" },
  { src: "/fon/22.jpg", alt: "Гримёрки" },
];

export default function AboutPage() {
  return (
    <div className={styles.wrap}>
      <nav className={styles.breadcrumbs} aria-label="Хлебные крошки">
        <Link href="/">Главная</Link>
        <span className={styles.breadcrumbsSep}>→</span>
        <span>О театре</span>
      </nav>
      <header className={styles.header}>
        <h1 className={styles.h1}>О театре</h1>
        <p className={styles.lead}>История, миссия, атмосфера и люди</p>
      </header>

      <section className={styles.contentSection}>
        <h2 className={styles.h2}>История</h2>
        <p>
          Драматический театр «Круг» основан в 2010 году. Здание — бывший
          особняк XIX века в центре города — было передано под театр и
          реконструировано с сохранением исторического облика. Сцена рассчитана
          на камерные постановки: до 120 зрителей, что создаёт особый контакт
          между залом и сценой.
        </p>
        <p>
          За годы существования театр сформировал постоянную труппу, открыл
          малую сцену для экспериментов и детские проекты. Художественный
          руководитель — Андрей Волков, режиссёр и педагог, лауреат национальных
          театральных премий.
        </p>
      </section>

      <section className={styles.contentSection}>
        <h2 className={styles.h2}>Миссия</h2>
        <p>
          Мы верим, что театр — это живое искусство, которое говорит с каждым
          зрителем на его языке. Наша миссия — сохранять русскую театральную
          традицию и открывать классику новым поколениям через честные,
          современные постановки. В репертуаре — русская и мировая классика,
          современная драматургия и авторские проекты.
        </p>
      </section>

      <section id="gallery" className={`${styles.contentSection} ${styles.contentSectionWide}`}>
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
