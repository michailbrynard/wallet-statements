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
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div
            className="bg-blue-600 h-2.5 rounded-full"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        <p className="text-sm text-gray-500 mt-2">
          {currentIndex} of {addresses.length} addresses signed
        </p>
      </div>
      
      {currentAddress && (
        <div className="border border-gray-200 rounded-lg p-4 mb-6">
          <h3 className="font-medium mb-2">Sign message for address:</h3>
          
          <div className="font-mono text-sm mb-1 text-gray-600">
            {currentAddress.path}
          </div>
          <div className="font-mono text-sm mb-3 break-all">
            {currentAddress.address}
          </div>
          
          <div className="bg-gray-50 p-3 rounded-md mb-4">
            <h4 className="text-sm font-medium text-gray-700 mb-1">Message to sign:</h4>
            <p className="text-sm text-gray-800">
              {createProofMessage(currentAddress.address, currentAddress.balance, reportDate, ownerName)}
            </p>
          </div>
          
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-md mb-4">
              {error}
            </div>
          )}
        </div>
      )}
      
      <div className="flex space-x-3">
        <button
          onClick={handleSkip}
          className="flex-1 py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Skip
        </button>
        <button
          onClick={handleSignMessage}
          disabled={isLoading}
          className="flex-1 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-400"
        >
          {isLoading ? 'Signing...' : 'Sign Message'}
        </button>
      </div>
    </div>
  );
} 