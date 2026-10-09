import { Metadata } from "next";
import config from "./config.mts";

interface PageSEOProps {
  title: string;
  description?: string;
  image?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}

export function genPageMetadata({ title, description, image, ...rest }: PageSEOProps): Metadata {
  const banner = image ?? `${config.meta.siteUrl}${config.meta.socialBanner}`;
  return {
    title,
    openGraph: {
      title: `${title} | ${config.meta.title}`,
      description: description || config.meta.description,
      url: "./",
      siteName: config.meta.title,
      images: [
        {
          url: banner,
          width: 1200,
          height: 630,
          alt: title
        }
      ],
      locale: "en_US",
      type: "website"
    },
    twitter: {
      title: `${title} | ${config.meta.title}`,
      card: "summary_large_image",
      images: [banner]
    },
    ...rest
  };
}
