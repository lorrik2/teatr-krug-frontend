"use client";

import { useState, useCallback } from "react";
import * as Accordion from "@radix-ui/react-accordion";
import type { Performance } from "@/lib/mock-data";
import { PerformanceCard } from "@/components/PerformanceCard";
import styles from "../styles/Page.module.css";

const MONTH_NAMES: Record<string, number> = {
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

/** Извлекает ключ месяца из даты "15 февраля 2025" → { key: "2025-02", label: "Февраль 2025" } */
function getMonthFromDate(dateStr: string): { key: string; label: string } | null {
  if (!dateStr || dateStr === "—") return null;
  const match = dateStr.match(/(\d+)\s+(января|февраля|марта|апреля|мая|июня|июля|августа|сентября|октября|ноября|декабря)\s+(\d{4})/);
  if (!match) return null;
  const [, , monthName, year] = match;
  const monthNum = MONTH_NAMES[monthName];
  if (!monthNum) return null;
  const key = `${year}-${String(monthNum).padStart(2, "0")}`;
  const labelMap: Record<string, string> = {
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
  const label = `${labelMap[monthName] || monthName} ${year}`;
  return { key, label };
}

function groupByMonth(performances: Performance[]): Map<string, { label: string; items: Performance[] }> {
  const groups = new Map<string, { label: string; items: Performance[] }>();

  for (const p of performances) {
    const datesToCheck: string[] = p.schedule?.length
      ? p.schedule.map((s) => s.date)
      : [p.date];

    const seenMonths = new Set<string>();
    for (const d of datesToCheck) {
      const month = getMonthFromDate(d);
      if (month && !seenMonths.has(month.key)) {
        seenMonths.add(month.key);
        const existing = groups.get(month.key);
        if (existing) {
          if (!existing.items.some((i) => i.id === p.id)) {
            existing.items.push(p);
          }
        } else {
          groups.set(month.key, { label: month.label, items: [p] });
        }
      }
    }

    if (seenMonths.size === 0) {
      const noDateKey = "no-date";
      const existing = groups.get(noDateKey);
      if (existing) {
        existing.items.push(p);
      } else {
        groups.set(noDateKey, { label: "В репертуаре", items: [p] });
      }
    }
  }

  return groups;
}

export default function AfishaContent({
  performances,
}: {
  performances: Performance[];
}) {
  const afishaPerformances = performances.filter((p) => p.inAfisha !== false);
  const byMonth = groupByMonth(afishaPerformances);

  const sortedEntries = Array.from(byMonth.entries()).sort(([a], [b]) => {
    if (a === "no-date") return 1;
    if (b === "no-date") return -1;
    return a.localeCompare(b);
  });

  const nearestMonthKey = sortedEntries[0]?.[0] ?? "";
  const [value, setValue] = useState<string>(nearestMonthKey);
  const monthEntries = sortedEntries.filter(([k]) => k !== "no-date");

  const goToMonth = useCallback((monthKey: string) => {
    setValue(monthKey);
    // Ждём завершения анимации collapse предыдущего месяца — иначе layout shift сдвигает скролл ниже
    const scrollAfterLayout = () => {
      const el = document.getElementById(`afisha-month-${monthKey}`);
      el?.scrollIntoView({ behavior: "smooth", block: "start" });
    };
    setTimeout(scrollAfterLayout, 320);
  }, []);

  return (
    <section className={styles.section}>
      {monthEntries.length > 1 && (
        <div className={styles.monthFilters} role="group" aria-label="Фильтр по месяцам">
          {monthEntries.map(([monthKey, { label }]) => (
            <button
              key={monthKey}
              type="button"
              onClick={() => goToMonth(monthKey)}
              className={value === monthKey ? styles.monthFilterActive : styles.monthFilterBtn}
              aria-pressed={value === monthKey}
            >
              {label}
            </button>
          ))}
        </div>
      )}
      <Accordion.Root
        type="single"
        collapsible
        value={value}
        onValueChange={setValue}
        className={styles.accordionRoot}
      >
        {sortedEntries.map(([monthKey, { label, items }]) => (
          <Accordion.Item
            key={monthKey}
            value={monthKey}
            className={styles.accordionItem}
          >
            <Accordion.Header id={monthKey !== "no-date" ? `afisha-month-${monthKey}` : undefined} className={styles.accordionHeader}>
              <Accordion.Trigger className={styles.accordionTrigger}>
                <span>{label}</span>
                <span className={styles.accordionChevron} aria-hidden>
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
              </Accordion.Trigger>
            </Accordion.Header>
            <Accordion.Content className={styles.accordionContent}>
              <ul className={`${styles.cardsGrid} ${styles.monthCards}`}>
                {items.map((play) => (
                  <PerformanceCard key={play.id} play={play} variant="afisha" />
                ))}
              </ul>
            </Accordion.Content>
          </Accordion.Item>
        ))}
      </Accordion.Root>
    </section>
  );
}
