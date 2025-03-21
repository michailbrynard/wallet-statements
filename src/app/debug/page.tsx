"use client";

import { useState, useEffect } from 'react';
import BalanceChecker from '@/components/BalanceChecker';
import { initTrezor, getAddresses } from '@/utils/trezor';
import { Address } from '@/types';

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

    // Initialize Trezor
    initTrezor();

    return () => {
      // Restore original console methods
      console.log = originalLog;
      console.warn = originalWarn;
      console.error = originalError;
    };
  }, []);

  const clearLog = () => {
    setLog([]);
  };
  
  const connectTrezor = async () => {
    setLoading(true);
    setError(null);
    try {
      console.log("Connecting to Trezor...");
      const addresses = await getAddresses(0, 5);
      console.log("Got addresses:", addresses);
      setTrezorAddresses(addresses);
    } catch (err) {
      console.error("Error connecting to Trezor:", err);
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Debug Page</h1>
        
        <div className="grid grid-cols-1 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-bold mb-4">Trezor Connection Test</h2>
            <p className="text-gray-600 mb-6">
              Test connecting to Trezor and retrieving addresses with live balances. 
              The application will scan up to 100 addresses, stopping after finding a gap of 20 addresses without balances (BIP44/BIP84 standard).
            </p>
            
            <div className="space-y-4">
              <button
                onClick={connectTrezor}
                disabled={loading}
                className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-400"
              >
                {loading ? 'Scanning Addresses...' : 'Connect to Trezor'}
              </button>
              
              {error && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-md">
                  {error}
                </div>
              )}
              
              {trezorAddresses.length > 0 && (
                <div className="mt-4">
                  <h3 className="text-lg font-semibold mb-2">Retrieved Addresses</h3>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Path
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Address
                          </th>
                          <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Balance (BTC)
                          </th>
                          <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Transactions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {trezorAddresses.map((addr) => (
                          <tr key={addr.address}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-mono">
                              {addr.path}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-mono">
                              {addr.address}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-right">
                              {addr.balance.toFixed(8)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-right">
                              {addr.transactions}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          </div>
          
          <BalanceChecker />
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Console Output</h2>
              <button
                onClick={clearLog}
                className="px-3 py-1 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
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