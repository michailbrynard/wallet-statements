"use client";

import { useState, useEffect } from 'react';
import BalanceChecker from '@/components/BalanceChecker';
import ThemeToggle from '@/components/ThemeToggle';
import { initTrezor, getAddresses } from '@/utils/trezor';
import { Address } from '@/types';
import Link from 'next/link';

export default function DebugPage() {
  const [log, setLog] = useState<string[]>([]);
  const [trezorAddresses, setTrezorAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Override console.log and other methods to capture them
    const originalLog = console.log;
    const originalWarn = console.warn;
    const originalError = console.error;

    console.log = (...args) => {
      originalLog(...args);
      setLog(prev => [...prev, `[LOG] ${args.map(a => typeof a === 'object' ? JSON.stringify(a) : a).join(' ')}`]);
    };

    console.warn = (...args) => {
      originalWarn(...args);
      setLog(prev => [...prev, `[WARN] ${args.map(a => typeof a === 'object' ? JSON.stringify(a) : a).join(' ')}`]);
    };

    console.error = (...args) => {
      originalError(...args);
      setLog(prev => [...prev, `[ERROR] ${args.map(a => typeof a === 'object' ? JSON.stringify(a) : a).join(' ')}`]);
    };

    return () => {
      // Restore original methods
      console.log = originalLog;
      console.warn = originalWarn;
      console.error = originalError;
    };
  }, []);

  const clearLog = () => {
    setLog([]);
  };

  const connectTrezor = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Initialize Trezor
      await initTrezor();
      
      // Get addresses
      const addresses = await getAddresses();
      setTrezorAddresses(addresses);
      
      console.log('Successfully connected to Trezor');
    } catch (err) {
      console.error('Error connecting to Trezor:', err);
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0a0a0a] p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">Debug Tools</h1>
          
          <div className="flex items-center space-x-4">
            <Link href="/" className="text-sm text-blue-500 hover:underline dark:text-blue-400">
              Back to App
            </Link>
            <ThemeToggle />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md dark:bg-[#1a1a1a] dark:border dark:border-gray-800">
          <h2 className="text-xl font-bold mb-4 dark:text-white">Trezor Connection Test</h2>
          
          <p className="text-gray-600 mb-6 dark:text-gray-300">
            Test direct connection to Trezor hardware wallet without using the main application workflow.
          </p>
          
          <button
            onClick={connectTrezor}
            disabled={loading}
            className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-400"
          >
            {loading ? 'Connecting...' : 'Connect to Trezor'}
          </button>
          
          {error && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-md dark:bg-red-900/20 dark:border-red-800 dark:text-red-400">
              {error}
            </div>
          )}
          
          {trezorAddresses.length > 0 && (
            <div className="mt-6">
              <h3 className="text-lg font-semibold mb-2 dark:text-white">Retrieved Addresses</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className="bg-gray-50 dark:bg-gray-800">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">
                        Path
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">
                        Address
                      </th>
                      <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">
                        Balance
                      </th>
                      <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">
                        Transactions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200 dark:bg-[#1a1a1a] dark:divide-gray-700">
                    {trezorAddresses.map((address) => (
                      <tr key={address.path}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                          {address.path}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-500 dark:text-gray-300">
                          {address.address}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right dark:text-gray-300">
                          {address.balance !== undefined ? `${address.balance} BTC` : 'Loading...'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right dark:text-gray-300">
                          {address.transactions !== undefined ? address.transactions : 'Loading...'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
        
        <div className="mt-8">
          <BalanceChecker />
        </div>
        
        <div className="mt-8">
          <div className="bg-white p-6 rounded-lg shadow-md dark:bg-[#1a1a1a] dark:border dark:border-gray-800">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold dark:text-white">Console Output</h2>
              <button
                onClick={clearLog}
                className="px-3 py-1 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
              >
                Clear
              </button>
            </div>
            
            <div className="bg-gray-900 text-gray-100 p-4 rounded-md h-96 overflow-y-auto font-mono text-xs">
              {log.length === 0 ? (
                <p className="text-gray-500">No log entries yet</p>
              ) : (
                log.map((entry, i) => (
                  <div key={i} className={`py-1 ${entry.includes('[ERROR]') ? 'text-red-400' : entry.includes('[WARN]') ? 'text-yellow-400' : 'text-green-400'}`}>
                    {entry}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 