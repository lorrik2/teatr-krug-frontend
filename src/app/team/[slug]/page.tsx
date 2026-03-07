import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getActorBySlug, getActors } from "@/lib/cms-data";
import { canonicalUrl, OG_LOGO } from "@/lib/site-config";
import BreadcrumbJsonLd from "@/components/seo/BreadcrumbJsonLd";
import { ActorPageContent } from "@/components/ActorPage";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  try {
    const actors = await getActors();
    return actors
      .map((a) => {
        const slug =
          typeof a.slug === "string" ? a.slug : String(a?.slug ?? "");
        return { slug };
      })
      .filter((p) => p.slug.length > 0);
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const actor = await getActorBySlug(slug);
  if (!actor) return { title: "Артист", description: "Артист не найден." };
  const url = canonicalUrl(`/team/${slug}`);
  const desc =
    actor.bio?.trim() ||
    `${actor.name} — актёр (режиссёр) драматического театра «Круг».`;
  return {
    title: `${actor.name} — Драматический театр «Круг»`,
    description: desc,
    alternates: { canonical: url },
    openGraph: {
      type: "profile",
      locale: "ru_RU",
      url,
      siteName: "Драматический театр «Круг»",
      title: actor.name,
      description: desc,
      images: actor.photo
        ? [{ url: actor.photo, width: 1200, height: 630, alt: actor.name }]
        : [
            {
              url: "/logo/logoLayout.png",
              width: 1200,
              height: 630,
              alt: actor.name,
            },
          ],
    },
    twitter: {
      card: "summary_large_image",
      title: actor.name,
      description: desc,
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
