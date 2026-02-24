/**
 * Базовый URL сайта для SEO (metadataBase, sitemap, canonical).
 * В production задайте NEXT_PUBLIC_SITE_URL в .env (например https://teatrkrug.ru)
 */
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://teatr-krug-spb.ru";
