import Script from "next/script";
import { Graph } from "schema-dts";
import config from "../app/config.mts";

const jsonLdGraph: Graph = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": "website",
      url: config.meta.siteUrl,
      author: {
        "@id": "person"
      },
      publisher: {
        "@id": "person"
      }
    },
    {
      "@type": "WebPage",
      "@id": config.meta.siteUrl,
      url: config.meta.siteUrl,
      name: config.meta.title,
      inLanguage: config.meta.locale,
      description: config.meta.description,
      author: {
        "@id": "person"
      },
      publisher: {
        "@id": "person"
      }
    }
  ]
};

export const JsonLd = () => {
  return (
    <Script
      id="json-ld"
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(jsonLdGraph)
      }}
    />
  );
};
