import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import OptimizedImage from "@/components/OptimizedImage";
import NewsArticleJsonLd from "@/components/seo/NewsArticleJsonLd";
import BreadcrumbJsonLd from "@/components/seo/BreadcrumbJsonLd";
import { getNewsItemBySlug, getNewsItems } from "@/lib/cms-data";
import { SITE_URL } from "@/lib/site-config";
import styles from "../../styles/Page.module.css";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  const newsItems = await getNewsItems();
  return newsItems.map((n) => ({ slug: n.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const item = await getNewsItemBySlug(slug);
  if (!item) return { title: "Событие" };
  const url = `${SITE_URL}/sobytiya/${slug}`;
  return {
    title: `${item.title} — Драматический театр «Круг»`,
    description: item.excerpt,
    alternates: { canonical: url },
    openGraph: {
      title: item.title,
      description: item.excerpt,
      url,
      images: item.image ? [{ url: item.image, alt: item.title }] : undefined,
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
      <header className={styles.header}>
        <Link href="/sobytiya" className="text-graphite-600 hover:underline">
          ← События
        </Link>
        <p className="mt-4 text-sm text-graphite-500">
          <time dateTime={item.date}>{item.date}</time> · {item.category}
        </p>
        <h1 className={styles.h1}>{item.title}</h1>
      </header>

      <article className="mx-auto max-w-3xl">
        <div className="relative aspect-video overflow-hidden rounded-lg bg-graphite-200">
          <OptimizedImage src={item.image} alt="" fill className="object-cover" effect="blur" />
        </div>
        <div className="mt-6 prose prose-graphite max-w-none">
          <p className="text-lg text-graphite-700">{item.excerpt}</p>
          {item.content ? (
            <p className="mt-4 whitespace-pre-line text-graphite-700">{item.content}</p>
          ) : null}
        </div>
      </article>
    </div>
  );
}
