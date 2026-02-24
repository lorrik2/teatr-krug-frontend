"use client";

import OptimizedImage from "@/components/OptimizedImage";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import styles from "./ImageSlider.module.css";

import "swiper/css";
import "swiper/css/navigation";

export interface ImageSlide {
  src: string;
  alt: string;
}

interface ImageSliderProps {
  images: ImageSlide[];
}

export default function ImageSlider({ images }: ImageSliderProps) {
  if (!images?.length) return null;

  return (
    <section
      className={styles.section}
      aria-label="Слайдер изображений"
      role="region"
    >
      <Swiper
        modules={[Navigation, Autoplay]}
        spaceBetween={0}
        slidesPerView={1}
        loop
        autoplay={{
          delay: 5000,
          disableOnInteraction: false,
        }}
        navigation
        className={styles.slider}
      >
        {images.map((img, i) => (
          <SwiperSlide key={i} className={styles.slide}>
            <div className={styles.imageWrap}>
              <OptimizedImage
                src={img.src}
                alt={img.alt}
                fill
                className={styles.image}
                sizes="100vw"
                priority={i === 0}
                effect="blur"
              />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
}
