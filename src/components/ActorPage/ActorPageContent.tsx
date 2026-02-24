"use client";

import OptimizedImage from "@/components/OptimizedImage";
import Link from "next/link";
import useFancybox from "@/hooks/useFancybox";
import type { Actor } from "@/lib/mock-data";
import styles from "./ActorPage.module.css";

interface ActorPageContentProps {
  actor: Actor;
}

export default function ActorPageContent({ actor }: ActorPageContentProps) {
  const [fancyboxRef] = useFancybox();
  const galleryImages = actor.gallery ?? [actor.photo];

  return (
    <div className={styles.wrap}>
      <nav className={styles.breadcrumbs} aria-label="Хлебные крошки">
        <Link href="/">Главная</Link>
        <span className={styles.breadcrumbsSep}>→</span>
        <Link href="/team">Команда</Link>
        <span className={styles.breadcrumbsSep}>→</span>
        <span className={styles.breadcrumbsCurrent}>{actor.name}</span>
      </nav>

      <article className={styles.article}>
        <div className={styles.layout}>
          <div ref={fancyboxRef} className={styles.photoColumn}>
            <a
              href={galleryImages[0]}
              data-fancybox="actor-gallery"
              data-caption={`${actor.name} (1/${galleryImages.length})`}
              className={styles.photoLink}
              aria-label={`Открыть фото ${actor.name}`}
            >
              <div className={styles.photoWrap}>
                <OptimizedImage
                  src={actor.photo}
                  alt={actor.name}
                  fill
                  className={styles.photo}
                  sizes="(max-width: 768px) 100vw, 50vw"
                  priority
                  effect="blur"
                />
              </div>
            </a>
            {galleryImages.length > 1 && (
              <ul className={styles.galleryGrid} aria-label="Галерея фото">
                {galleryImages.slice(1).map((src, i) => (
                  <li key={i}>
                    <a
                      href={src}
                      data-fancybox="actor-gallery"
                      data-caption={`${actor.name} (${i + 2}/${galleryImages.length})`}
                      className={styles.galleryThumb}
                      aria-label={`Фото ${i + 2}`}
                    >
                      <OptimizedImage
                        src={src}
                        alt={`${actor.name} — фото ${i + 2}`}
                        width={160}
                        height={120}
                        className={styles.galleryImg}
                        effect="blur"
                      />
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className={styles.infoColumn}>
            <h1 className={styles.name}>{actor.name}</h1>
            {actor.rank && <p className={styles.rank}>{actor.rank}</p>}
            <p className={styles.role}>{actor.role}</p>
            <div className={styles.bio}>
              {actor.bio
                .split(/\n\n+/)
                .filter(Boolean)
                .map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
            </div>
            <section className={styles.rolesSection}>
              <h2 className={styles.rolesTitle}>Роли в театре</h2>
              <ul className={styles.rolesList}>
                {actor.roles.map((r, i) => (
                  <li key={i}>{r}</li>
                ))}
              </ul>
            </section>
            {actor.theaterPage && (
              <div className="mt-8 pt-8 border-t border-graphite-200">
                <Link
                  href={actor.theaterPage}
                  className="inline-flex items-center font-medium text-graphite-950 no-underline hover:underline"
                >
                  Театр ТЕОС →
                </Link>
              </div>
            )}
          </div>
        </div>
      </article>
    </div>
  );
}
