import { useEffect, useState, useCallback } from "react";
import { getAllPosts } from "@/lib/firebase/firestore";
import type { Post } from "@/types";

interface UsePostsReturn {
  posts: Post[];
  loading: boolean;
  error: string | null;
  refresh: () => void;
}

export function usePosts(): UsePostsReturn {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getAllPosts();
      setPosts(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load posts");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetch();
  }, [fetch]);

  return { posts, loading, error, refresh: fetch };
}
