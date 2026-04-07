import type { Metadata } from "next";
import type { ReactNode } from "react";
import Link from "next/link";
import BreadcrumbJsonLd from "@/components/seo/BreadcrumbJsonLd";
import {
  getDostupnayaSredaPageData,
  type DostupnayaSredaPageData,
} from "@/lib/cms-data";
import { canonicalUrl, OG_LOGO } from "@/lib/site-config";
import styles from "../styles/Page.module.css";

const SITE_SUFFIX = " — Драматический театр «Круг»";
const KEYWORDS = [
  "доступная среда",
  "ОВЗ",
  "инвалиды",
  "доступность театра",
  "ФЗ 181",
  "Драматический театр Круг",
  "Санкт-Петербург",
];

function textToParagraphs(text: string): string[] {
  return text.split(/\n\n+/).filter((p) => p.trim());
}

function buildDocumentTitle(data: DostupnayaSredaPageData): string {
  if (data.metaTitle.trim()) return data.metaTitle.trim();
  return `${data.title}${SITE_SUFFIX}`;
}

export async function generateMetadata(): Promise<Metadata> {
  const data = await getDostupnayaSredaPageData();
  const title = buildDocumentTitle(data);
  const description = data?.metaDescription.trim();
  return {
    title,
    description,
    keywords: KEYWORDS,
    alternates: { canonical: canonicalUrl("/dostupnaya-sreda") },
    robots: { index: true, follow: true },
    openGraph: {
      type: "website",
      locale: "ru_RU",
      url: canonicalUrl("/dostupnaya-sreda"),
      siteName: "Драматический театр «Круг»",
      title,
      description,
      images: [
        {
          ...OG_LOGO,
          alt: title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

type SectionProps = {
  sectionId: string;
  heading: string;
  body: string;
  children?: ReactNode;
};

function ContentSection({ sectionId, heading, body, children }: SectionProps) {
  const paragraphs = textToParagraphs(body);
  const hasBody = paragraphs.length > 0;
  if (!heading.trim() && !hasBody && !children) return null;
  return (
    <section
      className={styles.contentSection}
      aria-labelledby={heading.trim() ? sectionId : undefined}
    >
      {heading.trim() ? (
        <h2 id={sectionId} className={styles.h2}>
          {heading.trim()}
        </h2>
      ) : null}
      {paragraphs.map((p, i) => (
        <p key={i}>{p}</p>
      ))}
      {children}
    </section>
  );
}

export default async function DostupnayaSredaPage() {
  const data = await getDostupnayaSredaPageData();
  const breadcrumbName = data.title.trim() || "Доступная среда";

  return (
    <>
      <BreadcrumbJsonLd
        items={[{ name: "Главная", href: "/" }, { name: breadcrumbName }]}
      />
      <div className={styles.wrap}>
        <nav className={styles.breadcrumbs} aria-label="Хлебные крошки">
          <Link href="/">Главная</Link>
          <span className={styles.breadcrumbsSep}>→</span>
          <span>{breadcrumbName}</span>
        </nav>

        <header className={styles.header}>
          <h1 className={styles.h1}>{data.title}</h1>
          {data.lead.trim() ? <p className={styles.lead}>{data.lead}</p> : null}
        </header>

        {data?.textBlocks?.map((el) => (
          <ContentSection
            key={el.title + el.descriptions}
            sectionId={`access-${el.title}`}
            heading={el.title}
            body={el.descriptions}
          />
        ))}

        {data.showContactsLink ? (
          <p>
            Телефоны, e-mail и режим работы указаны на странице{" "}
            <Link href="/kontakty" className={styles.galleryLink}>
              Контакты
            </Link>
            .
          </p>
        ) : null}
      </div>
    </>
  );
}
