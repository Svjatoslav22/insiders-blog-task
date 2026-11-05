import React from "react";
import Link from "next/link";
import type { Post } from "../types";

interface PostCardProps {
  post: Post;
}

export function PostCard({ post }: PostCardProps): React.JSX.Element {
  const formattedDate = new Date(post.createdAt).toLocaleDateString("uk-UA", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <article className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between text-xs text-gray-400 mb-3">
          <span className="font-medium text-gray-600">
            {post.author.name ?? post.author.email}
          </span>
          <time dateTime={post.createdAt}>{formattedDate}</time>
        </div>

        <h2 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2 hover:text-indigo-600 transition">
          <Link href={`/posts/${post.id}`}>{post.title}</Link>
        </h2>

        <p className="text-sm text-gray-600 line-clamp-3 mb-4 leading-relaxed">
          {post.content}
        </p>
      </div>

      <div className="pt-4 border-t border-gray-50 flex items-center justify-end">
        <Link
          href={`/posts/${post.id}`}
          className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 group"
        >
          Читати повністю
          <span className="group-hover:translate-x-0.5 transition-transform">→</span>
        </Link>
      </div>
    </article>
  );
}