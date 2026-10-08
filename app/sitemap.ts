import { MetadataRoute } from "next";
import config from "./config.mts";
import { getData } from "./data-loader";

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = config.meta.siteUrl;
  const data = getData();
  const lastModified = new Date().toISOString().split("T")[0];

  const languageRoutes = data.languages.map((l) => ({
    url: `${siteUrl}/language/${l.id}`,
    lastModified
  }));

  const categoryRoutes = data.categories.map((c) => ({
    url: `${siteUrl}/category/${c.id}`,
    lastModified
  }));

  const tagRoutes = data.tags.map((t) => ({
    url: `${siteUrl}/tag/${t.id}`,
    lastModified
  }));

  const routes = ["", "about"].map((route) => ({
    url: `${siteUrl}/${route}`,
    lastModified
  }));

  return [...routes, ...languageRoutes, ...categoryRoutes, ...tagRoutes];
}
