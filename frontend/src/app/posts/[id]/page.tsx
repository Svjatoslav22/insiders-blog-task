"use client";

import React, { Suspense } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { usePost } from "../../../hooks/usePost";

function PostDetailSkeleton(): React.JSX.Element {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12 animate-pulse space-y-6">
      <div className="h-5 w-32 bg-gray-200 rounded" />
      <div className="h-10 w-3/4 bg-gray-200 rounded" />
      <div className="h-64 bg-gray-200 rounded-2xl" />
      <div className="space-y-3">
        <div className="h-4 bg-gray-200 rounded w-full" />
        <div className="h-4 bg-gray-200 rounded w-5/6" />
      </div>
    </div>
  );
}

function PostDetailContent(): React.JSX.Element {
  const params = useParams();
  const id = typeof params.id === "string" ? params.id : "";
  const { post, isLoading, error } = usePost(id);

  if (isLoading) {
    return <PostDetailSkeleton />;
  }

  if (error || !post) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16 text-center space-y-4">
        <h2 className="text-2xl font-bold text-gray-900">Пост не знайдено</h2>
        <p className="text-gray-500 text-sm">
          {error ?? "Можливо, пост було видалено або посилання застаріло."}
        </p>
        <div>
          <Link
            href="/"
            className="inline-flex items-center text-sm font-semibold text-indigo-600 hover:text-indigo-800"
          >
            ← Повернутися до публікацій
          </Link>
        </div>
      </div>
    );
  }

  const formattedDate = new Date(post.createdAt).toLocaleDateString("uk-UA", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  const authorInitial = (post.author.name ?? post.author.email).charAt(0).toUpperCase();

  return (
    <article className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
      {/* Кнопка Назад */}
      <Link
        href="/"
        className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-indigo-600 mb-8 transition-colors"
      >
        <svg
          className="w-4 h-4 mr-2"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M10 19l-7-7m0 0l7-7m-7 7h18"
          />
        </svg>
        Назад до публікацій
      </Link>

      {/* Заголовок та метадані */}
      <header className="mb-10">
        <div className="flex items-center space-x-3 mb-4">
          <span className="bg-indigo-100 text-indigo-800 text-xs px-3 py-1 rounded-full font-semibold uppercase tracking-wide">
            Публікація
          </span>
          <span className="text-gray-500 text-sm">{formattedDate}</span>
        </div>

        <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 leading-tight mb-6">
          {post.title}
        </h1>

        <div className="flex items-center border-t border-b border-gray-100 py-4">
          <div className="h-10 w-10 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold text-lg shadow-sm">
            {authorInitial}
          </div>
          <div className="ml-3">
            <p className="text-sm font-medium text-gray-900">
              {post.author.name ?? post.author.email}
            </p>
            <p className="text-xs text-gray-500">Автор публікації</p>
          </div>
        </div>
      </header>

      {/* Обкладинка */}
      <img
        className="w-full h-80 sm:h-96 object-cover rounded-2xl shadow-md mb-10"
        src="https://images.unsplash.com/photo-1555066931-4365d14bab8c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"
        alt={post.title}
      />

      {/* Тіло статті */}
      <div className="prose prose-lg prose-indigo max-w-none text-gray-700 leading-relaxed whitespace-pre-wrap">
        {post.content}
      </div>
    </article>
  );
}

export default function PostDetailPage(): React.JSX.Element {
  return (
    <Suspense fallback={<PostDetailSkeleton />}>
      <PostDetailContent />
    </Suspense>
  );
}