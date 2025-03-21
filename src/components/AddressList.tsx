import { useState } from 'react';
import { Address } from '@/types';

interface AddressListProps {
  addresses: Address[];
  onSelectAddress: (address: Address, selected: boolean) => void;
  selectedAddresses?: Set<string>;
  isLoadingBalances?: boolean;
}

export default function AddressList({
  addresses,
  onSelectAddress,
  selectedAddresses = new Set(),
  isLoadingBalances = false,
}: AddressListProps) {
  // Format BTC balance with proper decimal places
  const formatBtcBalance = (balance: number): string => {
    return balance.toFixed(8);
  };
  
  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden">
      <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
        <h3 className="text-lg font-medium text-gray-900">Your Bitcoin Addresses</h3>
        <p className="text-sm text-gray-500">Select addresses to include in your statement</p>
        {isLoadingBalances && (
          <p className="text-xs text-blue-600 mt-1">Loading live balances...</p>
        )}
      </div>
      
      <div className="divide-y divide-gray-200">
        {addresses.length === 0 ? (
          <div className="p-6 text-center text-gray-500">
            No addresses found. Connect your Trezor wallet to view addresses.
          </div>
        ) : (
          addresses.map((address) => (
            <div
              key={address.address}
              className="flex items-start justify-between p-4 hover:bg-gray-50"
            >
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id={`address-${address.address}`}
                  checked={selectedAddresses.has(address.address)}
                  onChange={(e) => onSelectAddress(address, e.target.checked)}
                  className="h-4 w-4 text-blue-600 rounded focus:ring-blue-500 border-gray-300"
                />
                <label
                  htmlFor={`address-${address.address}`}
                  className="ml-3 block text-sm font-medium text-gray-700 cursor-pointer"
                >
                  <div className="flex flex-col">
                    <div className="font-mono text-xs text-gray-500">{address.path}</div>
                    <div className="font-mono">{address.address}</div>
                    <div className="flex space-x-4 mt-1 text-sm text-gray-500">
                      <div>{address.transactions} transactions</div>
                      {address.lastActivity && <div>Last active: {address.lastActivity}</div>}
                    </div>
                  </div>
                </label>
              </div>
              <div className="text-right">
                {isLoadingBalances ? (
                  <div className="flex items-center justify-end">
                    <svg className="animate-spin h-4 w-4 text-blue-600 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <div className="text-sm text-blue-600">Loading...</div>
                  </div>
                ) : (
                  <div className="text-lg font-medium text-gray-900">{formatBtcBalance(address.balance)} BTC</div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
} 