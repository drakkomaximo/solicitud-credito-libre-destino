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
        <QueryProvider>
          <Header />
          <div className="flex-1">
            {children}
          </div>
        </QueryProvider>
        <Footer />
      </body>
    </html>
  );
}
