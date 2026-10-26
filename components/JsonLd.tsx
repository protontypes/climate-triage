import type { Graph } from "schema-dts";
import config from "../app/config.mts";

const { siteUrl } = config.meta;
const organizationId = `${siteUrl}/#organization`;
const websiteId = `${siteUrl}/#website`;

const jsonLdGraph: Graph = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": organizationId,
      name: config.meta.siteName,
      url: siteUrl,
      logo: `${siteUrl}/logo.svg`,
      sameAs: [config.links.github]
    },
    {
      "@type": "WebSite",
      "@id": websiteId,
      url: siteUrl,
      name: config.meta.siteName,
      publisher: { "@id": organizationId }
    },
    {
      "@type": "WebPage",
      "@id": `${siteUrl}/#webpage`,
      url: siteUrl,
      name: config.meta.title,
      description: config.meta.description,
      inLanguage: config.meta.locale,
      isPartOf: { "@id": websiteId }
    }
  ]
};

export const JsonLd = () => {
  return (
    // Not next/script: it injects client-side, so crawlers that don't run JS miss it.
    <script
      type="application/ld+json"
      // biome-ignore lint/security/noDangerouslySetInnerHtml: JSON-LD from our own static config
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(jsonLdGraph).replace(/</g, "\\u003c")
      }}
    />
  );
};
