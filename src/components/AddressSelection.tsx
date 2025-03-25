import React from 'react';
import { Address } from '@/types';
import AddressList from './AddressList';

interface AddressSelectionProps {
  addresses: Address[];
  selectedAddresses: Address[];
  onSelectAddress: (address: Address, selected: boolean) => void;
  onContinue: () => void;
  error: string | null;
  isLoadingBalances?: boolean;
}

export default function AddressSelection({
  addresses,
  selectedAddresses,
  onSelectAddress,
  onContinue,
  error,
  isLoadingBalances = false,
}: AddressSelectionProps) {
  const selectedAddressesSet = new Set(selectedAddresses.map(a => a.address));
  const totalBalance = selectedAddresses.reduce((sum, addr) => sum + addr.balance, 0);
  
  return (
    <div className="space-y-6 w-full mx-auto">
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-bold mb-4">Select Addresses</h2>
        <p className="text-gray-600 mb-6">
          Choose which Bitcoin addresses you want to include in your statement.
        </p>
        
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-md">
            {error}
          </div>
        )}
        
        <AddressList
          addresses={addresses}
          selectedAddresses={selectedAddressesSet}
          onSelectAddress={onSelectAddress}
          isLoadingBalances={isLoadingBalances}
        />
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h3 className="text-lg font-medium">Selected Addresses</h3>
            <p className="text-sm text-gray-500">{selectedAddresses.length} of {addresses.length} selected</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-500">Total Balance</p>
            <p className="text-xl font-bold">{totalBalance.toFixed(8)} BTC</p>
          </div>
        </div>
        
        <button
          onClick={onContinue}
          disabled={selectedAddresses.length === 0}
          className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-400"
        >
          Continue to Sign Messages
        </button>
      </div>
    </div>
  );
} 