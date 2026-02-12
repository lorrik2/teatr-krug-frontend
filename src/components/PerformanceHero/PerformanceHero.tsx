"use client";

import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import useFancybox from "@/hooks/useFancybox";
import styles from "./PerformanceHero.module.css";

import "swiper/css";
import "swiper/css/pagination";

export interface PerformanceHeroProps {
  title: string;
  images: string[];
}

export default function PerformanceHero({
  title,
  images,
}: PerformanceHeroProps) {
  const [fancyboxRef] = useFancybox();
  const slides = images.length > 0 ? images : [""];
  const hasMultipleSlides = slides.length > 1;

  return (
    <section
      ref={fancyboxRef}
      className={styles.section}
      aria-label="Галерея спектакля"
      role="region"
    >
      <Swiper
        modules={[Autoplay, Pagination]}
        spaceBetween={0}
        slidesPerView={1}
        loop={hasMultipleSlides}
        autoplay={
          hasMultipleSlides
            ? { delay: 5000, disableOnInteraction: false }
            : false
        }
        pagination={{ clickable: true }}
        className={styles.slider}
        aria-label="Карусель фото спектакля"
      >
        {slides.map((src, index) => (
          <SwiperSlide
            key={index}
            className={styles.slide}
            aria-label={`Фото ${index + 1} из ${slides.length}`}
          >
            {src ? (
              <a
                href={src}
                data-fancybox="performance-gallery"
                data-caption={`${title} (${index + 1}/${slides.length})`}
                className={styles.slideBtn}
                aria-label={`Открыть галерею, фото ${index + 1}`}
              >
                <div className={styles.imageWrap}>
                  <Image
                    src={src}
                    alt={`${title} — фото ${index + 1}`}
                    fill
                    className={styles.image}
                    sizes="100vw"
                    priority={index === 0}
                  />
                </div>
              </a>
            ) : (
              <div className={styles.imageWrap}>
                <div className={styles.placeholder} aria-hidden />
              </div>
            )}
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
}
