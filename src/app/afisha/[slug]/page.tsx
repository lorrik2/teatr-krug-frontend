import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { performances, actors } from "@/lib/mock-data";
import PerformanceHero from "@/components/PerformanceHero";
import PerformanceCast from "@/components/PerformanceCast";
import PerformanceGallery from "@/components/PerformanceGallery";
import Reviews from "@/components/Reviews";
import TicketsBlock from "@/components/TicketsBlock";
import styles from "../../styles/PerformancePage.module.css";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return performances.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const play = performances.find((p) => p.slug === slug);
  if (!play) return { title: "Спектакль" };
  return {
    title: `${play.title} — Драматический театр «Круг»`,
    description: play.description,
    openGraph: { title: play.title, description: play.description },
  };
}

export default async function PerformancePage({ params }: Props) {
  const { slug } = await params;
  const play = performances.find((p) => p.slug === slug);
  if (!play) notFound();

  const galleryImages = play.gallery ?? [play.poster];
  const hasCreators =
    play.author ||
    play.director ||
    play.designer ||
    play.lightingDesigner ||
    play.soundDesigner ||
    play.lightSoundOperator;
  const hasCast = play.cast && play.cast.length > 0;
  const hasReviews = play.reviews && play.reviews.length > 0;
  return (
    <>
      <PerformanceHero title={play.title} images={galleryImages} />
      <div className={styles.wrap}>
        <nav className={styles.breadcrumbs} aria-label="Хлебные крошки">
          <Link href="/">Главная</Link>
          <span className={styles.breadcrumbsSep}>→</span>
          <Link href="/afisha">Афиша</Link>
        </nav>
        <section className={styles.aboutBlock}>
          <h1 className={styles.aboutTitle}>{play.title}</h1>
          <p className={styles.aboutDesc}>{play.description}</p>
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
              {play.director && (() => {
                const directorActor = actors.find(
                  (a) => a.name === play.director
                );
                return (
                  <div className={styles.creatorRow}>
                    <span className={styles.creatorLabel}>Режиссёр</span>
                    {directorActor ? (
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
                  <span className={styles.creatorName}>{play.soundDesigner}</span>
                </div>
              )}
              {play.lightSoundOperator && (
                <div className={styles.creatorRow}>
                  <span className={styles.creatorLabel}>Свето-звуко оператор</span>
                  <span className={styles.creatorName}>
                    {play.lightSoundOperator}
                  </span>
                </div>
              )}
            </div>
          )}
          {play.directorQuote && play.director && (() => {
            const directorActor = actors.find(
              (a) => a.name === play.director
            );
            return (
            <div className={styles.directorQuoteBlock}>
              <p className={styles.directorQuoteLabel}>
                {directorActor ? (
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

          {play.inAfisha &&
            (() => {
              const schedule =
                play.schedule?.length
                  ? play.schedule
                  : play.date !== "—"
                    ? [{ date: play.date, time: play.time }]
                    : [];
              return schedule.length > 0 ? (
                <div
                  className={styles.scheduleBlock}
                  aria-label="Ближайшие показы"
                >
                  {schedule.map((item, i) => (
                    <div key={i} className={styles.scheduleRow}>
                      <span className={styles.scheduleDateTime}>
                        {item.date}
                        <span className={styles.scheduleSep}>|</span>
                        {item.time}
                      </span>
                      <Link
                        href="#tickets"
                        className={styles.scheduleCta}
                      >
                        Купить билет
                      </Link>
                    </div>
                  ))}
                </div>
              ) : null;
            })()}
        </section>

        {hasCast && (
          <section className={styles.section} aria-labelledby="cast-title">
            <h2 id="cast-title" className={styles.sectionTitle}>
              В спектакле участвуют
            </h2>
            <PerformanceCast cast={play.cast!} />
          </section>
        )}

        {hasReviews && (
          <div className={styles.reviewsWrapper}>
            <Reviews
              reviews={play.reviews!}
              title="Отзывы зрителей"
              subtitle="Что говорят о спектакле"
              variant="light"
              id="reviews"
            />
          </div>
        )}

        <section className={styles.section} aria-labelledby="teaser-title">
          <h2 id="teaser-title" className={styles.sectionTitle}>
            Тизер
          </h2>
          <PerformanceGallery images={[]} teaserUrl={play.teaserUrl} />
        </section>

        <div className={styles.ticketsWrapper}>
          <TicketsBlock />
        </div>
      </div>
    </>
  );
}
