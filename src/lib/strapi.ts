/**
 * Strapi CMS client для Next.js
 * Подключается к http://localhost:1337 при разработке
 */

/** Рекурсивно сериализует объект populate в searchParams (формат qs) */
function serializePopulate(
  params: URLSearchParams,
  prefix: string,
  obj: Record<string, unknown>,
): void {
  for (const [key, value] of Object.entries(obj)) {
    const paramKey = `${prefix}[${key}]`;
    if (value === null || value === undefined) continue;
    if (
      typeof value === "boolean" ||
      typeof value === "number" ||
      typeof value === "string"
    ) {
      params.set(paramKey, String(value));
    } else if (Array.isArray(value)) {
      value.forEach((v, i) => {
        params.set(`${paramKey}[${i}]`, String(v));
      });
    } else if (typeof value === "object" && value !== null) {
      serializePopulate(params, paramKey, value as Record<string, unknown>);
    }
  }
}

const STRAPI_URL =
  process.env.STRAPI_URL ||
  process.env.NEXT_PUBLIC_STRAPI_URL ||
  "http://localhost:1337";

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
    populate?: string | string[] | Record<string, unknown>;
    filters?: Record<string, unknown>;
    sort?: string | string[];
    locale?: string;
    pagination?: { page?: number; pageSize?: number };
  },
): Promise<StrapiResponse<T> | null> {
  const url = new URL(getStrapiUrl(`/api${path}`));

  if (options?.locale) {
    url.searchParams.set("locale", options.locale);
  }
  if (options?.populate !== undefined) {
    const p = options.populate;
    if (typeof p === "string") {
      url.searchParams.set("populate", p);
    } else if (Array.isArray(p)) {
      p.forEach((v, i) => {
        url.searchParams.set(`populate[${i}]`, String(v));
      });
    } else if (p && typeof p === "object" && !Array.isArray(p)) {
      // Сериализация объекта populate для Strapi (формат qs)
      serializePopulate(
        url.searchParams,
        "populate",
        p as Record<string, unknown>,
      );
    }
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
  if (options?.pagination) {
    if (options.pagination.page != null)
      url.searchParams.set("pagination[page]", String(options.pagination.page));
    if (options.pagination.pageSize != null)
      url.searchParams.set(
        "pagination[pageSize]",
        String(options.pagination.pageSize),
      );
  }

  const headers: Record<string, string> = {};
  if (process.env.STRAPI_API_TOKEN) {
    headers.Authorization = `Bearer ${process.env.STRAPI_API_TOKEN}`;
  }

  try {
    const res = await fetch(url.toString(), {
      next: { revalidate: 60 },
      headers,
    });
    if (!res.ok) {
      const hint =
        res.status === 403
          ? " — проверьте права: Settings → Users & Permissions → Roles → Public"
          : res.status === 400
            ? " — неверные параметры запроса"
            : "";
      console.warn(`Strapi fetch failed: ${path}`, res.status, hint);
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

/** Проверяет, доступен ли Strapi (реальный endpoint) */
export async function isStrapiAvailable(): Promise<boolean> {
  try {
    const headers: Record<string, string> = {};
    if (process.env.STRAPI_API_TOKEN) {
      headers.Authorization = `Bearer ${process.env.STRAPI_API_TOKEN}`;
    }
    const res = await fetch(
      getStrapiUrl("/api/actors?pagination[pageSize]=1"),
      {
        cache: "no-store",
        headers,
      },
    );
    return res.ok;
  } catch {
    return false;
  }
}
