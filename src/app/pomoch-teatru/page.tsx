import type { Metadata } from "next";
import Link from "next/link";
import OptimizedImage from "@/components/OptimizedImage";
import { getPomochTeatruPageData } from "@/lib/cms-data";
import { canonicalUrl } from "@/lib/site-config";
import styles from "../styles/Page.module.css";

export const metadata: Metadata = {
  title: "Помочь театру — Драматический театр «Круг»",
  description: "Поддержать театр: реквизиты для перевода, QR-код для быстрой оплаты.",
  alternates: { canonical: canonicalUrl("/pomoch-teatru") },
  openGraph: {
    type: "website",
    locale: "ru_RU",
    url: canonicalUrl("/pomoch-teatru"),
    siteName: "Драматический театр «Круг»",
    title: "Помочь театру — Драматический театр «Круг»",
    description: "Поддержать театр: реквизиты для перевода, QR-код для быстрой оплаты.",
    images: [{ url: "/logo/logoLayout.png", width: 1200, height: 630, alt: "Помочь театру Круг" }],
  },
  twitter: { card: "summary_large_image", title: "Помочь театру — Драматический театр «Круг»" },
};

export default async function PomochTeatruPage() {
  const data = await getPomochTeatruPageData();
  const requisitesParagraphs = (data.requisitesText ?? "")
    .split(/\n\n+/)
    .filter((p) => p.trim());
  return (
    <div className={styles.wrap}>
      <nav className={styles.breadcrumbs} aria-label="Хлебные крошки">
        <Link href="/">Главная</Link>
        <span className={styles.breadcrumbsSep}>→</span>
        <span>Помочь театру</span>
      </nav>

      <header className={styles.header}>
        <h1 className={styles.h1}>{data.title || "Помочь театру"}</h1>
        <p className={styles.lead}>{data.lead || ""}</p>
      </header>

      {data.introText?.trim() && (
        <section className={styles.contentSection}>
          {data.introText
            .split(/\n\n+/)
            .filter((p) => p.trim())
            .map((p, i) => (
              <p key={i}>{p}</p>
            ))}
        </section>
      )}

      <section className={styles.contentSection}>
        <h2 className={styles.h2}>Реквизиты для перевода</h2>
        {requisitesParagraphs.length > 0 ? (
          requisitesParagraphs.map((p, i) => <p key={i}>{p}</p>)
        ) : (
          <div className={styles.videoPlaceholder}>
            <p className="text-center text-graphite-600">
              Здесь будут реквизиты для перевода
            </p>
          </div>
        )}
      </section>

      <section className={styles.contentSection}>
        <h2 className={styles.h2}>QR-код для оплаты</h2>
        {data.qrCodeImageUrl ? (
          <div className="flex justify-center">
            <OptimizedImage
              src={data.qrCodeImageUrl}
              alt="QR-код для оплаты"
              width={256}
              height={256}
            />
          </div>
        ) : (
          <div className={styles.videoPlaceholder}>
            <p className="text-center text-graphite-600">
              Здесь будет QR-код для быстрой оплаты
            </p>
          </div>
        )}
      </section>
    </div>
  );
}
