import React from "react";
import Link from "next/link";
import type { Post } from "../types";

interface PostCardProps {
  post: Post;
}

// Заглушки красивих обкладинок (підбираються автоматично по id)
const COVER_IMAGES = [
  "https://images.unsplash.com/photo-1555066931-4365d14bab8c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1498050108023-c5249f4df085?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
];

export function PostCard({ post }: PostCardProps): React.JSX.Element {
  const formattedDate = new Date(post.createdAt).toLocaleDateString("uk-UA", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  // Вибираємо картинку на основі довжини id, щоб у кожного поста була стабільна картинка
  const imageIndex = post.id.charCodeAt(0) % COVER_IMAGES.length;
  const coverImage = COVER_IMAGES[imageIndex] ?? COVER_IMAGES[0];

  return (
    <article className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 group flex flex-col">
      <div className="aspect-w-16 aspect-h-9 overflow-hidden bg-gray-100">
        <img
          className="w-full h-56 object-cover group-hover:scale-105 transition-transform duration-500"
          src={coverImage}
          alt={post.title}
        />
      </div>

      <div className="p-6 flex-grow flex flex-col justify-between">
        <div>
          <div className="text-xs font-bold text-indigo-600 uppercase tracking-wider mb-2">
            Публікація
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-3 leading-tight group-hover:text-indigo-600 transition-colors">
            <Link href={`/posts/${post.id}`}>{post.title}</Link>
          </h2>
          <p className="text-gray-600 mb-4 line-clamp-3 text-sm">
            {post.content}
          </p>
        </div>

        <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-50">
          <div className="flex items-center space-x-2 text-sm text-gray-500">
            <svg
              className="w-4 h-4 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <span>{formattedDate}</span>
          </div>

          <Link
            href={`/posts/${post.id}`}
            className="text-indigo-600 font-semibold text-sm hover:text-indigo-800 flex items-center group-hover:translate-x-0.5 transition-transform"
          >
            Читати{" "}
            <svg
              className="w-4 h-4 ml-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M14 5l7 7m0 0l-7 7m7-7H3"
              />
            </svg>
          </Link>
        </div>
      </div>
    </article>
  );
}