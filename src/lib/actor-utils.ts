import type { Actor, CastMember, Performance } from "./mock-data";

/**
 * Проверяет, есть ли у актёра контент для отображения на странице карточки.
 * Если заполнены только базовые поля (photo, name, role) — карточку открывать не нужно.
 */
export function hasActorCardContent(actor: Actor): boolean {
  if (actor.bio?.trim()) return true;
  if (actor.roles?.length) {
    const hasContent = actor.roles.some((r) => {
      const text = typeof r === "string" ? r : r?.role;
      return text?.trim();
    });
    if (hasContent) return true;
  }
  if (actor.gallery && actor.gallery.length > 1) return true;
  return false;
}

/**
 * Проверяет, является ли актёр режиссёром или художественным руководителем.
 * Только у них отображается полная карточка со ссылкой на страницу.
 */
export function isDirectorOrArtisticDirector(actor: Actor): boolean {
  const role = (actor.role || "").toLowerCase();
  const rank = (actor.rank || "").toLowerCase();
  return (
    role.includes("режиссёр") ||
    role.includes("режиссер") ||
    rank.includes("художественный руководитель")
  );
}

export interface ActorPerformanceRole {
  title: string;
  slug: string;
  role: string;
}

/**
 * Собирает роли актёра во всех спектаклях по actorSlug.
 * Данные берутся из cast спектаклей (Performance → Актёрский состав).
 */
export function getActorPerformanceRoles(
  actorSlug: string,
  performances: Performance[]
): ActorPerformanceRole[] {
  const result: ActorPerformanceRole[] = [];
  const slugStr = typeof actorSlug === "string" ? actorSlug : "";
  for (const perf of performances) {
    const member = perf.cast?.find((c) => (c.actorSlug ?? "") === slugStr);
    if (member) {
      const perfSlug = typeof perf.slug === "string" ? perf.slug : "";
      result.push({
        title: typeof perf.title === "string" ? perf.title : "",
        slug: perfSlug,
        role: typeof member.role === "string" ? member.role : "",
      });
    }
  }
  return result;
}

/**
 * Объединяет роли из двух источников:
 * 1) cast спектаклей (Performance → Актёрский состав)
 * 2) roles актёра с привязкой к спектаклю (Actor → Роли в спектаклях)
 * Используется в модалке «Роли в спектаклях».
 */
export function getActorPerformanceRolesMerged(
  actor: Actor,
  performances: Performance[]
): ActorPerformanceRole[] {
  const fromCast = getActorPerformanceRoles(actor.slug, performances);
  const fromActorRoles: ActorPerformanceRole[] = [];

  for (const r of actor.roles ?? []) {
    if (typeof r === "object" && r?.performanceSlug) {
      fromActorRoles.push({
        role: r.role || "",
        slug: r.performanceSlug,
        title: r.performanceTitle || "",
      });
    }
  }

  // Объединяем, убираем дубли (одинаковые slug+role)
  const seen = new Set<string>();
  const merged: ActorPerformanceRole[] = [];
  for (const item of [...fromActorRoles, ...fromCast]) {
    const key = `${item.slug}::${item.role}`;
    if (item.slug && item.role && !seen.has(key)) {
      seen.add(key);
      merged.push(item);
    }
  }
  return merged;
}

/**
 * Объединяет состав спектакля из двух источников:
 * 1) cast спектакля (Performance → Актёрский состав)
 * 2) актёры, у которых в карточке указана роль в этом спектакле (Actor → Роли в спектаклях)
 */
export function getMergedCast(
  performance: Performance,
  actors: Actor[]
): CastMember[] {
  const fromPerformance = performance.cast ?? [];
  const existingSlugs = new Set(
    fromPerformance.map((c) => c.actorSlug).filter(Boolean)
  );

  const fromActorRoles: CastMember[] = [];
  for (const actor of actors) {
    if (existingSlugs.has(actor.slug)) continue;

    for (const r of actor.roles ?? []) {
      if (
        typeof r === "object" &&
        r?.performanceSlug === performance.slug &&
        r?.role?.trim()
      ) {
        fromActorRoles.push({
          name: actor.name,
          role: r.role,
          actorSlug: actor.slug,
        });
        existingSlugs.add(actor.slug);
      }
    }
  }

  return [...fromPerformance, ...fromActorRoles];
}
