import type { Metadata } from "next";
import ErrorFallback from "@/components/ErrorFallback";

export const metadata: Metadata = {
  title: "Страница не найдена — Драматический театр «Круг»",
  description: "Запрашиваемая страница не найдена. Вернитесь на главную или в афишу театра Круг.",
  openGraph: {
    type: "website",
    locale: "ru_RU",
    siteName: "Драматический театр «Круг»",
    title: "Страница не найдена — Драматический театр «Круг»",
    description: "Запрашиваемая страница не найдена. Вернитесь на главную или в афишу театра Круг.",
    images: [{ url: "/logo/logoLayout.png", width: 1200, height: 630, alt: "Драматический театр «Круг»" }],
  },
};

export default function NotFound() {
  return <ErrorFallback />;
}
