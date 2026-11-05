"use client";

import React from "react";
import { usePosts } from "../hooks/usePosts";
import { PostCard } from "../components/PostCard";

export default function HomePage(): React.JSX.Element {
  const { posts, isLoading, error } = usePosts();

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight sm:text-5xl">
          Останні публікації
        </h1>
        <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-500">
          Читайте найсвіжіші думки, ідеї та новини з нашого блогу.
        </p>
      </div>

      {isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 animate-pulse">
          {[1, 2, 3].map((item) => (
            <div
              key={item}
              className="h-96 bg-white rounded-2xl shadow-sm border border-gray-100"
            />
          ))}
        </div>
      )}

      {error && !isLoading && (
        <div className="p-4 rounded-xl bg-red-50 text-red-700 text-sm border border-red-100 text-center max-w-md mx-auto">
          {error}
        </div>
      )}

      {!isLoading && !error && posts.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      )}

      {!isLoading && !error && posts.length === 0 && (
        <div className="text-center py-16 bg-white rounded-2xl border border-gray-100 shadow-sm max-w-xl mx-auto">
          <p className="text-gray-500 text-base">Поки що немає жодного опублікованого поста.</p>
        </div>
      )}
    </section>
  );
}