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

export default function TermsOfService() {
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
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Terms of Service</h1>
          
          <div className="space-y-6 text-gray-600">
            <p className="font-semibold text-gray-900">Last Updated: {new Date().toLocaleDateString()}</p>
            
            <section className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-900">1. Acceptance of Terms</h2>
              <p>
                By accessing or using WalletStatements.com (the &ldquo;Service&rdquo;) operated by 42 Enterprises Inc. (&ldquo;we,&rdquo; &ldquo;our,&rdquo; or &ldquo;us&rdquo;), 
                you agree to be bound by these Terms of Service. If you disagree with any part of these terms, you may not 
                access the Service.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-900">2. Open Source Nature</h2>
              <p>
                The Service is provided as open-source software under the MIT License. You may freely examine, modify, and use 
                the code in accordance with the license terms. The software is provided &ldquo;as is,&rdquo; without warranty of any kind.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-900">3. Use of Service</h2>
              <p>
                The Service is a front-end only application that generates Bitcoin wallet statements. You are responsible for:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Ensuring the security of your hardware wallet and private keys</li>
                <li>Verifying the accuracy of generated statements</li>
                <li>Maintaining the confidentiality of your wallet information</li>
                <li>Using the Service in compliance with applicable laws and regulations</li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-900">4. No Warranty</h2>
              <p>
                The Service is provided on an &ldquo;AS IS&rdquo; and &ldquo;AS AVAILABLE&rdquo; basis, without any warranties of any kind, whether 
                express or implied. We do not warrant that the Service will be uninterrupted, secure, or error-free.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-900">5. Limitation of Liability</h2>
              <p>
                In no event shall 42 Enterprises Inc., its directors, employees, partners, agents, suppliers, or affiliates be 
                liable for any indirect, incidental, special, consequential, or punitive damages, including without limitation, 
                loss of profits, data, use, goodwill, or other intangible losses, resulting from:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Your use or inability to use the Service</li>
                <li>Any unauthorized access to or use of our servers (if any)</li>
                <li>Any errors or omissions in the Service&apos;s operation</li>
                <li>Any damage to your computer system, hardware, software, or data</li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-900">6. Third-Party Services</h2>
              <p>
                The Service may use third-party services to query public blockchain data. We are not responsible for the 
                content, privacy policies, or practices of any third-party services.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-900">7. Changes to Terms</h2>
              <p>
                We reserve the right to modify or replace these Terms at any time. Changes will be effective immediately upon 
                posting to the Service. Your continued use of the Service after any changes constitutes acceptance of the new Terms.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-900">8. Contact</h2>
              <p>
                Questions about the Terms of Service should be directed to our GitHub repository through the issues section.
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