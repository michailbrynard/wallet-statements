"use client";

import { useEffect } from 'react';
import WalletInfoForm from '@/components/WalletInfoForm';
import ConnectWallet from '@/components/ConnectWallet';
import AddressSelection from '@/components/AddressSelection';
import SignMessages from '@/components/SignMessages';
import Statement from '@/components/Statement';
import ThemeToggle from '@/components/ThemeToggle';
import useWalletStatement from '@/hooks/useWalletStatement';
import Link from 'next/link';

export default function Home() {
  const {
    step,
    walletInfo,
    addresses,
    selectedAddresses,
    isLoading,
    isLoadingBalances,
    error,
    saveWalletInfo,
    connectWallet,
    toggleAddressSelection,
    continueToSigning,
    saveSignedMessages,
    getProofOfFunds,
    reset,
  } = useWalletStatement();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-xl font-bold text-gray-900">Trezor Hardware Wallet Statement</h1>
          
          <div className="flex items-center space-x-4">
            {step !== 'info' && (
              <button
                onClick={reset}
                className="text-sm text-gray-500 hover:text-gray-700"
              >
                Start Over
              </button>
            )}
            
            <ThemeToggle />
          </div>
        </div>
      </header>
      
      <main className="w-full max-w-5xl mx-auto py-8 px-4 sm:px-6 lg:px-8 flex-grow">
        {/* Step 1: Enter wallet info */}
        {step === 'info' && (
          <WalletInfoForm 
            onSubmit={saveWalletInfo} 
            isLoading={isLoading} 
          />
        )}
        
        {/* Step 2: Connect wallet */}
        {step === 'connect' && (
          <ConnectWallet 
            onConnect={connectWallet} 
            isLoading={isLoading} 
            error={error} 
          />
        )}
        
        {/* Step 3: Select addresses */}
        {step === 'addresses' && (
          <AddressSelection
            addresses={addresses}
            selectedAddresses={selectedAddresses}
            onSelectAddress={toggleAddressSelection}
            onContinue={continueToSigning}
            error={error}
            isLoadingBalances={isLoadingBalances}
          />
        )}
        
        {/* Step 4: Sign messages */}
        {step === 'sign' && (
          <SignMessages
            addresses={selectedAddresses}
            onComplete={saveSignedMessages}
            reportDate={walletInfo.reportDate || new Date().toISOString().split('T')[0]}
            ownerName={walletInfo.ownerName || ''}
          />
        )}
        
        {/* Step 5: View and download statement */}
        {step === 'statement' && (
          <Statement
            proofOfFunds={getProofOfFunds()}
            onBack={() => reset()}
          />
        )}
      </main>
      
      <footer className="bg-white border-t border-gray-200 mt-auto">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center">
            <p className="text-center text-sm text-gray-500">
              © {new Date().getFullYear()} Trezor Hardware Wallet Statement Generator. 
              This is a demonstration app for educational purposes.
            </p>
            <div className="mt-2 space-x-4">
              <Link href="/debug" className="text-xs text-blue-500 hover:underline">
                Debug Tools
              </Link>
              <Link href="/verify" className="text-xs text-blue-500 hover:underline">
                Signature Verification
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
