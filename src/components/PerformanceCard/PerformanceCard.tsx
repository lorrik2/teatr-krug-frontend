"use client";

import Link from "next/link";
import Image from "next/image";
import { motion, type Variants } from "framer-motion";
import type { Performance } from "@/lib/mock-data";
import styles from "./PerformanceCard.module.css";

type CardVariant = "afisha" | "repertuar";

interface PerformanceCardProps {
  play: Performance;
  variant: CardVariant;
  /** Использовать motion.li для анимации (на главной) */
  animated?: boolean;
  /** Варианты анимации для stagger (передавать при animated) */
  variants?: Variants;
  /** На мобильном — растянутый вариант (шире, как ateatra) */
  compact?: boolean;
}

export default function PerformanceCard({ play, variant, animated, variants, compact }: PerformanceCardProps) {
  const Wrapper = animated ? motion.li : "li";
  const detailBase = variant === "afisha" ? "/afisha" : "/repertuar";
  const detailHref = `${detailBase}/${play.slug}`;
  const showTicket = variant === "afisha" || play.inAfisha;

  return (
    <Wrapper
      className={styles.card}
      {...(variants && { variants })}
    >
      <div className={styles.cardInner}>
        <Link
          href={detailHref}
          className={`${styles.cardClickArea} ${compact ? styles.cardClickAreaWide : ""}`}
        >
          <div className={styles.posterBg}>
            <Image
              src={play.poster}
              alt={play.title}
              width={400}
              height={560}
              className={styles.posterImg}
            />
            <div className={styles.overlay} />
            <span className={styles.age}>{play.ageRating}</span>
            <div className={styles.topLeft}>
              <span className={styles.dateTime}>
                {play.date !== "—" ? (
                  <>
                    {play.date}
                    {play.time !== "—" && (
                      <>
                        <br />
                        {play.time}
                      </>
                    )}
                  </>
                ) : (
                  "В репертуаре"
                )}
              </span>
            </div>
          </div>
        </Link>
        <div className={styles.content}>
          <Link href={detailHref} className={styles.contentLink}>
            <h3 className={styles.cardTitle}>{play.title}</h3>
            <p className={styles.genre}>{play.genre}</p>
            <span className={styles.btnDetail}>Подробнее</span>
          </Link>
          {showTicket && (
            <Link href="/afisha#tickets" className={styles.btnTicket}>
              Купить билет
            </Link>
          )}
        </div>
      </div>
    </Wrapper>
  );
}
