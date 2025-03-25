'use client';

import { useState } from 'react';

interface BalanceResult {
  address: string;
  balanceSats: number;
  balanceBTC: number;
  networkType: 'mainnet' | 'testnet';
  error?: string;
}

export default function BalanceChecker() {
  const [address, setAddress] = useState('');
  const [result, setResult] = useState<BalanceResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const checkBalance = async () => {
    if (!address.trim()) {
      setError('Please enter a Bitcoin address');
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      // First try mainnet
      const response = await fetch(`/api/test-balance?address=${address}`);
      const data = await response.json();
      setResult(data);
    } catch (err) {
      setError(String(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">Balance Checker</h2>
      <p className="text-gray-600 mb-6">
        Test fetching balances directly from Blockstream API.
      </p>

      <div className="space-y-4">
        <div>
          <label htmlFor="address" className="block text-sm font-medium text-gray-700">
            Bitcoin Address
          </label>
          <input
            type="text"
            id="address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Enter a Bitcoin address"
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <button
          onClick={checkBalance}
          disabled={loading}
          className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-400"
        >
          {loading ? 'Checking...' : 'Check Balance'}
        </button>

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-md">
            {error}
          </div>
        )}

        {result && (
          <div className="p-4 bg-gray-50 rounded-md overflow-x-auto">
            <h3 className="text-lg font-semibold mb-2">Result</h3>
            <pre className="text-xs">{JSON.stringify(result, null, 2)}</pre>
          </div>
        )}
      </div>
    </div>
  );
} 