import { useEffect, useState } from "react";
import { getPostById } from "@/lib/firebase/firestore";
import type { Post } from "@/types";

interface UsePostReturn {
  post: Post | null;
  loading: boolean;
  error: string | null;
}

export function usePost(id: string): UsePostReturn {
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    let cancelled = false;

    async function fetch() {
      setLoading(true);
      setError(null);
      try {
        const data = await getPostById(id);
        if (!cancelled) setPost(data);
      } catch (err) {
        if (!cancelled)
          setError(err instanceof Error ? err.message : "Failed to load post");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetch();

    return () => {
      cancelled = true;
    };
  }, [id]);

  return { post, loading, error };
}
