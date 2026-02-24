"use client";

import Link from "next/link";
import OptimizedImage from "@/components/OptimizedImage";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay, Scrollbar } from "swiper/modules";
import styles from "./Hero.module.css";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/scrollbar";

export type HeroSlide = {
  id: string;
  title: string;
  subtitle?: string;
  image: string;
  cta?: string;
  /** Ссылка для кнопки (если не задана — /afisha) */
  ctaHref?: string;
};

export default function Hero({
  slides,
}: {
  slides: HeroSlide[];
}) {
  if (!slides?.length) return null;

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
        {slides.map((slide, index) => (
          <SwiperSlide
            key={slide.id}
            className={styles.slide}
            role="group"
            aria-label={`Слайд ${index + 1} из ${slides.length}: ${slide.title}`}
          >
            <div className={styles.imageWrap}>
              <OptimizedImage
                src={slide.image}
                alt={slide.title}
                fill
                className={styles.image}
                sizes="100vw"
                priority={index === 0}
                effect="blur"
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
                href={slide.ctaHref ?? "/afisha"}
                className={styles.cta}
                {...(slide.ctaHref?.startsWith("http") && {
                  target: "_blank",
                  rel: "noopener noreferrer",
                })}
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
