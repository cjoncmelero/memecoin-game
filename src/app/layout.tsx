import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import ClientLayout from '../components/ClientLayout/ClientLayout';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: "Memecoin Game",
  description: "La mejor plataforma para jugar y ganar con memecoins",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning={true} data-lt-installed="true">
      <body suppressHydrationWarning={true} className={inter.variable + " antialiased"}>
        <ClientLayout>
          {children}
        </ClientLayout>
      </body>
    </html>
  );
}
