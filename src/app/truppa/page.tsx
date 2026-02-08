import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { actors } from "@/lib/mock-data";
import styles from "../styles/Page.module.css";

export const metadata: Metadata = {
  title: "Труппа — Драматический театр «Круг»",
  description: "Актеры и режиссёры театра. Биографии, роли, фото.",
};

export default function TroupePage() {
  return (
    <div className={styles.wrap}>
      <header className={styles.header}>
        <h1 className={styles.h1}>Труппа</h1>
        <p className={styles.lead}>
          Актеры и режиссёры театра
        </p>
      </header>

      <section className={styles.section}>
        <ul className={styles.troupeGrid}>
          {actors.map((actor) => (
            <li key={actor.id} className={styles.troupeCard}>
              <Link href={`/truppa/${actor.slug}`} className={styles.troupeCardLink}>
                <div className={styles.troupePhotoWrap}>
                  <Image
                    src={actor.photo}
                    alt={actor.name}
                    width={400}
                    height={500}
                    className={styles.troupePhoto}
                  />
                </div>
                <div className={styles.troupeBody}>
                  <h2 className={styles.troupeName}>{actor.name}</h2>
                  {actor.rank && (
                    <p className={styles.troupeRank}>{actor.rank}</p>
                  )}
                  <p className={styles.troupeRole}>{actor.role}</p>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
