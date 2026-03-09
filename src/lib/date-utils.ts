/** Названия месяцев в родительном падеже (для парсинга "28 марта", "15 февраля 2025") */
export const MONTH_NAMES: Record<string, number> = {
  января: 1,
  февраля: 2,
  марта: 3,
  апреля: 4,
  мая: 5,
  июня: 6,
  июля: 7,
  августа: 8,
  сентября: 9,
  октября: 10,
  ноября: 11,
  декабря: 12,
};

/** Родительный падеж → именительный (для отображения "Март", "Февраль") */
export const MONTH_LABELS: Record<string, string> = {
  января: "Январь",
  февраля: "Февраль",
  марта: "Март",
  апреля: "Апрель",
  мая: "Май",
  июня: "Июнь",
  июля: "Июль",
  августа: "Август",
  сентября: "Сентябрь",
  октября: "Октябрь",
  ноября: "Ноябрь",
  декабря: "Декабрь",
};

/**
 * Форматирует дату для отображения.
 * Дата из CMS уже в формате "28 марта" или "15 февраля 2025" — возвращаем как есть.
 */
export function formatDisplayDate(dateStr: string): string {
  if (!dateStr || dateStr === "—") return "—";
  return dateStr.trim();
}

/**
 * Преобразует "28 марта"/"15 февраля 2025" в ISO дату (YYYY-MM-DD).
 * Без года — текущий год.
 */
export function toIsoDate(dateStr: string): string {
  if (!dateStr || dateStr === "—") return "";
  const match = dateStr.match(
    /(\d+)\s+(января|февраля|марта|апреля|мая|июня|июля|августа|сентября|октября|ноября|декабря)(?:\s+(\d{4}))?/,
  );
  if (!match) return "";
  const [, day, monthName, year] = match;
  const month = MONTH_NAMES[monthName];
  if (!month) return "";
  const yr = year ? Number(year) : new Date().getFullYear();
  const d = new Date(yr, month - 1, Number(day));
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${dd}`;
}

/**
 * Преобразует "28 марта"/"15 февраля 2025" + "19:00" в ISO 8601 (YYYY-MM-DDTHH:mm:00).
 * Без года — текущий год. Без времени — 00:00.
 */
export function toIsoDateTime(dateStr: string, timeStr?: string): string {
  if (!dateStr || dateStr === "—") return "";
  const match = dateStr.match(
    /(\d+)\s+(января|февраля|марта|апреля|мая|июня|июля|августа|сентября|октября|ноября|декабря)(?:\s+(\d{4}))?/,
  );
  if (!match) return "";
  const [, day, monthName, year] = match;
  const month = MONTH_NAMES[monthName];
  if (!month) return "";
  const yr = year ? Number(year) : new Date().getFullYear();
  const d = new Date(yr, month - 1, Number(day));
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  let hh = "00";
  let mm = "00";
  if (timeStr && timeStr !== "—") {
    const t = timeStr.match(/^(\d{1,2}):(\d{2})/);
    if (t) {
      hh = t[1].padStart(2, "0");
      mm = t[2];
    }
  }
  return `${y}-${m}-${dd}T${hh}:${mm}:00`;
}
