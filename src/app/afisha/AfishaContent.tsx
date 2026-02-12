"use client";

import { useState } from "react";
import { performances } from "@/lib/mock-data";
import { PerformanceCard } from "@/components/PerformanceCard";
import styles from "../styles/Page.module.css";

type FilterValue = "all" | "premiere" | "repertoire";

export default function AfishaContent() {
  const [filter, setFilter] = useState<FilterValue>("all");

  const afishaPerformances = performances.filter((p) => p.inAfisha !== false);
  const filtered =
    filter === "all"
      ? afishaPerformances
      : filter === "premiere"
        ? afishaPerformances.filter((p) => p.isPremiere)
        : afishaPerformances.filter((p) => !p.isPremiere);

  return (
    <section className={styles.section}>
      <div className={styles.filtersRow}>
        <button
          type="button"
          onClick={() => setFilter("all")}
          className={filter === "all" ? styles.filterActive : styles.filterBtn}
        >
          Все
        </button>
        <button
          type="button"
          onClick={() => setFilter("premiere")}
          className={filter === "premiere" ? styles.filterActive : styles.filterBtn}
        >
          Премьера
        </button>
        <button
          type="button"
          onClick={() => setFilter("repertoire")}
          className={filter === "repertoire" ? styles.filterActive : styles.filterBtn}
        >
          Репертуар
        </button>
      </div>

      <ul className={styles.cardsGrid}>
        {filtered.map((play) => (
          <PerformanceCard key={play.id} play={play} variant="afisha" />
        ))}
      </ul>
    </section>
  );
}
