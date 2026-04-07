"use client";

import Link from "next/link";
import OptimizedImage from "@/components/OptimizedImage";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";
import { motion } from "framer-motion";
import useFancybox from "@/hooks/useFancybox";
import styles from "./About.module.css";
import type { OTeatrePageData } from "@/lib/cms-data";

import "swiper/css";
import "swiper/css/pagination";

function textToParagraphs(text: string): string[] {
  return text.split(/\n\n+/).filter((p) => p.trim());
}

export default function About({ data }: { data?: OTeatrePageData | null }) {
  const [fancyboxRef] = useFancybox();

  if (!data?.showOnMainPage) return null;

  const title = data.mainPageTitle?.trim() || "О театре";
  const leadParagraphs = data.mainPageShowLead && data.lead
    ? textToParagraphs(data.lead)
    : [];
  const missionParagraphs = data.mainPageShowMission && data.missionText
    ? textToParagraphs(data.missionText)
    : [];
  const gallery = data.galleryImages?.length ? data.galleryImages : [];

  const allParagraphs = [...leadParagraphs, ...missionParagraphs];
  const hasContent = allParagraphs.length > 0 || gallery.length > 0;
  if (!hasContent) return null;

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
            {title}
          </h2>
        </motion.div>

        <div className={styles.content}>
          {allParagraphs.length > 0 && (
            <motion.div
              className={styles.text}
              initial={{ opacity: 0, x: -12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              {allParagraphs.map((p, i) => (
                <p key={i} className={i === 0 ? styles.lead : undefined}>
                  {p}
                </p>
              ))}
              <Link href="/o-teatre" className={styles.link}>
                Подробнее об истории и миссии →
              </Link>
            </motion.div>
          )}

          {gallery.length > 0 && (
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
                  <SwiperSlide key={i}>
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
          )}
        </div>
      </div>
    </section>
  );
}
