import type { MetadataRoute } from "next";
import config from "./config.mts";

// Required with `output: "export"`: Next 15+ no longer assumes metadata routes are static.
export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/"
    },
    sitemap: `${config.meta.siteUrl}/sitemap.xml`,
    host: config.meta.siteUrl
  };
}
