"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useAuth } from "../../context/AuthContext";
import { useAdminPosts } from "../../hooks/useAdminPosts";
import { PostFormModal } from "../../components/PostFormModal";
import type { Post } from "../../types";

export default function AdminPage(): React.JSX.Element {
  const { user, isLoading: isAuthLoading } = useAuth();
  const { posts, isLoading: isPostsLoading, error, createPost, updatePost, deletePost } =
    useAdminPosts();

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Перевірка прав доступу: якщо не адмін
  if (!isAuthLoading && (!user || user.role !== "ADMIN")) {
    return (
      <div className="max-w-md mx-auto py-16 text-center space-y-4">
        <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto text-2xl font-bold">
          🚫
        </div>
        <h1 className="text-2xl font-bold text-gray-900">Доступ обмежено</h1>
        <p className="text-sm text-gray-500">
          Ця сторінка доступна виключно адміністраторам системи.
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

  const handleOpenCreate = (): void => {
    setEditingPost(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (post: Post): void => {
    setEditingPost(post);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string): Promise<void> => {
    if (!window.confirm("Ви дійсно бажаєте видалити цей пост?")) return;

    setDeletingId(id);
    try {
      await deletePost(id);
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Помилка при видаленні поста");
    } finally {
      setDeletingId(null);
    }
  };

  const handleModalSubmit = async (title: string, content: string): Promise<void> => {
    if (editingPost) {
      await updatePost(editingPost.id, title, content);
    } else {
      await createPost(title, content);
    }
  };

  return (
    <div className="space-y-6">
      {/* Шапка адмінки */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-gray-100">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">
            Керування публікаціями
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Створюйте, редагуйте та видаляйте статті блогу
          </p>
        </div>
        <button
          type="button"
          onClick={handleOpenCreate}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-sm shadow-sm transition"
        >
          <span className="text-lg leading-none">+</span> Новий пост
        </button>
      </div>

      {/* Помилка завантаження */}
      {error && (
        <div className="p-4 rounded-xl bg-red-50 text-red-700 text-sm border border-red-100">
          {error}
        </div>
      )}

      {/* Завантаження */}
      {isPostsLoading && (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-16 bg-gray-100 rounded-xl animate-pulse" />
          ))}
        </div>
      )}

      {/* Таблиця або список постів */}
      {!isPostsLoading && posts.length > 0 && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50 text-xs font-semibold text-gray-500 uppercase tracking-wider border-b border-gray-100">
                <tr>
                  <th className="px-6 py-4">Заголовок</th>
                  <th className="px-6 py-4">Автор</th>
                  <th className="px-6 py-4">Дата</th>
                  <th className="px-6 py-4 text-right">Дії</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {posts.map((post) => (
                  <tr key={post.id} className="hover:bg-gray-50/50 transition">
                    <td className="px-6 py-4 font-medium text-gray-900 max-w-xs truncate">
                      <Link
                        href={`/posts/${post.id}`}
                        className="hover:text-indigo-600 transition"
                      >
                        {post.title}
                      </Link>
                    </td>
                    <td className="px-6 py-4 text-gray-500">
                      {post.author.name ?? post.author.email}
                    </td>
                    <td className="px-6 py-4 text-gray-400 text-xs whitespace-nowrap">
                      {new Date(post.createdAt).toLocaleDateString("uk-UA")}
                    </td>
                    <td className="px-6 py-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => handleOpenEdit(post)}
                          className="px-3 py-1 rounded text-xs font-medium text-indigo-600 hover:bg-indigo-50 transition"
                        >
                          Редагувати
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(post.id)}
                          disabled={deletingId === post.id}
                          className="px-3 py-1 rounded text-xs font-medium text-red-600 hover:bg-red-50 transition disabled:opacity-50"
                        >
                          {deletingId === post.id ? "..." : "Видалити"}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Якщо немає постів */}
      {!isPostsLoading && posts.length === 0 && (
        <div className="text-center py-16 bg-white rounded-2xl border border-gray-100">
          <p className="text-gray-500 text-sm">
            Ще немає створених постів. Натисніть кнопку &quot;Новий пост&quot;, щоб створити перший!
          </p>
        </div>
      )}

      {/* Модалка створення / редагування */}
      <PostFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleModalSubmit}
        postToEdit={editingPost}
      />
    </div>
  );
}