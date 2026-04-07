import type { Performance } from "@/lib/types";

/**
 * Показывать расписание дат и элементы покупки билета (страница спектакля, карточки).
 * Требуется «В афише» и включённый флаг в CMS (по умолчанию включён).
 */
export function performanceShowsTicketsAndSchedule(play: Performance): boolean {
  if (play.inAfisha === false) return false;
  if (play.showScheduleAndTickets === false) return false;
  return true;
}
