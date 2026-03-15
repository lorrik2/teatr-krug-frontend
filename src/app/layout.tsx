import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ScrollToTop from "@/components/ScrollToTop";
import NavigationProgress from "@/components/NavigationProgress/NavigationProgress";
import { getContactInfo, EMPTY_CONTACT } from "@/lib/cms-data";
import OrganizationJsonLd from "@/components/seo/OrganizationJsonLd";
import YandexMetrika from "@/components/YandexMetrika";
import MailRuMetrika from "@/components/MailRuMetrika";
import { SITE_URL } from "@/lib/site-config";

const montserrat = Montserrat({
  subsets: ["latin", "cyrillic"],
  variable: "--font-montserrat",
  display: "swap",
  preload: true,
  adjustFontFallback: true,
});

const posterama = localFont({
  src: "../../public/fonts/font_3.woff2",
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
    "Круг",
    "театр Круг",
    "драматический театр",
    "драматический театр Кург",
    "камерный театр",
    "Санкт-Петербург",
    "афиша спектаклей",
    "купить билеты",
    "театр СПб",
    "театр",
    "teatr krug",
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
        url: "/logo/logoLayout.png",
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

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const contactInfo = await getContactInfo().catch(() => EMPTY_CONTACT);
  return (
    <html
      lang="ru"
      className={`${montserrat.variable} ${posterama.variable} font-sans`}
      suppressHydrationWarning
    >
      <body className="min-h-screen flex flex-col">
        <YandexMetrika />
        <MailRuMetrika />
        <NavigationProgress />
        <OrganizationJsonLd />
        <Header />
        <main className="flex-1">{children}</main>
        <Footer contactInfo={contactInfo} />
        <ScrollToTop />
      </body>
    </html>
  );
}
