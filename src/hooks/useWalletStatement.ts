import { useState, useEffect } from 'react';
import { WalletInfo, Address, SignedMessage, ProofOfFunds } from '@/types';
import { initTrezor, getAddresses } from '@/utils/trezor';
import { updateWalletInfoWithExchangeRate } from '@/utils/currency';

type Step = 'info' | 'connect' | 'addresses' | 'sign' | 'statement';

export default function useWalletStatement() {
  const [step, setStep] = useState<Step>('info');
  const [walletInfo, setWalletInfo] = useState<Partial<WalletInfo>>({
    reportDate: new Date().toISOString().split('T')[0],
    currency: 'BTC',
  });
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedAddresses, setSelectedAddresses] = useState<Address[]>([]);
  const [signedMessages, setSignedMessages] = useState<SignedMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingBalances, setIsLoadingBalances] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Initialize Trezor
  useEffect(() => {
    initTrezor();
  }, []);
  
  // Step 1: Save wallet info
  const saveWalletInfo = async (info: Partial<WalletInfo>) => {
    setIsLoading(true);
    try {
      // Merge with existing wallet info
      const newWalletInfo = { ...walletInfo, ...info };
      
      // If display currency is specified, fetch exchange rate
      if (newWalletInfo.displayCurrency) {
        console.log(`Fetching exchange rate for ${newWalletInfo.displayCurrency}`);
        const updatedInfo = await updateWalletInfoWithExchangeRate(newWalletInfo as WalletInfo);
        setWalletInfo(updatedInfo);
        console.log('Updated wallet info with exchange rate:', updatedInfo);
      } else {
        setWalletInfo(newWalletInfo);
      }
      
      setStep('connect');
    } catch (error) {
      console.error('Error saving wallet info:', error);
      setError('Failed to fetch currency exchange rate. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Step 2: Connect to wallet and get addresses
  const connectWallet = async () => {
    setIsLoading(true);
    setIsLoadingBalances(true);
    setError(null);
    
    try {
      console.log('Attempting to connect to Trezor wallet...');
      // Change from fixed count of 10 to allow the discovery mechanism to work
      // We'll pass 5 as the minimum number of addresses we want, but the function
      // will continue scanning until it finds a gap of 20 empty addresses
      const walletAddresses = await getAddresses(0, 5);
      console.log('Successfully retrieved addresses:', walletAddresses);
      
      if (walletAddresses.length === 0) {
        throw new Error('No addresses were found. Please ensure your Trezor device is connected and unlocked.');
      }
      
      // Display a message about how many addresses were found with balances
      const addressesWithBalance = walletAddresses.filter(addr => addr.balance > 0);
      if (addressesWithBalance.length > 0) {
        console.log(`Found ${addressesWithBalance.length} addresses with balances out of ${walletAddresses.length} total`);
      }
      
      setAddresses(walletAddresses);
      setStep('addresses');
    } catch (err) {
      console.error('Trezor connection error:', err);
      const errorMessage = err instanceof Error ? err.message : String(err);
      setError(`Failed to connect to wallet: ${errorMessage}`);
      
      // Stay on the connect step if there's an error
      setStep('connect');
      
      // Clear any previously loaded addresses
      setAddresses([]);
    } finally {
      setIsLoading(false);
      setIsLoadingBalances(false);
    }
  };
  
  // Step 3: Select addresses to include
  const toggleAddressSelection = (address: Address, selected: boolean) => {
    if (selected) {
      setSelectedAddresses((prev) => [...prev, address]);
    } else {
      setSelectedAddresses((prev) => 
        prev.filter((addr) => addr.address !== address.address)
      );
    }
  };
  
  const continueToSigning = () => {
    if (selectedAddresses.length === 0) {
      setError('Please select at least one address');
      return;
    }
    
    setError(null);
    setStep('sign');
  };
  
  // Step 4: Sign messages for proof of funds
  const saveSignedMessages = (messages: SignedMessage[]) => {
    setSignedMessages(messages);
    
    // Calculate total balance
    const totalBalance = selectedAddresses.reduce((sum, addr) => sum + addr.balance, 0);
    
    // Create complete wallet info
    const completeWalletInfo: WalletInfo = {
      ...walletInfo as WalletInfo,
      addresses: selectedAddresses,
      totalBalance,
    };
    
    setWalletInfo(completeWalletInfo);
    setStep('statement');
  };
  
  // Generate final proof of funds
  const getProofOfFunds = (): ProofOfFunds => ({
    walletInfo: walletInfo as WalletInfo,
    signedMessages,
  });
  
  // Reset workflow
  const reset = () => {
    setStep('info');
    setSelectedAddresses([]);
    setSignedMessages([]);
  };
  
  return {
    step,
    walletInfo,
    addresses,
    selectedAddresses,
    signedMessages,
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
    setStep,
  };
} 