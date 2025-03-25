"use client";

import Link from 'next/link';
import ThemeToggle from '@/components/ThemeToggle';

const GitHubLink = () => (
  <Link
    href="https://github.com/michailbrynard/wallet-statements"
    target="_blank"
    rel="noopener noreferrer"
    className="text-gray-600 hover:text-gray-900 transition-colors"
    aria-label="View source on GitHub"
  >
    <svg
      viewBox="0 0 24 24"
      className="w-6 h-6"
      fill="currentColor"
    >
      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
    </svg>
  </Link>
);

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <Link href="/" className="text-xl font-bold text-gray-900 hover:text-gray-700">
            WalletStatements.com
          </Link>
          <div className="flex items-center space-x-4">
            <GitHubLink />
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main className="flex-grow max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow rounded-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Privacy Policy</h1>
          
          <div className="space-y-6 text-gray-600">
            <p className="font-semibold text-gray-900">Last Updated: {new Date().toLocaleDateString()}</p>
            
            <section className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-900">Introduction</h2>
              <p>
                42 Enterprises Inc. (&ldquo;we,&rdquo; &ldquo;our,&rdquo; or &ldquo;us&rdquo;) operates WalletStatements.com (the &ldquo;Service&rdquo;), 
                an open-source, front-end only application for generating Bitcoin wallet statements. This Privacy Policy 
                explains how we handle your information when you use our Service.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-900">No Data Collection</h2>
              <p>
                Our Service is designed to be completely client-side and does not collect, store, or transmit any personal 
                information. All operations occur locally in your web browser.
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>We do not operate any backend servers</li>
                <li>We do not use cookies or similar tracking technologies</li>
                <li>We do not collect analytics or usage data</li>
                <li>We do not store any wallet information</li>
                <li>All cryptographic operations are performed locally in your browser</li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-900">Your Data Security</h2>
              <p>
                The Service interacts with your hardware wallet directly through your browser. Your private keys never 
                leave your hardware wallet, and all operations requiring private key access are performed on the device 
                itself with explicit user confirmation.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-900">Third-Party Services</h2>
              <p>
                Our Service may query public blockchain data through third-party APIs to display wallet balances. 
                These queries only involve public blockchain addresses and do not include any personal information.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-900">Open Source Verification</h2>
              <p>
                Our Service is open source, and you can verify our privacy practices by reviewing our source code on 
                GitHub. We encourage users to audit the code and verify that no data collection or transmission occurs.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-900">Contact Us</h2>
              <p>
                If you have any questions about this Privacy Policy, you can review our source code on GitHub or 
                create an issue in our repository.
              </p>
            </section>
          </div>
        </div>
      </main>

      <footer className="bg-white border-t border-gray-200">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center">
            <p className="text-center text-sm text-gray-500">
              © {new Date().getFullYear()} WalletStatements.com - Professional Bitcoin Wallet Statements
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
} 