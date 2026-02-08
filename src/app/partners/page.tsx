import type { Metadata } from "next";
import Link from "next/link";
import styles from "../styles/Page.module.css";

export const metadata: Metadata = {
  title: "Партнёры и спонсоры — Драматический театр «Круг»",
  description: "Партнёры и спонсоры театра.",
};

export default function PartnersPage() {
  return (
    <div className={styles.wrap}>
      <header className={styles.header}>
        <Link href="/" className="text-graphite-600 hover:underline">
          ← На главную
        </Link>
        <h1 className={styles.h1}>Партнёры и спонсоры</h1>
      </header>
      <div className="mx-auto max-w-3xl text-graphite-700">
        <p>
          Раздел в разработке. Здесь будут размещены логотипы и ссылки на партнёров и спонсоров театра.
        </p>
      </div>
    </div>
  );
}
