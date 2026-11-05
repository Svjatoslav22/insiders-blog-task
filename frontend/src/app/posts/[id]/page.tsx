"use client";

import React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { usePost } from "../../../hooks/usePost";

export default function PostDetailPage(): React.JSX.Element {
  const params = useParams();
  const id = typeof params.id === "string" ? params.id : "";
  const { post, isLoading, error } = usePost(id);

  if (isLoading) {
    return (
      <div className="max-w-3xl mx-auto py-12 animate-pulse space-y-6">
        <div className="h-5 w-32 bg-gray-200 rounded" />
        <div className="h-10 w-3/4 bg-gray-200 rounded" />
        <div className="h-4 w-48 bg-gray-200 rounded" />
        <div className="space-y-3 pt-6 border-t border-gray-100">
          <div className="h-4 bg-gray-200 rounded w-full" />
          <div className="h-4 bg-gray-200 rounded w-5/6" />
          <div className="h-4 bg-gray-200 rounded w-4/6" />
        </div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="max-w-3xl mx-auto py-16 text-center space-y-4">
        <h2 className="text-2xl font-bold text-gray-900">Пост не знайдено</h2>
        <p className="text-gray-500 text-sm">
          {error ?? "Можливо, пост було видалено або посилання застаріло."}
        </p>
        <div>
          <Link
            href="/"
            className="inline-flex items-center text-sm font-semibold text-indigo-600 hover:text-indigo-800"
          >
            ← Повернутися на головну
          </Link>
        </div>
      </div>
    );
  }

  const formattedDate = new Date(post.createdAt).toLocaleDateString("uk-UA", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <article className="max-w-3xl mx-auto py-8">
      {/* Навігація назад */}
      <div className="mb-8">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-gray-500 hover:text-indigo-600 transition"
        >
          <span>←</span> До всіх публікацій
        </Link>
      </div>

      {/* Заголовок та метадані */}
      <header className="space-y-4 pb-8 border-b border-gray-100">
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-gray-900 leading-tight">
          {post.title}
        </h1>

        <div className="flex items-center gap-3 text-sm text-gray-500">
          <div className="w-9 h-9 rounded-full bg-indigo-100 text-indigo-700 font-bold flex items-center justify-center text-sm">
            {(post.author.name ?? post.author.email).charAt(0).toUpperCase()}
          </div>
          <div>
            <div className="font-semibold text-gray-900">
              {post.author.name ?? post.author.email}
            </div>
            <time dateTime={post.createdAt} className="text-xs text-gray-400">
              Опубліковано {formattedDate}
            </time>
          </div>
        </div>
      </header>

      {/* Тіло статті */}
      <div className="py-8 text-gray-700 text-lg leading-relaxed whitespace-pre-wrap">
        {post.content}
      </div>
    </article>
  );
}