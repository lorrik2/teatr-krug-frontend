"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import styles from "./Subscribe.module.css";

export default function Subscribe() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;
    setStatus("loading");
    // Заглушка: имитация отправки
    setTimeout(() => {
      setStatus("success");
      setEmail("");
    }, 800);
  }

  return (
    <section className={styles.section} aria-labelledby="subscribe-title">
      <div className={styles.container}>
        <motion.div
          className={styles.inner}
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 id="subscribe-title" className={styles.title}>
            Узнавайте о премьерах первыми
          </h2>
          <p className={styles.subtitle}>
            Подпишитесь на рассылку — анонсы спектаклей, спецпредложения и новости театра.
          </p>
          <form onSubmit={handleSubmit} className={styles.form}>
            <label htmlFor="subscribe-email" className="sr-only">
              Email для подписки
            </label>
            <input
              id="subscribe-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Ваш email"
              required
              disabled={status === "loading" || status === "success"}
              className={styles.input}
            />
            <button
              type="submit"
              disabled={status === "loading" || status === "success"}
              className={styles.button}
            >
              {status === "loading" && "Отправка…"}
              {status === "success" && "Подписка оформлена"}
              {status === "idle" && "Подписаться"}
              {status === "error" && "Попробовать снова"}
            </button>
          </form>
          {status === "success" && (
            <p className={styles.success}>Спасибо! Проверьте почту для подтверждения.</p>
          )}
        </motion.div>
      </div>
    </section>
  );
}
