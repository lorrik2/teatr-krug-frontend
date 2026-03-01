import type { Metadata } from "next";
import Link from "next/link";
import OptimizedImage from "@/components/OptimizedImage";
import { getPartnersPageData } from "@/lib/cms-data";
import styles from "../styles/Page.module.css";

export const metadata: Metadata = {
  title: "Партнёры и спонсоры — Драматический театр «Круг»",
  description: "Партнёры и спонсоры театра.",
};

export default async function PartnersPage() {
  const data = await getPartnersPageData();
  const introParagraphs = (data.introText ?? "")
    .split(/\n\n+/)
    .filter((p) => p.trim());
  return (
    <div className={styles.wrap}>
      <header className={styles.header}>
        <Link href="/" className="text-graphite-600 hover:underline">
          ← На главную
        </Link>
        <h1 className={styles.h1}>{data.title || "Партнёры и спонсоры"}</h1>
      </header>
      <div className="mx-auto max-w-3xl text-graphite-700">
        {introParagraphs.length > 0 ? (
          introParagraphs.map((p, i) => <p key={i} className="mb-4">{p}</p>)
        ) : (
          <p>
            Раздел в разработке. Здесь будут размещены логотипы и ссылки на
            партнёров и спонсоров театра.
          </p>
        )}
        {(data.partners ?? []).length > 0 && (
          <div className="mt-12 grid grid-cols-2 gap-8 sm:grid-cols-3">
            {(data.partners ?? []).map((partner, i) => (
              <div
                key={i}
                className="flex flex-col items-center gap-2 rounded-lg border border-graphite-200 p-4"
              >
                {partner.logoUrl ? (
                  partner.url ? (
                    <a
                      href={partner.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block"
                    >
                      <OptimizedImage
                        src={partner.logoUrl}
                        alt={partner.name}
                        width={120}
                        height={80}
                        className="object-contain"
                      />
                    </a>
                  ) : (
                    <OptimizedImage
                      src={partner.logoUrl}
                      alt={partner.name}
                      width={120}
                      height={80}
                      className="object-contain"
                    />
                  )
                ) : (
                  <span className="text-lg font-medium">{partner.name}</span>
                )}
                {partner.url && !partner.logoUrl && (
                  <a
                    href={partner.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-graphite-600 hover:underline"
                  >
                    {partner.name}
                  </a>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
