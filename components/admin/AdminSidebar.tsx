"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, FileText, PenSquare } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

const NAV_ITEMS = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "Posts",
    href: "/posts",
    icon: FileText,
  },
  {
    label: "New Post",
    href: "/posts/new",
    icon: PenSquare,
  },
] as const;

export function AdminSidebar() {
  const pathname = usePathname();
  const { user } = useAuth();

  return (
    <aside className="flex w-60 flex-col border-r border-neutral-200 bg-white">
      {/* Logo */}
      <div className="border-b border-neutral-200 px-6 py-5">
        <Link
          href="/dashboard"
          className="font-display text-lg font-bold text-neutral-900"
        >
          CMS<span className="text-blue-600">.</span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4" aria-label="Admin navigation">
        <ul className="space-y-1" role="list">
          {NAV_ITEMS.map(({ label, href, icon: Icon }) => {
            const isActive =
              href === "/posts"
                ? pathname === "/posts" ||
                  (pathname.startsWith("/posts/") &&
                    !pathname.startsWith("/posts/new"))
                : pathname === href || pathname.startsWith(`${href}/`);

            return (
              <li key={href}>
                <Link
                  href={href}
                  className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-blue-50 text-blue-700"
                      : "text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900"
                  }`}
                  aria-current={isActive ? "page" : undefined}
                >
                  <Icon
                    size={16}
                    className={isActive ? "text-blue-600" : "text-neutral-400"}
                    aria-hidden="true"
                  />
                  {label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Bottom - User info */}
      <div className="border-t border-neutral-200 px-4 py-4">
        <p className="truncate text-xs text-neutral-400">
          {user?.displayName ?? user?.email ?? "Admin"}
        </p>
      </div>
    </aside>
  );
}
