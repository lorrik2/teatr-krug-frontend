"use client";

import { useRef } from "react";
import Link from "next/link";
import OptimizedImage from "@/components/OptimizedImage";
import { Swiper, SwiperSlide } from "swiper/react";
import type { Swiper as SwiperType } from "swiper";
import {
  Navigation,
  Autoplay,
  EffectFade,
  Parallax,
  Pagination,
} from "swiper/modules";
import { premieres, DEFAULT_TICKETS_URL } from "@/lib/mock-data";
import styles from "./Premiere.module.css";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/effect-fade";

export default function Premiere() {
  const swiperRef = useRef<SwiperType | null>(null);

  return (
    <section
      className={styles.section}
      aria-label="Премьеры сезона"
      style={{ background: "var(--color-graphite-950)" }}
    >
      {/* Статичный тёмный фон */}
      <div className={styles.bgLayer} aria-hidden />

      <div className={styles.container}>
        <div className={styles.headerRow}>
          <p className={styles.badge} >
            Премьеры сезона
          </p>
          <div className={styles.navButtons}>
            <button
              type="button"
              className={styles.navBtn}
              aria-label="Предыдущий слайд"
              onClick={() => swiperRef.current?.slidePrev()}
            >
              ‹
            </button>
            <button
              type="button"
              className={styles.navBtn}
              aria-label="Следующий слайд"
              onClick={() => swiperRef.current?.slideNext()}
            >
              ›
            </button>
          </div>
        </div>

        <Swiper
          modules={[Navigation, Autoplay, EffectFade, Parallax, Pagination]}
          effect="fade"
          fadeEffect={{ crossFade: true }}
          parallax={{ enabled: true }}
          spaceBetween={0}
          slidesPerView={1}
          loop
          autoplay={{
            delay: 5000,
            disableOnInteraction: false,
          }}
          onSwiper={(swiper) => { swiperRef.current = swiper; }}
          navigation={true}
          pagination={{ clickable: true }}
          className={styles.slider}
          aria-label="Слайдер премьер"
        >
          {premieres.map((prem, index) => (
            <SwiperSlide key={prem.id} className={styles.slide}>
              <div className={styles.premiereGrid}>
                <div
                  className={styles.posterBlock}
                  data-swiper-parallax="-15%"
                  data-swiper-parallax-opacity="0.9"
                >
                  <div className={styles.posterWrap}>
                    <OptimizedImage
                      src={prem.poster}
                      alt={prem.title}
                      width={800}
                      height={1000}
                      className={styles.poster}
                      priority={index === 0}
                      effect="blur"
                    />
                  </div>
                </div>
                <div
                  className={styles.content}
                  data-swiper-parallax="10%"
                  data-swiper-parallax-opacity="0.8"
                >
                  <p className={styles.badgeInContent}>
                    Премьеры сезона
                  </p>
                  <h2 className={styles.title}>{prem.title}</h2>
                  <p className={styles.dateTime}>
                    {prem.date} · {prem.time}
                  </p>
                  <p className={styles.desc}>{prem.description}</p>
                  <dl className={styles.metaList}>
                    <dt className={styles.dt}>Режиссёр-постановщик</dt>
                    <dd className={styles.dd}>{prem.director}</dd>
                    <dt className={styles.dt}>В ролях</dt>
                    <dd className={styles.dd}>{prem.cast.join(", ")}</dd>
                  </dl>
                  <div className={styles.actions}>
                    <Link
                      href={`/afisha/${prem.slug}`}
                      className={styles.btnDetail}
                    >
                      Подробнее
                    </Link>
                    <Link
                      href={DEFAULT_TICKETS_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.btnTicket}
                    >
                      Купить билет
                    </Link>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
}
