import type { Metadata } from "next";
import Link from "next/link";
import OptimizedImage from "@/components/OptimizedImage";
import { getNewsItems } from "@/lib/cms-data";
import { canonicalUrl, OG_LOGO } from "@/lib/site-config";
import styles from "../styles/Page.module.css";

export async function generateMetadata(): Promise<Metadata> {
  const newsItems = await getNewsItems().catch(() => []);
  const firstWithImage = newsItems.find((n) => n.image);
  const ogImage = firstWithImage?.image
    ? { url: firstWithImage.image, width: 1200, height: 630, alt: firstWithImage.title || "События театра Круг" }
    : { ...OG_LOGO, alt: "События театра Круг" };
  return {
    title: "События — Драматический театр «Круг»",
    description: "Анонсы творческих вечеров, рецензии, экскурсии по театру, блог.",
    alternates: { canonical: canonicalUrl("/sobytiya") },
    openGraph: {
      type: "website",
      locale: "ru_RU",
      url: canonicalUrl("/sobytiya"),
      siteName: "Драматический театр «Круг»",
      title: "События — Драматический театр «Круг»",
      description: "Анонсы творческих вечеров, рецензии, экскурсии по театру, блог.",
      images: [ogImage],
    },
    twitter: { card: "summary_large_image", title: "События — Драматический театр «Круг»" },
  };
}

export default async function EventsPage() {
  const newsItems = (await getNewsItems().catch(() => [])) ?? [];
  return (
    <div className={styles.wrap}>
      <nav className={styles.breadcrumbs} aria-label="Хлебные крошки">
        <Link href="/">Главная</Link>
        <span className={styles.breadcrumbsSep}>→</span>
        <span>События</span>
      </nav>
      <header className={styles.header}>
        <h1 className={styles.h1}>События</h1>
      </header>

      <section className={styles.section}>
        <ul className={styles.newsGrid}>
          {newsItems.map((item) => (
            <li key={item.id} className={styles.newsCard}>
              <Link
                href={`/sobytiya/${item.slug}`}
                className={styles.newsCardLink}
              >
                <div className={styles.newsImageWrap}>
                  <OptimizedImage
                    src={item.image}
                    alt=""
                    width={600}
                    height={400}
                    className={styles.newsImage}
                    effect="blur"
                  />
                  <span className={styles.newsCategory}>{item.category}</span>
                </div>
                <div className={styles.newsBody}>
                  <time className={styles.newsDate} dateTime={item.date}>
                    {item.date}
                  </time>
                  <h2 className={styles.newsTitle}>{item.title}</h2>
                  <p className={styles.newsExcerpt}>{item.excerpt}</p>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
