import type { Actor, Performance } from "./mock-data";

/**
 * Проверяет, есть ли у актёра контент для отображения на странице карточки.
 * Если заполнены только базовые поля (photo, name, role) — карточку открывать не нужно.
 */
export function hasActorCardContent(actor: Actor): boolean {
  if (actor.bio?.trim()) return true;
  if (actor.roles?.length && actor.roles.some((r) => r?.trim())) return true;
  if (actor.gallery && actor.gallery.length > 1) return true;
  if (actor.theaterPage?.trim()) return true;
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
 * Данные берутся автоматически из cast спектаклей — при добавлении спектакля
 * и указании в нём актёров (actorSlug) роли автоматически появятся в модальном окне.
 */
export function getActorPerformanceRoles(
  actorSlug: string,
  performances: Performance[]
): ActorPerformanceRole[] {
  const result: ActorPerformanceRole[] = [];
  for (const perf of performances) {
    const member = perf.cast?.find((c) => c.actorSlug === actorSlug);
    if (member) {
      result.push({ title: perf.title, slug: perf.slug, role: member.role });
    }
  }
  return result;
}
