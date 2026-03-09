/**
 * Общие типы для CMS-данных (Strapi) и компонентов.
 * Используются в cms-data, страницах, компонентах, SEO.
 */

export interface CastMember {
  name: string;
  role: string;
  /** slug актёра из команды — для фото и ссылки на страницу актёра */
  actorSlug?: string;
  /** Фото участника — для записей без связи с актёром (музыканты, приглашённые) */
  photo?: string;
}

export interface Performance {
  id: string;
  title: string;
  slug: string;
  poster: string;
  /** Фото для слайдера наверху страницы. Если пусто — используется gallery или poster */
  heroSlider?: string[];
  /** Фотогалерея (ниже на странице). Отдельно от heroSlider */
  gallery?: string[];
  /** Подзаголовок: «спектакль X по пьесе Y. редакция Z | 18+» */
  subtitle?: string;
  /** Драматург / автор пьесы */
  author?: string;
  /** Режиссёр-постановщик */
  director?: string;
  /** Цитата режиссёра о спектакле */
  directorQuote?: string;
  /** Художник-постановщик */
  designer?: string;
  /** Художник по свету */
  lightingDesigner?: string;
  /** Звукорежиссёр */
  soundDesigner?: string;
  /** Свето-звуко оператор */
  lightSoundOperator?: string;
  /** Актёры и роли */
  cast?: CastMember[];
  /** Отзывы о спектакле */
  reviews?: Review[];
  /** URL тизера/трейлера (youtube, vimeo и т.п.) */
  teaserUrl?: string;
  date: string;
  time: string;
  ageRating: string;
  genre: string;
  description: string;
  duration?: string;
  /** Количество антрактов */
  intermissions?: number;
  isPremiere?: boolean;
  /** Есть ли спектакль в афише (продажа билетов) */
  inAfisha?: boolean;
  /** Даты и время показов в сезоне (если несколько — одна строка на каждую) */
  schedule?: { date: string; time: string }[];
  /** Награды и дипломы спектакля */
  awards?: { title: string; year?: string }[];
  /** Участие в конкурсах и фестивалях */
  festivals?: { title: string; year?: string; place?: string }[];
  /** Ссылка на покупку билетов (настраивается в CMS для каждого спектакля) */
  ticketsUrl?: string;
}

export interface Premiere {
  id: string;
  title: string;
  slug: string;
  poster: string;
  videoUrl?: string;
  description: string;
  director: string;
  cast: string[];
  date: string;
  time: string;
}

/** Роль актёра: строка (текст) или объект со ссылкой на спектакль */
export type ActorRole =
  | string
  | { role: string; performanceSlug?: string; performanceTitle?: string };

export interface Actor {
  id: string;
  name: string;
  slug: string;
  photo: string;
  role: string;
  rank?: string;
  bio: string;
  roles: ActorRole[];
  /** Галерея фото — при отсутствии используется [photo] */
  gallery?: string[];
}

export interface NewsItem {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  /** Полный текст (из Strapi) */
  content?: string;
  image: string;
  date: string;
  category: string;
}

export interface Review {
  id: string;
  quote: string;
  author: string;
  /** Ссылка на отзыв во ВКонтакте */
  vkUrl?: string;
  /** Ссылка на отзыв в Яндекс Картах */
  yandexMapsUrl?: string;
  /** Ссылка на отзыв в 2ГИС */
  twoGisUrl?: string;
}

/** Пункт меню — ссылка или группа с подпунктами */
export type NavItem =
  | { href: string; label: string }
  | { label: string; items: { href: string; label: string }[] };

/** Структура контактов (из Strapi / contact) */
export interface ContactInfo {
  address: string;
  boxOffice: string;
  admin: string;
  press: string;
  emailBoxOffice: string;
  emailAdmin: string;
  emailPress: string;
  social: { vk: string; telegram: string; instagram: string };
  workingHours: { boxOffice: string; admin: string };
  mapEmbed: string;
  howToGetThere: string;
  footerTagline: string;
  footerContactsTitle: string;
  footerCopyright: string;
}
