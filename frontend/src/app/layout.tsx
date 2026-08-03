import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import 'sweetalert2/dist/sweetalert2.min.css';
import Link from "next/link";
import { QueryProvider } from "@/presentation/providers/QueryProvider";
import { layoutMessages } from "@/presentation/messages/layout";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: layoutMessages.pageTitle,
  description: layoutMessages.pageDescription,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <QueryProvider>
        <header className="border-b border-slate-200 bg-white px-6 py-4">
          <nav className="mx-auto flex max-w-5xl items-center justify-between">
            <Link href="/" className="text-lg font-bold text-slate-900">
              {layoutMessages.brand}
            </Link>
            <div className="flex gap-4">
              <Link
                href="/applications/new"
                className="text-slate-600 hover:text-slate-900"
              >
                {layoutMessages.newApplication}
              </Link>
              <Link
                href="/applications"
                className="text-slate-600 hover:text-slate-900"
              >
                {layoutMessages.applications}
              </Link>
            </div>
          </nav>
        </header>
        {children}
        </QueryProvider>
      </body>
    </html>
  );
}
