import type { Metadata } from "next";
import AfishaContent from "./AfishaContent";
import TicketsBlock from "@/components/TicketsBlock";
import styles from "../styles/Page.module.css";

export const metadata: Metadata = {
  title: "Афиша — Драматический театр «Круг»",
  description:
    "Репертуар спектаклей текущего сезона. Даты, время, возрастной рейтинг. Купить билеты онлайн.",
};

export default function AfishaPage() {
  return (
    <div className={styles.wrap}>
      <header className={styles.header}>
        <h1 className={styles.h1}>Афиша</h1>
        <p className={styles.lead}>
          Репертуар текущего сезона. Выберите спектакль и дату.
        </p>
      </header>

      <AfishaContent />

      <div className="mt-16 md:mt-24">
        <TicketsBlock />
      </div>
    </div>
  );
}
