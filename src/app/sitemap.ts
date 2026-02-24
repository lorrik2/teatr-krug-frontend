import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site-config";
import {
  getRepertoirePerformances,
  getActors,
  getNewsItems,
} from "@/lib/cms-data";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [performances, actors, newsItems] = await Promise.all([
    getRepertoirePerformances(),
    getActors(),
    getNewsItems(),
  ]);

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: SITE_URL, lastModified: new Date(), changeFrequency: "weekly", priority: 1 },
    { url: `${SITE_URL}/afisha`, lastModified: new Date(), changeFrequency: "daily", priority: 0.9 },
    { url: `${SITE_URL}/repertuar`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.9 },
    { url: `${SITE_URL}/o-teatre`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE_URL}/o-teatre/fotogalereya`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
    { url: `${SITE_URL}/truppa`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE_URL}/sobytiya`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
    { url: `${SITE_URL}/kontakty`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE_URL}/arenda-zala`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
    { url: `${SITE_URL}/teatr-teos`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
    { url: `${SITE_URL}/partners`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
    { url: `${SITE_URL}/pomoch-teatru`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
  ];

  const performanceUrls: MetadataRoute.Sitemap = performances.map((p) => ({
    url: `${SITE_URL}/repertuar/${p.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  const afishaUrls: MetadataRoute.Sitemap = performances
    .filter((p) => p.inAfisha)
    .map((p) => ({
      url: `${SITE_URL}/afisha/${p.slug}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.85,
    }));

  const actorUrls: MetadataRoute.Sitemap = actors
    .filter((a) => a.slug)
    .map((a) => ({
      url: `${SITE_URL}/team/${a.slug}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.6,
    }));

  const newsUrls: MetadataRoute.Sitemap = newsItems.map((n) => ({
    url: `${SITE_URL}/sobytiya/${n.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  return [
    ...staticRoutes,
    ...performanceUrls,
    ...afishaUrls,
    ...actorUrls,
    ...newsUrls,
  ];
}
