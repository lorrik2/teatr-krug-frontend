import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getActorBySlug, getActors } from "@/lib/cms-data";
import { SITE_URL } from "@/lib/site-config";
import BreadcrumbJsonLd from "@/components/seo/BreadcrumbJsonLd";
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
  const url = `${SITE_URL}/team/${slug}`;
  return {
    title: `${actor.name} — Драматический театр «Круг»`,
    description: actor.bio,
    alternates: { canonical: url },
    openGraph: {
      title: actor.name,
      description: actor.bio,
      url,
      images: actor.photo ? [{ url: actor.photo, alt: actor.name }] : undefined,
    },
  };
}

export default async function ActorPage({ params }: Props) {
  const { slug } = await params;
  const actor = await getActorBySlug(slug);
  if (!actor) notFound();

  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Главная", href: "/" },
          { name: "Команда", href: "/team" },
          { name: actor.name },
        ]}
      />
      <ActorPageContent actor={actor} />
    </>
  );
}
