"use client";

import React, { useEffect, useState } from "react";
import type { Post } from "../types";

interface PostFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (title: string, content: string) => Promise<void>;
  postToEdit: Post | null;
}

export function PostFormModal({
  isOpen,
  onClose,
  onSubmit,
  postToEdit,
}: PostFormModalProps): React.JSX.Element | null {
  const [title, setTitle] = useState<string>("");
  const [content, setContent] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  useEffect(() => {
    if (postToEdit) {
      setTitle(postToEdit.title);
      setContent(postToEdit.content);
    } else {
      setTitle("");
      setContent("");
    }
    setError(null);
  }, [postToEdit, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setError(null);

    if (title.trim().length < 3) {
      setError("Заголовок повинен містити щонайменше 3 символи");
      return;
    }

    if (content.trim().length < 5) {
      setError("Текст поста повинен містити щонайменше 5 символів");
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit(title.trim(), content.trim());
      onClose();
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Не вдалося зберегти пост";
      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl w-full max-w-xl p-6 shadow-xl border border-gray-100">
        <div className="flex items-center justify-between pb-4 border-b border-gray-100">
          <h2 className="text-xl font-bold text-gray-900">
            {postToEdit ? "Редагувати пост" : "Створити новий пост"}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-xl font-bold p-1 leading-none"
          >
            ✕
          </button>
        </div>

        {error && (
          <div className="mt-4 p-3 rounded-lg bg-red-50 text-red-600 text-sm border border-red-100">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div>
            <label
              htmlFor="post-title"
              className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1"
            >
              Заголовок *
            </label>
            <input
              id="post-title"
              type="text"
              required
              value={title}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setTitle(e.target.value)
              }
              placeholder="Введіть заголовок статті..."
              className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
            />
          </div>

          <div>
            <label
              htmlFor="post-content"
              className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1"
            >
              Зміст публікації *
            </label>
            <textarea
              id="post-content"
              required
              rows={6}
              value={content}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                setContent(e.target.value)
              }
              placeholder="Напишіть текст статті тут..."
              className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition resize-y"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 transition"
            >
              Скасувати
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-sm shadow-sm transition disabled:opacity-50"
            >
              {isSubmitting
                ? "Збереження..."
                : postToEdit
                ? "Зберегти зміни"
                : "Опублікувати"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}