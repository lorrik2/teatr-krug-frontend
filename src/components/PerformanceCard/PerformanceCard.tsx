"use client";

import Link from "next/link";
import OptimizedImage from "@/components/OptimizedImage";
import { motion, type Variants } from "framer-motion";
import type { Performance } from "@/lib/types";
import { DEFAULT_TICKETS_URL } from "@/lib/site-config";
import { performanceShowsTicketsAndSchedule } from "@/lib/performance-tickets";
import { formatDisplayDate, toIsoDateTime } from "@/lib/date-utils";
import styles from "./PerformanceCard.module.css";

type CardVariant = "afisha" | "repertuar";

interface PerformanceCardProps {
  play: Performance;
  variant: CardVariant;
  /** Месяц в формате MM (для секции афиши), чтобы показывать даты именно этого месяца */
  monthKey?: string;
  /** Использовать motion.li для анимации (на главной) */
  animated?: boolean;
  /** Варианты анимации для stagger (передавать при animated) */
  variants?: Variants;
  /** На мобильном — растянутый вариант (шире, как ateatra) */
  compact?: boolean;
}

export default function PerformanceCard({
  play,
  variant,
  monthKey,
  animated,
  variants,
  compact,
}: PerformanceCardProps) {
  const Wrapper = animated ? motion.li : "li";
  const detailBase = variant === "afisha" ? "/afisha" : "/repertuar";
  const detailHref = `${detailBase}/${play.slug}`;
  const showTicket =
    variant === "afisha" || performanceShowsTicketsAndSchedule(play);
  const sortedSchedule = play.schedule?.length
    ? [...play.schedule].sort((a, b) => {
        const aTs = Date.parse(toIsoDateTime(a.date, a.time));
        const bTs = Date.parse(toIsoDateTime(b.date, b.time));
        if (Number.isNaN(aTs) && Number.isNaN(bTs)) return 0;
        if (Number.isNaN(aTs)) return 1;
        if (Number.isNaN(bTs)) return -1;
        return aTs - bTs;
      })
    : [];
  const getMonth = (dateStr: string) => {
    const iso = toIsoDateTime(dateStr, "00:00");
    if (!iso) return "";
    return iso.slice(5, 7);
  };
  const monthScoped = monthKey
    ? sortedSchedule.filter((s) => getMonth(s.date) === monthKey)
    : [];
  const activeSchedule = monthScoped.length ? monthScoped : sortedSchedule;
  const nearestShow = activeSchedule[0];
  const sameMonthShows = nearestShow
    ? activeSchedule.filter((s) => getMonth(s.date) === getMonth(nearestShow.date))
    : [];
  const datesLabel = sameMonthShows
    .map((s) => formatDisplayDate(s.date))
    .filter(Boolean)
    .join(", ");
  const showSingleTime = sameMonthShows.length === 1;
  const hasNearestShow = !!(play.inAfisha && nearestShow?.date && datesLabel);

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
            <OptimizedImage
              src={play.poster}
              alt={play.title}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className={styles.posterImg}
              style={{ objectFit: "cover" }}
              effect="blur"
            />
            <div className={styles.badges}>
              {play.isPremiere && <span className={styles.premiere}>Премьера</span>}
              <span className={styles.age}>{play.ageRating}</span>
            </div>
            <div className={styles.topLeft}>
              <span className={styles.dateTime}>
                {hasNearestShow ? (
                  <>
                    {datesLabel}
                    {showSingleTime && nearestShow.time && nearestShow.time !== "—" && (
                      <>
                        <br />
                        {nearestShow.time}
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
            <Link
              href={play.ticketsUrl ?? DEFAULT_TICKETS_URL}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.btnTicket}
            >
              Купить билет
            </Link>
          )}
        </div>
      </div>
    </Wrapper>
  );
}
