"use client";

import { useEffect, useState } from "react";
import { apiRequest } from "../lib/api";
import type { Post } from "../types";

interface UsePostResult {
  post: Post | null;
  isLoading: boolean;
  error: string | null;
}

export function usePost(id: string): UsePostResult {
  const [post, setPost] = useState<Post | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    let isMounted = true;
    setIsLoading(true);
    setError(null);

    apiRequest<{ post: Post }>(`/posts/${id}`)
      .then((data) => {
        if (isMounted) {
          setPost(data.post);
        }
      })
      .catch((err: unknown) => {
        if (isMounted) {
          const message =
            err instanceof Error ? err.message : "Не вдалося завантажити пост";
          setError(message);
        }
      })
      .finally(() => {
        if (isMounted) {
          setIsLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [id]);

  return { post, isLoading, error };
}