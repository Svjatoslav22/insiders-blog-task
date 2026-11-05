import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "../context/AuthContext";
import { Header } from "../components/Header";

const inter = Inter({
  subsets: ["latin", "cyrillic"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "insidersBlog - Тестове завдання",
  description: "Сучасний блог на Next.js та Express.js",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>): React.JSX.Element {
  return (
    <html lang="uk">
      <body
        className={`${inter.variable} font-sans bg-gray-50 text-gray-800 min-h-screen flex flex-col antialiased`}
      >
        <AuthProvider>
          <Header />
          <main className="flex-grow w-full">{children}</main>
          <footer className="bg-white border-t border-gray-100 py-8 mt-auto">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-sm text-gray-400">
              © 2026 insidersBlog. Створено з Next.js (App Router), Express.js та Tailwind CSS.
            </div>
          </footer>
        </AuthProvider>
      </body>
    </html>
  );
}