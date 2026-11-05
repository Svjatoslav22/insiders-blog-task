"use client";

import React from "react";
import { usePosts } from "../hooks/usePosts";
import { PostCard } from "../components/PostCard";

export default function HomePage(): React.JSX.Element {
  const { posts, isLoading, error } = usePosts();

  return (
    <section className="space-y-8">
      <div className="text-center py-8 border-b border-gray-100">
        <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl">
          Свіжі думки та статті
        </h1>
        <p className="mt-3 text-lg text-gray-500 max-w-xl mx-auto">
          Сучасний блог для спільноти. Читайте актуальні матеріали або публікуйте власні.
        </p>
      </div>

      {isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
          {[1, 2, 3].map((item) => (
            <div
              key={item}
              className="h-56 bg-gray-200/70 rounded-2xl border border-gray-100"
            />
          ))}
        </div>
      )}

      {error && !isLoading && (
        <div className="p-4 rounded-xl bg-red-50 text-red-700 text-sm border border-red-100 text-center">
          {error}
        </div>
      )}

      {!isLoading && !error && posts.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      )}

      {!isLoading && !error && posts.length === 0 && (
        <div className="text-center py-16 bg-white rounded-2xl border border-gray-100">
          <p className="text-gray-500 text-base">Поки що немає жодного опублікованого поста.</p>
        </div>
      )}
    </section>
  );
}