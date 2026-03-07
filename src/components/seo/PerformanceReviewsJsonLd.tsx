"use client";

import { SITE_URL } from "@/lib/site-config";
import type { Performance, Review } from "@/lib/types";

type Props = { play: Performance; basePath: "afisha" | "repertuar" };

/**
 * Микроразметка отзывов о спектакле (schema.org Review).
 * itemReviewed — Event или CreativeWork (спектакль).
 */
export default function PerformanceReviewsJsonLd({ play, basePath }: Props) {
  const reviews = play.reviews;
  if (!reviews?.length) return null;

  const url = `${SITE_URL}/${basePath}/${play.slug}`;
  const image = play.poster
    ? play.poster.startsWith("http")
      ? play.poster
      : `${SITE_URL}${play.poster.startsWith("/") ? "" : "/"}${play.poster}`
    : undefined;

  const itemReviewed = {
    "@type": "CreativeWork",
    name: play.title,
    url,
    description: play.description,
    image,
    author: play.director ? { "@type": "Person", name: play.director } : undefined,
  };

  const graph = reviews.map((r) => ({
    "@type": "Review",
    name: `Отзыв на спектакль «${play.title}»`,
    itemReviewed,
    reviewBody: r.quote?.trim() || "",
    author: {
      "@type": "Person",
      name: r.author?.trim() || "Зритель",
    },
    ...(r.vkUrl && { url: r.vkUrl }),
  }));

  const schema = {
    "@context": "https://schema.org",
    "@graph": graph,
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
