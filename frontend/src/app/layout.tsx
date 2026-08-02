import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  display: "swap",
});

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "https://noblenests.co";

export const metadata: Metadata = {
  metadataBase: new URL(APP_URL),
  title: {
    template: "%s — Noble Nests Co",
    default: "Noble Nests Co — Luxury Real Estate Investment Advisory",
  },
  description:
    "Noble Nests Co curates verified, high-growth luxury real estate investments in Bangalore, Kochi, and beyond. Not a listing site — a boutique investment advisory platform for serious investors.",
  keywords: [
    "Luxury Real Estate India",
    "Investment Advisory",
    "High ROI Properties",
    "Luxury Villas Bangalore",
    "NRI Property Investment",
    "Premium Apartments Kochi",
    "Real Estate Portfolio",
  ],
  authors: [{ name: "Noble Nests Co", url: APP_URL }],
  creator: "Noble Nests Co",
  robots: { index: true, follow: true },
  alternates: { canonical: APP_URL },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: APP_URL,
    siteName: "Noble Nests Co",
    title: "Noble Nests Co — Luxury Real Estate Investment Advisory",
    description:
      "Curated luxury real estate investments for discerning HNI investors. Verified projects, transparent advisory, exceptional returns.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Noble Nests Co — Luxury Real Estate Investment Advisory",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Noble Nests Co — Luxury Real Estate Investment Advisory",
    description: "Curated luxury real estate investments for discerning HNI investors.",
    images: ["/og-image.jpg"],
    creator: "@noblenestco",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark scroll-smooth">
      <body
        className={`${inter.variable} ${outfit.variable} antialiased min-h-screen flex flex-col`}
      >
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "RealEstateAgent",
              name: "Noble Nests Co",
              image: `${APP_URL}/og-image.jpg`,
              url: APP_URL,
              telephone: "+91-9000000000",
              address: {
                "@type": "PostalAddress",
                addressLocality: "Bangalore",
                addressRegion: "Karnataka",
                addressCountry: "IN"
              },
              description: "Luxury Real Estate Investment Advisory Platform.",
            })
          }}
        />
        <main className="flex-1">
          {children}
        </main>
      </body>
    </html>
  );
}
