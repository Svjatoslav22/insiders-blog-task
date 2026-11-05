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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl w-full max-w-xl p-6 sm:p-8 shadow-2xl border border-gray-100">
                <div className="flex items-center justify-between pb-4 border-b border-gray-100">
                    <h2 className="text-xl font-extrabold text-gray-900">
                        {postToEdit ? "Редагувати публікацію" : "Нова публікація"}
                    </h2>
                    <button
                        type="button"
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 rounded-lg p-1 transition-colors"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {error && (
                    <div className="mt-4 p-3 rounded-xl bg-red-50 text-red-600 text-sm border border-red-100">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5 mt-6">
                    <div>
                        <label
                            htmlFor="post-title"
                            className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2.5"
                        >
                            Заголовок публікації
                        </label>
                        <input
                            id="post-title"
                            type="text"
                            required
                            value={title}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                setTitle(e.target.value)
                            }
                            placeholder="Наприклад: Як налаштувати Next.js та Tailwind"
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                        />
                    </div>

                    <div>
                        <label
                            htmlFor="post-content"
                            className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2.5"
                        >
                            Текст статті
                        </label>
                        <textarea
                            id="post-content"
                            required
                            rows={6}
                            value={content}
                            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                                setContent(e.target.value)
                            }
                            placeholder="Поділіться вашими думками..."
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition resize-y"
                        />
                    </div>

                    <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={isSubmitting}
                            className="px-5 py-2.5 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-100 transition-colors"
                        >
                            Скасувати
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-sm shadow-md hover:shadow-lg transition-all disabled:opacity-50"
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