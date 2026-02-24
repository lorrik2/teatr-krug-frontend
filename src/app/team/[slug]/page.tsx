import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getActorBySlug, getActors } from "@/lib/cms-data";
import { ActorPageContent } from "@/components/ActorPage";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  const actors = await getActors();
  return actors
    .map((a) => {
      const slug = typeof a.slug === "string" ? a.slug : String(a?.slug ?? "");
      return { slug };
    })
    .filter((p) => p.slug.length > 0);
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const actor = await getActorBySlug(slug);
  if (!actor) return { title: "Артист" };
  return {
    title: `${actor.name} — Драматический театр «Круг»`,
    description: actor.bio,
    openGraph: { title: actor.name, description: actor.bio },
  };
}

export default async function ActorPage({ params }: Props) {
  const { slug } = await params;
  const actor = await getActorBySlug(slug);
  if (!actor) notFound();

  return <ActorPageContent actor={actor} />;
}
