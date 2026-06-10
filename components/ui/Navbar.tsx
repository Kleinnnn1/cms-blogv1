"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { SITE_NAME } from "@/constant";

const NAV_LINKS = [
  { label: "Blog", href: "/blog" },
  { label: "About", href: "/about" },
] as const;

export function Navbar() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 border-b border-neutral-200 bg-white/80 backdrop-blur-sm">
      <nav
        className="mx-auto flex max-w-3xl items-center justify-between px-6 py-4"
        aria-label="Main navigation"
      >
        <Link
          href="/"
          className="font-display text-xl font-bold tracking-tight text-neutral-900 transition-opacity hover:opacity-70"
        >
          {SITE_NAME}
          <span className="text-blue-600">.</span>
        </Link>

        <ul className="flex items-center gap-6" role="list">
          {NAV_LINKS.map(({ label, href }) => (
            <li key={href}>
              <Link
                href={href}
                className={`text-sm font-medium transition-colors hover:text-blue-600 ${
                  pathname.startsWith(href)
                    ? "text-blue-600"
                    : "text-neutral-600"
                }`}
                aria-current={pathname.startsWith(href) ? "page" : undefined}
              >
                {label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
