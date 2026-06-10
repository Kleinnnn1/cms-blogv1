import Link from "next/link";
import { SITE_AUTHOR } from "@/constant";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-neutral-200 bg-white">
      <div className="mx-auto flex max-w-3xl items-center justify-between px-6 py-6">
        <p className="text-sm text-neutral-500">© {year} {SITE_AUTHOR}</p>
        <Link
          href="/admin/dashboard"
          className="text-sm text-neutral-400 transition-colors hover:text-neutral-600"
        >
          Admin
        </Link>
      </div>
    </footer>
  );
}