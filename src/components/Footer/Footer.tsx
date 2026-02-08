import Link from "next/link";
import { navLinks, contactInfo } from "@/lib/mock-data";
import styles from "./Footer.module.css";

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.top}>
        <div className={styles.topGrid}>
          <div className={styles.brand}>
            <Link href="/" className={styles.logo}>
              Камерный театр
            </Link>
            <p className={styles.tagline}>
              Камерный театр — живая сцена, классика и современность. С 1995 года.
            </p>
          </div>
          <nav className={styles.links} aria-label="Меню в подвале">
            <ul className={styles.linkList}>
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className={styles.link}>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <div className={styles.contacts}>
            <p className={styles.contactsTitle}>Контакты</p>
            <p className={styles.address}>{contactInfo.address}</p>
            <p>
              <a href={`tel:${contactInfo.boxOffice.replace(/\s/g, "")}`} className={styles.tel}>
                Касса: {contactInfo.boxOffice}
              </a>
            </p>
            <p>
              <a href={`mailto:${contactInfo.emailBoxOffice}`} className={styles.mail}>
                {contactInfo.emailBoxOffice}
              </a>
            </p>
            <div className={styles.social}>
              <a href={contactInfo.social.vk} target="_blank" rel="noopener noreferrer" className={styles.socialLink} aria-label="ВКонтакте">
                VK
              </a>
              <a href={contactInfo.social.telegram} target="_blank" rel="noopener noreferrer" className={styles.socialLink} aria-label="Telegram">
                TG
              </a>
              <a href={contactInfo.social.instagram} target="_blank" rel="noopener noreferrer" className={styles.socialLink} aria-label="Instagram">
                IG
              </a>
            </div>
          </div>
        </div>
      </div>
      <div className={styles.bottom}>
        <div className={styles.bottomInner}>
          <p className={styles.copyright}>
            © {new Date().getFullYear()} Камерный театр. Все права защищены.
          </p>
          <div className={styles.legal}>
            <Link href="/privacy" className={styles.legalLink}>
              Политика конфиденциальности
            </Link>
            <Link href="/partners" className={styles.legalLink}>
              Партнёры и спонсоры
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
