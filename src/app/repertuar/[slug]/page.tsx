import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { repertoirePerformances } from "@/lib/mock-data";
import TicketsBlock from "@/components/TicketsBlock";
import styles from "../../styles/Page.module.css";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return repertoirePerformances.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const play = repertoirePerformances.find((p) => p.slug === slug);
  if (!play) return { title: "Спектакль" };
  return {
    title: `${play.title} — Репертуар — Драматический театр «Круг»`,
    description: play.description,
    openGraph: { title: play.title, description: play.description },
  };
}

export default async function RepertuarSlugPage({ params }: Props) {
  const { slug } = await params;
  const play = repertoirePerformances.find((p) => p.slug === slug);
  if (!play) notFound();

  return (
    <div className={styles.wrap}>
      <header className={styles.header}>
        <Link href="/repertuar" className="text-graphite-600 hover:underline">
          ← Репертуар
        </Link>
        <h1 className={styles.h1}>{play.title}</h1>
        <p className={styles.lead}>
          {play.date !== "—" ? (
            <>
              {play.date} · {play.time} · {play.ageRating}
              {play.duration && ` · ${play.duration}`}
            </>
          ) : (
            <>
              {play.ageRating}
              {play.duration && ` · ${play.duration}`}
            </>
          )}
        </p>
      </header>

      <section className="mt-8 grid gap-8 lg:grid-cols-2">
        <div className="relative aspect-[4/5] overflow-hidden rounded-lg bg-graphite-200">
          <Image
            src={play.poster}
            alt={play.title}
            fill
            className="object-cover"
            priority
          />
          <span className="absolute right-2 top-2 rounded bg-graphite-950 px-2 py-0.5 text-xs font-medium text-white">
            {play.ageRating}
          </span>
          {play.isPremiere && (
            <span className={styles.premiere}>Премьера</span>
          )}
          {play.inAfisha && (
            <span className="absolute bottom-2 left-2 rounded bg-green-700 px-2 py-0.5 text-xs font-medium text-white">
              В афише
            </span>
          )}
        </div>
        <div>
          <p className="text-graphite-700">{play.description}</p>
          <p className="mt-4 font-medium text-graphite-900">Жанр: {play.genre}</p>
          {play.inAfisha && (
            <Link href="/afisha#tickets" className="btn-ticket mt-6 inline-block">
              Купить билет
            </Link>
          )}
        </div>
      </section>

      {play.inAfisha && <TicketsBlock />}
    </div>
  );
}
