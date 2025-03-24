import { useState } from 'react';
import React from 'react';

interface ConnectWalletProps {
  onConnect: () => Promise<void>;
  isLoading: boolean;
  error: string | null;
  currentStep: number;
}

export default function ConnectWallet({
  onConnect,
  isLoading,
  error,
  currentStep,
}: ConnectWalletProps) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-2xl mx-auto">
      <h2 className="text-xl font-bold mb-4">Connect Your Trezor Wallet</h2>
      <p className="text-gray-600 mb-6">
        Connect your Trezor hardware wallet to retrieve your Bitcoin addresses and generate your statement.
      </p>
      
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-md">
          <h3 className="text-lg font-semibold mb-2">Connection Error</h3>
          <p className="mb-3">{error}</p>
          <div className="text-sm">
            <p className="font-medium">Troubleshooting steps:</p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>Make sure your Trezor device is connected and unlocked</li>
              <li>Ensure you have the latest firmware installed</li>
              <li>Try refreshing the page and connecting again</li>
              <li>If using Firefox, try Chrome or Edge for better compatibility</li>
              <li>Check if your browser has allowed the Trezor pop-up window</li>
            </ul>
          </div>
        </div>
      )}
      
      <p className="text-gray-600 mb-6">
        <strong className="text-gray-700">Important:</strong> Your private keys will never leave your hardware wallet. This application only retrieves public address information and allows you to sign proof-of-funds messages.
      </p>
      
      <div className="space-y-4">
        <button
          onClick={onConnect}
          disabled={isLoading}
          className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-400"
        >
          {isLoading ? 'Connecting...' : 'Connect Trezor'}
        </button>
        
        {isLoading && (
          <div className="flex items-center justify-center p-6 border border-blue-100 bg-blue-50 rounded-md">
            <div className="flex flex-col items-center w-full">
              <div className="w-full max-w-md">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <svg className="animate-spin h-5 w-5 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span className="font-medium text-blue-700">
                      Connecting to Trezor...
                    </span>
                  </div>
                  <div className="text-sm text-blue-600">Step {currentStep}/3</div>
                </div>
                
                <div className="w-full bg-blue-100 rounded-full h-2 mb-4">
                  <div 
                    className="bg-blue-600 h-2 rounded-full transition-all duration-1000 ease-in-out"
                    style={{ 
                      width: `${(currentStep / 3) * 100}%`,
                      animation: 'progress 2s ease-in-out infinite'
                    }}
                  ></div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 mt-1">
                      <div className={`w-2 h-2 rounded-full ${currentStep >= 1 ? 'bg-blue-600' : 'bg-gray-300'}`}></div>
                    </div>
                    <div>
                      <p className={`text-sm font-medium ${currentStep >= 1 ? 'text-gray-700' : 'text-gray-500'}`}>Retrieving account information</p>
                      <p className={`text-sm ${currentStep >= 1 ? 'text-gray-500' : 'text-gray-400'}`}>Getting your Bitcoin account details from the Trezor device</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 mt-1">
                      <div className={`w-2 h-2 rounded-full ${currentStep >= 2 ? 'bg-blue-600' : 'bg-gray-300'}`}></div>
                    </div>
                    <div>
                      <p className={`text-sm font-medium ${currentStep >= 2 ? 'text-gray-700' : 'text-gray-500'}`}>Scanning addresses</p>
                      <p className={`text-sm ${currentStep >= 2 ? 'text-gray-500' : 'text-gray-400'}`}>Checking for addresses with balances</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 mt-1">
                      <div className={`w-2 h-2 rounded-full ${currentStep >= 3 ? 'bg-blue-600' : 'bg-gray-300'}`}></div>
                    </div>
                    <div>
                      <p className={`text-sm font-medium ${currentStep >= 3 ? 'text-gray-700' : 'text-gray-500'}`}>Fetching balances</p>
                      <p className={`text-sm ${currentStep >= 3 ? 'text-gray-500' : 'text-gray-400'}`}>Getting current balances for each address</p>
                    </div>
                  </div>
                </div>

                <div className="mt-6 text-sm text-gray-600 text-center">
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 