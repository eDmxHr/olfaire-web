import type { Metadata } from "next";
import "./globals.css";
import { Nav } from "@/components/nav";
import { Footer } from "@/components/footer";
import { ScrollProgress } from "@/components/scroll-progress";
import { Cormorant_Garamond, DM_Sans } from "next/font/google";
import { cn } from "@/lib/utils";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  style: ["normal", "italic"],
  variable: "--font-serif",
  display: "swap",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Olfaire — Your Scent Intelligence",
    template: "%s · Olfaire",
  },
  description:
    "Olfaire turns your perfume collection into a curated daily experience. AI-powered daily picks, layering chemistry, and fragrance intelligence — guided by Lumi.",
  keywords: [
    "perfume app",
    "fragrance app",
    "cologne tracker",
    "scent collection",
    "perfume layering",
    "fragrance AI",
    "Lumi",
    "Olfaire",
    "daily fragrance",
    "perfume recommendation",
    "fragrance DNA",
    "oud",
    "parfum",
    "niche fragrance",
  ],
  authors: [{ name: "Olfaire" }],
  creator: "Olfaire",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://olfaire.app",
    siteName: "Olfaire",
    title: "Olfaire — Your Scent Intelligence",
    description:
      "AI-powered daily fragrance picks and layering chemistry for serious collectors.",
    images: [
      {
        url: "/og.png",
        width: 1200,
        height: 630,
        alt: "Olfaire — Your Scent Intelligence",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Olfaire — Your Scent Intelligence",
    description:
      "AI-powered daily fragrance picks and layering chemistry for serious collectors.",
    images: ["/og.png"],
  },
  metadataBase: new URL("https://olfaire.app"),
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-snippet": -1,
      "max-image-preview": "large",
      "max-video-preview": -1,
    },
  },
  icons: {
    icon: "/logo.png",
    apple: "/logo.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      scroll-behavior="smooth"
      lang="en"
      className={cn("font-sans", cormorant.variable, dmSans.variable)}
    >
      <body className="grain">
        <ScrollProgress />
        <Nav />
        <main>{children}</main>
        <Footer />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
