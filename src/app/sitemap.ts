import type { MetadataRoute } from "next";
import { listPosts } from "@/lib/blog-store";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://tnvgold.vercel.app";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    { url: SITE_URL, lastModified: now, changeFrequency: "daily", priority: 1.0 },
    { url: `${SITE_URL}/goldpulse`, lastModified: now, changeFrequency: "hourly", priority: 0.9 },
    { url: `${SITE_URL}/blog`, lastModified: now, changeFrequency: "hourly", priority: 0.8 },
  ];

  // Blog posts (dynamic)
  let blogPages: MetadataRoute.Sitemap = [];
  try {
    const posts = await listPosts({ limit: 200 });
    blogPages = posts.map((p) => ({
      url: `${SITE_URL}/blog/${p.slug}`,
      lastModified: new Date(p.publishedAt),
      changeFrequency: "weekly" as const,
      priority: 0.7,
    }));
  } catch {
    // fallback: empty
  }

  return [...staticPages, ...blogPages];
}
