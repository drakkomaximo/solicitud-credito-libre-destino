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
        <header className="bg-gradient-to-r from-sky-700 to-sky-600 px-6 py-4 shadow-lg">
          <nav className="mx-auto flex max-w-5xl items-center justify-between">
            <Link href="/" className="flex items-center gap-2 text-lg font-extrabold text-white">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/20 text-sm font-bold shadow-sm">
                BC
              </span>
              {layoutMessages.brand}
            </Link>
            <div className="flex items-center gap-2">
              <Link
                href="/applications/new"
                className="rounded-lg px-4 py-2 text-sm font-medium text-sky-50 transition hover:bg-white/10"
              >
                {layoutMessages.newApplication}
              </Link>
              <Link
                href="/applications"
                className="rounded-lg px-4 py-2 text-sm font-medium text-sky-50 transition hover:bg-white/10"
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
