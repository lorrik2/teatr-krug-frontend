"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import styles from "./About.module.css";

const gallery = [
  { src: "/fon/8.jpg", alt: "Фасад театра" },
  { src: "/fon/12.jpg", alt: "Зрительный зал" },
  { src: "/fon/13.jpg", alt: "Фойе" },
  { src: "/fon/14.jpg", alt: "Закулисье" },
];

export default function About() {
  return (
    <section className={styles.section} id="o-teatre" aria-labelledby="about-title">
      <div className={styles.container}>
        <motion.div
          className={styles.header}
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 id="about-title" className={styles.title}>
            О театре
          </h2>
          <p className={styles.subtitle}>
            История здания и труппы, миссия и атмосфера
          </p>
        </motion.div>

        <div className={styles.content}>
          <motion.div
            className={styles.text}
            initial={{ opacity: 0, x: -12 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <p className={styles.lead}>
              Камерный театр основан в 1995 году. Мы занимаем историческое здание в центре города — бывший особняк XIX века, переоборудованный под камерную сцену.
            </p>
            <p>
              Наша миссия — сохранять живую театральную традицию и открывать классику новым поколениям. Художественный руководитель — Андрей Волков, режиссёр и педагог, лауреат национальных премий.
            </p>
            <p>
              В репертуаре — русская и мировая классика, современная драматургия и экспериментальные постановки. Зрительный зал на 120 мест создаёт атмосферу камерности и доверия между сценой и залом.
            </p>
            <Link href="/o-teatre" className={styles.link}>
              Подробнее об истории и миссии →
            </Link>
          </motion.div>

          <div className={styles.videoWrap}>
            <div className={styles.videoPlaceholder}>
              <span className={styles.videoLabel}>Видео-визитка театра (2–3 мин)</span>
              <div className={styles.videoPlaceholderInner} />
            </div>
          </div>
        </div>

        <motion.div
          className={styles.gallery}
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h3 className={styles.galleryTitle}>Фотогалерея</h3>
          <ul className={styles.galleryGrid}>
            {gallery.map((img, i) => (
              <li key={i}>
<Image
                src={img.src}
                alt={img.alt}
                width={600}
                height={400}
                className={styles.galleryImg}
              />
              </li>
            ))}
          </ul>
        </motion.div>
      </div>
    </section>
  );
}
