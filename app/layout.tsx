import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Sentimiento Transgresivo",
    template: "%s | Sentimiento Transgresivo",
  },
  description:
    "Visualización y comparación de métricas musicales y análisis de sentimiento de las discografías de Extremoduro y Robe.",
  icons: {
    icon: [
      { url: "/icon.svg", type: "image/svg+xml", sizes: "any" },
    ],
    shortcut: "/icon.svg",
    apple: "/icon.webp",
  },
  manifest: "/manifest.webmanifest",
  openGraph: {
    title: "Sentimiento Transgresivo",
    description:
      "Visualización y comparación de métricas musicales y análisis de sentimiento de las discografías de Extremoduro y Robe.",
    siteName: "Sentimiento Transgresivo",
    locale: "es_ES",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Sentimiento Transgresivo",
    description:
      "Visualización y comparación de métricas musicales y análisis de sentimiento de Extremoduro y Robe.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col" suppressHydrationWarning>{children}</body>
    </html>
  );
}
