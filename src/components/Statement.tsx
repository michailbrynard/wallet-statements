import { useState } from 'react';
import { ProofOfFunds } from '@/types';
import { formatCurrencyAmount } from '@/utils/currency';
import { generatePDF } from '@/utils/pdf';

interface StatementProps {
  proofOfFunds: ProofOfFunds;
  onBack: () => void;
}

export default function Statement({ proofOfFunds, onBack }: StatementProps) {
  const { walletInfo, signedMessages } = proofOfFunds;
  const [isGenerating, setIsGenerating] = useState(false);

  const handleDownloadPDF = async () => {
    setIsGenerating(true);
    try {
      const pdfBytes = await generatePDF(proofOfFunds);
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = `bitcoin-statement-${new Date().toISOString().split('T')[0]}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error generating PDF:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <section className="p-6 bg-white rounded-lg shadow-lg print:shadow-none w-full mx-auto">
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-2xl font-bold mb-4">Bitcoin Wallet Statement</h2>
          <p className="text-sm text-gray-600">Generated on {walletInfo.reportDate}</p>
          
          <div className="mt-6">
            <h3 className="text-xl font-semibold mb-3">Account Information</h3>
            <div className="grid grid-cols-2 gap-x-4 gap-y-2">
              <p className="text-sm text-gray-600">Account Holder</p>
              <p className="font-medium">{walletInfo.ownerName}</p>
              
              <p className="text-sm text-gray-600">Wallet Name</p>
              <p className="font-medium">{walletInfo.walletName}</p>
              
              <p className="text-sm text-gray-600">Total Balance</p>
              <p className="font-medium">
                {walletInfo.totalBalance.toFixed(8)} BTC
                {walletInfo.displayCurrency && walletInfo.exchangeRate && (
                  <span className="ml-2 text-gray-500">
                    (≈ {formatCurrencyAmount(walletInfo.totalBalance * walletInfo.exchangeRate, walletInfo.displayCurrency)})
                  </span>
                )}
              </p>
              
              {walletInfo.displayCurrency && walletInfo.exchangeRate && (
                <>
                  <p className="text-sm text-gray-600">Exchange Rate</p>
                  <p className="font-medium">
                    1 BTC = {formatCurrencyAmount(walletInfo.exchangeRate, walletInfo.displayCurrency)}
                  </p>
                </>
              )}
            </div>
          </div>
        </div>
        
        <div className="flex flex-col items-end space-y-4">
          <button
            onClick={onBack}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition-colors"
          >
            Back
          </button>
          <button
            onClick={handleDownloadPDF}
            disabled={isGenerating}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors flex items-center space-x-2 disabled:bg-blue-300"
          >
            {isGenerating ? (
              <>
                <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></span>
                <span>Generating PDF...</span>
              </>
            ) : (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V7.414A2 2 0 0015.414 6L12 2.586A2 2 0 0010.586 2H6zm5 6a1 1 0 10-2 0v3.586l-1.293-1.293a1 1 0 10-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 11.586V8z" clipRule="evenodd" />
                </svg>
                <span>Download Statement (PDF)</span>
              </>
            )}
          </button>
          
          <span className="text-sm text-gray-500 text-right">
            Includes cryptographic proof of ownership
          </span>
        </div>
      </div>
      
      {/* Addresses section */}
      <div className="mt-8">
        <h3 className="text-xl font-semibold mb-3">Bitcoin Addresses</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Address
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Path
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Balance
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Transactions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {walletInfo.addresses.map((address) => (
                <tr key={address.address}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-mono">
                    {address.address}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-mono">
                    {address.path}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-right">
                    {address.balance} BTC
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">
                    {address.transactions}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Signed messages section */}
      <div className="mt-8">
        <h3 className="text-xl font-semibold mb-3">Cryptographic Proofs of Ownership</h3>
        <div className="space-y-4">
          {signedMessages.map((signed, index) => (
            <div key={index} className="border border-gray-200 rounded-lg p-4">
              <p className="text-sm font-medium text-gray-700 mb-2">Address:</p>
              <p className="font-mono text-sm mb-3">{signed.address}</p>
              
              <p className="text-sm font-medium text-gray-700 mb-2">Signed Message:</p>
              <p className="text-sm bg-gray-50 p-3 rounded mb-3">{signed.message}</p>
              
              <p className="text-sm font-medium text-gray-700 mb-2">Signature:</p>
              <p className="font-mono text-xs bg-gray-50 p-3 rounded overflow-auto" style={{ maxHeight: '100px' }}>
                {signed.signature}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
} 