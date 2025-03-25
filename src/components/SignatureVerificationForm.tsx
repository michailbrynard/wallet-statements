"use client";

import { useState, useEffect } from 'react';
import * as bitcoin from 'bitcoinjs-lib';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as ecc from '@bitcoinerlab/secp256k1';
import bitcoinMessage from 'bitcoinjs-message';

const signatureVerificationSchema = z.object({
  message: z.string().min(1, 'Message is required'),
  signature: z.string().min(1, 'Signature is required')
    .transform(sig => {
      // Remove all whitespace and line breaks
      const cleaned = sig.replace(/\s+/g, '');
      // Remove any base64 padding if present
      return cleaned.replace(/=+$/, '');
    }),
  address: z.string().min(1, 'Bitcoin address is required')
    .regex(/^[13][a-km-zA-HJ-NP-Z1-9]{25,34}$|^bc1[ac-hj-np-z02-9]{11,71}$/, 'Invalid Bitcoin address format'),
});

type SignatureVerificationForm = z.infer<typeof signatureVerificationSchema>;

function VerificationForm() {
  const [verificationResult, setVerificationResult] = useState<boolean | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    // Initialize bitcoinjs-lib with ecc library only on the client side
    bitcoin.initEccLib(ecc);
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignatureVerificationForm>({
    resolver: zodResolver(signatureVerificationSchema),
  });

  const verifySignature = (data: SignatureVerificationForm) => {
    try {
      const verified = bitcoinMessage.verify(data.message, data.address, data.signature, undefined, true);
      setVerificationResult(verified);
      setError(null);
    } catch (err) {
      if (err instanceof Error && err.message === 'checkSegwitAlways can only be used with a compressed pubkey signature flagbyte') {
        // If message created with uncompressed private key, retry without checkSegwitAlways flag
        try {
          const verified = bitcoinMessage.verify(data.message, data.address, data.signature);
          setVerificationResult(verified);
          setError(null);
        } catch (retryErr) {
          setError(retryErr instanceof Error ? retryErr.message : 'An error occurred during verification');
          setVerificationResult(null);
        }
      } else {
        setError(err instanceof Error ? err.message : 'An error occurred during verification');
        setVerificationResult(null);
      }
    }
  };

  if (!isClient) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-pulse text-gray-500">Loading verification form...</div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(verifySignature)} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Bitcoin Address</label>
        <input
          type="text"
          {...register('address')}
          className="mt-1 block w-full px-4 py-3 rounded-lg border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-gray-900 placeholder-gray-400 font-mono"
          placeholder="Enter the Bitcoin address (e.g., 1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa or bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh)"
        />
        {errors.address && (
          <p className="mt-2 text-sm text-red-600">{errors.address.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
        <textarea
          {...register('message')}
          className="mt-1 block w-full px-4 py-3 rounded-lg border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-gray-900 placeholder-gray-400"
          rows={4}
          placeholder="Enter the message that was signed..."
        />
        {errors.message && (
          <p className="mt-2 text-sm text-red-600">{errors.message.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Signature (Base64)</label>
        <textarea
          {...register('signature')}
          className="mt-1 block w-full px-4 py-3 rounded-lg border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-gray-900 placeholder-gray-400 font-mono"
          rows={3}
          placeholder="Paste the signature in Base64 format (spaces and line breaks will be automatically removed)"
        />
        {errors.signature && (
          <p className="mt-2 text-sm text-red-600">{errors.signature.message}</p>
        )}
      </div>

      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200 font-medium"
      >
        Verify Signature
      </button>

      {verificationResult !== null && (
        <div className="mt-8 p-6 rounded-lg bg-gray-50 border border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Verification Result</h3>
          <div className="mt-3 flex items-center space-x-3">
            <div className={`w-4 h-4 rounded-full ${verificationResult ? 'bg-green-500' : 'bg-red-500'}`} />
            <p className={`text-lg font-medium ${verificationResult ? 'text-green-600' : 'text-red-600'}`}>
              {verificationResult ? 'Signature is valid!' : 'Signature is invalid!'}
            </p>
          </div>
        </div>
      )}

      {error && (
        <div className="mt-8 p-6 rounded-lg bg-red-50 border border-red-200">
          <h3 className="text-lg font-medium text-red-800">Error</h3>
          <p className="mt-2 text-red-600">{error}</p>
        </div>
      )}
    </form>
  );
}

export default function SignatureVerificationForm() {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-8">
        <div className="prose max-w-none mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">How to Use</h2>
          <ol className="list-decimal list-inside space-y-2 text-gray-600">
            <li>Enter the Bitcoin address that signed the message</li>
            <li>Enter the message that was signed</li>
            <li>Paste the signature in Base64 format (spaces and line breaks will be automatically removed)</li>
            <li>Click &ldquo;Verify Signature&rdquo; to check if the signature is valid</li>
          </ol>
        </div>

        <VerificationForm />
      </div>
    </div>
  );
}