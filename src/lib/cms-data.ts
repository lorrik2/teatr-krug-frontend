/**
 * Слой данных: Strapi CMS.
 * Использует Strapi, когда он доступен; иначе возвращает пустые данные.
 */

import { fetchStrapi, getStrapiMediaUrl } from "./strapi";
import { GALLERY_PAGE_SIZE } from "./theater-gallery";
import type {
  Performance,
  Actor,
  NewsItem,
  Review,
  ContactInfo,
} from "./types";

/** Пустая структура контактов — когда Strapi не вернул данные */
const EMPTY_CONTACT: ContactInfo = {
  address: "",
  boxOffice: "",
  admin: "",
  press: "",
  emailBoxOffice: "",
  emailAdmin: "",
  emailPress: "",
  social: { vk: "", telegram: "", instagram: "" },
  workingHours: { boxOffice: "", admin: "" },
  mapEmbed: "",
  howToGetThere: "",
  footerTagline: "",
  footerContactsTitle: "",
  footerCopyright: "",
};

export { EMPTY_CONTACT };
import { getPerformanceSlug, getActorSlug, getNewsSlug } from "./slug-utils";
import { MONTH_NAMES } from "./date-utils";

/** Безопасно извлекает URL из медиа-поля Strapi (поддержка data.attributes.url, data.url и прямого url) */
function getMediaUrl(field: unknown): string {
  if (!field || typeof field !== "object") return "";
  const f = field as Record<string, unknown>;
  if (typeof f.url === "string") return getStrapiMediaUrl(f.url);
  const attrs = f.attributes as Record<string, unknown> | undefined;
  if (attrs && typeof attrs === "object" && typeof attrs.url === "string")
    return getStrapiMediaUrl(attrs.url);
  const data = f.data as Record<string, unknown> | undefined;
  if (!data || typeof data !== "object") return "";
  if (data?.attributes && typeof data.attributes === "object") {
    const url = (data.attributes as Record<string, unknown>).url;
    if (typeof url === "string") return getStrapiMediaUrl(url);
  }
  if (typeof data.url === "string") return getStrapiMediaUrl(data.url);
  return "";
}

/** Парсит дату "28 марта" или "15 февраля 2025" в timestamp для сортировки. Без года — текущий год. */
function parseDisplayDate(dateStr: string): number {
  if (!dateStr || dateStr === "—") return Infinity;
  const match = dateStr.match(
    /(\d+)\s+(января|февраля|марта|апреля|мая|июня|июля|августа|сентября|октября|ноября|декабря)(?:\s+(\d{4}))?/,
  );
  if (!match) return Infinity;
  const [, day, monthName, year] = match;
  const month = MONTH_NAMES[monthName];
  if (!month) return Infinity;
  const yr = year ? Number(year) : new Date().getFullYear();
  const d = new Date(yr, month - 1, Number(day));
  return d.getTime();
}

/** Парсит время "19:00" в минуты от полуночи. */
function parseTime(timeStr: string): number {
  if (!timeStr) return 0;
  const m = timeStr.match(/^(\d{1,2}):(\d{2})/);
  if (!m) return 0;
  return parseInt(m[1], 10) * 60 + parseInt(m[2], 10);
}

/** Минимальная дата спектакля (из schedule или date) для сортировки. */
function getEarliestSortKey(p: Performance): { ts: number; timeMins: number } {
  const dates: { date: string; time: string }[] = p.schedule?.length
    ? p.schedule
    : p.date
      ? [{ date: p.date, time: p.time || "" }]
      : [];
  if (dates.length === 0) return { ts: Infinity, timeMins: 0 };
  let min = { ts: Infinity, timeMins: 0 };
  for (const { date, time } of dates) {
    const ts = parseDisplayDate(date);
    const timeMins = parseTime(time);
    if (ts < min.ts || (ts === min.ts && timeMins < min.timeMins)) {
      min = { ts, timeMins };
    }
  }
  return min;
}

/** Сортирует спектакли по хронологии: по ближайшей дате показа. Без даты — в конец. */
export function sortPerformancesChronologically(
  performances: Performance[],
): Performance[] {
  return [...performances].sort((a, b) => {
    const ka = getEarliestSortKey(a);
    const kb = getEarliestSortKey(b);
    if (ka.ts !== kb.ts) return ka.ts - kb.ts;
    return ka.timeMins - kb.timeMins;
  });
}

/** Безопасно маппит элемент галереи Strapi */
function mapGalleryItem(g: unknown): string {
  if (!g || typeof g !== "object") return "";
  const f = g as Record<string, unknown>;
  return getMediaUrl(f) || getStrapiMediaUrl(f.url as string) || "";
}

/** Извлекает массив медиа из поля Strapi (поддержка { data: [...] } и прямого массива) */
function extractMediaArray(raw: unknown): unknown[] {
  if (!raw) return [];
  if (Array.isArray(raw)) return raw;
  const obj = raw as Record<string, unknown>;
  const data = obj.data;
  if (Array.isArray(data)) return data;
  if (data && typeof data === "object" && !Array.isArray(data)) return [data];
  return [];
}

// Маппинг Strapi → наш формат (с защитой от неполных/битых данных)
function mapStrapiPerformance(d: any): Performance | null {
  try {
    if (!d || typeof d !== "object") return null;
    const attrs = d.attributes ?? d;
    const poster =
      getMediaUrl(attrs.poster ?? d.poster) || getMediaUrl(d.poster) || "";
    const galleryArr = extractMediaArray(attrs.gallery ?? d.gallery);
    const gallery =
      galleryArr.length > 0
        ? galleryArr.map(mapGalleryItem).filter(Boolean)
        : undefined;

    const heroSliderArr = extractMediaArray(attrs.heroSlider ?? d.heroSlider);
    const heroSlider =
      heroSliderArr.length > 0
        ? heroSliderArr.map(mapGalleryItem).filter(Boolean)
        : undefined;

    const rawSlug = attrs.slug ?? d.slug;
    const title = (attrs.title ?? d.title) || "";
    if (!title) return null;
    // Strapi может вернуть "performance" — подменяем на slug из title
    const slug = getPerformanceSlug({ title, slug: rawSlug });

    const castRaw = attrs.invitedCast ?? attrs.cast ?? d.invitedCast ?? d.cast;
    const cast = Array.isArray(castRaw)
      ? castRaw
          .filter((c: unknown) => c && typeof c === "object")
          .map((c: any) => {
            const photoUrl = getMediaUrl(c.photo) || getMediaUrl(c.photo?.data);
            return {
              name: typeof c.name === "string" ? c.name : "",
              role: typeof c.role === "string" ? c.role : "",
              photo:
                typeof photoUrl === "string" && photoUrl ? photoUrl : undefined,
            };
          })
          .filter((m: { name: string }) => m.name)
      : undefined;

    const reviewsRaw = attrs.reviews ?? d.reviews;
    const scheduleRaw = attrs.schedule ?? d.schedule;
    const awardsRaw = attrs.awards ?? d.awards;
    const festivalsRaw = attrs.festivals ?? d.festivals;

    return {
      id: d.documentId ?? attrs.documentId ?? String(d.id ?? ""),
      title,
      slug,
      poster,
      heroSlider: heroSlider?.length ? heroSlider : undefined,
      gallery: gallery?.length ? gallery : undefined,
      subtitle: attrs.subtitle ?? d.subtitle ?? undefined,
      author: attrs.author ?? d.author ?? undefined,
      director: attrs.director ?? d.director ?? undefined,
      directorQuote: attrs.directorQuote ?? d.directorQuote ?? undefined,
      designer: attrs.designer ?? d.designer ?? undefined,
      lightingDesigner:
        attrs.lightingDesigner ?? d.lightingDesigner ?? undefined,
      soundDesigner: attrs.soundDesigner ?? d.soundDesigner ?? undefined,
      lightSoundOperator:
        attrs.lightSoundOperator ?? d.lightSoundOperator ?? undefined,
      cast: cast?.length ? cast : undefined,
      reviews: Array.isArray(reviewsRaw)
        ? reviewsRaw
            .filter((r: unknown) => r && typeof r === "object")
            .map((r: any, i: number) => {
              const rAttrs = (r as any).attributes ?? r;
              return {
                id: `r${i}`,
                quote: rAttrs.quote ?? r.quote ?? "",
                author: rAttrs.author ?? r.author ?? "",
                vkUrl: rAttrs.vkUrl ?? r.vkUrl ?? undefined,
              };
            })
        : undefined,
      teaserUrl: attrs.teaserUrl ?? d.teaserUrl ?? undefined,
      date: (attrs.date ?? d.date) || "",
      time: (attrs.time ?? d.time) || "",
      ageRating: (attrs.ageRating ?? d.ageRating) || "",
      genre: (attrs.genre ?? d.genre) || "",
      description: (attrs.description ?? d.description) || "",
      duration: attrs.duration ?? d.duration ?? undefined,
      intermissions: attrs.intermissions ?? d.intermissions ?? undefined,
      isPremiere: attrs.isPremiere ?? d.isPremiere ?? false,
      inAfisha: (attrs.inAfisha ?? d.inAfisha) !== false,
      showScheduleAndTickets:
        (attrs.showScheduleAndTickets ?? d.showScheduleAndTickets) !== false,
      schedule: Array.isArray(scheduleRaw)
        ? scheduleRaw
            .filter((s: unknown) => s && typeof s === "object")
            .map((s: any) => {
              const sAttrs = (s as any).attributes ?? s;
              return {
                date: sAttrs.date ?? s.date ?? "",
                time: sAttrs.time ?? s.time ?? "",
                ticketsUrl:
                  (sAttrs.ticketsUrl ?? s.ticketsUrl)?.trim() || undefined,
              };
            })
        : undefined,
      awards: Array.isArray(awardsRaw)
        ? awardsRaw
            .filter((a: unknown) => a && typeof a === "object")
            .map((a: any) => {
              const aAttrs = (a as any).attributes ?? a;
              return {
                title: aAttrs.title ?? a.title ?? "",
                year: aAttrs.year ?? a.year ?? "",
              };
            })
        : undefined,
      festivals: Array.isArray(festivalsRaw)
        ? festivalsRaw
            .filter((f: unknown) => f && typeof f === "object")
            .map((f: any) => {
              const fAttrs = (f as any).attributes ?? f;
              const logoMedia = fAttrs.logo ?? f.logo;
              return {
                title: fAttrs.title ?? f.title ?? "",
                year: fAttrs.year ?? f.year ?? "",
                place: fAttrs.place ?? f.place ?? "",
                logo: logoMedia ? getMediaUrl(logoMedia) : undefined,
              };
            })
        : undefined,
      ticketsUrl: (attrs.ticketsUrl ?? d.ticketsUrl) || undefined,
      ticketButtonLabel:
        (attrs.ticketButtonLabel ?? d.ticketButtonLabel)?.trim() || undefined,
      featuredBlockImage:
        getMediaUrl(attrs.featuredBlockImage ?? d.featuredBlockImage) ||
        undefined,
      featuredBlockText:
        (attrs.featuredBlockText ?? d.featuredBlockText)?.trim() || undefined,
      featuredBlockGallery: (() => {
        const arr = extractMediaArray(
          attrs.featuredBlockGallery ?? d.featuredBlockGallery,
        );
        return arr.length > 0
          ? arr.map(mapGalleryItem).filter(Boolean)
          : undefined;
      })(),
    };
  } catch (err) {
    console.warn("mapStrapiPerformance error:", err);
    return null;
  }
}

function mapStrapiActor(d: any): Actor | null {
  try {
    if (!d || typeof d !== "object") return null;
    const attrs = d.attributes ?? d;
    const photo = getMediaUrl(attrs.photo ?? d.photo) || "";
    const galleryRaw = attrs.gallery ?? d.gallery;
    const gallery =
      galleryRaw && Array.isArray(galleryRaw)
        ? galleryRaw.map(mapGalleryItem).filter(Boolean)
        : undefined;

    const rolesRaw = attrs.roles ?? d.roles;
    const rolesList: Array<
      | { role: string; performanceSlug?: string; performanceTitle?: string }
      | string
    > = Array.isArray(rolesRaw)
      ? (rolesRaw
          .map((r: any) => {
            if (!r || typeof r !== "object") return null;
            const roleText = typeof r.text === "string" ? r.text : "";
            if (!roleText) return null;
            const perf = r.performance?.data ?? r.performance;
            const perfAttrs = perf?.attributes ?? perf;
            const perfSlug = perfAttrs?.slug ?? perf?.slug;
            const perfTitle = perfAttrs?.title ?? perf?.title;
            if (typeof perfSlug === "string" && perfSlug) {
              return {
                role: roleText,
                performanceSlug: perfSlug,
                performanceTitle:
                  typeof perfTitle === "string" ? perfTitle : undefined,
              };
            }
            return roleText;
          })
          .filter(Boolean) as Array<
          | {
              role: string;
              performanceSlug?: string;
              performanceTitle?: string;
            }
          | string
        >)
      : [];

    const rawSlug = attrs.slug ?? d.slug;
    const name =
      typeof (attrs.name ?? d.name) === "string" ? (attrs.name ?? d.name) : "";
    if (!name) return null;
    // Strapi может вернуть "actor" — подменяем на slug из name
    const slug = getActorSlug({ name, slug: rawSlug });

    return {
      id: d.documentId ?? attrs.documentId ?? String(d.id ?? ""),
      name,
      slug,
      photo,
      role: (attrs.role ?? d.role) || "",
      rank: attrs.rank ?? d.rank,
      bio: (attrs.bio ?? d.bio) || "",
      roles: rolesList,
      gallery: gallery?.length ? gallery : undefined,
    };
  } catch (err) {
    console.warn("mapStrapiActor error:", err);
    return null;
  }
}

function mapStrapiNewsItem(d: any): NewsItem {
  const attrs = d.attributes ?? d;
  const image = getMediaUrl(attrs.image ?? d.image) || "";
  const rawSlug = attrs.slug ?? d.slug;
  const slugStr =
    typeof rawSlug === "string"
      ? rawSlug
      : typeof rawSlug === "object" && rawSlug !== null
        ? (rawSlug.default ?? rawSlug.en ?? rawSlug.ru ?? "")
        : "";
  const title = (attrs.title ?? d.title) || "";
  const slug = getNewsSlug({ title, slug: slugStr });
  return {
    id: d.documentId ?? attrs.documentId ?? String(d.id ?? ""),
    slug,
    title,
    excerpt: (attrs.excerpt ?? d.excerpt) || "",
    content: (attrs.content ?? d.content) as string | undefined,
    image,
    date: (attrs.date ?? d.date) || "",
  };
}

function mapStrapiHeroSlide(d: any) {
  const attrs = d.attributes ?? d;
  const image = getMediaUrl(attrs.image ?? d.image) || "";
  return {
    id: d.documentId ?? attrs.documentId ?? String(d.id ?? ""),
    title: attrs.title ?? d.title ?? "",
    subtitle: attrs.subtitle ?? d.subtitle ?? "",
    image,
    cta: attrs.cta ?? d.cta ?? "",
    ctaHref: attrs.ctaHref ?? d.ctaHref ?? "",
    order: attrs.order ?? d.order ?? 0,
  };
}

function mapStrapiReview(d: any): Review {
  const attrs = d.attributes ?? d;
  return {
    id: d.documentId ?? attrs.documentId ?? String(d.id ?? ""),
    quote: attrs.quote ?? d.quote ?? "",
    author: attrs.author ?? d.author ?? "",
    vkUrl: attrs.vkUrl ?? d.vkUrl ?? undefined,
    yandexMapsUrl: attrs.yandexMapsUrl ?? d.yandexMapsUrl ?? undefined,
    twoGisUrl: attrs.twoGisUrl ?? d.twoGisUrl ?? undefined,
  };
}

/** Populate для спектаклей: все поля + invitedCast.photo для фото приглашённых */
const PERFORMANCE_POPULATE = {
  poster: true,
  heroSlider: true,
  gallery: true,
  featuredBlockImage: true,
  featuredBlockGallery: true,
  invitedCast: { populate: ["photo"] },
  reviews: true,
  schedule: true,
  awards: true,
  festivals: { populate: { logo: true } },
} as const;

/** Спектакли для афиши (inAfisha) */
export async function getPerformances(): Promise<Performance[]> {
  try {
    const res = await fetchStrapi<Array<unknown>>("/performances", {
      populate: PERFORMANCE_POPULATE,
      filters: { inAfisha: true },
      sort: ["date:asc"],
    });
    if (res?.data && Array.isArray(res.data)) {
      const mapped = res.data
        .map((d: any) => mapStrapiPerformance(d))
        .filter((p): p is Performance => p != null);
      if (mapped.length > 0) return sortPerformancesChronologically(mapped);
    }
  } catch (err) {
    console.warn("getPerformances error:", err);
  }
  return [];
}

/** Полный репертуар */
export async function getRepertoirePerformances(): Promise<Performance[]> {
  try {
    const res = await fetchStrapi<Array<unknown>>("/performances", {
      populate: PERFORMANCE_POPULATE,
    });
    if (res?.data && Array.isArray(res.data)) {
      const mapped = res.data
        .map((d: any) => mapStrapiPerformance(d))
        .filter((p): p is Performance => p != null);
      if (mapped.length > 0) return sortPerformancesChronologically(mapped);
    }
  } catch (err) {
    console.warn("getRepertoirePerformances error:", err);
  }
  return [];
}

/** Спектакль по slug */
export async function getPerformanceBySlug(
  slug: string,
): Promise<Performance | null> {
  try {
    const res = await fetchStrapi<Array<unknown>>("/performances", {
      populate: PERFORMANCE_POPULATE,
      sort: ["title:asc"],
    });
    const data = res?.data;
    if (Array.isArray(data)) {
      for (const d of data) {
        const play = mapStrapiPerformance(d);
        if (play && play.slug === slug) return play;
      }
    }
  } catch (err) {
    console.warn("getPerformanceBySlug error:", err);
  }
  return null;
}

/** Опции для запроса актёров */
const ACTORS_SORT = ["name:asc"];

/** Собирает всех актёров с пагинацией — обходит ограничение Strapi (по умолчанию 25, max ~100–250) */
async function fetchAllActors(
  populate: string | Record<string, unknown>,
): Promise<unknown[]> {
  const all: unknown[] = [];
  let page = 1;
  const pageSize = 100;
  for (;;) {
    const res = await fetchStrapi<Array<unknown>>("/actors", {
      populate,
      sort: ACTORS_SORT,
      pagination: { page, pageSize },
    });
    const data = res?.data;
    if (!Array.isArray(data)) break;
    all.push(...data);
    const total = res?.meta?.pagination?.total;
    const pageCount = res?.meta?.pagination?.pageCount ?? 1;
    if (page >= pageCount || data.length === 0) break;
    page++;
  }
  return all;
}

/** Актёры — фото (populate *) и роли (roles.performance), слияние. Загружает все страницы. */
export async function getActors(): Promise<Actor[]> {
  try {
    const [photosData, rolesData] = await Promise.all([
      fetchAllActors("*"),
      fetchAllActors("roles.performance"),
    ]);
    if (!Array.isArray(photosData) || photosData.length === 0) return [];
    const withPhotos = photosData
      .map((d: any) => mapStrapiActor(d))
      .filter((a): a is Actor => a != null);
    if (withPhotos.length === 0) return [];

    if (Array.isArray(rolesData) && rolesData.length > 0) {
      const byId = new Map<string, Actor>();
      for (const a of withPhotos) byId.set(a.id, a);
      for (const d of rolesData) {
        const withRoles = mapStrapiActor(d);
        if (withRoles) {
          const base = byId.get(withRoles.id);
          if (base && (withRoles.roles?.length ?? 0) > 0) {
            byId.set(base.id, { ...base, roles: withRoles.roles });
          }
        }
      }
      return Array.from(byId.values());
    }
    return withPhotos;
  } catch (err) {
    console.warn("getActors error:", err);
  }
  return [];
}

/** Актёр по slug — сначала фильтр по slug, иначе поиск во всех (fallback) */
export async function getActorBySlug(slug: string): Promise<Actor | null> {
  try {
    const [resPhotos, resRoles] = await Promise.all([
      fetchStrapi<Array<unknown>>("/actors", {
        populate: "*",
        filters: { slug },
        sort: ACTORS_SORT,
        pagination: { pageSize: 10 },
      }),
      fetchStrapi<Array<unknown>>("/actors", {
        populate: "roles.performance",
        filters: { slug },
        sort: ACTORS_SORT,
        pagination: { pageSize: 10 },
      }),
    ]);
    const photosArr = resPhotos?.data;
    const rolesArr = resRoles?.data;
    if (Array.isArray(photosArr) && photosArr.length > 0) {
      const withPhotos = mapStrapiActor(photosArr[0] as any);
      if (withPhotos && (withPhotos.slug === slug || photosArr.length === 1)) {
        if (Array.isArray(rolesArr) && rolesArr.length > 0) {
          const withRoles = mapStrapiActor(rolesArr[0] as any);
          if (withRoles?.roles?.length)
            return { ...withPhotos, roles: withRoles.roles };
        }
        return withPhotos;
      }
    }
    const all = await getActors();
    const found = all.find((a) => a.slug === slug);
    return found ?? null;
  } catch (err) {
    console.warn("getActorBySlug error:", err);
  }
  return null;
}

/** Новости / события */
export async function getNewsItems(): Promise<NewsItem[]> {
  try {
    const res = await fetchStrapi<Array<unknown>>("/news-items", {
      populate: "*",
      sort: ["date:desc"],
    });
    if (res?.data && Array.isArray(res.data)) {
      return res.data.map((d: any) => mapStrapiNewsItem(d));
    }
  } catch (err) {
    console.warn("getNewsItems error:", err);
  }
  return [];
}

/** Новость по slug */
export async function getNewsItemBySlug(
  slug: string,
): Promise<NewsItem | null> {
  try {
    const res = await fetchStrapi<Array<unknown>>("/news-items", {
      populate: "*",
      sort: ["date:desc"],
    });
    const data = res?.data;
    if (Array.isArray(data)) {
      for (const d of data) {
        const item = mapStrapiNewsItem(d);
        if (item.slug === slug) return item;
      }
    }
  } catch (err) {
    console.warn("getNewsItemBySlug error:", err);
  }
  return null;
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
  try {
    const res = await fetchStrapi<Array<unknown>>("/hero-slides", {
      populate: "*",
      sort: ["order:asc"],
    });
    if (res?.data && Array.isArray(res.data)) {
      return res.data.map((d: any) => mapStrapiHeroSlide(d));
    }
  } catch (err) {
    console.warn("getHeroSlides error:", err);
  }
  return [];
}

/** Контакты */
export async function getContactInfo(): Promise<ContactInfo> {
  try {
    const res = await fetchStrapi<Record<string, unknown>>("/contact", {
      populate: "*",
    });
    const d = res?.data as Record<string, unknown> | undefined;
    if (d) {
      const attrs = (d.attributes as Record<string, unknown>) ?? d;
      return {
        address: (attrs.address as string) || "",
        boxOffice: (attrs.boxOffice as string) || "",
        admin: (attrs.admin as string) || "",
        press: (attrs.press as string) || "",
        emailBoxOffice: (attrs.emailBoxOffice as string) || "",
        emailAdmin: (attrs.emailAdmin as string) || "",
        emailPress: (attrs.emailPress as string) || "",
        social: {
          vk: (attrs.socialVk as string) || "",
          telegram: (attrs.socialTelegram as string) || "",
          instagram: (attrs.socialInstagram as string) || "",
        },
        workingHours: {
          boxOffice: (attrs.workingHoursBoxOffice as string) || "",
          admin: (attrs.workingHoursAdmin as string) || "",
        },
        mapEmbed: (attrs.mapEmbed as string) || "",
        howToGetThere: (attrs.howToGetThere as string) || "",
        footerTagline: (attrs.footerTagline as string)?.trim() || "",
        footerContactsTitle:
          (attrs.footerContactsTitle as string)?.trim() || "",
        footerCopyright: (attrs.footerCopyright as string)?.trim() || "",
      };
    }
  } catch (err) {
    console.warn("getContactInfo error:", err);
  }
  return EMPTY_CONTACT;
}

/** Отзывы о театре */
export async function getTheaterReviews(): Promise<Review[]> {
  try {
    const res = await fetchStrapi<Array<unknown>>("/theater-reviews", {
      populate: "*",
      sort: ["order:asc"],
    });
    if (res?.data && Array.isArray(res.data)) {
      return res.data.map((d: any) => mapStrapiReview(d));
    }
  } catch (err) {
    console.warn("getTheaterReviews error:", err);
  }
  return [];
}

/** Фотогалерея театра */
export type GalleryImage = { src: string; alt: string };
export async function getTheaterGalleryImages(): Promise<GalleryImage[]> {
  try {
    const res = await fetchStrapi<Array<unknown>>("/theater-galleries", {
      populate: "image",
      sort: ["order:asc"],
    });
    if (res?.data && Array.isArray(res.data)) {
      return res.data
        .map((d: any) => {
          const attrs = d.attributes ?? d;
          const src = getMediaUrl(attrs.image ?? d.image) || "";
          const alt = (attrs.alt ?? d.alt) || "Фото театра";
          return { src, alt };
        })
        .filter((img) => img.src);
    }
  } catch (err) {
    console.warn("getTheaterGalleryImages error:", err);
  }
  return [];
}

export { GALLERY_PAGE_SIZE };

/** Маппит медиа в { src, alt } для галерей */
function mapGalleryImages(
  field: unknown,
  defaultAlt = "Фото",
): { src: string; alt: string }[] {
  if (!field) return [];
  const arr = Array.isArray(field) ? field : [field];
  return arr
    .map((item: unknown) => {
      const src = getMediaUrl(item);
      if (!src) return null;
      const alt =
        item &&
        typeof item === "object" &&
        item !== null &&
        "alternativeText" in item
          ? String((item as Record<string, unknown>).alternativeText)
          : defaultAlt;
      return { src, alt: alt || defaultAlt };
    })
    .filter((x): x is { src: string; alt: string } => x !== null);
}

/** Театр ТЕОС */
export interface TeatrTeosPageData {
  title: string;
  lead: string;
  aboutText: string;
  /** Логотип театра (справа от текста в блоке «О театре») */
  logo: { src: string; alt: string } | null;
  /** Фотогалерея (плитка как в спектаклях) */
  galleryImages: { src: string; alt: string }[];
  address: string;
  /** Как добраться (транспорт, ориентиры) */
  howToGetThere: string;
  phone: string;
  socialVk: string;
  socialTelegram: string;
  /** Текст блока о спектаклях и билетах у партнёра */
  partnerBlockText: string;
  /** Ссылка на сайт партнёра */
  partnerBlockLink: string;
  /** Текст кнопки */
  partnerBlockButtonLabel: string;
}

/** Аренда зала */
export interface ArendaZalaPageData {
  title: string;
  lead: string;
  conditionsText: string;
  galleryImages: { src: string; alt: string }[];
  howToBookText: string;
}

/** Помочь театру */
export interface PomochTeatruPageData {
  title: string;
  lead: string;
  introText: string;
  requisitesText: string;
  qrCodeImageUrl: string;
}

/** О театре */
export interface OTeatrePageData {
  title: string;
  lead: string;
  historyText: string;
  missionText: string;
  galleryImages: { src: string; alt: string }[];
  /** Настройки блока на главной */
  showOnMainPage: boolean;
  mainPageTitle: string;
  mainPageShowLead: boolean;
  mainPageShowMission: boolean;
}

/** Страница «Доступная среда» (ФЗ № 181-ФЗ) */
export interface DostupnayaSredaPageData {
  title: string;
  lead: string;
  metaTitle: string;
  metaDescription: string;
  textBlocks: { title: string; descriptions: string }[];
  /** Если true — после текста блока контактов показывается ссылка на /kontakty */
  showContactsLink: boolean;
}

/** Театр ТЕОС */
export async function getTeatrTeosPageData(): Promise<TeatrTeosPageData> {
  const defaults: TeatrTeosPageData = {
    title: "Ещё один театр Маргариты Вафиной",
    lead: "Театральный проект Маргариты Вафиной",
    aboutText:
      "Здесь будет текст о театре Маргариты Вафиной. Добавьте описание проекта, миссию, историю и ключевую информацию.",
    logo: null,
    galleryImages: [],
    address: "Укажите адрес театра",
    howToGetThere: "",
    phone: "+7 921 64 59 200",
    socialVk: "https://vk.com",
    socialTelegram: "https://t.me",
    partnerBlockText:
      "Спектакли и билеты на спектакли театра ТЕОС можно посмотреть и приобрести на сайте партнёра.",
    partnerBlockLink: "",
    partnerBlockButtonLabel: "Перейти на сайт партнёра",
  };
  try {
    const res = await fetchStrapi<Record<string, unknown>>("/teatr-teos", {
      populate: "*",
    });
    const d = (res as { data?: Record<string, unknown> } | null)?.data;
    if (d) {
      const attrs = (d.attributes ?? d) as Record<string, unknown>;
      const logoRaw = attrs.logo;
      const logoArr = logoRaw
        ? mapGalleryImages(
            (logoRaw as { data?: unknown })?.data ?? logoRaw,
            "Логотип театра Теос",
          )
        : [];
      const logo = logoArr[0] ?? null;
      const galleryArr = extractMediaArray(attrs.gallery ?? d.gallery);
      const galleryImages =
        galleryArr.length > 0
          ? mapGalleryImages(galleryArr, "Театр Теос")
          : defaults.galleryImages;
      return {
        title: (attrs.title as string) || defaults.title,
        lead: (attrs.lead as string) || defaults.lead,
        aboutText: (attrs.aboutText as string) || defaults.aboutText,
        logo,
        galleryImages,
        address: (attrs.address as string) || defaults.address,
        howToGetThere:
          (attrs.howToGetThere as string) ?? defaults.howToGetThere,
        phone: (attrs.phone as string) || defaults.phone,
        socialVk: (attrs.socialVk as string) || defaults.socialVk,
        socialTelegram:
          (attrs.socialTelegram as string) || defaults.socialTelegram,
        partnerBlockText:
          (attrs.partnerBlockText as string) || defaults.partnerBlockText,
        partnerBlockLink:
          (attrs.partnerBlockLink as string) || defaults.partnerBlockLink,
        partnerBlockButtonLabel:
          (attrs.partnerBlockButtonLabel as string) ||
          defaults.partnerBlockButtonLabel,
      };
    }
  } catch (err) {
    console.warn("getTeatrTeosPageData error:", err);
  }
  return defaults;
}

/** Аренда зала */
export async function getArendaZalaPageData(): Promise<ArendaZalaPageData> {
  const defaults: ArendaZalaPageData = {
    title: "Аренда зала",
    lead: "Зрительный зал и помещения театра для ваших мероприятий",
    conditionsText: `Драматический театр «Круг» предлагает в аренду зрительный зал и сопутствующие помещения для проведения спектаклей, концертов, презентаций, корпоративных мероприятий и творческих проектов.

Зал рассчитан на 120 зрителей. В наличии профессиональное сценическое оборудование, световая и звуковая аппаратура. Фойе подходит для фуршетов и выставок.`,
    galleryImages: [],
    howToBookText:
      "По вопросам аренды обращайтесь в администрацию театра по телефону или электронной почте. Указаны на странице Контакты (ссылка добавляется автоматически на сайте).",
  };
  try {
    const res = await fetchStrapi<Record<string, unknown>>("/arenda-zala", {
      populate: "*",
    });
    const d = (res as { data?: Record<string, unknown> } | null)?.data;
    if (d) {
      const attrs = (d.attributes ?? d) as Record<string, unknown>;
      const galleryRaw = attrs.gallery;
      const galleryArr = Array.isArray(galleryRaw)
        ? galleryRaw
        : ((galleryRaw as { data?: unknown })?.data ?? []);
      return {
        title: (attrs.title as string) || defaults.title,
        lead: (attrs.lead as string) || defaults.lead,
        conditionsText:
          (attrs.conditionsText as string) || defaults.conditionsText,
        galleryImages:
          mapGalleryImages(galleryArr, "Фото").length > 0
            ? mapGalleryImages(galleryArr, "Фото")
            : defaults.galleryImages,
        howToBookText:
          (attrs.howToBookText as string) || defaults.howToBookText,
      };
    }
  } catch (err) {
    console.warn("getArendaZalaPageData error:", err);
  }
  return defaults;
}

/** Помочь театру */
export async function getPomochTeatruPageData(): Promise<PomochTeatruPageData> {
  const defaults: PomochTeatruPageData = {
    title: "Помочь театру",
    lead: "Ваша поддержка помогает нам создавать новые спектакли",
    introText: "",
    requisitesText: "",
    qrCodeImageUrl: "",
  };
  try {
    const res = await fetchStrapi<Record<string, unknown>>("/pomoch-teatru", {
      populate: "*",
    });
    const d = (res as { data?: Record<string, unknown> } | null)?.data;
    if (d) {
      const attrs = (d.attributes ?? d) as Record<string, unknown>;
      const qrRaw = attrs.qrCodeImage;
      const qrMedia = (qrRaw as { data?: unknown })?.data ?? qrRaw;
      const qrUrl = qrMedia ? getMediaUrl(qrMedia) : "";
      return {
        title: (attrs.title as string) || defaults.title,
        lead: (attrs.lead as string) || defaults.lead,
        introText: (attrs.introText as string) || defaults.introText,
        requisitesText:
          (attrs.requisitesText as string) || defaults.requisitesText,
        qrCodeImageUrl: qrUrl || defaults.qrCodeImageUrl,
      };
    }
  } catch (err) {
    console.warn("getPomochTeatruPageData error:", err);
  }
  return defaults;
}

/** О театре */
export async function getOTeatrePageData(): Promise<OTeatrePageData> {
  const defaults: OTeatrePageData = {
    title: "",
    lead: "",
    historyText: "",
    missionText: "",
    galleryImages: [],
    showOnMainPage: false,
    mainPageTitle: "",
    mainPageShowLead: true,
    mainPageShowMission: false,
  };
  try {
    const res = await fetchStrapi<Record<string, unknown>>("/o-teatre", {
      populate: "*",
    });
    const d = (res as { data?: Record<string, unknown> } | null)?.data;
    if (d) {
      const attrs = (d.attributes ?? d) as Record<string, unknown>;
      const galleryRaw = attrs.gallery;
      const galleryArr = Array.isArray(galleryRaw)
        ? galleryRaw
        : ((galleryRaw as { data?: unknown })?.data ?? []);
      return {
        title: (attrs.title as string) || defaults.title,
        lead: typeof attrs.lead === "string" ? attrs.lead : "",
        historyText:
          typeof attrs.historyText === "string" ? attrs.historyText : "",
        missionText:
          typeof attrs.missionText === "string" ? attrs.missionText : "",
        galleryImages:
          mapGalleryImages(galleryArr, "Фото").length > 0
            ? mapGalleryImages(galleryArr, "Фото")
            : defaults.galleryImages,
        // showOnMainPage: по умолчанию true, если есть контент (lead или галерея)
        showOnMainPage:
          attrs.showOnMainPage === true ||
          (attrs.showOnMainPage == null &&
            (!!(typeof attrs.lead === "string" && attrs.lead.trim()) ||
              mapGalleryImages(galleryArr, "Фото").length > 0)),
        mainPageTitle:
          typeof attrs.mainPageTitle === "string" ? attrs.mainPageTitle : "",
        mainPageShowLead: attrs.mainPageShowLead !== false,
        mainPageShowMission: attrs.mainPageShowMission === true,
      };
    }
  } catch (err) {
    console.warn("getOTeatrePageData error:", err);
  }
  return defaults;
}

const DEFAULT_DOSTUPNAYA_SREDA = {
  title: "Доступная среда",
  lead: "Сведения для зрителей с ограниченными возможностями здоровья и лиц, сопровождающих их",
  metaTitle: "Доступная среда",
  textBlocks: [],
  metaDescription:
    "Информация о посещении театра лицами с ограниченными возможностями здоровья: доступ в здание, услуги, помощь персонала, контакты для согласования.",

  showContactsLink: true,
};

/** Доступная среда */
export async function getDostupnayaSredaPageData(): Promise<DostupnayaSredaPageData> {
  const defaults = DEFAULT_DOSTUPNAYA_SREDA;
  try {
    const res = await fetchStrapi<Record<string, unknown>>(
      "/dostupnaya-sreda",
      {
        populate: "*",
      },
    );
    const d = (res as { data?: Record<string, unknown> } | null)?.data;
    if (d) {
      const attrs = (d.attributes ?? d) as Record<string, unknown>;
      const str = (k: string) =>
        typeof attrs[k] === "string" ? (attrs[k] as string) : "";
      return {
        title: str("title").trim(),
        lead: str("lead").trim(),
        metaTitle: str("metaTitle").trim(),
        metaDescription: str("metaDescription").trim(),
        textBlocks: [
          {
            title: str("generalHeading").trim(),
            descriptions: str("generalText").trim(),
          },
          {
            title: str("buildingHeading").trim(),
            descriptions: str("buildingText").trim(),
          },
          {
            title: str("servicesHeading").trim(),
            descriptions: str("servicesHeading").trim(),
          },
          {
            title: str("staffHeading").trim(),
            descriptions: str("staffText").trim(),
          },
          {
            title: str("contactHeading").trim(),
            descriptions: str("contactText").trim(),
          },
        ],
        showContactsLink: attrs.showContactsLink !== false,
      };
    }
  } catch (err) {
    console.warn("getDostupnayaSredaPageData error:", err);
  }
  return { ...defaults };
}
