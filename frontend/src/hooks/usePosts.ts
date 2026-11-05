"use client";

import { useEffect, useState } from "react";
import { apiRequest } from "../lib/api";
import type { Post } from "../types";

interface UsePostsResult {
  posts: Post[];
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function usePosts(): UsePostsResult {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPosts = async (): Promise<void> => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await apiRequest<{ posts: Post[] }>("/posts");
      setPosts(data.posts);
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : "Не вдалося завантажити пости";
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void fetchPosts();
  }, []);

  return { posts, isLoading, error, refetch: fetchPosts };
}