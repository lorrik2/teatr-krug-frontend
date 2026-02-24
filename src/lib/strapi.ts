/**
 * Strapi CMS client для Next.js
 * Подключается к http://localhost:1337 при разработке
 */

const STRAPI_URL = process.env.STRAPI_URL || process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337";

export function getStrapiUrl(path = "") {
  return `${STRAPI_URL.replace(/\/+$/, "")}${path}`;
}

export function getStrapiMediaUrl(url: string | null | undefined): string {
  if (!url) return "";
  if (url.startsWith("http")) return url;
  return getStrapiUrl(url);
}

export interface StrapiResponse<T> {
  data: T;
  meta?: {
    pagination?: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
}

export async function fetchStrapi<T>(
  path: string,
  options?: {
    populate?: string | Record<string, unknown>;
    filters?: Record<string, unknown>;
    sort?: string | string[];
  }
): Promise<StrapiResponse<T> | null> {
  const url = new URL(getStrapiUrl(`/api${path}`));

  if (options?.populate) {
    url.searchParams.set(
      "populate",
      typeof options.populate === "string"
        ? options.populate
        : JSON.stringify(options.populate)
    );
  }
  if (options?.filters) {
    Object.entries(options.filters).forEach(([key, value]) => {
      url.searchParams.set(`filters[${key}][$eq]`, String(value));
    });
  }
  if (options?.sort) {
    const sortArr = Array.isArray(options.sort) ? options.sort : [options.sort];
    url.searchParams.set("sort", sortArr.join(","));
  }

  try {
    const res = await fetch(url.toString(), {
      next: { revalidate: 60 },
      headers: process.env.STRAPI_API_TOKEN
        ? { Authorization: `Bearer ${process.env.STRAPI_API_TOKEN}` }
        : {},
    });
    if (!res.ok) {
      console.warn(`Strapi fetch failed: ${path}`, res.status);
      return null;
    }
    return res.json();
  } catch (err) {
    const isConnectionRefused =
      err instanceof Error &&
      "cause" in err &&
      typeof (err as { cause?: { code?: string } }).cause === "object" &&
      (err as { cause?: { code?: string } }).cause?.code === "ECONNREFUSED";
    if (!isConnectionRefused) console.warn("Strapi fetch error:", err);
    return null;
  }
}

/** Проверяет, доступен ли Strapi (реальный endpoint, не /api) */
export async function isStrapiAvailable(): Promise<boolean> {
  try {
    const res = await fetch(getStrapiUrl("/api/actors?pagination[pageSize]=1"), {
      cache: "no-store",
      headers: process.env.STRAPI_API_TOKEN
        ? { Authorization: `Bearer ${process.env.STRAPI_API_TOKEN}` }
        : {},
    });
    return res.ok;
  } catch {
    return false;
  }
}
