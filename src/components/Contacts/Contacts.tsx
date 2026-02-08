import { contactInfo } from "@/lib/mock-data";
import styles from "./Contacts.module.css";

export default function Contacts() {
  return (
    <section className={styles.section} id="kontakty" aria-labelledby="contacts-title">
      <div className={styles.container}>
        <h2 id="contacts-title" className={styles.title}>
          Контакты и схема проезда
        </h2>
        <p className={styles.subtitle}>
          Адрес, телефоны, режим работы кассы и администрации
        </p>

        <div className={styles.layoutGrid}>
          <div className={styles.info}>
            <div className={styles.block}>
              <h3 className={styles.blockTitle}>Адрес</h3>
              <p className={styles.address}>{contactInfo.address}</p>
            </div>
            <div className={styles.block}>
              <h3 className={styles.blockTitle}>Телефоны</h3>
              <ul className={styles.list}>
                <li>
                  <a href={`tel:${contactInfo.boxOffice.replace(/\s/g, "")}`}>
                    Касса: {contactInfo.boxOffice}
                  </a>
                </li>
                <li>
                  <a href={`tel:${contactInfo.admin.replace(/\s/g, "")}`}>
                    Администрация: {contactInfo.admin}
                  </a>
                </li>
                <li>
                  <a href={`tel:${contactInfo.press.replace(/\s/g, "")}`}>
                    Пресс-служба: {contactInfo.press}
                  </a>
                </li>
              </ul>
            </div>
            <div className={styles.block}>
              <h3 className={styles.blockTitle}>Email</h3>
              <ul className={styles.list}>
                <li>
                  <a href={`mailto:${contactInfo.emailBoxOffice}`}>
                    Касса: {contactInfo.emailBoxOffice}
                  </a>
                </li>
                <li>
                  <a href={`mailto:${contactInfo.emailAdmin}`}>
                    Администрация: {contactInfo.emailAdmin}
                  </a>
                </li>
                <li>
                  <a href={`mailto:${contactInfo.emailPress}`}>
                    Пресс-служба: {contactInfo.emailPress}
                  </a>
                </li>
              </ul>
            </div>
            <div className={styles.block}>
              <h3 className={styles.blockTitle}>Режим работы</h3>
              <p>{contactInfo.workingHours.boxOffice}</p>
              <p className="mt-1">{contactInfo.workingHours.admin}</p>
            </div>
            <div className={styles.block}>
              <h3 className={styles.blockTitle}>Социальные сети</h3>
              <div className={styles.social}>
                <a href={contactInfo.social.vk} target="_blank" rel="noopener noreferrer">
                  ВКонтакте
                </a>
                <a href={contactInfo.social.telegram} target="_blank" rel="noopener noreferrer">
                  Telegram
                </a>
                <a href={contactInfo.social.instagram} target="_blank" rel="noopener noreferrer">
                  Instagram
                </a>
              </div>
            </div>
            <div className={styles.transport}>
              <h3 className={styles.blockTitle}>Как добраться</h3>
              <p>Метро «Театральная», 5 мин пешком. Автобусы 12, 45 — ост. «Театральная площадь». Парковка для зрителей: ул. Театральная, паркинг №2 (бесплатно в день спектакля по предъявлению билета).</p>
            </div>
          </div>
          <div className={styles.mapWrap}>
            <div className={styles.mapPlaceholder}>
              <p className={styles.mapLabel}>
                Интерактивная карта (Яндекс.Карты / Google Maps)
              </p>
              <p className={styles.mapHint}>
                Здесь будет встроена карта по адресу театра
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
