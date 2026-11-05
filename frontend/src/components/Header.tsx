"use client";

import React, { Suspense } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "../context/AuthContext";

function NavLinks(): React.JSX.Element {
  const pathname = usePathname();
  const { user } = useAuth();

  const isHome = pathname === "/";
  const isAdmin = pathname === "/admin";

  return (
    <nav className="hidden md:flex space-x-8">
      <Link
        href="/"
        className={`font-medium px-1 py-2 border-b-2 transition-colors ${
          isHome
            ? "text-indigo-600 border-indigo-600"
            : "text-gray-500 border-transparent hover:text-indigo-600"
        }`}
      >
        Головна
      </Link>

      {user?.role === "ADMIN" && (
        <Link
          href="/admin"
          className={`font-medium px-1 py-2 border-b-2 transition-colors ${
            isAdmin
              ? "text-indigo-600 border-indigo-600"
              : "text-gray-500 border-transparent hover:text-indigo-600"
          }`}
        >
          Адмін-панель
        </Link>
      )}
    </nav>
  );
}

function NavLinksFallback(): React.JSX.Element {
  return (
    <nav className="hidden md:flex space-x-8">
      <Link
        href="/"
        className="font-medium px-1 py-2 text-indigo-600 border-b-2 border-indigo-600"
      >
        Головна
      </Link>
    </nav>
  );
}

export function Header(): React.JSX.Element {
  const { user, logout } = useAuth();

  return (
    <header className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Градієнтний логотип */}
          <Link
            href="/"
            className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 hover:opacity-90 transition-opacity"
          >
            insidersBlog<span className="text-indigo-600">.</span>
          </Link>

          {/* Навігація огорнута в Suspense для підтримки usePathname в Next.js 16 */}
          <Suspense fallback={<NavLinksFallback />}>
            <NavLinks />
          </Suspense>

          {/* Авторизація */}
          <div className="flex items-center space-x-4">
            {user ? (
              <div className="flex items-center space-x-3">
                <span className="text-sm font-medium text-gray-700 hidden sm:inline">
                  {user.name ?? user.email}
                </span>
                <button
                  type="button"
                  onClick={logout}
                  className="text-sm font-medium text-red-600 hover:text-red-700 px-3 py-1.5 rounded-lg hover:bg-red-50 transition-colors"
                >
                  Вийти
                </button>
              </div>
            ) : (
              <>
                <Link
                  href="/login"
                  className="text-sm font-medium text-gray-600 hover:text-indigo-600 transition-colors"
                >
                  Увійти
                </Link>
                <Link
                  href="/register"
                  className="bg-indigo-600 text-white hover:bg-indigo-700 px-5 py-2.5 rounded-xl text-sm font-medium transition-all shadow-md hover:shadow-lg"
                >
                  Реєстрація
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}