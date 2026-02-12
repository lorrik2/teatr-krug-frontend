"use client";

import { motion } from "framer-motion";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import { reviews } from "@/lib/mock-data";
import styles from "./Reviews.module.css";

import "swiper/css";
import "swiper/css/pagination";

export default function Reviews() {
  return (
    <section
      className={styles.section}
      id="otzyvy"
      aria-labelledby="reviews-title"
    >
      <div className={styles.container}>
        <motion.div
          className={styles.header}
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 id="reviews-title" className={styles.title}>
            Отзывы о спектаклях
          </h2>
          <p className={styles.subtitle}>
            Что говорят наши зрители
          </p>
        </motion.div>

        <motion.div
          className={styles.sliderWrap}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <Swiper
            modules={[Autoplay, Pagination]}
            spaceBetween={16}
            slidesPerView={1}
            loop
            autoplay={{
              delay: 6000,
              disableOnInteraction: false,
            }}
            pagination={{ clickable: true }}
            breakpoints={{
              768: { slidesPerView: 2, spaceBetween: 24 },
              1024: { slidesPerView: 2, spaceBetween: 48 },
            }}
            className={styles.slider}
          >
            {reviews.map((review) => (
              <SwiperSlide key={review.id}>
                <blockquote className={styles.quote}>
                  <span className={styles.quoteMark}>&ldquo;</span>
                  <p className={styles.quoteText}>{review.quote}</p>
                  <footer className={styles.attribution}>
                    — из отзыва зрительницы {review.author}
                  </footer>
                </blockquote>
              </SwiperSlide>
            ))}
          </Swiper>
        </motion.div>
      </div>
    </section>
  );
}
