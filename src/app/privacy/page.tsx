import type { Metadata } from "next";
import Link from "next/link";
import styles from "../styles/Page.module.css";

export const metadata: Metadata = {
  title: "Политика конфиденциальности — Драматический театр «Круг»",
  description: "Политика конфиденциальности сайта театра.",
};

export default function PrivacyPage() {
  return (
    <div className={styles.wrap}>
      <header className={styles.header}>
        <Link href="/" className="text-graphite-600 hover:underline">
          ← На главную
        </Link>
        <h1 className={styles.h1}>Политика конфиденциальности</h1>
      </header>
      <div className="mx-auto max-w-3xl text-graphite-700">
        <p>
          На данной странице будет размещена политика конфиденциальности в соответствии с требованиями законодательства. Контент подгружается из CMS или добавляется вручную.
        </p>
      </div>
    </div>
  );
}
