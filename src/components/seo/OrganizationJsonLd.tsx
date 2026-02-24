"use client";

import { LocalBusinessJsonLd } from "next-seo";
import { SITE_URL } from "@/lib/site-config";

export default function OrganizationJsonLd() {
  return (
    <LocalBusinessJsonLd
      type="PerformingArtsTheater"
      name="Драматический театр «Круг»"
      url={SITE_URL}
      description="Официальный сайт драматического театра «Круг». Афиша спектаклей, покупка билетов, труппа, события."
      address={{
        streetAddress: "Касимовская, 5",
        addressLocality: "Санкт-Петербург",
        addressCountry: "RU",
      }}
      sameAs={["https://vk.com/teatr_krug", "https://t.me/teatr_krug"]}
    />
  );
}
