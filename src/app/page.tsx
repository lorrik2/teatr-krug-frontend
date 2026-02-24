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
} from "@/lib/cms-data";
import { SITE_URL } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Драматический театр «Круг» — Афиша, билеты, события",
  description:
    "Официальный сайт драматического театра «Круг». Афиша спектаклей, покупка билетов, труппа, события и контакты.",
  alternates: { canonical: SITE_URL },
};

export default async function HomePage() {
  const [heroSlides, performances, newsItems, contactInfo, reviews, actors] =
    await Promise.all([
      getHeroSlides(),
      getPerformances(),
      getNewsItems(),
      getContactInfo(),
      getTheaterReviews(),
      getActors(),
    ]);

  return (
    <>
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
