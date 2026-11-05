"use client";

import React from "react";
import Link from "next/link";
import { useAuth } from "../context/AuthContext";

export function Header(): React.JSX.Element {
  const { user, logout } = useAuth();

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <span className="w-8 h-8 rounded-lg bg-indigo-600 text-white font-bold flex items-center justify-center text-lg shadow-sm group-hover:bg-indigo-700 transition">
            I
          </span>
          <span className="text-xl font-bold tracking-tight text-gray-900 group-hover:text-indigo-600 transition">
            Insiders<span className="text-indigo-600">.</span>
          </span>
        </Link>

        <nav className="flex items-center gap-4">
          <Link
            href="/"
            className="text-sm font-medium text-gray-600 hover:text-indigo-600 transition"
          >
            Головна
          </Link>

          {user ? (
            <div className="flex items-center gap-3">
              {user.role === "ADMIN" && (
                <Link
                  href="/admin"
                  className="px-3 py-1.5 text-xs font-semibold rounded-md bg-amber-50 text-amber-700 border border-amber-200 hover:bg-amber-100 transition"
                >
                   Адмінка
                </Link>
              )}

              <div className="flex items-center gap-2 pl-2 border-l border-gray-200">
                <span className="text-sm font-medium text-gray-700">
                  {user.name ?? user.email}
                </span>
                <button
                  type="button"
                  onClick={logout}
                  className="text-xs font-medium text-red-600 hover:text-red-700 px-2 py-1 rounded hover:bg-red-50 transition"
                >
                  Вийти
                </button>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                href="/login"
                className="text-sm font-medium text-gray-700 hover:text-indigo-600 px-3 py-1.5 transition"
              >
                Увійти
              </Link>
              <Link
                href="/register"
                className="text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 px-3.5 py-1.5 rounded-lg shadow-sm transition"
              >
                Реєстрація
              </Link>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
}