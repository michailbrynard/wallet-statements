import { useState, FormEvent } from 'react';
import { WalletInfo } from '@/types';

// List of commonly used currencies
const currencies = ['USD', 'EUR', 'GBP', 'JPY', 'CAD', 'AUD', 'CHF', 'CNY', 'INR', 'SGD'];

type WalletInfoFormProps = {
  onSubmit: (walletInfo: WalletInfo) => void;
  isLoading?: boolean;
};

export default function WalletInfoForm({ onSubmit, isLoading = false }: WalletInfoFormProps) {
  const [walletName, setWalletName] = useState('');
  const [ownerName, setOwnerName] = useState('');
  const [displayCurrency, setDisplayCurrency] = useState('USD');

  const today = new Date().toISOString().split('T')[0];
  const [reportDate, setReportDate] = useState(today);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!walletName) {
      alert('Please enter a wallet name');
      return;
    }
    
    if (!ownerName) {
      alert('Please enter your name');
      return;
    }
    
    const walletInfo: WalletInfo = {
      walletName: walletName.trim(),
      ownerName: ownerName.trim(),
      addresses: [],
      totalBalance: 0,
      reportDate,
      displayCurrency,
    };
    
    onSubmit(walletInfo);
  };
  
  return (
    <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-2xl mx-auto">
      <h2 className="text-xl font-semibold mb-4 text-gray-800">Wallet Statement Information</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="walletName" className="block text-sm font-medium text-gray-700 mb-1">
            Wallet Name / Account Name
          </label>
          <input
            type="text"
            id="walletName"
            value={walletName}
            onChange={(e) => setWalletName(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            placeholder="e.g. My Hardware Wallet, Company Bitcoin Reserve"
            required
          />
        </div>
        
        <div>
          <label htmlFor="ownerName" className="block text-sm font-medium text-gray-700 mb-1">
            Owner / Account Holder Name
          </label>
          <input
            type="text"
            id="ownerName"
            value={ownerName}
            onChange={(e) => setOwnerName(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            placeholder="e.g. John Smith"
            required
          />
        </div>
        
        <div>
          <label htmlFor="reportDate" className="block text-sm font-medium text-gray-700 mb-1">
            Report Date
          </label>
          <input
            type="date"
            id="reportDate"
            value={reportDate}
            onChange={(e) => setReportDate(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        
        <div>
          <label htmlFor="displayCurrency" className="block text-sm font-medium text-gray-700 mb-1">
            Display Currency (for equivalent values)
          </label>
          <select
            id="displayCurrency"
            value={displayCurrency}
            onChange={(e) => setDisplayCurrency(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          >
            {currencies.map((currency) => (
              <option key={currency} value={currency}>
                {currency}
              </option>
            ))}
          </select>
        </div>
        
        <div className="pt-4">
          <button
            type="submit"
            disabled={isLoading}
            className="w-full rounded-md bg-gray-800 px-6 py-3 text-lg font-semibold text-white shadow-sm hover:bg-gray-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-800 cursor-pointer disabled:bg-gray-400 disabled:text-gray-200 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Loading...' : 'Generate Statement'}
          </button>
        </div>
      </form>
    </div>
  );
} 