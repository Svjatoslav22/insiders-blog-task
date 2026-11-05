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

  if (!isAuthLoading && (!user || user.role !== "ADMIN")) {
    return (
      <section className="max-w-md mx-auto py-16 text-center space-y-4">
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
      </section>
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
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Шапка адмінки */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900">Управління публікаціями</h1>
          <p className="mt-1 text-sm text-gray-500">
            Додавайте, редагуйте або видаляйте пости вашого блогу.
          </p>
        </div>
        <button
          type="button"
          onClick={handleOpenCreate}
          className="inline-flex items-center px-5 py-2.5 bg-indigo-600 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white hover:bg-indigo-700 transition-colors"
        >
          <svg
            className="w-5 h-5 mr-2 -ml-1"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 4v16m8-8H4"
            />
          </svg>
          Новий пост
        </button>
      </div>

      {error && (
        <div className="mb-6 p-4 rounded-xl bg-red-50 text-red-700 text-sm border border-red-100">
          {error}
        </div>
      )}

      {isPostsLoading && (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-16 bg-white rounded-2xl shadow-sm border border-gray-100 animate-pulse" />
          ))}
        </div>
      )}

      {!isPostsLoading && posts.length > 0 && (
        <div className="bg-white shadow-sm rounded-2xl border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                    Заголовок
                  </th>
                  <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                    Статус
                  </th>
                  <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                    Дата
                  </th>
                  <th scope="col" className="px-6 py-4 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">
                    Дії
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {posts.map((post) => (
                  <tr key={post.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 flex-shrink-0 bg-indigo-50 rounded-lg flex items-center justify-center text-indigo-600 font-bold text-sm">
                          {post.title.charAt(0).toUpperCase()}
                        </div>
                        <div className="ml-4">
                          <Link
                            href={`/posts/${post.id}`}
                            className="text-sm font-medium text-gray-900 hover:text-indigo-600 transition-colors"
                          >
                            {post.title}
                          </Link>
                          <div className="text-sm text-gray-500">
                            {post.author.name ?? post.author.email}
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                        Опубліковано
                      </span>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(post.createdAt).toLocaleDateString("uk-UA")}
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-3">
                      <button
                        type="button"
                        onClick={() => handleOpenEdit(post)}
                        className="text-indigo-600 hover:text-indigo-900 transition-colors"
                      >
                        Редагувати
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(post.id)}
                        disabled={deletingId === post.id}
                        className="text-red-600 hover:text-red-900 font-medium transition-colors disabled:opacity-50"
                      >
                        {deletingId === post.id ? "..." : "Видалити"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {!isPostsLoading && posts.length === 0 && (
        <div className="text-center py-16 bg-white rounded-2xl border border-gray-100 shadow-sm">
          <p className="text-gray-500 text-sm">
            Ще немає створених постів. Натисніть кнопку &quot;Новий пост&quot;, щоб створити перший!
          </p>
        </div>
      )}

      <PostFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleModalSubmit}
        postToEdit={editingPost}
      />
    </section>
  );
}