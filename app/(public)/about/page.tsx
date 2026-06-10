import type { Metadata } from "next";
import { SITE_AUTHOR } from "@/constant";

export const metadata: Metadata = {
  title: "About",
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <div className="mb-10">
        <h1 className="font-display text-4xl font-bold text-neutral-900">
          About
        </h1>
      </div>

      <div className="prose prose-neutral max-w-none">
        <p className="text-lg text-neutral-700 leading-relaxed">
          Hi, I'm {SITE_AUTHOR}. Welcome to my blog.
        </p>
        <p className="mt-4 text-neutral-600 leading-relaxed">
          I write about software development, tech, and everything in between.
        </p>
      </div>
    </div>
  );
}