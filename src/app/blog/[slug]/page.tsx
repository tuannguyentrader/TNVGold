import type { Metadata } from "next";
import { BlogDetailClient } from "./blog-detail-client";
import { getPost } from "@/lib/blog-store";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) {
    return { title: "Post not found" };
  }
  return {
    title: post.title.vi,
    description: post.excerpt.vi,
    openGraph: {
      title: post.title.vi,
      description: post.excerpt.vi,
      type: "article",
      publishedTime: new Date(post.publishedAt).toISOString(),
    },
    alternates: {
      canonical: `/blog/${slug}`,
    },
  };
}

export default async function BlogDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return <BlogDetailClient slug={slug} />;
}
