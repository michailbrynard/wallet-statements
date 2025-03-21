import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import ClientLoadingWrapper from "@/components/ClientLoadingWrapper";
import ThemeInitializer from "@/components/ThemeInitializer";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Trezor Hardware Wallet Statement Generator",
  description: "Generate professional statements for your Trezor hardware wallet with proof of funds verification",
  keywords: ["trezor", "bitcoin", "wallet", "statement", "proof of funds", "cryptocurrency"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <head>
        {/* No more inline script here - prevents hydration errors */}
      </head>
      <body className={`${inter.variable} font-sans h-full antialiased flex flex-col`}>
        <ThemeInitializer />
        <ClientLoadingWrapper />
        <div className="flex flex-col min-h-screen flex-grow">
          {children}
        </div>
      </body>
    </html>
  );
}
