"use client";

import { motion } from "framer-motion";
import type { SVGProps } from "react";

function VkIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      width="20"
      height="20"
      fill="currentColor"
      aria-hidden
      {...props}
    >
      <path d="M15.684 0H8.316C1.592 0 0 1.592 0 8.316v7.368C0 22.408 1.592 24 8.316 24h7.368C22.408 24 24 22.408 24 15.684V8.316C24 1.592 22.408 0 15.684 0zm3.692 17.123h-1.744c-.66 0-.862-.525-2.049-1.727-1.033-1-1.49-1.135-1.744-1.135-.356 0-.458.102-.458.593v1.575c0 .424-.135.678-1.253.678-1.846 0-3.896-1.118-5.335-3.202C4.624 10.857 4 8.57 4 8.096c0-.254.102-.491.593-.491h1.744c.44 0 .61.203.78.678.863 2.49 2.303 4.675 2.896 4.675.22 0 .322-.102.322-.66V9.721c-.068-1.186-.695-1.287-.695-1.711 0-.203.17-.407.44-.407h2.744c.373 0 .508.203.508.643v3.473c0 .372.17.508.271.508.22 0 .407-.136.814-.542 1.254-1.406 2.151-3.574 2.151-3.574.119-.254.322-.491.763-.491h1.744c.525 0 .644.27.525.643-.22 1.017-2.354 4.031-2.354 4.031-.186.305-.254.44 0 .78.186.254.796.779 1.203 1.253.745.847 1.32 1.558 1.473 2.049.17.49-.085.744-.576.744z" />
    </svg>
  );
}
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import { theaterReviews } from "@/lib/mock-data";
import type { Review } from "@/lib/mock-data";
import styles from "./Reviews.module.css";

import "swiper/css";
import "swiper/css/pagination";

type ReviewsProps = {
  reviews?: Review[];
  title?: string;
  subtitle?: string;
  /** dark (по умолчанию) — тёмный фон для главной; light — светлый для страницы спектакля */
  variant?: "dark" | "light";
  id?: string;
};

export default function Reviews({
  reviews = theaterReviews,
  title = "Отзывы о театре",
  subtitle = "Что говорят наши зрители",
  variant = "dark",
  id = "otzyvy",
}: ReviewsProps) {
  const sectionClass =
    variant === "light" ? styles.sectionLight : styles.section;
  const titleClass =
    variant === "light" ? styles.titleLight : styles.title;
  const subtitleClass =
    variant === "light" ? styles.subtitleLight : styles.subtitle;
  const quoteClass =
    variant === "light" ? styles.quoteLight : styles.quote;
  const quoteMarkClass =
    variant === "light" ? styles.quoteMarkLight : styles.quoteMark;
  const quoteTextClass =
    variant === "light" ? styles.quoteTextLight : styles.quoteText;
  const attributionClass =
    variant === "light" ? styles.attributionLight : styles.attribution;

  return (
    <section
      className={sectionClass}
      id={id}
      aria-labelledby="reviews-title"
    >
      <div className={styles.container}>
        <motion.div
          className={styles.header}
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 id="reviews-title" className={titleClass}>
            {title}
          </h2>
          {subtitle && (
            <p className={subtitleClass}>{subtitle}</p>
          )}
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
            loop={reviews.length > 1}
            autoplay={
              reviews.length > 1
                ? { delay: 6000, disableOnInteraction: false }
                : false
            }
            pagination={{ clickable: true }}
            breakpoints={{
              768: { slidesPerView: 2, spaceBetween: 24 },
              1024: { slidesPerView: 2, spaceBetween: 48 },
            }}
            className={styles.slider}
          >
            {reviews.map((review) => (
              <SwiperSlide key={review.id}>
                <blockquote className={quoteClass}>
                  <span className={quoteMarkClass}>&ldquo;</span>
                  <p className={quoteTextClass}>{review.quote}</p>
                  <footer className={attributionClass}>
                    <span className={styles.attributionInner}>
                      — {review.author}
                      {review.vkUrl && (
                        <a
                          href={review.vkUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={styles.vkLink}
                          aria-label="Отзыв ВКонтакте"
                          title="Открыть отзыв ВКонтакте"
                        >
                          <VkIcon className={styles.vkIcon} />
                        </a>
                      )}
                    </span>
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
