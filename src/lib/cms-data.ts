/**
 * Слой данных: Strapi CMS с fallback на mock-data
 * Использует Strapi, когда он доступен; иначе — локальные мок-данные
 */

import {
  fetchStrapi,
  getStrapiMediaUrl,
  isStrapiAvailable,
  type StrapiResponse,
} from "./strapi";
import {
  performances,
  repertoirePerformances,
  actors,
  newsItems,
  heroSlides,
  contactInfo,
  theaterReviews,
  navLinks,
  navItems,
} from "./mock-data";
import {
  theaterGalleryImages,
  GALLERY_PAGE_SIZE,
} from "./theater-gallery";
import type { Performance, Actor, NewsItem, Review } from "./mock-data";

// Маппинг Strapi → наш формат
function mapStrapiPerformance(d: any): Performance {
  const poster = d.poster?.url
    ? getStrapiMediaUrl(d.poster.url)
    : d.poster?.url || "";
  const gallery =
    d.gallery && Array.isArray(d.gallery)
      ? d.gallery.map((g: any) => getStrapiMediaUrl(g?.url)).filter(Boolean)
      : undefined;

  return {
    id: d.documentId || String(d.id),
    title: d.title,
    slug: d.slug,
    poster,
    gallery: gallery?.length ? gallery : undefined,
    subtitle: d.subtitle,
    author: d.author,
    director: d.director,
    directorQuote: d.directorQuote,
    designer: d.designer,
    lightingDesigner: d.lightingDesigner,
    soundDesigner: d.soundDesigner,
    lightSoundOperator: d.lightSoundOperator,
    cast: d.cast?.map((c: any) => ({
      name: c.name,
      role: c.role,
      actorSlug: c.actor?.slug,
    })),
    reviews: d.reviews?.map((r: any, i: number) => ({
      id: `r${i}`,
      quote: r.quote,
      author: r.author,
      vkUrl: r.vkUrl,
    })),
    teaserUrl: d.teaserUrl,
    date: d.date || "",
    time: d.time || "",
    ageRating: d.ageRating || "",
    genre: d.genre || "",
    description: d.description || "",
    duration: d.duration,
    intermissions: d.intermissions,
    isPremiere: d.isPremiere,
    inAfisha: d.inAfisha !== false,
    schedule: d.schedule?.map((s: any) => ({ date: s.date, time: s.time })),
    awards: d.awards?.map((a: any) => ({ title: a.title, year: a.year })),
    festivals: d.festivals?.map((f: any) => ({
      title: f.title,
      year: f.year,
      place: f.place,
    })),
    ticketsUrl: d.ticketsUrl || undefined,
  };
}

function mapStrapiActor(d: any): Actor {
  const photo = d.photo?.url ? getStrapiMediaUrl(d.photo?.url) : "";
  const gallery =
    d.gallery && Array.isArray(d.gallery)
      ? d.gallery.map((g: any) => getStrapiMediaUrl(g?.url)).filter(Boolean)
      : undefined;

  const rolesList = Array.isArray(d.roles)
    ? d.roles.map((r: any) => (typeof r === "string" ? r : r?.text)).filter(Boolean)
    : [];

  const slug = typeof d.slug === "string" ? d.slug : "";
  return {
    id: d.documentId || String(d.id),
    name: d.name,
    slug,
    photo,
    role: d.role || "",
    rank: d.rank,
    bio: d.bio || "",
    roles: rolesList,
    gallery,
    theaterPage: d.theaterPage || undefined,
  };
}

function mapStrapiNewsItem(d: any): NewsItem {
  const image = d.image?.url ? getStrapiMediaUrl(d.image.url) : "";
  return {
    id: d.documentId || String(d.id),
    slug: d.slug,
    title: d.title,
    excerpt: d.excerpt || "",
    content: d.content || undefined,
    image,
    date: d.date || "",
    category: d.category || "",
  };
}

function mapStrapiHeroSlide(d: any) {
  const image = d.image?.url ? getStrapiMediaUrl(d.image.url) : "";
  return {
    id: d.documentId || String(d.id),
    title: d.title,
    subtitle: d.subtitle,
    image,
    cta: d.cta,
    ctaHref: d.ctaHref,
    order: d.order ?? 0,
  };
}

function mapStrapiReview(d: any): Review {
  return {
    id: d.documentId || String(d.id),
    quote: d.quote,
    author: d.author,
    vkUrl: d.vkUrl,
  };
}

async function checkStrapi(): Promise<boolean> {
  return isStrapiAvailable();
}

/** Спектакли для афиши (inAfisha) */
export async function getPerformances(): Promise<Performance[]> {
  if (await checkStrapi()) {
    const res = await fetchStrapi<Array<unknown>>("/performances", {
      populate: "*",
      filters: { inAfisha: true },
      sort: ["date:asc"],
    });
    if (res?.data && Array.isArray(res.data)) {
      return res.data.map((d: any) => mapStrapiPerformance(d));
    }
  }
  return performances;
}

/** Полный репертуар */
export async function getRepertoirePerformances(): Promise<Performance[]> {
  if (await checkStrapi()) {
    const res = await fetchStrapi<Array<unknown>>("/performances", {
      populate: "*",
      sort: ["title:asc"],
    });
    if (res?.data && Array.isArray(res.data)) {
      return res.data.map((d: any) => mapStrapiPerformance(d));
    }
  }
  return repertoirePerformances;
}

/** Спектакль по slug */
export async function getPerformanceBySlug(
  slug: string,
): Promise<Performance | null> {
  if (await checkStrapi()) {
    const res = await fetchStrapi<Array<unknown>>("/performances", {
      populate: "*",
      filters: { slug },
    });
    const data = res?.data;
    if (Array.isArray(data) && data.length > 0) {
      return mapStrapiPerformance(data[0]);
    }
  }
  return repertoirePerformances.find((p) => p.slug === slug) ?? null;
}

/** Актёры */
export async function getActors(): Promise<Actor[]> {
  if (await checkStrapi()) {
    const res = await fetchStrapi<Array<unknown>>("/actors", {
      populate: "*",
      sort: ["name:asc"],
    });
    if (res?.data && Array.isArray(res.data)) {
      return res.data.map((d: any) => mapStrapiActor(d));
    }
  }
  return actors;
}

/** Актёр по slug */
export async function getActorBySlug(slug: string): Promise<Actor | null> {
  if (await checkStrapi()) {
    const res = await fetchStrapi<Array<unknown>>("/actors", {
      populate: "*",
      filters: { slug },
    });
    const data = res?.data;
    if (Array.isArray(data) && data.length > 0) {
      return mapStrapiActor(data[0]);
    }
  }
  return actors.find((a) => a.slug === slug) ?? null;
}

/** Новости / события */
export async function getNewsItems(): Promise<NewsItem[]> {
  if (await checkStrapi()) {
    const res = await fetchStrapi<Array<unknown>>("/news-items", {
      populate: "*",
      sort: ["date:desc"],
    });
    if (res?.data && Array.isArray(res.data)) {
      return res.data.map((d: any) => mapStrapiNewsItem(d));
    }
  }
  return newsItems;
}

/** Новость по slug */
export async function getNewsItemBySlug(
  slug: string,
): Promise<NewsItem | null> {
  if (await checkStrapi()) {
    const res = await fetchStrapi<Array<unknown>>("/news-items", {
      populate: "*",
      filters: { slug },
    });
    const data = res?.data;
    if (Array.isArray(data) && data.length > 0) {
      return mapStrapiNewsItem(data[0]);
    }
  }
  return newsItems.find((n) => n.slug === slug) ?? null;
}

/** Слайды героя */
export async function getHeroSlides(): Promise<
  Array<{
    id: string;
    title: string;
    subtitle?: string;
    image: string;
    cta?: string;
    ctaHref?: string;
  }>
> {
  if (await checkStrapi()) {
    const res = await fetchStrapi<Array<unknown>>("/hero-slides", {
      populate: "*",
      sort: ["order:asc"],
    });
    if (res?.data && Array.isArray(res.data)) {
      return res.data.map((d: any) => mapStrapiHeroSlide(d));
    }
  }
  return heroSlides;
}

/** Контакты */
export async function getContactInfo(): Promise<typeof contactInfo> {
  if (await checkStrapi()) {
    const res = await fetchStrapi<Record<string, unknown>>("/contact");
    const d = res?.data as Record<string, unknown> | undefined;
    if (d) {
      return {
        address: (d.address as string) || "",
        boxOffice: (d.boxOffice as string) || "",
        admin: (d.admin as string) || "",
        press: (d.press as string) || "",
        emailBoxOffice: (d.emailBoxOffice as string) || "",
        emailAdmin: (d.emailAdmin as string) || "",
        emailPress: (d.emailPress as string) || "",
        social: {
          vk: (d.socialVk as string) || "",
          telegram: (d.socialTelegram as string) || "",
          instagram: (d.socialInstagram as string) || "",
        },
        workingHours: {
          boxOffice: (d.workingHoursBoxOffice as string) || "",
          admin: (d.workingHoursAdmin as string) || "",
        },
        mapEmbed: (d.mapEmbed as string) || "",
        howToGetThere: (d.howToGetThere as string) || "",
      };
    }
  }
  return contactInfo;
}

/** Отзывы о театре */
export async function getTheaterReviews(): Promise<Review[]> {
  if (await checkStrapi()) {
    const res = await fetchStrapi<Array<unknown>>("/theater-reviews", {
      sort: ["order:asc"],
    });
    if (res?.data && Array.isArray(res.data)) {
      return res.data.map((d: any) => mapStrapiReview(d));
    }
  }
  return theaterReviews;
}

/** Фотогалерея театра */
export type GalleryImage = { src: string; alt: string };
export async function getTheaterGalleryImages(): Promise<GalleryImage[]> {
  if (await checkStrapi()) {
    const res = await fetchStrapi<Array<unknown>>("/theater-galleries", {
      populate: "image",
      sort: ["order:asc"],
    });
    if (res?.data && Array.isArray(res.data)) {
      return res.data.map((d: any) => ({
        src: d.image?.url ? getStrapiMediaUrl(d.image.url) : "",
        alt: d.alt || "Фото театра",
      })).filter((img) => img.src);
    }
  }
  return theaterGalleryImages;
}

export { GALLERY_PAGE_SIZE };

/** Премьеры — из спектаклей с isPremiere */
export async function getPremieres() {
  const perfs = await getPerformances();
  return perfs
    .filter((p) => p.isPremiere)
    .slice(0, 3)
    .map((p) => ({
      id: p.id,
      title: p.title,
      slug: p.slug,
      poster: p.poster,
      description: p.description,
      director: p.director,
      cast: p.cast?.map((c) => c.name) ?? [],
      date: p.date,
      time: p.time,
    }));
}

export { navLinks, navItems };
