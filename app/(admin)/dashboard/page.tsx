"use client";

import Link from "next/link";
import { usePosts } from "@/hooks/usePosts";
import { Spinner } from "@/components/ui/Spinner";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { formatDateShort } from "@/lib/utils";
import {
  FileText,
  BookOpen,
  FileEdit,
  PenSquare,
  ExternalLink,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useEffect } from "react";

export default function DashboardPage() {
  const { posts, loading } = usePosts();
  const { user } = useAuth();

  const totalPosts = posts.length;
  const publishedPosts = posts.filter((p) => p.status === "published").length;
  const draftPosts = posts.filter((p) => p.status === "draft").length;
  const recentPosts = posts.slice(0, 5);

  useEffect(() => {
    document.title = "Dashboard | TopicHub";
  }, []);

  const stats = [
    {
      label: "Total Posts",
      value: totalPosts,
      icon: FileText,
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      label: "Published",
      value: publishedPosts,
      icon: BookOpen,
      color: "text-green-600",
      bg: "bg-green-50",
    },
    {
      label: "Drafts",
      value: draftPosts,
      icon: FileEdit,
      color: "text-amber-600",
      bg: "bg-amber-50",
    },
  ];

  const greeting = getGreeting();
  const firstName = user?.displayName?.split(" ")[0] ?? "Kenneth";

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-neutral-900">
            {greeting}, {firstName}
          </h1>
          <p className="mt-1 text-sm text-neutral-500">
            Here's what's happening with your blog.
          </p>
        </div>

        {/* Quick actions */}
        <div className="flex items-center gap-3">
          <Link
            href="/blog"
            target="_blank"
            className="flex items-center gap-2 rounded-lg border border-neutral-200 bg-white px-4 py-2 text-sm font-medium text-neutral-600 transition-colors hover:bg-neutral-50"
          >
            <ExternalLink size={14} aria-hidden="true" />
            View Blog
          </Link>
          <Link
            href="/posts/new"
            className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
          >
            <PenSquare size={14} aria-hidden="true" />
            New Post
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {stats.map(({ label, value, icon: Icon, color, bg }) => (
          <div
            key={label}
            className="rounded-xl border border-neutral-200 bg-white p-6"
          >
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-neutral-500">{label}</p>
              <div className={`${bg} rounded-lg p-2`}>
                <Icon size={16} className={color} aria-hidden="true" />
              </div>
            </div>
            <p className="mt-3 font-display text-3xl font-bold text-neutral-900">
              {loading ? "—" : value}
            </p>
          </div>
        ))}
      </div>

      {/* Recent posts */}
      <div className="rounded-xl border border-neutral-200 bg-white">
        <div className="flex items-center justify-between border-b border-neutral-200 px-6 py-4">
          <h2 className="text-sm font-semibold text-neutral-900">
            Recent Posts
          </h2>
          <Link
            href="/posts"
            className="text-xs font-medium text-blue-600 hover:text-blue-700"
          >
            View all
          </Link>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Spinner />
          </div>
        ) : recentPosts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <p className="text-sm text-neutral-500">No posts yet.</p>
            <Link
              href="/posts/new"
              className="mt-3 text-sm font-medium text-blue-600 hover:text-blue-700"
            >
              Create your first post →
            </Link>
          </div>
        ) : (
          <ul role="list" className="divide-y divide-neutral-100">
            {recentPosts.map((post) => (
              <li key={post.id}>
                <Link
                  href={`/posts/${post.id}`}
                  className="flex items-center justify-between px-6 py-4 transition-colors hover:bg-neutral-50"
                >
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-neutral-900">
                      {post.title}
                    </p>
                    <p className="mt-0.5 text-xs text-neutral-400">
                      {formatDateShort(post.updatedAt)}
                    </p>
                  </div>
                  <StatusBadge status={post.status} />
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}
