import Link from "next/link";
import type { Performance, Actor } from "@/lib/types";
import {
  isDirectorOrArtisticDirector,
  getMergedCast,
} from "@/lib/actor-utils";
import { DEFAULT_TICKETS_URL } from "@/lib/site-config";
import { performanceShowsTicketsAndSchedule } from "@/lib/performance-tickets";
import { formatDisplayDate } from "@/lib/date-utils";
import PerformanceHero from "@/components/PerformanceHero";
import PerformanceEventJsonLd from "@/components/seo/PerformanceEventJsonLd";
import PerformanceReviewsJsonLd from "@/components/seo/PerformanceReviewsJsonLd";
import BreadcrumbJsonLd from "@/components/seo/BreadcrumbJsonLd";
import PerformanceCast from "@/components/PerformanceCast";
import PerformanceGallery from "@/components/PerformanceGallery";
import GalleryLightbox from "@/components/GalleryLightbox";
import PerformanceFeaturedBlock from "@/components/PerformanceFeaturedBlock";
import Reviews from "@/components/Reviews";
import styles from "@/app/styles/PerformancePage.module.css";

export type PerformancePageConfig = {
  basePath: "afisha" | "repertuar";
  breadcrumbLabel: string;
  breadcrumbHref: string;
  /** true: галерея до актёров (афиша), false: галерея после (репертуар) */
  galleryBeforeCast: boolean;
};

type Props = {
  play: Performance;
  actors: Actor[];
  performances: Performance[];
  config: PerformancePageConfig;
};

export default function PerformancePageContent({
  play,
  actors,
  performances,
  config,
}: Props) {
  const {
    basePath,
    breadcrumbLabel,
    breadcrumbHref,
  } = config;

  const heroImages = (
    play.heroSlider?.length
      ? play.heroSlider
      : play.gallery?.length
        ? play.gallery.slice(0, 5)
        : play.poster
          ? [play.poster]
          : []
  ).filter((s): s is string => !!s);

  const galleryImages = (play.gallery ?? (play.poster ? [play.poster] : []))
    .filter((s): s is string => !!s);

  const hasTeaserOrGallery = !!play.teaserUrl || galleryImages.length > 0;

  const featuredMainImage = play.featuredBlockImage;
  const featuredText = play.featuredBlockText?.trim();
  const featuredCarousel = play.featuredBlockGallery?.filter((s): s is string => !!s) ?? [];
  const hasFeaturedBlock =
    !!featuredMainImage || !!featuredText || featuredCarousel.length > 0;

  const hasCreators =
    play.author ||
    play.director ||
    play.designer ||
    play.lightingDesigner ||
    play.soundDesigner ||
    play.lightSoundOperator;

  const mergedCast = getMergedCast(play, actors);
  const hasCast = mergedCast.length > 0;
  const hasReviews = play.reviews && play.reviews.length > 0;
  const hasAwards =
    (play.awards?.length ?? 0) > 0 || (play.festivals?.length ?? 0) > 0;

  const schedule =
    play.schedule?.length
      ? play.schedule.filter((s) => s?.date || s?.time)
      : play.date && play.date !== "—" && (play.date || play.time)
        ? [{ date: play.date, time: play.time }]
        : [];

  const showTicketUi = performanceShowsTicketsAndSchedule(play);
  const showScheduleBlock = showTicketUi && schedule.length > 0;

  const scheduleBlock = showScheduleBlock ? (
      <div
        className={styles.scheduleBlock}
        aria-label="Ближайшие показы"
      >
        {schedule.map((item, i) => (
          <div key={i} className={styles.scheduleRow}>
            <span className={styles.scheduleDateTime}>
              {formatDisplayDate(item.date)}
              <span className={styles.scheduleSep}>|</span>
              {item.time}
            </span>
            <Link
              href={item.ticketsUrl ?? play.ticketsUrl ?? DEFAULT_TICKETS_URL}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.scheduleCta}
            >
              Купить билет
            </Link>
          </div>
        ))}
      </div>
    ) : null;

  const gallerySectionClass =
    play.teaserUrl
      ? styles.section
      : hasReviews
        ? styles.sectionFirstAfterDarkBleed
        : styles.sectionFlowContinue;

  const gallerySection =
    galleryImages.length > 0 ? (
      <section
        className={gallerySectionClass}
        aria-labelledby="gallery-title"
      >
        <h2 id="gallery-title" className={styles.sectionTitle}>
          Фотографии
        </h2>
        <GalleryLightbox
          images={galleryImages.map((src, i) => ({
            src,
            alt: `${play.title} — фото ${i + 1}`,
          }))}
          variant="grid"
          limit={4}
          moreLabel="Смотреть ещё"
          galleryId="performance-photos"
        />
      </section>
    ) : null;

  const castSection =
    hasCast ? (
      <section
        className={
          hasAwards
            ? styles.section
            : hasFeaturedBlock
              ? styles.sectionAfterFeaturedContinue
              : styles.sectionFlowContinue
        }
        aria-labelledby="cast-title"
      >
        <h2 id="cast-title" className={styles.sectionTitle}>
          В спектакле участвуют
        </h2>
        <PerformanceCast
          cast={mergedCast}
          actors={actors}
          performances={performances}
        />
      </section>
    ) : null;

  return (
    <>
      <PerformanceEventJsonLd
        play={play}
        basePath={basePath}
        ticketsUrl={
          showTicketUi ? (play.ticketsUrl ?? DEFAULT_TICKETS_URL) : undefined
        }
      />
      {hasReviews && (
        <PerformanceReviewsJsonLd play={play} basePath={basePath} />
      )}
      <BreadcrumbJsonLd
        items={[
          { name: "Главная", href: "/" },
          { name: breadcrumbLabel, href: breadcrumbHref },
          { name: play.title },
        ]}
      />
      <PerformanceHero
        title={play.title}
        images={heroImages}
        ticketsUrl={
          showTicketUi ? (play.ticketsUrl ?? DEFAULT_TICKETS_URL) : undefined
        }
        ticketButtonLabel={play.ticketButtonLabel}
      />
      <div
        className={
          showScheduleBlock
            ? `${styles.wrap} ${styles.wrapTightAfterSchedule}`
            : styles.wrap
        }
      >
        <nav className={styles.breadcrumbs} aria-label="Хлебные крошки">
          <Link href="/">Главная</Link>
          <span className={styles.breadcrumbsSep}>→</span>
          <Link href={breadcrumbHref}>{breadcrumbLabel}</Link>
        </nav>
        <section className={styles.aboutBlock}>
          <h1 className={styles.aboutTitle}>{play.title}</h1>
          {(play.description || play.subtitle) && (
            <p className={styles.aboutDesc}>
              {play.description || play.subtitle || ""}
            </p>
          )}
          {(play.duration || play.intermissions != null) && (
            <div className={styles.infoBlock}>
              {play.duration && (
                <span className={styles.infoItem}>
                  <span className={styles.infoLabel}>Продолжительность</span>
                  <span className={styles.infoValue}>{play.duration}</span>
                </span>
              )}
              {play.intermissions != null && play.intermissions >= 0 && (
                <span className={styles.infoItem}>
                  <span className={styles.infoLabel}>Антракты</span>
                  <span className={styles.infoValue}>
                    {play.intermissions === 0
                      ? "без антракта"
                      : play.intermissions === 1
                        ? "1 антракт"
                        : play.intermissions >= 2 && play.intermissions <= 4
                          ? `${play.intermissions} антракта`
                          : `${play.intermissions} антрактов`}
                  </span>
                </span>
              )}
            </div>
          )}
          {hasCreators && (
            <div className={styles.creatorsBlock}>
              {play.author && (
                <div className={styles.creatorRow}>
                  <span className={styles.creatorLabel}>Автор</span>
                  <span className={styles.creatorName}>{play.author}</span>
                </div>
              )}
              {play.director &&
                (() => {
                  const directorActor = actors.find(
                    (a) => a.name === play.director,
                  );
                  return (
                    <div className={styles.creatorRow}>
                      <span className={styles.creatorLabel}>Режиссёр</span>
                      {directorActor && isDirectorOrArtisticDirector(directorActor) ? (
                        <Link
                          href={`/team/${directorActor.slug}`}
                          className={styles.creatorNameLink}
                        >
                          {play.director}
                        </Link>
                      ) : (
                        <span className={styles.creatorName}>
                          {play.director}
                        </span>
                      )}
                    </div>
                  );
                })()}
              {play.designer && (
                <div className={styles.creatorRow}>
                  <span className={styles.creatorLabel}>Художник</span>
                  <span className={styles.creatorName}>{play.designer}</span>
                </div>
              )}
              {play.lightingDesigner && (
                <div className={styles.creatorRow}>
                  <span className={styles.creatorLabel}>Художник по свету</span>
                  <span className={styles.creatorName}>
                    {play.lightingDesigner}
                  </span>
                </div>
              )}
              {play.soundDesigner && (
                <div className={styles.creatorRow}>
                  <span className={styles.creatorLabel}>Звукорежиссёр</span>
                  <span className={styles.creatorName}>
                    {play.soundDesigner}
                  </span>
                </div>
              )}
              {play.lightSoundOperator && (
                <div className={styles.creatorRow}>
                  <span className={styles.creatorLabel}>
                    Свето-звуко оператор
                  </span>
                  <span className={styles.creatorName}>
                    {play.lightSoundOperator}
                  </span>
                </div>
              )}
            </div>
          )}
          {play.directorQuote &&
            play.director &&
            (() => {
              const directorActor = actors.find(
                (a) => a.name === play.director,
              );
              return (
                <div className={styles.directorQuoteBlock}>
                  <p className={styles.directorQuoteLabel}>
                    {directorActor && isDirectorOrArtisticDirector(directorActor) ? (
                      <Link
                        href={`/team/${directorActor.slug}`}
                        className={styles.directorQuoteLabelLink}
                      >
                        {play.director}
                      </Link>
                    ) : (
                      play.director
                    )}
                    , режиссёр спектакля
                  </p>
                  <blockquote className={styles.directorQuoteText}>
                    {play.directorQuote}
                  </blockquote>
                </div>
              );
            })()}
          {scheduleBlock}
        </section>
      </div>

      {hasFeaturedBlock && (
        <PerformanceFeaturedBlock
          mainImage={featuredMainImage}
          text={featuredText || undefined}
          carouselImages={
            featuredCarousel.length > 0 ? featuredCarousel : undefined
          }
          performanceTitle={play.title}
        />
      )}

      <div
        className={
          hasFeaturedBlock
            ? `${styles.wrap} ${styles.wrapAfterFeatured}`
            : styles.wrap
        }
      >
        {hasAwards && (
          <section
            className={
              hasFeaturedBlock ? styles.sectionAfterFeatured : styles.sectionFlowContinue
            }
            aria-labelledby="awards-title"
          >
            <h2 id="awards-title" className={styles.sectionTitle}>
              Награды, дипломы и участие в фестивалях
            </h2>
            <ul className={styles.awardsList}>
              {play.awards?.map((award, i) => (
                <li key={`a-${i}`} className={styles.awardItem}>
                  <span className={styles.awardTitle}>{award.title}</span>
                  {award.year && (
                    <span className={styles.awardMeta}>{award.year}</span>
                  )}
                </li>
              ))}
              {play.festivals?.map((fest, i) => (
                <li key={`f-${i}`} className={styles.awardFestItem}>
                  <div className={styles.awardFestContent}>
                    <span className={styles.awardTitle}>{fest.title}</span>
                    <span className={styles.awardMeta}>
                      {[fest.year, fest.place].filter(Boolean).join(" · ")}
                    </span>
                  </div>
                  {fest.logo && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={fest.logo}
                      alt=""
                      className={styles.awardFestLogo}
                      width={56}
                      height={56}
                    />
                  )}
                </li>
              ))}
            </ul>
          </section>
        )}

        {castSection}
      </div>

      {hasReviews && (
        <div className={styles.reviewsWrapper}>
          <Reviews
            reviews={play.reviews!}
            title="Отзывы зрителей"
            subtitle="Что говорят о спектакле"
            variant="dark"
            compact
            id="reviews"
          />
        </div>
      )}

      <div
        className={
          hasTeaserOrGallery
            ? `${styles.wrap} ${styles.wrapBottomGallery}`
            : styles.wrap
        }
      >
        {play.teaserUrl && (
          <section
            className={
              hasReviews
                ? styles.sectionFirstAfterDarkBleed
                : styles.section
            }
            aria-labelledby="teaser-title"
          >
            <h2 id="teaser-title" className={styles.sectionTitle}>
              Тизер
            </h2>
            <PerformanceGallery images={[]} teaserUrl={play.teaserUrl} />
          </section>
        )}

        {gallerySection}
      </div>
    </>
  );
}
