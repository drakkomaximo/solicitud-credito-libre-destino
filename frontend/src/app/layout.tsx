import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Link from "next/link";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Solicitud de Crédito",
  description: "Micrositio de solicitud digital de crédito de libre destino",
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
        <header className="border-b border-slate-200 bg-white px-6 py-4">
          <nav className="mx-auto flex max-w-5xl items-center justify-between">
            <Link href="/" className="text-lg font-bold text-slate-900">
              CrediDigital
            </Link>
            <div className="flex gap-4">
              <Link
                href="/applications/new"
                className="text-slate-600 hover:text-slate-900"
              >
                Nueva solicitud
              </Link>
              <Link
                href="/applications"
                className="text-slate-600 hover:text-slate-900"
              >
                Solicitudes
              </Link>
            </div>
          </nav>
        </header>
        {children}
      </body>
    </html>
  );
}
