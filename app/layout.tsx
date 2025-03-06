import "@fortawesome/fontawesome-svg-core/styles.css";
import type { Metadata, Viewport } from "next";
import { Space_Grotesk } from "next/font/google";
import React from "react";

import { TopBar } from "@/components/TopBar";
import "@/styles/globals.scss";
import config from "./config.mts";

// Fontawesome and TailwindCSS related settings
const space_grotesk = Space_Grotesk({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-space-grotesk"
});

export const metadata: Metadata = {
  metadataBase: new URL(config.meta.siteUrl),
  title: {
    default: config.meta.title,
    template: `%s | ${config.meta.title}`
  },
  description: config.meta.description,
  openGraph: {
    title: config.meta.title,
    description: config.meta.description,
    url: "./",
    siteName: config.meta.title,
    images: [config.meta.socialBanner],
    locale: "en_US",
    type: "website"
  },
  alternates: {
    canonical: "./"
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1
    }
  },
  twitter: {
    title: config.meta.title,
    card: "summary_large_image",
    images: [config.meta.socialBanner]
  },
  creator: config.author.name,
  publisher: config.author.name,
  authors: [
    {
      name: config.author.name,
      url: config.author.website
    }
  ]
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#2563eb" />
        <meta name="msapplication-TileColor" content="#2563eb" />
        <meta name="theme-color" content="#2563eb" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <script
          defer
          data-domain="climatetriage.com"
          src="https://plausible.io/js/script.js"
        ></script>
        <script
          defer
          src="https://cloud.umami.is/script.js"
          data-website-id="8ef78ec6-24ca-4940-bfdc-ee8e79b8ed3f"
        ></script>
      </head>
      <body>
        <main className={`${space_grotesk.variable} font-sans`}>
          <TopBar />
          {children}
        </main>
        {/* <SponsorMe /> */}
      </body>
    </html>
  );
}
