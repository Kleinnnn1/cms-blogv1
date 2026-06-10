export type PostStatus = "draft" | "published";

export interface Post {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  coverImage: string | null;
  tags: string[];
  status: PostStatus;
  createdAt: string;
  updatedAt: string;
}

export type PostPayload = Omit<Post, "id" | "createdAt" | "updatedAt">;
