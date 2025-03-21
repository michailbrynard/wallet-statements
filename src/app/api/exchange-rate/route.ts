import { NextResponse } from 'next/server';

// Define fallback rates in case APIs fail
const fallbackRates: Record<string, number> = {
  usd: 64500,
  eur: 60250,
  gbp: 51200,
  jpy: 9880000,
  cad: 87500,
  aud: 96800,
  cny: 468000,
  chf: 57300,
  krw: 86900000,
  zar: 1180000,
};

/**
 * API route for fetching Bitcoin exchange rates
 * Acts as a proxy to avoid Content Security Policy issues
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const currency = searchParams.get('currency') || 'usd';
  const normalizedCurrency = currency.toLowerCase();
  
  console.log(`Server-side API fetching exchange rate for BTC/${normalizedCurrency}`);
  
  try {
    // First try CoinGecko API
    const coinGeckoUrl = `https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=${normalizedCurrency}`;
    
    try {
      const response = await fetch(coinGeckoUrl, {
        headers: {
          'Accept': 'application/json',
          'User-Agent': 'Bitcoin Wallet Statement Generator/1.0'
        },
        cache: 'no-store'
      });
      
      if (response.ok) {
        const data = await response.json();
        
        if (data.bitcoin?.[normalizedCurrency]) {
          console.log(`CoinGecko rate for BTC/${normalizedCurrency}: ${data.bitcoin[normalizedCurrency]}`);
          return NextResponse.json({ rate: data.bitcoin[normalizedCurrency] });
        }
      }
      
      console.log('CoinGecko API failed, falling back to CoinCap');
    } catch (error) {
      console.error('CoinGecko API error:', error);
    }
    
    // Try CoinCap API as fallback (USD only)
    try {
      const coinCapResponse = await fetch('https://api.coincap.io/v2/assets/bitcoin', {
        headers: {
          'Accept': 'application/json',
          'User-Agent': 'Bitcoin Wallet Statement Generator/1.0'
        },
        cache: 'no-store'
      });
      
      if (coinCapResponse.ok) {
        const data = await coinCapResponse.json();
        const usdRate = parseFloat(data.data?.priceUsd);
        
        if (usdRate && !isNaN(usdRate)) {
          // If currency is USD, return directly
          if (normalizedCurrency === 'usd') {
            console.log(`CoinCap rate for BTC/USD: ${usdRate}`);
            return NextResponse.json({ rate: usdRate });
          }
          
          // Otherwise, convert via Frankfurter API
          try {
            const fxResponse = await fetch(
              `https://api.frankfurter.app/latest?from=USD&to=${normalizedCurrency.toUpperCase()}`,
              { cache: 'no-store' }
            );
            
            if (fxResponse.ok) {
              const fxData = await fxResponse.json();
              const fxRate = fxData.rates?.[normalizedCurrency.toUpperCase()];
              
              if (fxRate && !isNaN(fxRate)) {
                const convertedRate = usdRate * fxRate;
                console.log(`Converted rate for BTC/${normalizedCurrency}: ${convertedRate}`);
                return NextResponse.json({ rate: convertedRate });
              }
            }
          } catch (fxError) {
            console.error('Forex API error:', fxError);
          }
        }
      }
    } catch (coinCapError) {
      console.error('CoinCap API error:', coinCapError);
    }
    
    // All APIs failed, use fallback rates
    const fallbackRate = fallbackRates[normalizedCurrency] || fallbackRates.usd;
    console.log(`Using fallback rate for BTC/${normalizedCurrency}: ${fallbackRate}`);
    return NextResponse.json({ rate: fallbackRate });
    
  } catch (error) {
    console.error('Exchange rate API error:', error);
    
    // Return fallback rate as last resort with a 200 status to avoid breaking the frontend
    const fallbackRate = fallbackRates[normalizedCurrency] || fallbackRates.usd;
    return NextResponse.json({ 
      rate: fallbackRate,
      source: 'fallback',
      error: 'API services unavailable'
    });
  }
} 