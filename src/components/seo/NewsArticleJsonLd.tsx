"use client";

import { ArticleJsonLd } from "next-seo";
import { SITE_URL } from "@/lib/site-config";
import { toIsoDate } from "@/lib/date-utils";
import type { NewsItem } from "@/lib/mock-data";

type Props = { item: NewsItem };

export default function NewsArticleJsonLd({ item }: Props) {
  const datePublished = toIsoDate(item.date);
  const url = `${SITE_URL}/sobytiya/${item.slug}`;
  const image = item.image?.startsWith("http")
    ? item.image
    : item.image
      ? `${SITE_URL}${item.image.startsWith("/") ? "" : "/"}${item.image}`
      : undefined;

  return (
    <ArticleJsonLd
      type="NewsArticle"
      headline={item.title}
      description={item.excerpt}
      url={url}
      datePublished={datePublished ?? undefined}
      images={image ? [image] : undefined}
      author={{
        name: "Драматический театр «Круг»",
        url: SITE_URL,
      }}
      publisher={{
        name: "Драматический театр «Круг»",
        url: SITE_URL,
      }}
    />
  );
}
