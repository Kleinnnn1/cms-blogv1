"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { PostForm } from "@/components/admin/PostForm";
import { createPost } from "@/lib/firebase/firestore";
import { generateExcerpt } from "@/lib/utils";
import type { PostFormValues } from "@/lib/validations";

export default function NewPostPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(values: PostFormValues) {
    setIsSubmitting(true);
    try {
      await createPost({
        title: values.title,
        slug: values.slug,
        content: values.content,
        excerpt: values.excerpt || generateExcerpt(values.content),
        coverImage: values.coverImage,
        tags: values.tags,
        status: values.status,
      });
      router.push("/posts");
    } finally {
      setIsSubmitting(false);
    }
  }

  return <PostForm onSubmit={handleSubmit} isSubmitting={isSubmitting} />;
}