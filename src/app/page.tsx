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
  getOTeatrePageData,
  EMPTY_CONTACT,
} from "@/lib/cms-data";
import { canonicalUrl, OG_LOGO } from "@/lib/site-config";
import TheaterReviewsJsonLd from "@/components/seo/TheaterReviewsJsonLd";

export async function generateMetadata(): Promise<Metadata> {
  const heroSlides = await getHeroSlides().catch(() => []);
  const ogImage = heroSlides[0]?.image
    ? { url: heroSlides[0].image, width: 1200, height: 630, alt: "Драматический театр «Круг»" }
    : { ...OG_LOGO, alt: "Драматический театр «Круг»" };
  return {
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
    images: [ogImage],
  },
  twitter: {
    card: "summary_large_image",
    title: "Драматический театр «Круг» — Афиша, билеты, события",
    description: "Официальный сайт театра. Афиша спектаклей, покупка билетов, труппа, события.",
  },
};
}

export default async function HomePage() {
  const [
    heroSlides = [],
    performances = [],
    newsItems = [],
    contactInfo,
    reviews = [],
    actors = [],
    aboutData,
  ] = await Promise.all([
    getHeroSlides().catch(() => []),
    getPerformances().catch(() => []),
    getNewsItems().catch(() => []),
    getContactInfo().catch(() => EMPTY_CONTACT),
    getTheaterReviews().catch(() => []),
    getActors().catch(() => []),
    getOTeatrePageData().catch(() => null),
  ]);

  return (
    <>
      <TheaterReviewsJsonLd reviews={reviews} />
      <Hero slides={heroSlides} />
      <Repertoire performances={performances} />
      <About data={aboutData} />
      <Team actors={actors} />
      <Reviews reviews={reviews} />
      <News newsItems={newsItems} />
      <Contacts contactInfo={contactInfo} />
    </>
  );
}
