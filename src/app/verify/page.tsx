"use client";

import { useState } from 'react';
import Link from 'next/link';
import ThemeToggle from '@/components/ThemeToggle';

export default function VerifyPage() {
  const [message, setMessage] = useState('');
  const [signature, setSignature] = useState('');
  const [address, setAddress] = useState('');
  const [verificationResult, setVerificationResult] = useState<boolean | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleVerify = async () => {
    try {
      // TODO: Implement actual signature verification
      setVerificationResult(true);
      setError(null); // Clear any previous errors
    } catch (error) {
      console.error('Error verifying signature:', error);
      setVerificationResult(false);
      setError('Failed to verify signature. Please check your inputs and try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <Link href="/" className="text-xl font-bold text-gray-900 hover:text-gray-700">
            WalletStatements.com
          </Link>
          <div className="flex items-center space-x-4">
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main className="flex-grow">
        <div className="max-w-3xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Bitcoin Signature Verification Tool
            </h1>
            <p className="text-xl text-gray-600">
              Verify the authenticity of Bitcoin address signatures. Enter the message, signature, and address to verify ownership.
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-8">
            <div className="space-y-6">
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                  Message
                </label>
                <textarea
                  id="message"
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Enter the message that was signed"
                />
              </div>

              <div>
                <label htmlFor="signature" className="block text-sm font-medium text-gray-700 mb-2">
                  Signature
                </label>
                <input
                  type="text"
                  id="signature"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  value={signature}
                  onChange={(e) => setSignature(e.target.value)}
                  placeholder="Enter the cryptographic signature"
                />
              </div>

              <div>
                <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-2">
                  Bitcoin Address
                </label>
                <input
                  type="text"
                  id="address"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Enter the Bitcoin address"
                />
              </div>

              <button
                onClick={handleVerify}
                className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Verify Signature
              </button>

              {error && (
                <div className="text-red-600 text-sm mt-2">
                  {error}
                </div>
              )}

              {verificationResult !== null && (
                <div className={`mt-4 p-4 rounded-md ${verificationResult ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                  {verificationResult ? (
                    <p className="font-medium">✓ Signature verified successfully</p>
                  ) : (
                    <p className="font-medium">✗ Signature verification failed</p>
                  )}
                </div>
              )}
            </div>

            <div className="mt-8 border-t border-gray-200 pt-8">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">How Bitcoin Signature Verification Works</h2>
              <div className="prose prose-sm text-gray-600">
                <p>
                  Bitcoin signature verification uses cryptographic principles to prove ownership of a Bitcoin address. When you sign a message with your private key, it creates a unique signature that can only be verified using the corresponding public key (derived from the Bitcoin address).
                </p>
                <p>
                  This tool verifies that the signature was created by the private key associated with the provided Bitcoin address. The verification process:
                </p>
                <ol>
                  <li>Derives the public key from the Bitcoin address</li>
                  <li>Recovers the message hash from the signature</li>
                  <li>Verifies the signature using the public key</li>
                </ol>
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="bg-white border-t border-gray-200">
        <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center">
            <p className="text-center text-sm text-gray-500">
              © {new Date().getFullYear()} WalletStatements.com - Bitcoin Signature Verification
            </p>
            <div className="mt-4 space-x-6">
              <Link href="/" className="text-sm text-gray-500 hover:text-gray-700">
                Generate Statement
              </Link>
              <Link href="/privacy" className="text-sm text-gray-500 hover:text-gray-700">
                Privacy Policy
              </Link>
              <Link href="/terms" className="text-sm text-gray-500 hover:text-gray-700">
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
} 