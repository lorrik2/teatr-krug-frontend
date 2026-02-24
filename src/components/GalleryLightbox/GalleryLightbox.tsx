"use client";

import OptimizedImage from "@/components/OptimizedImage";
import Link from "next/link";
import useFancybox from "@/hooks/useFancybox";
import styles from "./GalleryLightbox.module.css";

export interface GalleryImage {
  src: string;
  alt: string;
}

interface GalleryLightboxProps {
  images: GalleryImage[];
  /** Вариант: grid для страницы О театре, slider для блока About, row — один ряд с кнопкой «смотреть все» */
  variant?: "grid" | "slider" | "row";
  /** Ссылка «Смотреть все фото» — отображается как последняя карточка в variant="row" */
  moreLink?: { href: string; label: string };
  /** Показать только N фото, остальные — в lightbox по кнопке «Смотреть ещё» (для variant="grid") */
  limit?: number;
  /** Подпись кнопки «Смотреть ещё» */
  moreLabel?: string;
  /** Уникальный id галереи для data-fancybox (чтобы не смешивать с другими) */
  galleryId?: string;
}

export default function GalleryLightbox({
  images,
  variant = "grid",
  moreLink,
  limit,
  moreLabel = "Смотреть ещё",
  galleryId = "gallery",
}: GalleryLightboxProps) {
  const [fancyboxRef] = useFancybox();
  const showLimited =
    variant === "grid" && limit != null && images.length > limit;
  const visibleImages = showLimited ? images.slice(0, limit) : images;
  const hiddenImages = showLimited ? images.slice(limit) : [];

  if (variant === "row") {
    return (
      <div className={styles.galleryRow}>
        <ul ref={fancyboxRef} className={styles.galleryRowList}>
          {images.map((img, i) => (
            <li key={i} className={styles.galleryRowItem}>
              <a
                href={img.src}
                data-fancybox="gallery"
                data-caption={`${img.alt} (${i + 1}/${images.length})`}
                className={styles.thumbBtn}
                aria-label={`Открыть фото: ${img.alt}`}
              >
                <OptimizedImage
                  src={img.src}
                  alt={img.alt}
                  fill
                  className={styles.thumbImg}
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                  effect="blur"
                />
              </a>
            </li>
          ))}
        </ul>
        {moreLink && (
          <Link href={moreLink.href} className={styles.moreCard}>
            <span className={styles.moreCardText}>{moreLink.label}</span>
          </Link>
        )}
      </div>
    );
  }

  return (
    <div ref={fancyboxRef} className={variant === "grid" ? styles.galleryGridWrap : undefined}>
      <ul
        className={variant === "grid" ? styles.galleryGrid : styles.galleryList}
      >
        {visibleImages.map((img, i) => (
          <li key={i}>
            <a
              href={img.src}
              data-fancybox={galleryId}
              data-caption={`${img.alt} (${i + 1}/${images.length})`}
              className={styles.thumbBtn}
              aria-label={`Открыть фото: ${img.alt}`}
            >
              <OptimizedImage
                src={img.src}
                alt={img.alt}
                fill
                className={styles.thumbImg}
                sizes="(max-width: 380px) 100vw, (max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                effect="blur"
              />
            </a>
          </li>
        ))}
      </ul>
      {hiddenImages.map((img, i) => (
        <a
          key={`hidden-${i}`}
          href={img.src}
          data-fancybox={galleryId}
          data-caption={`${img.alt} (${visibleImages.length + i + 1}/${images.length})`}
          className={styles.hiddenTrigger}
          aria-hidden
        >
          {img.alt}
        </a>
      ))}
      {showLimited && (
        <a
          href={images[0].src}
          data-fancybox={galleryId}
          data-caption={`${images[0].alt} (1/${images.length})`}
          className={styles.moreCard}
          aria-label={`Открыть все ${images.length} фото`}
        >
          <span className={styles.moreCardText}>
            {moreLabel} ({images.length})
          </span>
        </a>
      )}
    </div>
  );
}
