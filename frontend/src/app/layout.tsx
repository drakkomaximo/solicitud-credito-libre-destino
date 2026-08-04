import type { Metadata } from "next";
import "./globals.css";
import 'sweetalert2/dist/sweetalert2.min.css';
import { QueryProvider } from "@/presentation/providers/QueryProvider";
import { layoutMessages } from "@/presentation/messages/layout";
import Header from "@/presentation/components/common/Header";
import { Footer } from "@/presentation/components/common/Footer";
import { geistSans, geistMono } from "@/presentation/lib/fonts";

export const metadata: Metadata = {
  title: layoutMessages.pageTitle,
  description: layoutMessages.pageDescription,
  icons: { icon: '/icon.svg' },
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
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:left-2 focus:top-2 focus:z-50 focus:rounded focus:bg-sky-700 focus:px-3 focus:py-2 focus:text-white"
        >
          Saltar al contenido
        </a>
        <QueryProvider>
          <Header />
          <main id="main-content" className="flex-1" tabIndex={-1}>
            {children}
          </main>
        </QueryProvider>
        <Footer />
      </body>
    </html>
  );
}
