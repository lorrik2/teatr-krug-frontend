import type { NavItem } from "./types";

/**
 * Базовый URL сайта для SEO (metadataBase, sitemap, canonical).
 * В production задайте NEXT_PUBLIC_SITE_URL в .env (например https://teatrkrug.ru)
 * Всегда https и без завершающей косой черты.
 */
const rawUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://teatr-krug-spb.ru";

export const SITE_URL = (() => {
  let u = rawUrl.replace(/\/+$/, "");
  // Для production-доменов — принудительно https (localhost оставляем как есть)
  if (
    u.startsWith("http://") &&
    !u.includes("localhost") &&
    !u.includes("127.0.0.1")
  ) {
    u = u.replace(/^http:\/\//, "https://");
  }
  return u;
})();

/** Fallback-изображение для OpenGraph/SEO (логотип) */
export const OG_LOGO = {
  url: "/logo/logoLayout.png",
  width: 1200,
  height: 630,
};

/**
 * Единая точка формирования canonical URL. Используется во всех страницах
 * для консистентности и исключения дубликатов.
 * Формат: без завершающей косой черты (кроме корня, где слеш не нужен).
 * @param path — путь страницы (например "/afisha", "/" или "/team/slug")
 */
export function canonicalUrl(path: string): string {
  if (!path || path === "/") return SITE_URL;
  const p = path.startsWith("/") ? path : `/${path}`;
  const normalized = p.replace(/\/+$/, ""); // убираем trailing slash
  return `${SITE_URL}${normalized}`;
}

/** URL по умолчанию для покупки билетов (афиша на quicktickets.ru) */
export const DEFAULT_TICKETS_URL = "https://quicktickets.ru/spb-teatr-krug";

/** Меню с группами и выпадающими списками */
export const navItems: NavItem[] = [
  {
    label: "Спектакли",
    items: [
      { href: "/afisha", label: "Афиша" },
      { href: "/repertuar", label: "Репертуар" },
    ],
  },
  {
    label: "О нас",
    items: [
      { href: "/o-teatre", label: "О театре: история, ценности" },
      { href: "/team", label: "Команда" },
      { href: "/o-teatre/fotogalereya", label: "Фотогалерея" },
      { href: "/sobytiya", label: "События" },
      { href: "/kontakty", label: "Контакты" },
      { href: "/dostupnaya-sreda", label: "Доступная среда" },
    ],
  },
  {
    label: "Сотрудничество",
    items: [
      { href: "/arenda-zala", label: "Аренда зала" },
      { href: "/pomoch-teatru", label: "Помочь театру" },
    ],
  },
  {
    href: "/teatr-teos",
    label: "Театр ТеОс",
  },
];

/** Плоский список ссылок (для Footer, breadcrumbs и т.д.) */
export const navLinks = navItems.flatMap((item) =>
  "items" in item ? item.items : [{ href: item.href, label: item.label }],
);
