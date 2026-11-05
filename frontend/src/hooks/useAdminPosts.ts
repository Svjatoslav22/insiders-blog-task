"use client";

import { useEffect, useState } from "react";
import { apiRequest } from "../lib/api";
import type { Post } from "../types";

interface UseAdminPostsResult {
  posts: Post[];
  isLoading: boolean;
  error: string | null;
  createPost: (title: string, content: string) => Promise<void>;
  updatePost: (id: string, title: string, content: string) => Promise<void>;
  deletePost: (id: string) => Promise<void>;
  refetch: () => Promise<void>;
}

export function useAdminPosts(): UseAdminPostsResult {
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
      const message =
        err instanceof Error ? err.message : "Не вдалося завантажити список постів";
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void fetchPosts();
  }, []);

  const createPost = async (title: string, content: string): Promise<void> => {
    const res = await apiRequest<{ post: Post }>("/posts", {
      method: "POST",
      body: { title, content },
    });
    setPosts((prev) => [res.post, ...prev]);
  };

  const updatePost = async (
    id: string,
    title: string,
    content: string
  ): Promise<void> => {
    const res = await apiRequest<{ post: Post }>(`/posts/${id}`, {
      method: "PUT",
      body: { title, content },
    });
    setPosts((prev) => prev.map((p) => (p.id === id ? res.post : p)));
  };

  const deletePost = async (id: string): Promise<void> => {
    await apiRequest<{ message: string }>(`/posts/${id}`, {
      method: "DELETE",
    });
    setPosts((prev) => prev.filter((p) => p.id !== id));
  };

  return {
    posts,
    isLoading,
    error,
    createPost,
    updatePost,
    deletePost,
    refetch: fetchPosts,
  };
}