import Link from "next/link";
import styles from "./TicketsBlock.module.css";

export default function TicketsBlock() {
  return (
    <section
      className={styles.section}
      id="tickets"
      aria-labelledby="tickets-title"
    >
      <div className={styles.container}>
        <h2 id="tickets-title" className={styles.title}>
          Онлайн-продажа билетов
        </h2>
        <p className={styles.subtitle}>
          Приобретайте билеты на спектакли удобно и безопасно. Переход на сайт
          нашего партнёра.
        </p>
        <Link
          href="https://quicktickets.ru/spb-teatr-krug"
          className={styles.cta}
          aria-label="Перейти к покупке билетов (внешняя ссылка)"
        >
          Купить билет на партнёрском сайте
        </Link>
        <p className={styles.note}>Афиша на quicktickets.ru</p>
      </div>
    </section>
  );
}
