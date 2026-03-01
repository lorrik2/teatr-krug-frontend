import type { Metadata } from "next";
import AfishaContent from "./AfishaContent";
import { getPerformances } from "@/lib/cms-data";
import styles from "../styles/Page.module.css";

export const metadata: Metadata = {
  title: "Афиша — Драматический театр «Круг»",
  description:
    "Репертуар спектаклей текущего сезона. Даты, время, возрастной рейтинг. Купить билеты онлайн.",
};

export default async function AfishaPage() {
  const performances = (await getPerformances().catch(() => [])) ?? [];
  return (
    <div className={styles.wrap}>
      <header className={styles.header}>
        <h1 className={styles.h1}>Афиша</h1>
        <p className={styles.lead}>Выберите спектакль и дату.</p>
      </header>

      <AfishaContent performances={performances} />
    </div>
  );
}
