import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { actors } from "@/lib/mock-data";
import styles from "../../styles/Page.module.css";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return actors.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const actor = actors.find((a) => a.slug === slug);
  if (!actor) return { title: "Артист" };
  return {
    title: `${actor.name} — Драматический театр «Круг»`,
    description: actor.bio,
    openGraph: { title: actor.name, description: actor.bio },
  };
}

export default async function ActorPage({ params }: Props) {
  const { slug } = await params;
  const actor = actors.find((a) => a.slug === slug);
  if (!actor) notFound();

  return (
    <div className={styles.wrap}>
      <header className={styles.header}>
        <Link href="/team" className="text-graphite-600 hover:underline">
          ← Команда
        </Link>
        <div className="mt-8 grid gap-8 md:grid-cols-2">
          <div className="relative aspect-[4/5] overflow-hidden rounded-lg bg-graphite-200">
            <Image
              src={actor.photo}
              alt={actor.name}
              fill
              className="object-cover"
              priority
            />
          </div>
          <div className="flex flex-col justify-center">
            <h1 className={styles.h1}>{actor.name}</h1>
            {actor.rank && (
              <p className="mt-1 text-graphite-600">{actor.rank}</p>
            )}
            <p className="mt-2 font-medium text-graphite-700">{actor.role}</p>
            <p className="mt-4 text-graphite-700">{actor.bio}</p>
            <div className="mt-6">
              <h2 className="font-serif text-lg font-bold text-graphite-950">
                Роли в театре
              </h2>
              <ul className="mt-2 list-disc pl-5 text-graphite-700">
                {actor.roles.map((r, i) => (
                  <li key={i}>{r}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </header>
    </div>
  );
}
