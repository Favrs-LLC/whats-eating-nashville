import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import { generateOrganizationJsonLd } from "@/lib/seo";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const playfairDisplay = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
});

export const metadata: Metadata = {
  title: {
    default: "What's Eating Nashville",
    template: "%s | What's Eating Nashville"
  },
  description: "Discover Nashville's incredible food scene through the eyes of local creators. From hot chicken joints to hidden gems, explore Music City's culinary landscape.",
  keywords: ["Nashville food", "Nashville restaurants", "hot chicken", "Music City dining", "Nashville eats", "food bloggers", "restaurant reviews"],
  authors: [{ name: "What's Eating Nashville" }],
  creator: "What's Eating Nashville",
  publisher: "What's Eating Nashville",
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: '/',
    siteName: "What's Eating Nashville",
    title: "What's Eating Nashville",
    description: "Discover Nashville's incredible food scene through the eyes of local creators",
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: "What's Eating Nashville - Discover Music City's Food Scene",
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@whatseatingnash',
    creator: '@whatseatingnash',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const organizationJsonLd = generateOrganizationJsonLd()

  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationJsonLd),
          }}
        />
      </head>
      <body
        className={`${inter.variable} ${playfairDisplay.variable} font-sans antialiased`}
      >
        <div className="min-h-screen flex flex-col">
          <NavBar />
          <main className="flex-1">
            {children}
          </main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
