"use client";

import { SITE_URL } from "@/lib/site-config";
import type { Review } from "@/lib/types";

type Props = { reviews: Review[] };

const THEATER_ITEM_REVIEWED = {
  "@type": "PerformingArtsTheater",
  name: "Драматический театр «Круг»",
  url: SITE_URL,
  address: {
    "@type": "PostalAddress",
    streetAddress: "Касимовская, 5",
    addressLocality: "Санкт-Петербург",
    addressCountry: "RU",
  },
};

/**
 * Микроразметка отзывов о театре (schema.org Review).
 * Рендерится на главной странице.
 */
export default function TheaterReviewsJsonLd({ reviews }: Props) {
  if (!reviews?.length) return null;

  const graph = reviews.map((r) => ({
    "@type": "Review",
    itemReviewed: THEATER_ITEM_REVIEWED,
    reviewBody: r.quote?.trim() || "",
    author: {
      "@type": "Person",
      name: r.author?.trim() || "Зритель",
    },
    ...((r.vkUrl || r.yandexMapsUrl || r.twoGisUrl) && {
      url: r.vkUrl || r.yandexMapsUrl || r.twoGisUrl,
    }),
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
