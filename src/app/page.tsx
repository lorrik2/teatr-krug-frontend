import type { Metadata } from "next";
import Hero from "@/components/Hero";
import Repertoire from "@/components/Repertoire";
import About from "@/components/About";
import Team from "@/components/Team";
import Reviews from "@/components/Reviews";
import News from "@/components/News";
import Contacts from "@/components/Contacts";
import {
  getHeroSlides,
  getPerformances,
  getNewsItems,
  getContactInfo,
  getTheaterReviews,
  getActors,
  EMPTY_CONTACT,
} from "@/lib/cms-data";
import { canonicalUrl } from "@/lib/site-config";
import TheaterReviewsJsonLd from "@/components/seo/TheaterReviewsJsonLd";

export const metadata: Metadata = {
  title: "Драматический театр «Круг» — Афиша, билеты, события",
  description:
    "Официальный сайт драматического театра «Круг». Афиша спектаклей, покупка билетов, труппа, отзывы зрителей, события и контакты.",
  keywords: [
    "театр Круг",
    "драматический театр",
    "Санкт-Петербург",
    "афиша спектаклей",
    "отзывы о театре",
    "купить билеты",
    "театр СПб",
  ],
  alternates: { canonical: canonicalUrl("/") },
  openGraph: {
    type: "website",
    locale: "ru_RU",
    url: canonicalUrl("/"),
    siteName: "Драматический театр «Круг»",
    title: "Драматический театр «Круг» — Афиша, билеты, события",
    description:
      "Официальный сайт драматического театра «Круг». Афиша спектаклей, покупка билетов, труппа, события и контакты.",
    images: [{ url: "/fon/8.jpg", width: 1200, height: 630, alt: "Драматический театр «Круг»" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Драматический театр «Круг» — Афиша, билеты, события",
    description: "Официальный сайт театра. Афиша спектаклей, покупка билетов, труппа, события.",
  },
};

export default async function HomePage() {
  const [heroSlides = [], performances = [], newsItems = [], contactInfo, reviews = [], actors = []] =
    await Promise.all([
      getHeroSlides().catch(() => []),
      getPerformances().catch(() => []),
      getNewsItems().catch(() => []),
      getContactInfo().catch(() => EMPTY_CONTACT),
      getTheaterReviews().catch(() => []),
      getActors().catch(() => []),
    ]);

  return (
    <>
      <TheaterReviewsJsonLd reviews={reviews} />
      <Hero slides={heroSlides} />
      <Repertoire performances={performances} />
      <About />
      <Team actors={actors} />
      <Reviews reviews={reviews} />
      <News newsItems={newsItems} />
      <Contacts contactInfo={contactInfo} />
    </>
  );
}
