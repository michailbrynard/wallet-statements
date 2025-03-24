import { useState } from 'react';
import { Address, SignedMessage } from '@/types';
import { createProofMessage, signMessage } from '@/utils/trezor';

interface SignMessagesProps {
  addresses: Address[];
  onComplete: (signedMessages: SignedMessage[]) => void;
  reportDate: string;
  ownerName: string;
}

export default function SignMessages({
  addresses,
  onComplete,
  reportDate,
  ownerName,
}: SignMessagesProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [signedMessages, setSignedMessages] = useState<SignedMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const currentAddress = addresses[currentIndex];
  const progress = Math.round(((currentIndex) / addresses.length) * 100);
  const isCompleted = currentIndex >= addresses.length;

  const handleSignMessage = async () => {
    if (!currentAddress) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const message = createProofMessage(
        currentAddress.address,
        currentAddress.balance,
        reportDate,
        ownerName
      );
      
      const result = await signMessage(currentAddress.path, message);
      
      if (result) {
        setSignedMessages((prev) => [...prev, result]);
        setCurrentIndex((prev) => prev + 1);
      } else {
        setError('Failed to sign message. Please try again.');
      }
    } catch (err) {
      setError('Error: ' + (err instanceof Error ? err.message : String(err)));
    } finally {
      setIsLoading(false);
    }
  };

  const handleSkip = () => {
    setCurrentIndex((prev) => prev + 1);
  };

  const handleComplete = () => {
    onComplete(signedMessages);
  };

  if (isCompleted) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-bold mb-4">Signing Complete</h2>
        
        <div className="mb-4">
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div
              className="bg-green-600 h-2.5 rounded-full"
              style={{ width: '100%' }}
            ></div>
          </div>
          <p className="text-sm text-gray-500 mt-2">
            {signedMessages.length} of {addresses.length} addresses signed
          </p>
        </div>
        
        <div className="mt-8">
          <button
            onClick={handleComplete}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Generate Statement
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-2xl mx-auto">
      <h2 className="text-xl font-bold mb-4">Sign Proof of Funds</h2>
      
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium text-gray-700">Signing Progress</span>
            <span className="text-sm text-gray-500">({currentIndex} of {addresses.length})</span>
          </div>
          <span className="text-sm font-medium text-blue-600">{progress}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div
            className="bg-blue-600 h-3 rounded-full transition-all duration-300 ease-in-out"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>
      
      {currentAddress && (
        <div className="border border-gray-200 rounded-lg p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-medium text-gray-900">Current Address</h3>
            {isLoading && (
              <div className="flex items-center space-x-2 text-blue-600">
                <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span className="text-sm">Signing...</span>
              </div>
            )}
          </div>
          
          <div className="space-y-3">
            <div>
              <div className="text-xs font-medium text-gray-500 mb-1">Derivation Path</div>
              <div className="font-mono text-sm bg-gray-50 p-2 rounded">
                {currentAddress.path}
              </div>
            </div>
            
            <div>
              <div className="text-xs font-medium text-gray-500 mb-1">Address</div>
              <div className="font-mono text-sm bg-gray-50 p-2 rounded break-all">
                {currentAddress.address}
              </div>
            </div>
            
            <div>
              <div className="text-xs font-medium text-gray-500 mb-1">Balance</div>
              <div className="font-mono text-sm bg-gray-50 p-2 rounded">
                {currentAddress.balance.toFixed(8)} BTC
              </div>
            </div>
          </div>
          
          <div className="mt-6">
            <div className="text-xs font-medium text-gray-500 mb-2">Message to Sign</div>
            <div className="bg-gray-50 p-3 rounded-md">
              <p className="text-sm text-gray-800 font-mono break-words">
                {createProofMessage(currentAddress.address, currentAddress.balance, reportDate, ownerName)}
              </p>
            </div>
          </div>
          
          {error && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 text-red-700 rounded-md">
              <div className="flex items-center space-x-2">
                <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                <span>{error}</span>
              </div>
            </div>
          )}
          
          <div className="mt-6 flex space-x-3">
            <button
              onClick={handleSignMessage}
              disabled={isLoading}
              className="flex-1 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Signing...' : 'Sign Message'}
            </button>
            <button
              onClick={handleSkip}
              disabled={isLoading}
              className="py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed"
            >
              Skip
            </button>
          </div>
        </div>
      )}
    </div>
  );
} 