import { WalletInfo } from '@/types';

// Cache exchange rates to avoid redundant API calls
interface ExchangeRateCache {
  [key: string]: {
    rate: number;
    timestamp: number;
  };
}

const exchangeRateCache: ExchangeRateCache = {};
const CACHE_DURATION = 60 * 60 * 1000; // 1 hour in milliseconds

/**
 * Get the exchange rate for Bitcoin to a specified currency
 * Uses our own API proxy to avoid Content Security Policy issues
 */
export const getBitcoinExchangeRate = async (currency: string = 'USD'): Promise<number> => {
  const normalizedCurrency = currency.toLowerCase();
  const cacheKey = `BTC-${normalizedCurrency}`;
  
  // Check cache first
  const cachedRate = exchangeRateCache[cacheKey];
  const now = Date.now();
  
  if (cachedRate && now - cachedRate.timestamp < CACHE_DURATION) {
    console.log(`Using cached exchange rate for ${cacheKey}: ${cachedRate.rate}`);
    return cachedRate.rate;
  }
  
  // Use our own API route to fetch the exchange rate
  try {
    console.log(`Fetching exchange rate for BTC/${normalizedCurrency} via server API`);
    const response = await fetch(
      `/api/exchange-rate?currency=${encodeURIComponent(normalizedCurrency)}`
    );
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (!data.rate) {
      throw new Error(`Could not find rate for BTC/${normalizedCurrency} in API response`);
    }
    
    const rate = parseFloat(data.rate);
    
    // Cache the result
    exchangeRateCache[cacheKey] = {
      rate,
      timestamp: now
    };
    
    console.log(`Got exchange rate for BTC/${normalizedCurrency}: ${rate}`);
    return rate;
  } catch (error) {
    console.error('Error fetching exchange rate:', error);
    
    // Return cached rate even if expired, or use accurate fallback rates
    if (cachedRate) {
      console.warn(`Using expired cached exchange rate for ${cacheKey}: ${cachedRate.rate}`);
      return cachedRate.rate;
    }
    
    // More accurate fallback rates as of recent market conditions
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
    
    const rate = fallbackRates[normalizedCurrency] || 64500; // Default to USD value if unknown currency
    console.warn(`Using fallback exchange rate for ${cacheKey}: ${rate}`);
    
    // Cache this fallback rate too, but with a shorter duration (15 minutes)
    exchangeRateCache[cacheKey] = {
      rate,
      timestamp: now - (CACHE_DURATION - 15 * 60 * 1000) // Expire after 15 min
    };
    
    return rate;
  }
};

/**
 * Updates the WalletInfo with the current exchange rate for the chosen display currency
 */
export const updateWalletInfoWithExchangeRate = async (walletInfo: WalletInfo): Promise<WalletInfo> => {
  // If no display currency is specified, don't update
  if (!walletInfo.displayCurrency) {
    return walletInfo;
  }
  
  try {
    const exchangeRate = await getBitcoinExchangeRate(walletInfo.displayCurrency);
    
    return {
      ...walletInfo,
      exchangeRate
    };
  } catch (error) {
    console.error('Error updating wallet info with exchange rate:', error);
    return walletInfo;
  }
};

/**
 * Format a currency amount nicely based on the currency code
 */
export const formatCurrencyAmount = (amount: number, currencyCode: string = 'USD'): string => {
  const code = currencyCode.toUpperCase();
  
  // Get appropriate decimal places based on currency
  let decimalPlaces = 2;
  if (code === 'JPY' || code === 'KRW') {
    decimalPlaces = 0; // No decimal places for JPY or KRW
  } else if (code === 'BTC' || code === 'XBT') {
    decimalPlaces = 8; // 8 decimal places for BTC
  }
  
  // Get currency symbol or use code
  const symbols: Record<string, string> = {
    USD: '$',
    EUR: '€',
    GBP: '£',
    JPY: '¥',
    CNY: '¥',
    KRW: '₩',
    BTC: '₿',
    XBT: '₿',
    AUD: 'A$',
    CAD: 'C$',
    CHF: 'Fr',
    ZAR: 'R'
  };
  
  const symbol = symbols[code] || code;
  
  // Format the number with appropriate decimal places and thousands separators
  const formattedAmount = new Intl.NumberFormat('en-US', {
    minimumFractionDigits: decimalPlaces,
    maximumFractionDigits: decimalPlaces,
  }).format(amount);
  
  // Combine symbol and amount based on standard usage
  if (['USD', 'CAD', 'AUD', 'NZD', 'HKD', 'SGD'].includes(code)) {
    return `${symbol}${formattedAmount}`;
  } else if (code === 'GBP') {
    return `${symbol}${formattedAmount}`;
  } else if (['EUR', 'ZAR'].includes(code)) {
    return `${formattedAmount} ${symbol}`;
  } else {
    return `${symbol}${formattedAmount}`;
  }
}; 