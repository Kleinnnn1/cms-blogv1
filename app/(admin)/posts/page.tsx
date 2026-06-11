"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePosts } from "@/hooks/usePosts";
import { deletePost } from "@/lib/firebase/firestore";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { Spinner } from "@/components/ui/Spinner";
import { formatDateShort } from "@/lib/utils";
import { PenSquare, Pencil, Trash2 } from "lucide-react";
import type { Post, PostStatus } from "@/types";

type FilterStatus = "all" | PostStatus;

export default function PostsPage() {
  const { posts, loading, error, refresh } = usePosts();
  const [filter, setFilter] = useState<FilterStatus>("all");
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [confirmPost, setConfirmPost] = useState<Post | null>(null);

  useEffect(() => {
    document.title = "Posts | TopicHub";
  }, []);

  const filtered =
    filter === "all" ? posts : posts.filter((p) => p.status === filter);

  async function handleDelete() {
    if (!confirmPost) return;
    setDeletingId(confirmPost.id);
    try {
      await deletePost(confirmPost.id);
      refresh();
    } finally {
      setDeletingId(null);
      setConfirmPost(null);
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-neutral-900">
            Posts
          </h1>
          <p className="mt-1 text-sm text-neutral-500">
            {posts.length} {posts.length === 1 ? "post" : "posts"} total
          </p>
        </div>
        <Link
          href="/posts/new"
          className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
        >
          <PenSquare size={14} aria-hidden="true" />
          New Post
        </Link>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-1 rounded-lg border border-neutral-200 bg-neutral-100 p-1 w-fit">
        {(["all", "published", "draft"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className={`rounded-md px-3 py-1.5 text-sm font-medium capitalize transition-colors ${
              filter === tab
                ? "bg-white text-neutral-900 shadow-sm"
                : "text-neutral-500 hover:text-neutral-700"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="rounded-xl border border-neutral-200 bg-white">
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <Spinner />
          </div>
        ) : error ? (
          <div className="flex items-center justify-center py-16">
            <p className="text-sm text-red-500">{error}</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <p className="text-sm text-neutral-500">
              {filter === "all" ? "No posts yet." : `No ${filter} posts.`}
            </p>
            {filter === "all" && (
              <Link
                href="/posts/new"
                className="mt-3 text-sm font-medium text-blue-600 hover:text-blue-700"
              >
                Create your first post →
              </Link>
            )}
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-neutral-200">
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wide text-neutral-500">
                  Title
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wide text-neutral-500">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wide text-neutral-500">
                  Updated
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wide text-neutral-500">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {filtered.map((post) => (
                <tr key={post.id} className="group hover:bg-neutral-50">
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-medium text-neutral-900 truncate max-w-xs">
                        {post.title}
                      </p>
                      <p className="mt-0.5 text-xs text-neutral-400">
                        /{post.slug}
                      </p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <StatusBadge status={post.status} />
                  </td>
                  <td className="px-6 py-4 text-neutral-500">
                    {formatDateShort(post.updatedAt)}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/posts/${post.id}`}
                        className="rounded-md p-1.5 text-neutral-400 transition-colors hover:bg-neutral-100 hover:text-neutral-700"
                        aria-label={`Edit ${post.title}`}
                      >
                        <Pencil size={14} aria-hidden="true" />
                      </Link>
                      <button
                        onClick={() => setConfirmPost(post)}
                        disabled={deletingId === post.id}
                        className="rounded-md p-1.5 text-neutral-400 transition-colors hover:bg-red-50 hover:text-red-600 disabled:opacity-50"
                        aria-label={`Delete ${post.title}`}
                      >
                        {deletingId === post.id ? (
                          <Spinner size="sm" />
                        ) : (
                          <Trash2 size={14} aria-hidden="true" />
                        )}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Confirm delete dialog */}
      <ConfirmDialog
        open={!!confirmPost}
        title="Delete post"
        description={`"${confirmPost?.title}" will be permanently deleted. This cannot be undone.`}
        confirmLabel="Delete"
        onConfirm={handleDelete}
        onCancel={() => setConfirmPost(null)}
        destructive
      />
    </div>
  );
}
