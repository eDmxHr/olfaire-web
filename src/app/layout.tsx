import type { Metadata } from 'next'
import './globals.css'
import { Nav } from '@/components/Nav'
import { Footer } from '@/components/Footer'
import { Inter } from "next/font/google";
import { cn } from "@/lib/utils";

const inter = Inter({subsets:['latin'],variable:'--font-sans'});

export const metadata: Metadata = {
  title: {
    default: 'Olfaire — Your Scent Intelligence',
    template: '%s · Olfaire',
  },
  description:
    'Olfaire turns your perfume collection into a curated daily experience. AI-powered daily picks, layering chemistry, and fragrance intelligence — guided by Lumi.',
  keywords: [
    'perfume app', 'fragrance app', 'cologne tracker', 'scent collection',
    'perfume layering', 'fragrance AI', 'Lumi', 'Olfaire', 'daily fragrance',
    'perfume recommendation', 'fragrance DNA', 'oud', 'parfum', 'niche fragrance',
  ],
  authors: [{ name: 'Olfaire' }],
  creator: 'Olfaire',
  openGraph: {
    type:        'website',
    locale:      'en_US',
    url:         'https://olfaire.app',
    siteName:    'Olfaire',
    title:       'Olfaire — Your Scent Intelligence',
    description: 'AI-powered daily fragrance picks and layering chemistry for serious collectors.',
    images: [{
      url:    'https://olfaire.app/og.jpg',
      width:  1200,
      height: 630,
      alt:    'Olfaire — Your Scent Intelligence',
    }],
  },
  twitter: {
    card:        'summary_large_image',
    title:       'Olfaire — Your Scent Intelligence',
    description: 'AI-powered daily fragrance picks and layering chemistry for serious collectors.',
    images:      ['https://olfaire.app/og.jpg'],
  },
  metadataBase: new URL('https://olfaire.app'),
  robots: {
    index:  true,
    follow: true,
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={cn("font-sans", inter.variable)}>
      <body className="grain">
        <Nav />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  )
}
