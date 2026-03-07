import type { Metadata } from "next";
import Link from "next/link";
import OptimizedImage from "@/components/OptimizedImage";
import { getPartnersPageData } from "@/lib/cms-data";
import { canonicalUrl, OG_LOGO } from "@/lib/site-config";
import styles from "../styles/Page.module.css";

export async function generateMetadata(): Promise<Metadata> {
  const data = await getPartnersPageData();
  const firstLogo = data.partners?.[0]?.logoUrl;
  const ogImage = firstLogo
    ? { url: firstLogo, width: 1200, height: 630, alt: data.partners[0].name || "Партнёры театра Круг" }
    : { ...OG_LOGO, alt: "Партнёры театра Круг" };
  return {
    title: "Партнёры и спонсоры — Драматический театр «Круг»",
    description: "Партнёры и спонсоры театра.",
    alternates: { canonical: canonicalUrl("/partners") },
    openGraph: {
      type: "website",
      locale: "ru_RU",
      url: canonicalUrl("/partners"),
      siteName: "Драматический театр «Круг»",
      title: "Партнёры и спонсоры — Драматический театр «Круг»",
      description: "Партнёры и спонсоры театра.",
      images: [ogImage],
    },
    twitter: { card: "summary_large_image", title: "Партнёры и спонсоры — Драматический театр «Круг»" },
  };
}

export default async function PartnersPage() {
  const data = await getPartnersPageData();
  const introParagraphs = (data.introText ?? "")
    .split(/\n\n+/)
    .filter((p) => p.trim());
  return (
    <div className={styles.wrap}>
      <nav className={styles.breadcrumbs} aria-label="Хлебные крошки">
        <Link href="/">Главная</Link>
        <span className={styles.breadcrumbsSep}>→</span>
        <span>Партнёры и спонсоры</span>
      </nav>

      <header className={styles.header}>
        <h1 className={styles.h1}>{data.title || "Партнёры и спонсоры"}</h1>
        <p className={styles.lead}>
          Организации, поддерживающие театр «Круг»
        </p>
      </header>

      <section
        className={styles.contentSection}
        aria-labelledby="partners-intro-heading"
      >
        <h2 id="partners-intro-heading" className="sr-only">
          О партнёрах
        </h2>
        <div className="mx-auto max-w-3xl text-graphite-700">
          {introParagraphs.length > 0 ? (
            introParagraphs.map((p, i) => (
              <p key={i} className="mb-4">
                {p}
              </p>
            ))
          ) : (
            <p>
              Раздел в разработке. Здесь будут размещены логотипы и ссылки на
              партнёров и спонсоров театра.
            </p>
          )}
        </div>
      </section>

      {(data.partners ?? []).length > 0 && (
        <section
          className={`${styles.contentSection} ${styles.contentSectionWide}`}
          aria-labelledby="partners-list-heading"
        >
          <h2 id="partners-list-heading" className={styles.h2}>
            Наши партнёры
          </h2>
          <ul className="mt-6 grid list-none grid-cols-2 gap-8 p-0 sm:grid-cols-3">
            {(data.partners ?? []).map((partner, i) => (
              <li
                key={i}
                className="flex flex-col items-center gap-2 rounded-lg border border-graphite-200 p-4"
              >
                {partner.logoUrl ? (
                  partner.url ? (
                    <a
                      href={partner.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block"
                    >
                      <OptimizedImage
                        src={partner.logoUrl}
                        alt={partner.name}
                        width={120}
                        height={80}
                        className="object-contain"
                      />
                    </a>
                  ) : (
                    <OptimizedImage
                      src={partner.logoUrl}
                      alt={partner.name}
                      width={120}
                      height={80}
                      className="object-contain"
                    />
                  )
                ) : (
                  <span className="text-lg font-medium">{partner.name}</span>
                )}
                {partner.url && !partner.logoUrl && (
                  <a
                    href={partner.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-graphite-600 hover:underline"
                  >
                    {partner.name}
                  </a>
                )}
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
