import TrezorConnect from '@trezor/connect-web';
import { Address, SignedMessage } from '@/types';
import * as bitcoin from 'bitcoinjs-lib';
import { payments, networks } from 'bitcoinjs-lib';

// Define types for Trezor API responses
interface TrezorAddress {
  path: string;
  address: string;
  balance?: number;
  transfers?: number;
}

interface TrezorTransaction {
  timestamp: number;
  inputs: {
    addresses?: string[];
  }[];
  outputs: {
    addresses?: string[];
  }[];
}

interface TrezorAccountInfo {
  addresses?: TrezorAddress[];
  used?: TrezorAddress[];
  unused?: TrezorAddress[];
  change?: TrezorAddress[];
  history?: {
    transactions?: TrezorTransaction[];
  };
  path?: string;
  descriptor?: string;
}

// Create a simple rate limiter
const createRateLimiter = (maxRequestsPerSecond: number) => {
  const queue: (() => void)[] = [];
  let processing = false;
  
  // Process the queue
  const processQueue = async () => {
    if (processing || queue.length === 0) return;
    
    processing = true;
    const waitTime = 1000 / maxRequestsPerSecond;
    
    while (queue.length > 0) {
      const task = queue.shift();
      if (task) {
        task();
        await new Promise(resolve => setTimeout(resolve, waitTime));
      }
    }
    
    processing = false;
  };
  
  // Add a task to the queue
  return (task: () => void) => {
    queue.push(task);
    processQueue();
  };
};

// Rate limiter for API calls - limit to 5 calls per second
const apiRateLimiter = createRateLimiter(5);

// Initialize Trezor Connect
export const initTrezor = () => {
  try {
    // Make sure the manifest is proper and complete
    TrezorConnect.manifest({
      email: 'developer@example.com',
      appUrl: 'https://hardware-statement.com',
    });
    
    console.log("Trezor Connect initialized successfully");
    
    // Init TrezorConnect with settings
    return TrezorConnect.init({
      popup: true, // Use Trezor's popup
      debug: false, // Enable debug mode for development
      lazyLoad: true, // Set to true to load the iframe later
      manifest: {
        email: 'developer@example.com',
        appUrl: 'https://hardware-statement.com',
      },
    });
  } catch (error) {
    console.error("Error initializing Trezor Connect:", error);
    throw error;
  }
};

// Helper function to generate mock addresses
const generateMockAddresses = (startIndex: number, count: number): Address[] => {
  console.warn('Using mock addresses as fallback');
  const addresses: Address[] = [];
  
  for (let i = startIndex; i < startIndex + count; i++) {
    addresses.push({
      path: `m/84'/0'/0'/0/${i}`,
      address: `bc1q${Math.random().toString(36).substring(2, 15)}`,
      balance: Math.random() * 2, // Mock balance in BTC
      transactions: Math.floor(Math.random() * 50),
      lastActivity: new Date(Date.now() - Math.random() * 10000000000).toISOString().split('T')[0],
    });
  }
  
  console.log("Generated mock addresses:", addresses);
  return addresses;
};

// Fetch real-time balance from a blockchain API via our server API route
// Adds rate limiting to prevent 500 errors
const fetchAddressBalance = async (address: string): Promise<number> => {
  return new Promise((resolve) => {
    apiRateLimiter(async () => {
      console.log(`Fetching balance for address: ${address}`);
      try {
        // Use our server API route to avoid CSP issues
        const response = await fetch(`/api/address-balance?address=${encodeURIComponent(address)}`);
        
        if (!response.ok) {
          console.warn(`API error for ${address}: ${response.status}`);
          resolve(0); // Return 0 as fallback on error
          return;
        }
        
        const data = await response.json();
        console.log(`Successfully fetched balance for ${address}: ${data.balanceBTC} BTC`);
        resolve(data.balanceBTC || 0);
      } catch (error) {
        console.error(`Error fetching balance for ${address}:`, error);
        resolve(0); // Return 0 as fallback
      }
    });
  });
};

// Function to safely get an address from the device with retries on error
async function safeGetAddress(path: string, retries = 3): Promise<any> {
  let attempt = 0;
  let lastError = null;
  
  while (attempt < retries) {
    try {
      // Add a small delay between device calls
      if (attempt > 0) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
      
      const result = await TrezorConnect.getAddress({
        path,
        coin: 'btc',
        showOnTrezor: false,
      });
      
      if (result.success) {
        return result;
      } else if (result.payload.error && result.payload.error.includes('device call in progress')) {
        // If device is busy, wait a bit longer before retry
        console.warn(`Device busy, waiting longer before retry for ${path}`);
        await new Promise(resolve => setTimeout(resolve, 2000));
      } else {
        console.warn(`Failed to get address for ${path}:`, result.payload.error);
        return null;
      }
    } catch (error) {
      console.error(`Error in attempt ${attempt + 1} for ${path}:`, error);
      lastError = error;
    }
    
    attempt++;
  }
  
  console.error(`Failed to get address for ${path} after ${retries} attempts:`, lastError);
  return null;
}

// Get Bitcoin addresses from Trezor
export const getAddresses = async (
  startIndex: number = 0,
  count: number = 10
): Promise<Address[]> => {
  try {
    console.log(`Requesting Bitcoin addresses from Trezor, startIndex: ${startIndex}, count: ${count}`);
    
    // First, check if Trezor is initialized
    await initTrezor();
    
    // Standard gap limit according to BIP44/BIP84
    const GAP_LIMIT = 20;
    const MAX_ADDRESSES_TO_CHECK = 100; // Safety limit to prevent infinite loops
    
    // Get the account descriptor from Trezor directly - this only needs one popup
    console.log("Getting account info from Trezor");
    const accountInfoResult = await TrezorConnect.getAccountInfo({
      coin: 'btc',
      path: "m/84'/0'/0'", // BIP84 account path
      details: 'txs',
    });
    
    if (!accountInfoResult.success) {
      console.error("Failed to get account info:", accountInfoResult.payload.error);
      throw new Error(`Failed to get account info: ${accountInfoResult.payload.error}`);
    }
    
    // Extract addresses from the account info
    const accountInfo = accountInfoResult.payload;
    console.log("Successfully retrieved account info:", accountInfo);
    
    // Collect all address information
    const addresses: Address[] = [];
    
    // Process used addresses (these likely have balances)
    if (accountInfo.addresses?.used && accountInfo.addresses.used.length > 0) {
      console.log(`Processing ${accountInfo.addresses.used.length} used addresses`);
      
      for (const addr of accountInfo.addresses.used) {
        const balance = await fetchAddressBalance(addr.address);
        addresses.push({
          path: addr.path,
          address: addr.address,
          balance,
          transactions: addr.transfers || 0,
          lastActivity: '',
        });
      }
    }
    
    // Process unused addresses (may have received funds recently)
    if (accountInfo.addresses?.unused && accountInfo.addresses.unused.length > 0) {
      console.log(`Processing ${accountInfo.addresses.unused.length} unused addresses`);
      
      for (const addr of accountInfo.addresses.unused) {
        const balance = await fetchAddressBalance(addr.address);
        if (balance > 0) {
          addresses.push({
            path: addr.path,
            address: addr.address,
            balance,
            transactions: addr.transfers || 0,
            lastActivity: '',
          });
        }
      }
    }
    
    // Process change addresses (these often have balances too)
    if (accountInfo.addresses?.change && accountInfo.addresses.change.length > 0) {
      console.log(`Processing ${accountInfo.addresses.change.length} change addresses`);
      
      for (const addr of accountInfo.addresses.change) {
        const balance = await fetchAddressBalance(addr.address);
        if (balance > 0) {
          addresses.push({
            path: addr.path,
            address: addr.address,
            balance,
            transactions: addr.transfers || 0,
            lastActivity: '',
          });
        }
      }
    }
    
    // Get additional change addresses if none were returned
    if (!accountInfo.addresses?.change || accountInfo.addresses.change.length === 0) {
      console.log("No change addresses returned, checking additional change addresses");
      
      const changeBatch = [];
      for (let i = 0; i < 10; i++) {
        changeBatch.push({
          path: `m/84'/0'/0'/1/${i}`, // Change address path
          showOnTrezor: false,
          coin: 'btc'
        });
      }
      
      try {
        const changeResult = await TrezorConnect.getAddress({
          bundle: changeBatch
        });
        
        if (changeResult.success) {
          console.log(`Processing ${changeResult.payload.length} additional change addresses`);
          
          for (const addrResult of changeResult.payload) {
            if (addrResult && 'success' in addrResult && addrResult.success) {
              const balance = await fetchAddressBalance(addrResult.address);
              if (balance > 0) {
                addresses.push({
                  path: addrResult.serializedPath,
                  address: addrResult.address,
                  balance,
                  transactions: 0,
                  lastActivity: '',
                });
              }
            }
          }
        }
      } catch (error) {
        console.error("Error checking additional change addresses:", error);
      }
    }
    
    // Get additional receive addresses if we don't have enough
    if (addresses.length < count) {
      const receiveBatch = [];
      const startIdx = accountInfo.addresses?.used?.length || 0;
      
      for (let i = 0; i < GAP_LIMIT && startIdx + i < MAX_ADDRESSES_TO_CHECK; i++) {
        receiveBatch.push({
          path: `m/84'/0'/0'/0/${startIdx + i}`, // Receive address path
          showOnTrezor: false,
          coin: 'btc'
        });
      }
      
      try {
        const receiveResult = await TrezorConnect.getAddress({
          bundle: receiveBatch
        });
        
        if (receiveResult.success) {
          console.log(`Processing ${receiveResult.payload.length} additional receive addresses`);
          
          for (const addrResult of receiveResult.payload) {
            if (addrResult && 'success' in addrResult && addrResult.success) {
              const balance = await fetchAddressBalance(addrResult.address);
              if (balance > 0) {
                addresses.push({
                  path: addrResult.serializedPath,
                  address: addrResult.address,
                  balance,
                  transactions: 0,
                  lastActivity: '',
                });
              }
            }
          }
        }
      } catch (error) {
        console.error("Error checking additional receive addresses:", error);
      }
    }
    
    // If we have addresses with balances, return them all
    const addressesWithBalance = addresses.filter(addr => addr.balance > 0);
    
    if (addressesWithBalance.length > 0) {
      console.log(`Found ${addressesWithBalance.length} addresses with balances`);
      
      // Sort addresses by balance (highest first)
      addressesWithBalance.sort((a, b) => b.balance - a.balance);
      return addressesWithBalance;
    }
    
    // If no addresses with balances, return top addresses up to count
    console.log(`No addresses with balances found, returning first ${Math.min(count, addresses.length)} addresses`);
    return addresses.slice(0, count);
  } catch (error) {
    console.error('Error getting addresses:', error);
    throw new Error(`Failed to get addresses from Trezor: ${error instanceof Error ? error.message : String(error)}`);
  }
};

// Sign a message with a specific address
export const signMessage = async (
  path: string,
  message: string
): Promise<SignedMessage | null> => {
  try {
    console.log(`Signing message for path: ${path}`);
    const result = await TrezorConnect.signMessage({
      path,
      message,
      coin: 'btc',
    });

    if (!result.success) {
      console.error("Error signing message:", result.payload.error);
      throw new Error(result.payload.error);
    }

    console.log("Message signed successfully");
    return {
      address: result.payload.address,
      message,
      signature: result.payload.signature,
    };
  } catch (error) {
    console.error('Error signing message:', error);
    return null;
  }
};

// Verify a signed message
export const verifyMessage = async (
  address: string,
  message: string,
  signature: string
): Promise<boolean> => {
  try {
    console.log(`Verifying message for address: ${address}`);
    const result = await TrezorConnect.verifyMessage({
      address,
      message,
      signature,
      coin: 'btc',
    });

    console.log("Verification result:", result);
    return result.success;
  } catch (error) {
    console.error('Error verifying message:', error);
    return false;
  }
};

// Create a standard proof of funds message
export const createProofMessage = (address: string, balance: number, date: string, ownerName: string) => {
  return `I, ${ownerName}, hereby confirm that I own the Bitcoin address ${address} with a balance of ${balance} BTC as of ${date}.`;
}; 