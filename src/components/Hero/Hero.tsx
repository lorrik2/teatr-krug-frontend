"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { heroSlides } from "@/lib/mock-data";
import styles from "./Hero.module.css";

export default function Hero() {
  const [index, setIndex] = useState(0);
  const slide = heroSlides[index];

  useEffect(() => {
    const t = setInterval(() => {
      setIndex((i) => (i + 1) % heroSlides.length);
    }, 5000);
    return () => clearInterval(t);
  }, []);

  return (
    <section className={styles.section} aria-label="Главный экран">
      <div className={styles.slider}>
        <AnimatePresence mode="wait">
          <motion.div
            key={slide.id}
            className={styles.slide}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className={styles.imageWrap}>
              <Image
                src={slide.image}
                alt=""
                fill
                className={styles.image}
                sizes="100vw"
                priority
              />
              <div className={styles.overlay} />
            </div>
            <div className={styles.content}>
              <motion.h1
                className={styles.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                {slide.title}
              </motion.h1>
              <motion.p
                className={styles.subtitle}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35 }}
              >
                {slide.subtitle}
              </motion.p>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <Link
                  href={index === 0 ? "/afisha" : "/afisha#tickets"}
                  className={styles.cta}
                >
                  {slide.cta}
                </Link>
              </motion.div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
      <div className={styles.dots}>
        {heroSlides.map((_, i) => (
          <button
            key={i}
            type="button"
            className={styles.dot}
            aria-label={`Слайд ${i + 1}`}
            aria-current={i === index}
            onClick={() => setIndex(i)}
          >
            <span className={i === index ? styles.dotActive : undefined} />
          </button>
        ))}
      </div>
    </section>
  );
}
