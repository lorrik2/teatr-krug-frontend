/** Конвертирует "15 февраля 2025" + "19:00" в ISO 8601 для schema.org */
const RU_MONTHS: Record<string, string> = {
  января: "01", февраля: "02", марта: "03", апреля: "04", мая: "05", июня: "06",
  июля: "07", августа: "08", сентября: "09", октября: "10", ноября: "11", декабря: "12",
};

export function toIsoDateTime(dateStr: string, timeStr: string): string | null {
  const m = dateStr.match(/^(\d{1,2})\s+(\S+)\s+(\d{4})$/);
  if (!m) return null;
  const [, day, monthRu, year] = m;
  const month = RU_MONTHS[monthRu];
  if (!month) return null;
  const time = timeStr.replace(/[^\d:]/g, "") || "19:00";
  const [h, min] = time.split(":").map((x) => x.padStart(2, "0"));
  return `${year}-${month}-${day.padStart(2, "0")}T${h}:${min}:00`;
}

/** Конвертирует "15 февраля 2025" в ISO дату YYYY-MM-DD */
export function toIsoDate(dateStr: string): string | null {
  const m = dateStr.match(/^(\d{1,2})\s+(\S+)\s+(\d{4})$/);
  if (!m) return null;
  const [, day, monthRu, year] = m;
  const month = RU_MONTHS[monthRu];
  if (!month) return null;
  return `${year}-${month}-${day.padStart(2, "0")}`;
}
