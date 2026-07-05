import type { Metadata } from "next";
import "./globals.css";
import { fontVariables } from "@/lib/fonts";
import SmoothScroll from "@/components/providers/SmoothScroll";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { site } from "@/data/site";

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: "Garyfalia Customs — Custom Sneakers & Jackets",
    template: "%s — Garyfalia Customs",
  },
  description: site.intro,
  openGraph: {
    type: "website",
    siteName: site.name,
    title: "Garyfalia Customs — Custom Sneakers & Jackets",
    description: site.intro,
    url: site.url,
  },
  twitter: {
    card: "summary_large_image",
    title: "Garyfalia Customs — Custom Sneakers & Jackets",
    description: site.intro,
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: site.name,
  url: site.url,
  description: site.intro,
  email: site.email,
  sameAs: [site.instagram.url],
  address: { "@type": "PostalAddress", addressLocality: site.location },
  makesOffer: {
    "@type": "Offer",
    itemOffered: {
      "@type": "Service",
      name: "Custom hand-painted sneakers & denim jackets",
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${fontVariables} h-full`}>
      <body className="flex min-h-full flex-col bg-marble text-ink antialiased">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-full focus:bg-navy focus:px-5 focus:py-2.5 focus:text-sm focus:font-medium focus:text-marble focus:shadow-lift"
        >
          Skip to content
        </a>
        <SmoothScroll>
          <Header />
          <main id="main" className="flex-1">
            {children}
          </main>
          <Footer />
        </SmoothScroll>
      </body>
    </html>
  );
}
