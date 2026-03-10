"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";
import { motion } from "framer-motion";
import OptimizedImage from "@/components/OptimizedImage";
import useFancybox from "@/hooks/useFancybox";
import styles from "./PerformanceFeaturedBlock.module.css";

import "swiper/css";
import "swiper/css/pagination";

export type PerformanceFeaturedBlockProps = {
  /** Одна главная фотография (опционально — добавляется в админке) */
  mainImage?: string | null;
  /** Текст (описание, цитата) */
  text?: string;
  /** Серия фото для карусели (альбомные) */
  carouselImages?: string[];
  performanceTitle: string;
};

export default function PerformanceFeaturedBlock({
  mainImage,
  text,
  carouselImages = [],
  performanceTitle,
}: PerformanceFeaturedBlockProps) {
  const hasPhoto = !!mainImage?.trim();
  const hasText = !!text?.trim();
  const hasCarousel = carouselImages.length > 0;

  const galleryId = "featured-block-photos";
  const allImages = [
    ...(hasPhoto ? [mainImage!] : []),
    ...(hasCarousel ? carouselImages : []),
  ];
  const [fancyboxRef] = useFancybox();

  return (
    <section
      className={styles.section}
      aria-labelledby="featured-block-title"
    >
      <div className={styles.container}>
        <h2 id="featured-block-title" className={styles.srOnly}>
          О спектакле &quot;{performanceTitle}&quot;
        </h2>

        <div ref={fancyboxRef} className={styles.grid}>
          {/* 1. Одна фотография */}
          {hasPhoto && (
            <motion.div
              className={styles.photoSection}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <a
                href={mainImage!}
                data-fancybox={galleryId}
                data-caption={`${performanceTitle} — фото (1/${allImages.length})`}
                className={styles.photoLink}
                aria-label="Открыть фото"
              >
                <div className={styles.photoWrap}>
                  <OptimizedImage
                    src={mainImage!}
                    alt={`${performanceTitle} — фото`}
                    fill
                    className={styles.photoImg}
                    sizes="(max-width: 767px) 100vw, (max-width: 1023px) 50vw, 33vw"
                    effect="blur"
                  />
                </div>
              </a>
            </motion.div>
          )}

          {/* 2. Текст */}
          {hasText && (
            <motion.div
              className={styles.textSection}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <div className={styles.textContent}>
                {(text ?? "")
                  .split(/\n\n+/)
                  .filter((p) => p.trim())
                  .map((p, i) => (
                    <p key={i}>{p.trim()}</p>
                  ))}
              </div>
            </motion.div>
          )}

          {/* 3. Карусель фото */}
          {hasCarousel && (
            <motion.div
              className={styles.carouselSection}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <Swiper
                modules={[Pagination, Autoplay]}
                spaceBetween={12}
                slidesPerView={1}
                breakpoints={{
                  480: { slidesPerView: 2, spaceBetween: 16 },
                  768: { slidesPerView: 2.5, spaceBetween: 20 },
                  1024: { slidesPerView: 3, spaceBetween: 24 },
                }}
                loop={carouselImages.length > 1}
                autoplay={
                  carouselImages.length > 1
                    ? { delay: 4500, disableOnInteraction: false }
                    : false
                }
                pagination={{ clickable: true }}
                className={styles.carousel}
              >
                {carouselImages.map((src, i) => {
                  const idx = allImages.indexOf(src) + 1;
                  const alt = `${performanceTitle} — фото ${idx}`;
                  return (
                    <SwiperSlide key={`${src}-${i}`} className={styles.carouselSlide}>
                      <a
                        href={src}
                        data-fancybox={galleryId}
                        data-caption={`${alt} (${idx}/${allImages.length})`}
                        className={styles.carouselSlideLink}
                        aria-label={`Открыть фото ${idx}`}
                      >
                        <div className={styles.carouselSlideInner}>
                          <OptimizedImage
                            src={src}
                            alt={alt}
                            fill
                            className={styles.carouselImg}
                            sizes="(max-width: 479px) 95vw, (max-width: 767px) 50vw, (max-width: 1023px) 45vw, 400px"
                            effect="blur"
                          />
                        </div>
                      </a>
                    </SwiperSlide>
                  );
                })}
              </Swiper>
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
}
