import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import ClientLoadingWrapper from "@/components/ClientLoadingWrapper";

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
      <body className={`${inter.variable} font-sans h-full antialiased`}>
        <ClientLoadingWrapper />
        {children}
      </body>
    </html>
  );
}
