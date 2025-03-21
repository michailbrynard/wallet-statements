export interface Address {
  path: string;
  address: string;
  balance: number;
  transactions: number;
  lastActivity?: string;
}

export interface SignedMessage {
  address: string;
  message: string;
  signature: string;
}

export interface WalletInfo {
  walletName: string;
  ownerName: string;
  ownerEmail?: string;
  ownerPhone?: string;
  companyName?: string;
  addresses: Address[];
  totalBalance: number;
  reportDate: string;
  currency?: string;
  displayCurrency?: string;
  exchangeRate?: number;
}

export interface ProofOfFunds {
  walletInfo: WalletInfo;
  signedMessages: SignedMessage[];
} 