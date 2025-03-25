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
  title: "WalletStatements.com - Professional Bitcoin Wallet Statements",
  description: "Generate secure, verifiable proof of funds for your Bitcoin wallet. Perfect for mortgage applications, financial verification, and business transactions.",
  keywords: ["bitcoin wallet statement", "proof of funds", "bitcoin signature verification", "verify bitcoin address", "bitcoin proof of ownership", "cryptographic signature", "bitcoin wallet verification", "trezor statement", "hardware wallet statement", "mortgage proof of funds"],
  openGraph: {
    title: "WalletStatements.com - Professional Bitcoin Wallet Statements & Signature Verification",
    description: "Generate professional Bitcoin wallet statements and verify ownership with cryptographic signatures. Perfect for proof of funds, mortgage applications, and financial verification.",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "WalletStatements.com - Professional Bitcoin Wallet Statements & Signature Verification",
    description: "Generate professional Bitcoin wallet statements and verify ownership with cryptographic signatures. Perfect for proof of funds, mortgage applications, and financial verification.",
  },
  icons: {
    icon: [
      {
        url: '/icon',
        type: 'image/png',
      },
    ],
    apple: [
      {
        url: '/apple-icon',
        type: 'image/png',
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                  document.documentElement.classList.add('dark')
                } else {
                  document.documentElement.classList.remove('dark')
                }
              } catch (_) {}
            `,
          }}
        />
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
