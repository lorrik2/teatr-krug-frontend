import type { Metadata } from "next";
import { Inter, Cinzel } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ScrollToTop from "@/components/ScrollToTop";

const inter = Inter({
  subsets: ["latin", "cyrillic"],
  variable: "--font-inter",
});

/* Cinzel — театральный шрифт в духе Posterama (римская античность, афиши). Чтобы использовать Posterama — добавьте файлы в public/fonts/ и @font-face в globals.css */
const cinzel = Cinzel({
  subsets: ["latin", "latin-ext"],
  variable: "--font-posterama",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Драматический театр «Круг» — Афиша, билеты, новости",
  description:
    "Официальный сайт драматического театра «Круг». Афиша спектаклей, покупка билетов, труппа, новости и контакты.",
  icons: {
    icon: "/logo/лого круг.png",
  },
  openGraph: {
    title: "Драматический театр «Круг»",
    description: "Афиша, билеты, команда, новости.",
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
      className={`${inter.variable} ${cinzel.variable} font-sans`}
    >
      <body className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
        <ScrollToTop />
      </body>
    </html>
  );
}
