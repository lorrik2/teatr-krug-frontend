import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { newsItems } from "@/lib/mock-data";
import styles from "../../styles/Page.module.css";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return newsItems.map((n) => ({ slug: n.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const item = newsItems.find((n) => n.slug === slug);
  if (!item) return { title: "Новость" };
  return {
    title: `${item.title} — Камерный театр`,
    description: item.excerpt,
    openGraph: { title: item.title, description: item.excerpt },
  };
}

export default async function NewsItemPage({ params }: Props) {
  const { slug } = await params;
  const item = newsItems.find((n) => n.slug === slug);
  if (!item) notFound();

  return (
    <div className={styles.wrap}>
      <header className={styles.header}>
        <Link href="/novosti" className="text-graphite-600 hover:underline">
          ← Новости
        </Link>
        <p className="mt-4 text-sm text-graphite-500">
          <time dateTime={item.date}>{item.date}</time> · {item.category}
        </p>
        <h1 className={styles.h1}>{item.title}</h1>
      </header>

      <article className="mx-auto max-w-3xl">
        <div className="relative aspect-video overflow-hidden rounded-lg bg-graphite-200">
          <Image
            src={item.image}
            alt=""
            fill
            className="object-cover"
          />
        </div>
        <div className="mt-6 prose prose-graphite max-w-none">
          <p className="text-lg text-graphite-700">{item.excerpt}</p>
          <p className="mt-4 text-graphite-700">
            Полный текст материала будет подгружаться из Strapi CMS. Здесь — заглушка для демонстрации структуры страницы новости.
          </p>
        </div>
      </article>
    </div>
  );
}
