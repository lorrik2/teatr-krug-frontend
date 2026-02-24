import type { Metadata } from "next";
import Link from "next/link";
import GalleryLightbox from "@/components/GalleryLightbox";
import {
  theaterGalleryImages,
  GALLERY_PAGE_SIZE,
} from "@/lib/theater-gallery";
import styles from "../../styles/Page.module.css";
import fotogalereyaStyles from "./fotogalereya.module.css";

export const metadata: Metadata = {
  title: "Фотогалерея — О театре — Драматический театр «Круг»",
  description:
    "Фотографии театра: фасад, зрительный зал, фойе, гримёрки, закулисье.",
};

type Props = { searchParams: Promise<{ page?: string }> };

export default async function FotogalereyaPage({ searchParams }: Props) {
  const { page: pageParam } = await searchParams;
  const page = Math.max(1, parseInt(pageParam ?? "1", 10) || 1);
  const totalPages = Math.ceil(
    theaterGalleryImages.length / GALLERY_PAGE_SIZE
  );
  const currentPage = Math.min(page, totalPages);

  const start = (currentPage - 1) * GALLERY_PAGE_SIZE;
  const imagesOnPage = theaterGalleryImages.slice(
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

      <section className={`${styles.contentSection} ${styles.contentSectionWide}`}>
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
