"use client";

import Link from "next/link";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay, Scrollbar } from "swiper/modules";
import { heroSlides } from "@/lib/mock-data";
import styles from "./Hero.module.css";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/scrollbar";

export default function Hero() {
  return (
    <section
      className={styles.section}
      aria-label="Главный слайдер"
      role="region"
    >
      <Swiper
        modules={[Navigation, Autoplay, Scrollbar]}
        spaceBetween={0}
        slidesPerView={1}
        loop
        autoplay={{
          delay: 5000,
          disableOnInteraction: false,
        }}
        navigation={true}
        scrollbar={{
          hide: false,
          draggable: true,
        }}
        className={styles.slider}
        aria-label="Слайдер афиши театра"
        role="group"
      >
        {heroSlides.map((slide, index) => (
          <SwiperSlide
            key={slide.id}
            className={styles.slide}
            role="group"
            aria-label={`Слайд ${index + 1} из ${heroSlides.length}: ${slide.title}`}
          >
            <div className={styles.imageWrap}>
              <Image
                src={slide.image}
                alt={slide.title}
                fill
                className={styles.image}
                sizes="100vw"
                priority={index === 0}
              />
              <div className={styles.overlay} aria-hidden />
            </div>
            <div
              className={styles.content}
              aria-live="polite"
              aria-atomic="true"
            >
              {index === 0 ? (
                <h1 className={styles.title}>{slide.title}</h1>
              ) : (
                <h2 className={styles.title}>{slide.title}</h2>
              )}
              <p className={styles.subtitle}>{slide.subtitle}</p>
              <Link
                href={index === 0 ? "/afisha" : "/afisha#tickets"}
                className={styles.cta}
              >
                {slide.cta}
              </Link>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
}
