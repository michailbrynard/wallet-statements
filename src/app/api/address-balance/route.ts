import { NextResponse } from 'next/server';

// Fetch balance from Blockstream API on the server side
const fetchBalanceFromBlockstream = async (address: string, isTestnet = false) => {
  const network = isTestnet ? 'testnet/' : '';
  const url = `https://blockstream.info/${network}api/address/${address}`;
  
  console.log(`Fetching balance from: ${url}`);
  
  const response = await fetch(url, {
    headers: {
      'Accept': 'application/json',
    },
    cache: 'no-store',
  });
  
  if (!response.ok) {
    throw new Error(`Blockstream API error: ${response.status}`);
  }
  
  const data = await response.json();
  
  // Calculate balance in BTC (satoshis / 100,000,000)
  const balanceBTC = (data.chain_stats.funded_txo_sum - data.chain_stats.spent_txo_sum) / 100000000;
  
  return {
    address,
    balanceSats: data.chain_stats.funded_txo_sum - data.chain_stats.spent_txo_sum,
    balanceBTC,
    networkType: isTestnet ? 'testnet' : 'mainnet',
  };
};

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const address = searchParams.get('address');
  
  if (!address) {
    return NextResponse.json({ error: 'Address parameter is required' }, { status: 400 });
  }
  
  try {
    // Try mainnet first
    try {
      const result = await fetchBalanceFromBlockstream(address);
      return NextResponse.json(result);
    } catch (mainnetError) {
      // If mainnet fails, try testnet
      console.log(`Mainnet lookup failed for ${address}:`, mainnetError);
      console.log('Trying testnet...');
      try {
        const testnetResult = await fetchBalanceFromBlockstream(address, true);
        return NextResponse.json(testnetResult);
      } catch (testnetError) {
        // Handle error
        console.error('Testnet lookup failed:', testnetError);
        return NextResponse.json({ error: 'Failed to fetch balance' }, { status: 500 });
      }
    }
  } catch (error) {
    console.error('Error fetching address balance:', error);
    return NextResponse.json(
      { 
        error: `Failed to fetch balance: ${error instanceof Error ? error.message : String(error)}`,
        address,
        balanceBTC: 0, // Return 0 as fallback
        balanceSats: 0,
      }, 
      { status: 500 }
    );
  }
} 