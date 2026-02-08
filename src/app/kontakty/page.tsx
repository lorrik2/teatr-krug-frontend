import type { Metadata } from "next";
import Contacts from "@/components/Contacts";
import styles from "../styles/Page.module.css";

export const metadata: Metadata = {
  title: "Контакты — Камерный театр",
  description: "Адрес, телефоны кассы и администрации, схема проезда, режим работы, соцсети.",
};

export default function ContactsPage() {
  return (
    <div className={styles.wrap}>
      <header className={styles.header}>
        <h1 className={styles.h1}>Контакты</h1>
        <p className={styles.lead}>
          Адрес, телефоны, карта и режим работы
        </p>
      </header>
      <Contacts />
    </div>
  );
}
