import type { Metadata } from "next";
import Link from "next/link";
import Contacts from "@/components/Contacts";
import { getContactInfo, EMPTY_CONTACT } from "@/lib/cms-data";
import { canonicalUrl } from "@/lib/site-config";
import styles from "../styles/Page.module.css";

export const metadata: Metadata = {
  title: "Контакты и схема проезда — Драматический театр «Круг»",
  description: "Адрес, телефоны кассы и администрации, схема проезда, режим работы, соцсети.",
  alternates: { canonical: canonicalUrl("/kontakty") },
  openGraph: {
    type: "website",
    locale: "ru_RU",
    url: canonicalUrl("/kontakty"),
    siteName: "Драматический театр «Круг»",
    title: "Контакты и схема проезда — Драматический театр «Круг»",
    description: "Адрес, телефоны кассы и администрации, схема проезда, режим работы, соцсети.",
    images: [{ url: "/logo/logoLayout.png", width: 1200, height: 630, alt: "Контакты театра Круг" }],
  },
  twitter: { card: "summary_large_image", title: "Контакты — Драматический театр «Круг»" },
};

export default async function ContactsPage() {
  const contactInfo = await getContactInfo().catch(() => EMPTY_CONTACT);
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
        <p className="mt-6">
          <Link
            href="/dostupnaya-sreda"
            className={styles.btnDetail}
          >
            Доступная среда для зрителей с ОВЗ
          </Link>
        </p>
      </header>
      {contactInfo.address || contactInfo.boxOffice ? (
        <Contacts contactInfo={contactInfo} showTitle={false} compact />
      ) : (
        <p className={styles.emptyMessage}>Контакты скоро будут добавлены.</p>
      )}
    </div>
  );
}
