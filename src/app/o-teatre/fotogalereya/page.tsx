import type { Metadata } from "next";
import Link from "next/link";
import GalleryLightbox from "@/components/GalleryLightbox";
import {
  getTheaterGalleryImages,
  GALLERY_PAGE_SIZE,
} from "@/lib/cms-data";
import { canonicalUrl, OG_LOGO } from "@/lib/site-config";
import styles from "../../styles/Page.module.css";
import fotogalereyaStyles from "./fotogalereya.module.css";

export async function generateMetadata(): Promise<Metadata> {
  const images = await getTheaterGalleryImages().catch(() => []);
  const ogImage = images[0]?.src
    ? { url: images[0].src, width: 1200, height: 630, alt: images[0].alt || "Фотогалерея театра Круг" }
    : { ...OG_LOGO, alt: "Фотогалерея театра Круг" };
  return {
    title: "Фотогалерея — О театре — Драматический театр «Круг»",
    description: "Фотографии театра: фасад, зрительный зал, фойе, гримёрки, закулисье.",
    alternates: { canonical: canonicalUrl("/o-teatre/fotogalereya") },
    openGraph: {
      type: "website",
      locale: "ru_RU",
      url: canonicalUrl("/o-teatre/fotogalereya"),
      siteName: "Драматический театр «Круг»",
      title: "Фотогалерея — О театре — Драматический театр «Круг»",
      description: "Фотографии театра: фасад, зрительный зал, фойе, гримёрки, закулисье.",
      images: [ogImage],
    },
    twitter: { card: "summary_large_image", title: "Фотогалерея — Драматический театр «Круг»" },
  };
}

type Props = { searchParams: Promise<{ page?: string }> };

export default async function FotogalereyaPage({ searchParams }: Props) {
  const images = (await getTheaterGalleryImages().catch(() => [])) ?? [];
  const { page: pageParam } = await searchParams;
  const page = Math.max(1, parseInt(pageParam ?? "1", 10) || 1);
  const totalPages = Math.ceil(images.length / GALLERY_PAGE_SIZE);
  const currentPage = Math.min(page, totalPages);

  const start = (currentPage - 1) * GALLERY_PAGE_SIZE;
  const imagesOnPage = images.slice(
    start,
    start + GALLERY_PAGE_SIZE
  );

  return (
    <div className={styles.wrap}>
      <nav className={styles.breadcrumbs} aria-label="Хлебные крошки">
        <Link href="/">Главная</Link>
        <span className={styles.breadcrumbsSep}>→</span>
        <Link href="/o-teatre">О театре</Link>
        <span className={styles.breadcrumbsSep}>→</span>
        <span>Фотогалерея</span>
      </nav>

      <header className={styles.header}>
        <h1 className={styles.h1}>Фотогалерея</h1>
        <p className={styles.lead}>
          Все фото театра: фасад, зал, фойе, гримёрки, закулисье
        </p>
      </header>

      <section
        className={`${styles.contentSection} ${styles.contentSectionWide}`}
        aria-labelledby="gallery-heading"
      >
        <h2 id="gallery-heading" className={styles.h2}>
          Фотографии театра
        </h2>
        <GalleryLightbox
          images={imagesOnPage}
          variant="grid"
        />
      </section>

      {totalPages > 1 && (
        <nav className={fotogalereyaStyles.pagination} aria-label="Пагинация">
          <ul className={fotogalereyaStyles.paginationList}>
            {currentPage > 1 && (
              <li>
                <Link
                  href={
                    currentPage === 2
                      ? "/o-teatre/fotogalereya"
                      : `/o-teatre/fotogalereya?page=${currentPage - 1}`
                  }
                  className={fotogalereyaStyles.paginationPrev}
                >
                  ← Назад
                </Link>
              </li>
            )}
            <li className={fotogalereyaStyles.paginationPages}>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => {
                const show =
                  p === 1 ||
                  p === totalPages ||
                  (p >= currentPage - 1 && p <= currentPage + 1);
                if (!show) return null;
                return (
                  <span key={p}>
                    {p === currentPage ? (
                      <span
                        className={fotogalereyaStyles.paginationCurrent}
                        aria-current="page"
                      >
                        {p}
                      </span>
                    ) : (
                      <Link
                        href={
                          p === 1
                            ? "/o-teatre/fotogalereya"
                            : `/o-teatre/fotogalereya?page=${p}`
                        }
                        className={fotogalereyaStyles.paginationLink}
                      >
                        {p}
                      </Link>
                    )}
                  </span>
                );
              })}
            </li>
            {currentPage < totalPages && (
              <li>
                <Link
                  href={`/o-teatre/fotogalereya?page=${currentPage + 1}`}
                  className={fotogalereyaStyles.paginationNext}
                >
                  Вперёд →
                </Link>
              </li>
            )}
          </ul>
          <p className={fotogalereyaStyles.paginationInfo}>
            Страница {currentPage} из {totalPages}
          </p>
        </nav>
      )}
    </div>
  );
}
