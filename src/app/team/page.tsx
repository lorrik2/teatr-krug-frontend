import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { actors } from "@/lib/mock-data";
import styles from "../styles/Page.module.css";

export const metadata: Metadata = {
  title: "Команда — Драматический театр «Круг»",
  description: "Актеры и режиссёры театра. Биографии, роли, фото.",
};

export default function TeamPage() {
  return (
    <div className={styles.wrap}>
      <header className={styles.header}>
        <h1 className={styles.h1}>Команда</h1>
        <p className={styles.lead}>Актеры и режиссёры театра</p>
      </header>

      <section className={styles.section}>
        <ul className={styles.teamGrid}>
          {actors.map((actor) => (
            <li key={actor.id} className={styles.teamCard}>
              <Link
                href={`/team/${actor.slug}`}
                className={styles.teamCardLink}
              >
                <div className={styles.teamPhotoWrap}>
                  <Image
                    src={actor.photo}
                    alt={actor.name}
                    width={400}
                    height={500}
                    className={styles.teamPhoto}
                  />
                </div>
                <div className={styles.teamBody}>
                  <h2 className={styles.teamName}>{actor.name}</h2>
                  {actor.rank && (
                    <p className={styles.teamRank}>{actor.rank}</p>
                  )}
                  <p className={styles.teamRole}>{actor.role}</p>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
