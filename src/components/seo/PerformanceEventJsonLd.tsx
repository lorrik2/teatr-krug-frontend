"use client";

import { EventJsonLd, CreativeWorkJsonLd } from "next-seo";
import { SITE_URL } from "@/lib/site-config";
import { toIsoDateTime } from "@/lib/date-utils";
import type { Performance } from "@/lib/mock-data";

type Props = {
  play: Performance;
  basePath: "afisha" | "repertuar";
  ticketsUrl?: string;
};

function getImageUrl(poster: string | undefined): string | undefined {
  if (!poster) return undefined;
  return poster.startsWith("http")
    ? poster
    : `${SITE_URL}${poster.startsWith("/") ? "" : "/"}${poster}`;
}

export default function PerformanceEventJsonLd({
  play,
  basePath,
  ticketsUrl,
}: Props) {
  const url = `${SITE_URL}/${basePath}/${play.slug}`;
  const image = getImageUrl(play.poster);

  const schedule = play.schedule?.length
    ? play.schedule
    : play.date !== "—"
      ? [{ date: play.date, time: play.time }]
      : [];

  const firstShow = schedule[0];
  const startDate = firstShow
    ? toIsoDateTime(firstShow.date, firstShow.time)
    : null;

  // Спектакль с датой — Event (театральное событие)
  if (startDate) {
    return (
      <EventJsonLd
        name={play.title}
        startDate={startDate}
        location={{
          name: "Драматический театр «Круг»",
          address: {
            streetAddress: "Касимовская, 5",
            addressLocality: "Санкт-Петербург",
            addressCountry: "RU",
          },
        }}
        url={url}
        description={play.description}
        image={image}
        offers={
          ticketsUrl
            ? {
                url: ticketsUrl,
                price: 0,
                priceCurrency: "RUB",
                availability: "https://schema.org/InStock",
              }
            : undefined
        }
        performer={play.director}
      />
    );
  }

  // Спектакль без даты — CreativeWork (театральная постановка)
  return (
    <CreativeWorkJsonLd
      type="CreativeWork"
      name={play.title}
      description={play.description}
      url={url}
      image={image}
      author={play.author ?? play.director}
      publisher={{
        name: "Драматический театр «Круг»",
        url: SITE_URL,
      }}
    />
  );
}
