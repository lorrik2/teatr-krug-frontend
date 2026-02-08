import Link from "next/link";
import Image from "next/image";
import { mainPremiere } from "@/lib/mock-data";
import styles from "./Premiere.module.css";

export default function Premiere() {
  return (
    <section className={styles.section} aria-labelledby="premiere-title">
      <div className={styles.container}>
        <div className={styles.premiereGrid}>
          <div className={styles.posterBlock}>
            <div className={styles.posterWrap}>
              <Image
                src={mainPremiere.poster}
                alt={mainPremiere.title}
                width={800}
                height={1000}
                className={styles.poster}
              />
            </div>
          </div>
          <div className={styles.content}>
            <p className={styles.badge}>Премьера сезона</p>
            <h2 id="premiere-title" className={styles.title}>
              {mainPremiere.title}
            </h2>
            <p className={styles.dateTime}>
              {mainPremiere.date} · {mainPremiere.time}
            </p>
            <p className={styles.desc}>{mainPremiere.description}</p>
            <dl className={styles.metaList}>
              <dt className={styles.dt}>Режиссёр-постановщик</dt>
              <dd className={styles.dd}>{mainPremiere.director}</dd>
              <dt className={styles.dt}>В ролях</dt>
              <dd className={styles.dd}>{mainPremiere.cast.join(", ")}</dd>
            </dl>
            <div className={styles.actions}>
              <Link href={`/afisha/${mainPremiere.slug}`} className={styles.btnDetail}>
                Подробнее
              </Link>
              <Link href="/afisha#tickets" className={styles.btnTicket}>
                Купить билет
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
