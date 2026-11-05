"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "../../context/AuthContext";

export default function RegisterPage(): React.JSX.Element {
  const router = useRouter();
  const { register } = useAuth();

  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setError(null);

    if (password.length < 6) {
      setError("Пароль повинен містити щонайменше 6 символів");
      return;
    }

    setIsSubmitting(true);

    try {
      await register(email, password, name);
      router.push("/");
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Не вдалося зареєструватися";
      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16">
      <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-md">
        <div className="text-center mb-8">
          <Link
            href="/"
            className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600"
          >
            insidersBlog<span className="text-indigo-600">.</span>
          </Link>
          <h1 className="text-2xl font-bold text-gray-900 mt-4">Створення акаунту</h1>
          <p className="text-sm text-gray-500 mt-1">
            Приєднуйтесь до блог-платформи вже зараз
          </p>
        </div>

        {error && (
          <div className="mb-6 p-3 rounded-xl bg-red-50 border border-red-100 text-sm text-red-600 text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="name"
              className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2"
            >
              Ваше імʼя (необовʼязково)
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setName(e.target.value)
              }
              placeholder="Тарас Шевченко"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
            />
          </div>

          <div>
            <label
              htmlFor="email"
              className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2"
            >
              Email *
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setEmail(e.target.value)
              }
              placeholder="example@mail.com"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2"
            >
              Пароль *
            </label>
            <input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setPassword(e.target.value)
              }
              placeholder="Мінімум 6 символів"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 px-5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-sm shadow-md hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed mt-2"
          >
            {isSubmitting ? "Реєстрація..." : "Зареєструватися"}
          </button>
        </form>

        <div className="text-center mt-6 pt-6 border-t border-gray-100 text-sm text-gray-500">
          Вже маєте акаунт?{" "}
          <Link
            href="/login"
            className="font-medium text-indigo-600 hover:text-indigo-800"
          >
            Увійти
          </Link>
        </div>
      </div>
    </div>
  );
}