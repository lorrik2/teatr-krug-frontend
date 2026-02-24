"use client";

import { BreadcrumbJsonLd } from "next-seo";
import { SITE_URL } from "@/lib/site-config";

type BreadcrumbItem = { name: string; href?: string };

type Props = { items: BreadcrumbItem[] };

export default function BreadcrumbJsonLdComponent({ items }: Props) {
  const ldItems = items.map((it, i) => ({
    name: it.name,
    ...(it.href && { item: `${SITE_URL}${it.href}` }),
  }));

  return <BreadcrumbJsonLd items={ldItems} />;
}
