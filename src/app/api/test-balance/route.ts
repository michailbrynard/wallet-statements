import { NextResponse } from 'next/server';

// Simple function to fetch balance from Blockstream
const fetchBalance = async (address: string) => {
  try {
    console.log(`Fetching balance for ${address} from Blockstream API`);
    const response = await fetch(`https://blockstream.info/api/address/${address}`);
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    
    const data = await response.json();
    return {
      address,
      balanceSats: data.chain_stats.funded_txo_sum - data.chain_stats.spent_txo_sum,
      balanceBTC: (data.chain_stats.funded_txo_sum - data.chain_stats.spent_txo_sum) / 100000000,
      rawData: data
    };
  } catch (error) {
    console.error(`Error fetching balance for ${address}:`, error);
    
    // Try testnet as fallback
    try {
      console.log(`Trying testnet API for ${address}`);
      const response = await fetch(`https://blockstream.info/testnet/api/address/${address}`);
      
      if (!response.ok) {
        throw new Error(`Testnet API error: ${response.status}`);
      }
      
      const data = await response.json();
      return {
        address,
        network: 'testnet',
        balanceSats: data.chain_stats.funded_txo_sum - data.chain_stats.spent_txo_sum,
        balanceBTC: (data.chain_stats.funded_txo_sum - data.chain_stats.spent_txo_sum) / 100000000,
        rawData: data
      };
    } catch (testnetError) {
      return {
        address,
        error: String(error),
        testnetError: String(testnetError)
      };
    }
  }
};

export async function GET(request: Request) {
  // Get address from query parameters
  const { searchParams } = new URL(request.url);
  const address = searchParams.get('address');
  
  if (address) {
    // Single address mode
    const result = await fetchBalance(address);
    return NextResponse.json(result);
  } else {
    // Default test with known addresses
    const testAddresses = [
      '1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa', // Satoshi's address
      'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh', // Random SegWit address
    ];
    
    const results = await Promise.all(testAddresses.map(fetchBalance));
    return NextResponse.json({ results });
  }
} 