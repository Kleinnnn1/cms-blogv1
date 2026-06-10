"use client";

import { use } from "react";
import { notFound } from "next/navigation";
import { useEffect, useState } from "react";
import { getPostBySlug } from "@/lib/firebase/firestore";
import { PostContent } from "@/components/blog/PostContent";
import { Spinner } from "@/components/ui/Spinner";
import { formatDate } from "@/lib/utils";
import type { Post } from "@/types";

export default function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getPostBySlug(slug).then((data) => {
      setPost(data);
      setLoading(false);
    });
  }, [slug]);

  if (loading)
    return (
      <div className="flex justify-center py-16">
        <Spinner />
      </div>
    );
  if (!post) return notFound();

  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <div className="mb-10 space-y-4">
        {post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-medium text-blue-700"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
        <h1 className="font-display text-4xl font-bold text-neutral-900">
          {post.title}
        </h1>
        {post.excerpt && (
          <p className="text-lg text-neutral-500">{post.excerpt}</p>
        )}
        <p className="text-sm text-neutral-400">{formatDate(post.createdAt)}</p>
        {post.coverImage && (
          <img
            src={post.coverImage}
            alt={post.title}
            className="w-full rounded-xl object-cover"
          />
        )}
      </div>
      <PostContent content={post.content} />
    </div>
  );
}
