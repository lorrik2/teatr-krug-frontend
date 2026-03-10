import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import OptimizedImage from "@/components/OptimizedImage";
import NewsArticleJsonLd from "@/components/seo/NewsArticleJsonLd";
import BreadcrumbJsonLd from "@/components/seo/BreadcrumbJsonLd";
import { getNewsItemBySlug, getNewsItems } from "@/lib/cms-data";
import { canonicalUrl, OG_LOGO } from "@/lib/site-config";
import styles from "../../styles/Page.module.css";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  try {
    const newsItems = await getNewsItems();
    const params: { slug: string }[] = [];
    for (const n of newsItems) {
      const s = n.slug;
      if (typeof s === "string" && s.length > 0 && !s.includes("[object")) {
        params.push({ slug: s });
      }
    }
    return params;
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const item = await getNewsItemBySlug(slug);
  if (!item) return { title: "Событие", description: "Событие не найдено." };
  const url = canonicalUrl(`/sobytiya/${slug}`);
  const desc =
    item.excerpt?.trim() ||
    `Событие «${item.title}» в театре Круг. Анонсы, рецензии, экскурсии.`;
  return {
    title: `${item.title} — Драматический театр «Круг»`,
    description: desc,
    alternates: { canonical: url },
    openGraph: {
      type: "article",
      locale: "ru_RU",
      url,
      siteName: "Драматический театр «Круг»",
      title: item.title,
      description: desc,
      images: item.image
        ? [{ url: item.image, width: 1200, height: 630, alt: item.title }]
        : [{ ...OG_LOGO, alt: item.title }],
    },
    twitter: {
      card: "summary_large_image",
      title: item.title,
      description: desc,
    },
  };
}

export default async function EventItemPage({ params }: Props) {
  const { slug } = await params;
  const item = await getNewsItemBySlug(slug);
  if (!item) notFound();

  return (
    <div className={styles.wrap}>
      <NewsArticleJsonLd item={item} />
      <BreadcrumbJsonLd
        items={[
          { name: "Главная", href: "/" },
          { name: "События", href: "/sobytiya" },
          { name: item.title },
        ]}
      />
      <nav className={styles.breadcrumbs} aria-label="Хлебные крошки">
        <Link href="/">Главная</Link>
        <span className={styles.breadcrumbsSep}>→</span>
        <Link href="/sobytiya">События</Link>
        <span className={styles.breadcrumbsSep}>→</span>
        <span>{item.title}</span>
      </nav>
      <header className={styles.header}>
        <p className="mt-2 text-sm text-graphite-500">
          <time dateTime={item.date}>{item.date}</time> · {item.category}
        </p>
        <h1 className={styles.h1}>{item.title}</h1>
      </header>

      <article className="mx-auto max-w-3xl">
        <div className="relative aspect-video overflow-hidden rounded-lg bg-graphite-200">
          <OptimizedImage src={item.image} alt="" fill className="object-cover" effect="blur" />
        </div>
        <div className="mt-6 prose prose-graphite max-w-none">
          <p className="text-lg text-graphite-700 whitespace-pre-line">{item.excerpt}</p>
          {item.content ? (
            <p className="mt-4 whitespace-pre-line text-graphite-700">{item.content}</p>
          ) : null}
        </div>
      </article>
    </div>
  );
}
