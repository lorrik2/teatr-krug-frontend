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
import { theaterGalleryImages, GALLERY_PAGE_SIZE } from "./theater-gallery";
import type { Performance, Actor, NewsItem, Review } from "./mock-data";
import { getPerformanceSlug, getActorSlug, getNewsSlug } from "./slug-utils";

/** Безопасно извлекает URL из медиа-поля Strapi (поддержка data.attributes.url и прямого url) */
function getMediaUrl(field: unknown): string {
  if (!field || typeof field !== "object") return "";
  const f = field as Record<string, unknown>;
  if (typeof f.url === "string") return getStrapiMediaUrl(f.url);
  const data = f.data as Record<string, unknown> | undefined;
  if (data?.attributes && typeof data.attributes === "object") {
    const url = (data.attributes as Record<string, unknown>).url;
    if (typeof url === "string") return getStrapiMediaUrl(url);
  }
  if (data?.url && typeof data.url === "string")
    return getStrapiMediaUrl(data.url);
  return "";
}

/** Безопасно маппит элемент галереи Strapi */
function mapGalleryItem(g: unknown): string {
  if (!g || typeof g !== "object") return "";
  const f = g as Record<string, unknown>;
  return getMediaUrl(f) || getStrapiMediaUrl(f.url as string) || "";
}

// Маппинг Strapi → наш формат (с защитой от неполных/битых данных)
function mapStrapiPerformance(d: any): Performance | null {
  try {
    if (!d || typeof d !== "object") return null;
    const attrs = d.attributes ?? d;
    const poster =
      getMediaUrl(attrs.poster ?? d.poster) || getMediaUrl(d.poster) || "";
    const galleryRaw = attrs.gallery ?? d.gallery;
    const gallery =
      galleryRaw && Array.isArray(galleryRaw)
        ? galleryRaw.map(mapGalleryItem).filter(Boolean)
        : undefined;

    const rawSlug = attrs.slug ?? d.slug;
    const title = (attrs.title ?? d.title) || "";
    if (!title) return null;
    // Strapi может вернуть "performance" — подменяем на slug из title
    const slug = getPerformanceSlug({ title, slug: rawSlug });

    const castRaw = attrs.cast ?? d.cast;
    const cast = Array.isArray(castRaw)
      ? castRaw
          .filter((c: unknown) => c && typeof c === "object")
          .map((c: any) => {
            const actorSlug =
              c.actor?.slug ?? c.actor?.data?.attributes?.slug ?? c.actorSlug;
            return {
              name: typeof c.name === "string" ? c.name : "",
              role: typeof c.role === "string" ? c.role : "",
              actorSlug: typeof actorSlug === "string" ? actorSlug : "",
            };
          })
          .filter((m: { name: string }) => m.name)
      : undefined;

    return {
      id: d.documentId ?? attrs.documentId ?? String(d.id ?? ""),
      title,
      slug,
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
      cast: cast?.length ? cast : undefined,
      reviews: Array.isArray(d.reviews)
        ? d.reviews
            .filter((r: unknown) => r && typeof r === "object")
            .map((r: any, i: number) => ({
              id: `r${i}`,
              quote: r.quote ?? "",
              author: r.author ?? "",
              vkUrl: r.vkUrl,
            }))
        : undefined,
      teaserUrl: d.teaserUrl,
      date: d.date || "",
      time: d.time || "",
      ageRating: d.ageRating || "",
      genre: d.genre || "",
      description: d.description || "",
      duration: d.duration,
      intermissions: d.intermissions,
      isPremiere: d.isPremiere ?? false,
      inAfisha: d.inAfisha !== false,
      schedule: Array.isArray(d.schedule)
        ? d.schedule
            .filter((s: unknown) => s && typeof s === "object")
            .map((s: any) => ({ date: s.date ?? "", time: s.time ?? "" }))
        : undefined,
      awards: Array.isArray(d.awards)
        ? d.awards
            .filter((a: unknown) => a && typeof a === "object")
            .map((a: any) => ({ title: a.title ?? "", year: a.year ?? "" }))
        : undefined,
      festivals: Array.isArray(d.festivals)
        ? d.festivals
            .filter((f: unknown) => f && typeof f === "object")
            .map((f: any) => ({
              title: f.title ?? "",
              year: f.year ?? "",
              place: f.place ?? "",
            }))
        : undefined,
      ticketsUrl: d.ticketsUrl || undefined,
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
  const image = d.image?.url ? getStrapiMediaUrl(d.image.url) : "";
  const rawSlug = d.attributes?.slug ?? d.slug;
  const slugStr =
    typeof rawSlug === "string"
      ? rawSlug
      : typeof rawSlug === "object" && rawSlug !== null
        ? (rawSlug.default ?? rawSlug.en ?? rawSlug.ru ?? "")
        : "";
  const title = d.title || "";
  const slug = getNewsSlug({ title, slug: slugStr });
  return {
    id: d.documentId || String(d.id),
    slug,
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
  try {
    if (await checkStrapi()) {
      const res = await fetchStrapi<Array<unknown>>("/performances", {
        populate: "*",
        filters: { inAfisha: true },
        sort: ["date:asc"],
      });
      if (res?.data && Array.isArray(res.data)) {
        const mapped = res.data
          .map((d: any) => mapStrapiPerformance(d))
          .filter((p): p is Performance => p != null);
        if (mapped.length > 0) return mapped;
      }
    }
  } catch (err) {
    console.warn("getPerformances error:", err);
  }
  return performances;
}

/** Полный репертуар */
export async function getRepertoirePerformances(): Promise<Performance[]> {
  try {
    if (await checkStrapi()) {
      const res = await fetchStrapi<Array<unknown>>("/performances", {
        populate: "*",
        sort: ["title:asc"],
      });
      if (res?.data && Array.isArray(res.data)) {
        const mapped = res.data
          .map((d: any) => mapStrapiPerformance(d))
          .filter((p): p is Performance => p != null);
        if (mapped.length > 0) return mapped;
      }
    }
  } catch (err) {
    console.warn("getRepertoirePerformances error:", err);
  }
  return repertoirePerformances;
}

/** Спектакль по slug */
export async function getPerformanceBySlug(
  slug: string,
): Promise<Performance | null> {
  try {
    if (await checkStrapi()) {
      // Strapi может возвращать slug="performance" — ищем по всему репертуару
      const res = await fetchStrapi<Array<unknown>>("/performances", {
        populate: "*",
        sort: ["title:asc"],
      });
      const data = res?.data;
      if (Array.isArray(data)) {
        for (const d of data) {
          const play = mapStrapiPerformance(d);
          if (play && play.slug === slug) return play;
        }
      }
    }
  } catch (err) {
    console.warn("getPerformanceBySlug error:", err);
  }
  return repertoirePerformances.find((p) => p.slug === slug) ?? null;
}

/** Актёры */
export async function getActors(): Promise<Actor[]> {
  try {
    if (await checkStrapi()) {
      const res = await fetchStrapi<Array<unknown>>("/actors", {
        populate: "roles.performance",
        sort: ["name:asc"],
        pagination: { pageSize: 100 },
      });
      if (res?.data && Array.isArray(res.data)) {
        const mapped = res.data
          .map((d: any) => mapStrapiActor(d))
          .filter((a): a is Actor => a != null);
        if (mapped.length > 0) return mapped;
      }
    }
  } catch (err) {
    console.warn("getActors error:", err);
  }
  return actors;
}

/** Актёр по slug */
export async function getActorBySlug(slug: string): Promise<Actor | null> {
  try {
    if (await checkStrapi()) {
      const res = await fetchStrapi<Array<unknown>>("/actors", {
        populate: "roles.performance",
        sort: ["name:asc"],
        pagination: { pageSize: 100 },
      });
      const data = res?.data;
      if (Array.isArray(data)) {
        for (const d of data) {
          const actor = mapStrapiActor(d);
          if (actor && actor.slug === slug) return actor;
        }
      }
    }
  } catch (err) {
    console.warn("getActorBySlug error:", err);
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
  try {
    if (await checkStrapi()) {
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
    }
  } catch (err) {
    console.warn("getNewsItemBySlug error:", err);
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
      return res.data
        .map((d: any) => ({
          src: d.image?.url ? getStrapiMediaUrl(d.image.url) : "",
          alt: d.alt || "Фото театра",
        }))
        .filter((img) => img.src);
    }
  }
  return theaterGalleryImages;
}

export { GALLERY_PAGE_SIZE };

/** Маппит медиа в { src, alt } для галерей */
function mapGalleryImages(field: unknown, defaultAlt = "Фото"): { src: string; alt: string }[] {
  if (!field) return [];
  const arr = Array.isArray(field) ? field : [field];
  return arr
    .map((item: unknown) => {
      const src = getMediaUrl(item);
      if (!src) return null;
      const alt =
        item && typeof item === "object" && item !== null && "alternativeText" in item
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
  sliderImages: { src: string; alt: string }[];
  galleryImages: { src: string; alt: string }[];
  address: string;
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
  requisitesText: string;
  qrCodeImageUrl: string;
}

/** Партнёр */
export interface PartnerItem {
  name: string;
  logoUrl: string;
  url: string;
}

/** Партнёры и спонсоры */
export interface PartnersPageData {
  title: string;
  introText: string;
  partners: PartnerItem[];
}

/** О театре */
export interface OTeatrePageData {
  title: string;
  lead: string;
  historyText: string;
  missionText: string;
  galleryImages: { src: string; alt: string }[];
}

/** Театр ТЕОС */
export async function getTeatrTeosPageData(): Promise<TeatrTeosPageData> {
  const defaults: TeatrTeosPageData = {
    title: "Ещё один театр Маргариты Вафиной",
    lead: "Театральный проект Маргариты Вафиной",
    aboutText:
      "Здесь будет текст о театре Маргариты Вафиной. Добавьте описание проекта, миссию, историю и ключевую информацию.",
    sliderImages: [
      { src: "/fon/4.jpg", alt: "Ещё один театр Маргариты Вафиной" },
      { src: "/fon/6.jpg", alt: "Зрительный зал" },
      { src: "/fon/7.jpg", alt: "Сцена" },
    ],
    galleryImages: [
      { src: "/fon/8.jpg", alt: "Фасад" },
      { src: "/fon/12.jpg", alt: "Зал" },
      { src: "/fon/13.jpg", alt: "Фойе" },
      { src: "/fon/22.jpg", alt: "Интерьер" },
    ],
    address: "Укажите адрес театра",
    phone: "+7 921 64 59 200",
    socialVk: "https://vk.com",
    socialTelegram: "https://t.me",
    partnerBlockText:
      "Спектакли и билеты на спектакли театра ТЕОС можно посмотреть и приобрести на сайте партнёра.",
    partnerBlockLink: "",
    partnerBlockButtonLabel: "Перейти на сайт партнёра",
  };
  if (await checkStrapi()) {
    const res = await fetchStrapi<Record<string, unknown>>("/teatr-teos", {
      populate: "*",
    });
    const d = (res as { data?: Record<string, unknown> } | null)?.data;
    if (d) {
      const attrs = (d.attributes ?? d) as Record<string, unknown>;
      const sliderRaw = attrs.sliderImages;
      const sliderArr = Array.isArray(sliderRaw)
        ? sliderRaw
        : (sliderRaw as { data?: unknown })?.data ?? [];
      const galleryRaw = attrs.galleryImages;
      const galleryArr = Array.isArray(galleryRaw)
        ? galleryRaw
        : (galleryRaw as { data?: unknown })?.data ?? [];
      return {
        title: (attrs.title as string) || defaults.title,
        lead: (attrs.lead as string) || defaults.lead,
        aboutText: (attrs.aboutText as string) || defaults.aboutText,
        sliderImages:
          mapGalleryImages(sliderArr, "Слайд").length > 0
            ? mapGalleryImages(sliderArr, "Слайд")
            : defaults.sliderImages,
        galleryImages:
          mapGalleryImages(galleryArr, "Фото").length > 0
            ? mapGalleryImages(galleryArr, "Фото")
            : defaults.galleryImages,
        address: (attrs.address as string) || defaults.address,
        phone: (attrs.phone as string) || defaults.phone,
        socialVk: (attrs.socialVk as string) || defaults.socialVk,
        socialTelegram: (attrs.socialTelegram as string) || defaults.socialTelegram,
        partnerBlockText: (attrs.partnerBlockText as string) || defaults.partnerBlockText,
        partnerBlockLink: (attrs.partnerBlockLink as string) || defaults.partnerBlockLink,
        partnerBlockButtonLabel: (attrs.partnerBlockButtonLabel as string) || defaults.partnerBlockButtonLabel,
      };
    }
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
    galleryImages: [
      { src: "/fon/8.jpg", alt: "Фасад театра" },
      { src: "/fon/12.jpg", alt: "Зрительный зал" },
      { src: "/fon/13.jpg", alt: "Фойе" },
      { src: "/fon/22.jpg", alt: "Гримёрки" },
      { src: "/fon/6.jpg", alt: "Зал" },
      { src: "/fon/7.jpg", alt: "Закулисье" },
    ],
    howToBookText:
      "По вопросам аренды обращайтесь в администрацию театра по телефону или электронной почте. Указаны на странице Контакты (ссылка добавляется автоматически на сайте).",
  };
  if (await checkStrapi()) {
    const res = await fetchStrapi<Record<string, unknown>>("/arenda-zala", {
      populate: "*",
    });
    const d = (res as { data?: Record<string, unknown> } | null)?.data;
    if (d) {
      const attrs = (d.attributes ?? d) as Record<string, unknown>;
      const galleryRaw = attrs.gallery;
      const galleryArr = Array.isArray(galleryRaw)
        ? galleryRaw
        : (galleryRaw as { data?: unknown })?.data ?? [];
      return {
        title: (attrs.title as string) || defaults.title,
        lead: (attrs.lead as string) || defaults.lead,
        conditionsText: (attrs.conditionsText as string) || defaults.conditionsText,
        galleryImages:
          mapGalleryImages(galleryArr, "Фото").length > 0
            ? mapGalleryImages(galleryArr, "Фото")
            : defaults.galleryImages,
        howToBookText: (attrs.howToBookText as string) || defaults.howToBookText,
      };
    }
  }
  return defaults;
}

/** Помочь театру */
export async function getPomochTeatruPageData(): Promise<PomochTeatruPageData> {
  const defaults: PomochTeatruPageData = {
    title: "Помочь театру",
    lead: "Ваша поддержка помогает нам создавать новые спектакли",
    requisitesText: "",
    qrCodeImageUrl: "",
  };
  if (await checkStrapi()) {
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
        requisitesText: (attrs.requisitesText as string) || defaults.requisitesText,
        qrCodeImageUrl: qrUrl || defaults.qrCodeImageUrl,
      };
    }
  }
  return defaults;
}

/** Партнёры и спонсоры */
export async function getPartnersPageData(): Promise<PartnersPageData> {
  const defaults: PartnersPageData = {
    title: "Партнёры и спонсоры",
    introText:
      "Раздел в разработке. Здесь будут размещены логотипы и ссылки на партнёров и спонсоров театра.",
    partners: [],
  };
  if (await checkStrapi()) {
    const res = await fetchStrapi<Record<string, unknown>>("/partners", {
      populate: "*",
    });
    const d = (res as { data?: Record<string, unknown> } | null)?.data;
    if (d) {
      const attrs = (d.attributes ?? d) as Record<string, unknown>;
      const partnersRaw = (attrs.partners ?? []) as Record<string, unknown>[];
      const partnersArr = Array.isArray(partnersRaw) ? partnersRaw : [];
      const partners: PartnerItem[] = partnersArr
        .map((p: Record<string, unknown>) => {
          const logoRaw = p.logo;
          const logo = (logoRaw as { data?: unknown })?.data ?? logoRaw;
          return {
            name: (p.name as string) || "",
            logoUrl: logo ? getMediaUrl(logo) : "",
            url: (p.url as string) || "",
          };
        })
        .filter((p) => p.name);
      return {
        title: (attrs.title as string) || defaults.title,
        introText: (attrs.introText as string) || defaults.introText,
        partners: partners.length > 0 ? partners : defaults.partners,
      };
    }
  }
  return defaults;
}

/** О театре */
export async function getOTeatrePageData(): Promise<OTeatrePageData> {
  const defaults: OTeatrePageData = {
    title: "О театре",
    lead: "История, миссия, атмосфера и люди",
    historyText: `Драматический театр «Круг» основан в 2010 году. Здание — бывший особняк XIX века в центре города — было передано под театр и реконструировано с сохранением исторического облика. Сцена рассчитана на камерные постановки: до 120 зрителей, что создаёт особый контакт между залом и сценой.

За годы существования театр сформировал постоянную труппу, открыл малую сцену для экспериментов и детские проекты. Художественный руководитель — Андрей Волков, режиссёр и педагог, лауреат национальных театральных премий.`,
    missionText: `Мы верим, что театр — это живое искусство, которое говорит с каждым зрителем на его языке. Наша миссия — сохранять русскую театральную традицию и открывать классику новым поколениям через честные, современные постановки. В репертуаре — русская и мировая классика, современная драматургия и авторские проекты.`,
    galleryImages: [
      { src: "/fon/8.jpg", alt: "Фасад театра" },
      { src: "/fon/12.jpg", alt: "Зрительный зал" },
      { src: "/fon/13.jpg", alt: "Фойе" },
      { src: "/fon/22.jpg", alt: "Гримёрки" },
    ],
  };
  if (await checkStrapi()) {
    const res = await fetchStrapi<Record<string, unknown>>("/o-teatre", {
      populate: "*",
    });
    const d = (res as { data?: Record<string, unknown> } | null)?.data;
    if (d) {
      const attrs = (d.attributes ?? d) as Record<string, unknown>;
      const galleryRaw = attrs.gallery;
      const galleryArr = Array.isArray(galleryRaw)
        ? galleryRaw
        : (galleryRaw as { data?: unknown })?.data ?? [];
      return {
        title: (attrs.title as string) || defaults.title,
        lead: (attrs.lead as string) || defaults.lead,
        historyText: (attrs.historyText as string) || defaults.historyText,
        missionText: (attrs.missionText as string) || defaults.missionText,
        galleryImages:
          mapGalleryImages(galleryArr, "Фото").length > 0
            ? mapGalleryImages(galleryArr, "Фото")
            : defaults.galleryImages,
      };
    }
  }
  return defaults;
}

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
