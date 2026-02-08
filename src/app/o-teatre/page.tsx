import type { Metadata } from "next";
import Image from "next/image";
import styles from "../styles/Page.module.css";

export const metadata: Metadata = {
  title: "О театре — Драматический театр «Круг»",
  description:
    "История здания и труппы, миссия, художественный руководитель, фотогалерея и видео-визитка.",
};

const gallery = [
  { src: "/fon/8.jpg", alt: "Фасад театра" },
  { src: "/fon/12.jpg", alt: "Зрительный зал" },
  { src: "/fon/13.jpg", alt: "Фойе" },
  { src: "/fon/22.jpg", alt: "Гримёрки" },
  { src: "/fon/23.jpg", alt: "Закулисье" },
];

export default function AboutPage() {
  return (
    <div className={styles.wrap}>
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

      <section className={styles.contentSection}>
        <h2 className={styles.h2}>Фотогалерея</h2>
        <ul className={styles.gallery}>
          {gallery.map((img, i) => (
            <li key={i}>
              <Image
                src={img.src}
                alt={img.alt}
                width={800}
                height={500}
                className={styles.galleryImg}
              />
            </li>
          ))}
        </ul>
      </section>

      <section className={styles.contentSection}>
        <h2 className={styles.h2}>Видео-визитка</h2>
        <div className={styles.videoPlaceholder}>
          <p>Здесь будет встроено видео 2–3 минуты о театре</p>
        </div>
      </section>
    </div>
  );
}
