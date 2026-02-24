"use client";

import Link from "next/link";
import OptimizedImage from "@/components/OptimizedImage";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";
import { motion } from "framer-motion";
import useFancybox from "@/hooks/useFancybox";
import styles from "./About.module.css";

import "swiper/css";
import "swiper/css/pagination";

const gallery = [
  { src: "/fon/8.jpg", alt: "Фасад театра" },
  { src: "/fon/12.jpg", alt: "Зрительный зал" },
  { src: "/fon/13.jpg", alt: "Фойе" },
  { src: "/fon/14.jpg", alt: "Закулисье" },
];

export default function About() {
  const [fancyboxRef] = useFancybox();

  return (
    <section
      className={styles.section}
      id="o-teatre"
      aria-labelledby="about-title"
    >
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
              Драматический театр «Круг» основан в 2010 году. Мы занимаем
              историческое здание в центре города — бывший особняк XIX века,
              переоборудованный под камерную сцену.
            </p>
            <p>
              Наша миссия — сохранять живую театральную традицию и открывать
              классику новым поколениям. Художественный руководитель — Андрей
              Волков, режиссёр и педагог, лауреат национальных премий.
            </p>
            <p>
              В репертуаре — русская и мировая классика, современная драматургия
              и экспериментальные постановки. Зрительный зал на 120 мест создаёт
              атмосферу камерности и доверия между сценой и залом.
            </p>
            <Link href="/o-teatre" className={styles.link}>
              Подробнее об истории и миссии →
            </Link>
          </motion.div>

          <div ref={fancyboxRef} className={styles.sliderWrap}>
            <Swiper
              modules={[Pagination, Autoplay]}
              spaceBetween={0}
              slidesPerView={1}
              loop
              autoplay={{
                delay: 4000,
                disableOnInteraction: false,
              }}
              pagination={{ clickable: true }}
              className={styles.slider}
            >
              {gallery.map((img, i) => (
                <SwiperSlide key={i} className={styles.slide}>
                  <a
                    href={img.src}
                    data-fancybox="about-gallery"
                    data-caption={`${img.alt} (${i + 1}/${gallery.length})`}
                    className={styles.slideBtn}
                    aria-label={`Открыть фото: ${img.alt}`}
                  >
                    <div className={styles.slideInner}>
                      <OptimizedImage
                        src={img.src}
                        alt={img.alt}
                        fill
                        className={styles.slideImg}
                        sizes="(max-width: 768px) 100vw, 50vw"
                        effect="blur"
                      />
                    </div>
                  </a>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </div>
      </div>
    </section>
  );
}
