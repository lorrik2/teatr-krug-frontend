import type { Metadata } from "next";
import { getActors, getRepertoirePerformances } from "@/lib/cms-data";
import TeamGrid from "@/components/Team/TeamGrid";
import styles from "../team/TeamPage.module.css";

export const metadata: Metadata = {
  title: "Команда — Драматический театр «Круг»",
  description: "Актеры и режиссёры театра. Биографии, роли, фото.",
};

export default async function TroupePage() {
  const [actors, performances] = await Promise.all([
    getActors(),
    getRepertoirePerformances(),
  ]);
  return (
    <div className={styles.wrap}>
      <header className={styles.header}>
        <h1 className={styles.title}>Команда</h1>
        <p className={styles.subtitle}>Актеры и режиссёры театра</p>
      </header>

      <section className={styles.section}>
        <TeamGrid actors={actors} performances={performances} />
      </section>
    </div>
  );
}
