"use client";

import { useState, useMemo } from "react";
import { PostCard } from "@/components/blog/PostCard";
import { TagFilter } from "@/components/blog/TagFilter";
import { Spinner } from "@/components/ui/Spinner";
import { usePublishedPosts } from "@/hooks/usePublishedPosts";
import { Search } from "lucide-react";

export default function BlogPage() {
  const { posts, loading, error } = usePublishedPosts();
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const allTags = useMemo(
    () => [...new Set(posts.flatMap((p) => p.tags))].sort(),
    [posts],
  );

  const filtered = useMemo(() => {
    let result = selectedTag
      ? posts.filter((p) => p.tags.includes(selectedTag))
      : posts;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.excerpt.toLowerCase().includes(q),
      );
    }

    return result;
  }, [posts, selectedTag, searchQuery]);

  return (
    <div className="mx-auto max-w-3xl px-6 py-10">
      <div className="mb-12">
        <div className="relative">
          <Search
            size={18}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400"
            aria-hidden="true"
          />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search posts..."
            className="w-full rounded-full border border-neutral-200 bg-white py-3 pl-12 pr-4 text-sm text-neutral-900 placeholder:text-neutral-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          />
        </div>
      </div>

      {allTags.length > 0 && (
        <div className="mb-5">
          <TagFilter
            tags={allTags}
            selected={selectedTag}
            onChange={setSelectedTag}
          />
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-16">
          <Spinner />
        </div>
      ) : error ? (
        <p className="py-16 text-center text-sm text-red-500">{error}</p>
      ) : filtered.length === 0 ? (
        <p className="py-16 text-center text-sm text-neutral-500">
          {searchQuery
            ? `No posts matching "${searchQuery}".`
            : selectedTag
              ? `No posts tagged "${selectedTag}".`
              : "No posts published yet."}
        </p>
      ) : (
        <div>
          {filtered.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      )}
    </div>
  );
}
