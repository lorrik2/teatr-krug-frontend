import Link from "next/link";
import OptimizedImage from "@/components/OptimizedImage";
import { navLinks, contactInfo } from "@/lib/mock-data";
import styles from "./Footer.module.css";

const IconVK = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="currentColor"
    aria-hidden
  >
    <path d="M15.684 0H8.316C1.592 0 0 1.592 0 8.316v7.368C0 22.408 1.592 24 8.316 24h7.368C22.408 24 24 22.408 24 15.684V8.316C24 1.592 22.408 0 15.684 0zm3.692 17.123h-1.744c-.66 0-.862-.525-2.049-1.727-1.033-1-1.49-1.135-1.744-1.135-.356 0-.458.102-.458.593v1.575c0 .424-.135.678-1.253.678-1.846 0-3.896-1.118-5.335-3.202C4.624 10.857 4.03 8.57 4.03 8.096c0-.254.102-.491.593-.491h1.744c.44 0 .61.203.78.677.863 2.49 2.303 4.675 2.896 4.675.22 0 .322-.102.322-.66V9.721c-.068-1.186-.695-1.287-.695-1.71 0-.203.17-.407.44-.407h2.744c.37 0 .508.203.508.643v3.473c0 .372.17.508.271.508.22 0 .407-.136.814-.542 1.254-1.406 2.151-3.574 2.151-3.574.119-.254.322-.491.763-.491h1.744c.525 0 .644.27.525.643-.22 1.017-2.354 4.031-2.354 4.031-.186.305-.254.44 0 .78.186.254.796.779 1.203 1.253.745.847 1.32 1.558 1.473 2.049.17.491-.085.744-.576.744z" />
  </svg>
);

const IconTelegram = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="currentColor"
    aria-hidden
  >
    <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
  </svg>
);

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.top}>
        <div className={styles.topGrid}>
          <div className={styles.brand}>
            <Link href="/" className={styles.logo}>
              <OptimizedImage
                src="/logo/лого круг.png"
                alt="Драматический театр Круг"
                width={140}
                height={48}
                className={styles.logoImg}
                effect="blur"
              />
            </Link>
            <p className={styles.tagline}>
              Драматический театр «Круг» — живая сцена, классика и
              современность. С 2010 года.
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
              <a
                href={`tel:${contactInfo.boxOffice.replace(/\s/g, "")}`}
                className={styles.tel}
              >
                Касса: {contactInfo.boxOffice}
              </a>
            </p>
            <p>
              <a
                href={`mailto:${contactInfo.emailBoxOffice}`}
                className={styles.mail}
              >
                {contactInfo.emailBoxOffice}
              </a>
            </p>
            <div className={styles.social}>
              <a
                href={contactInfo.social.vk}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.socialIcon}
                aria-label="ВКонтакте"
              >
                <IconVK />
              </a>
              <a
                href={contactInfo.social.telegram}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.socialIcon}
                aria-label="Telegram"
              >
                <IconTelegram />
              </a>
            </div>
          </div>
        </div>
      </div>
      <div className={styles.bottom}>
        <div className={styles.bottomInner}>
          <p className={styles.copyright}>
            © {new Date().getFullYear()} Драматический театр «Круг». Все права
            защищены.
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
