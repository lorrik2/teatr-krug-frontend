import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ScrollToTop from "@/components/ScrollToTop";
import OrganizationJsonLd from "@/components/seo/OrganizationJsonLd";
import { SITE_URL } from "@/lib/site-config";

const montserrat = Montserrat({
  subsets: ["latin", "cyrillic"],
  variable: "--font-montserrat",
  display: "swap",
  preload: true,
  adjustFontFallback: true,
});

const posterama = localFont({
  src: "../../public/fonts/86bbde51a8a09cbad16f2259b875f654.woff2",
  variable: "--font-posterama",
  display: "swap",
  preload: true,
  adjustFontFallback: "Arial",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "Драматический театр «Круг» — Афиша, билеты, события",
  description:
    "Официальный сайт драматического театра «Круг». Афиша спектаклей, покупка билетов, труппа, события и контакты.",
  keywords: [
    "театр Круг",
    "драматический театр",
    "Санкт-Петербург",
    "афиша спектаклей",
    "купить билеты",
    "театр СПб",
  ],
  icons: { icon: "/logo/logoLayout.png" },
  openGraph: {
    type: "website",
    locale: "ru_RU",
    url: SITE_URL,
    siteName: "Драматический театр «Круг»",
    title: "Драматический театр «Круг» — Афиша, билеты, события",
    description:
      "Официальный сайт драматического театра «Круг». Афиша спектаклей, покупка билетов, труппа, события.",
    images: [
      {
        url: "/fon/8.jpg",
        width: 1200,
        height: 630,
        alt: "Драматический театр «Круг»",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Драматический театр «Круг»",
    description: "Афиша спектаклей, покупка билетов, труппа, события.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ru"
      className={`${montserrat.variable} ${posterama.variable} font-sans`}
      suppressHydrationWarning
    >
      <body className="min-h-screen flex flex-col">
        <OrganizationJsonLd />
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
        <ScrollToTop />
      </body>
    </html>
  );
}
