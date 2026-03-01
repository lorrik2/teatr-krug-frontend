import type { Metadata } from "next";
import Link from "next/link";
import Contacts from "@/components/Contacts";
import { getContactInfo } from "@/lib/cms-data";
import { contactInfo as defaultContactInfo } from "@/lib/mock-data";
import styles from "../styles/Page.module.css";

export const metadata: Metadata = {
  title: "Контакты и схема проезда — Драматический театр «Круг»",
  description: "Адрес, телефоны кассы и администрации, схема проезда, режим работы, соцсети.",
};

export default async function ContactsPage() {
  const contactInfo = await getContactInfo().catch(() => defaultContactInfo);
  return (
    <div className={`${styles.wrap} ${styles.contactsWrap}`}>
      <nav className={styles.breadcrumbs} aria-label="Хлебные крошки">
        <Link href="/">Главная</Link>
        <span className={styles.breadcrumbsSep}>→</span>
        <span>Контакты</span>
      </nav>
      <header className={`${styles.header} ${styles.contactsHeader}`}>
        <h1 className={styles.h1}>Контакты и схема проезда</h1>
        <p className={styles.lead}>
          Адрес, телефоны, карта и режим работы
        </p>
      </header>
      <Contacts contactInfo={contactInfo} showTitle={false} compact />
    </div>
  );
}
