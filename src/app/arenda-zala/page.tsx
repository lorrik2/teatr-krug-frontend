import type { Metadata } from "next";
import Link from "next/link";
import GalleryLightbox from "@/components/GalleryLightbox";
import { getArendaZalaPageData } from "@/lib/cms-data";
import { canonicalUrl, OG_LOGO } from "@/lib/site-config";
import styles from "../styles/Page.module.css";

export async function generateMetadata(): Promise<Metadata> {
  const data = await getArendaZalaPageData();
  const ogImage = data.galleryImages?.[0]?.src
    ? { url: data.galleryImages[0].src, width: 1200, height: 630, alt: data.galleryImages[0].alt || "Аренда зала театра Круг" }
    : { ...OG_LOGO, alt: "Аренда зала театра Круг" };
  return {
    title: "Аренда зала — Драматический театр «Круг»",
    description: "Аренда зрительного зала и помещений театра для мероприятий, концертов, показов.",
    alternates: { canonical: canonicalUrl("/arenda-zala") },
    openGraph: {
      type: "website",
      locale: "ru_RU",
      url: canonicalUrl("/arenda-zala"),
      siteName: "Драматический театр «Круг»",
      title: "Аренда зала — Драматический театр «Круг»",
      description: "Аренда зрительного зала и помещений театра для мероприятий, концертов, показов.",
      images: [ogImage],
    },
    twitter: { card: "summary_large_image", title: "Аренда зала — Драматический театр «Круг»" },
  };
}

export default async function ArendaZalaPage() {
  const data = await getArendaZalaPageData();
  const galleryImages = data.galleryImages;
  const paragraphs = (data.conditionsText ?? "")
    .split(/\n\n+/)
    .filter((p) => p.trim());
  return (
    <div className={styles.wrap}>
      <nav className={styles.breadcrumbs} aria-label="Хлебные крошки">
        <Link href="/">Главная</Link>
        <span className={styles.breadcrumbsSep}>→</span>
        <span>Аренда зала</span>
      </nav>

      <header className={styles.header}>
        <h1 className={styles.h1}>{data.title || "Аренда зала"}</h1>
        <p className={styles.lead}>{data.lead || ""}</p>
      </header>

      <section className={styles.contentSection}>
        <h2 className={styles.h2}>Условия аренды</h2>
        {paragraphs.length > 0 ? (
          paragraphs.map((p, i) => <p key={i}>{p}</p>)
        ) : (
          <p>
            Драматический театр «Круг» предлагает в аренду зрительный зал и
            сопутствующие помещения. По вопросам аренды обращайтесь в
            администрацию театра.
          </p>
        )}
      </section>

      {galleryImages.length > 0 && (
        <section
          id="gallery"
          className={`${styles.contentSection} ${styles.contentSectionWide}`}
        >
          <h2 className={styles.h2}>Фотографии зала и помещений</h2>
          <GalleryLightbox
            images={galleryImages}
            variant="grid"
            limit={4}
            moreLabel="Смотреть ещё"
            galleryId="arenda-zala-photos"
          />
        </section>
      )}

      <section className={styles.contentSection}>
        <h2 className={styles.h2}>Как забронировать</h2>
        <p>
          {data.howToBookText ? (
            data.howToBookText
          ) : (
            <>
              По вопросам аренды обращайтесь в администрацию театра по
              телефону или электронной почте. Указаны на странице{" "}
              <Link href="/kontakty" className={styles.galleryLink}>
                Контакты
              </Link>
              .
            </>
          )}
        </p>
      </section>
    </div>
  );
}
