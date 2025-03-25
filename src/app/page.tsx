"use client";

import WalletInfoForm from '@/components/WalletInfoForm';
import ConnectWallet from '@/components/ConnectWallet';
import AddressSelection from '@/components/AddressSelection';
import SignMessages from '@/components/SignMessages';
import Statement from '@/components/Statement';
import ThemeToggle from '@/components/ThemeToggle';
import useWalletStatement from '@/hooks/useWalletStatement';
import Link from 'next/link';

const GitHubLink = () => (
  <Link
    href="https://github.com/michailbrynard/wallet-statements"
    target="_blank"
    rel="noopener noreferrer"
    className="text-gray-600 hover:text-gray-900 transition-colors"
    aria-label="View source on GitHub"
  >
    <svg
      viewBox="0 0 24 24"
      className="w-6 h-6"
      fill="currentColor"
    >
      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
    </svg>
  </Link>
);

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
    connectionStep,
  } = useWalletStatement();

  if (step === 'info') {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <header className="bg-white shadow-sm sticky top-0 z-10">
          <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
            <Link href="/" className="text-xl font-bold text-gray-900 hover:text-gray-700">
              WalletStatements.com
            </Link>
            <div className="flex items-center space-x-4">
              <GitHubLink />
              <ThemeToggle />
            </div>
          </div>
        </header>

        <main className="flex-grow">
          <div className="relative bg-white dark:bg-gray-900">
            <div className="absolute inset-0">
              <div className="absolute inset-0 bg-gradient-to-r from-gray-900 to-gray-800 dark:from-gray-950 dark:to-gray-900 mix-blend-multiply dark:mix-blend-normal" />
              <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))] dark:bg-[url('/grid-dark.svg')]" />
            </div>
            <div className="relative max-w-7xl mx-auto py-24 px-4 sm:py-32 sm:px-6 lg:px-8">
              <div className="text-center">
                <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">
                  Professional Bitcoin Wallet Statements
                </h1>
                <p className="mt-6 text-xl text-gray-200 max-w-3xl mx-auto">
                  Generate secure, verifiable proof of funds for your Bitcoin wallet. Perfect for mortgage applications, financial verification, and business transactions.
                </p>
                <div className="mt-10 flex justify-center gap-x-6">
                  <button
                    onClick={() => document.getElementById('generate-form')?.scrollIntoView({ behavior: 'smooth' })}
                    className="rounded-md bg-white px-6 py-3 text-lg font-semibold text-gray-900 shadow-sm hover:bg-gray-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white cursor-pointer"
                  >
                    Generate Statement
                  </button>
                  <Link
                    href="/example-statement.pdf"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-md bg-gray-800 px-6 py-3 text-lg font-semibold text-white shadow-sm hover:bg-gray-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-800 cursor-pointer"
                  >
                    Preview Statement
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Features Section */}
          <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-3 gap-8 mb-16">
              <div className="bg-white p-8 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Proof of Funds</h3>
                <p className="text-gray-600">Generate professional statements for mortgage applications and financial verification.</p>
              </div>
              <div className="bg-white p-8 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Secure & Private</h3>
                <p className="text-gray-600">Your private keys never leave your hardware wallet. All operations require explicit device confirmation and no data is sent to servers.</p>
              </div>
              <div className="bg-white p-8 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Verifiable</h3>
                <p className="text-gray-600">Each statement is cryptographically signed and can be independently verified.</p>
              </div>
            </div>
          </div>

          {/* How it Works Section */}
          <div className="bg-gray-50 py-24">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-16">
                <h2 className="text-3xl font-bold text-gray-900 mb-8">How It Works</h2>
                <div className="grid md:grid-cols-4 gap-12">
                  <div>
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                      <span className="text-2xl font-bold text-blue-600">1</span>
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-3">Connect Wallet</h3>
                    <p className="text-gray-600">Connect your Trezor hardware wallet securely</p>
                  </div>
                  <div>
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                      <span className="text-2xl font-bold text-blue-600">2</span>
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-3">Select Addresses</h3>
                    <p className="text-gray-600">Choose which addresses to include in your statement</p>
                  </div>
                  <div>
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                      <span className="text-2xl font-bold text-blue-600">3</span>
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-3">Sign Messages</h3>
                    <p className="text-gray-600">Verify ownership with your hardware wallet</p>
                  </div>
                  <div>
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                      <span className="text-2xl font-bold text-blue-600">4</span>
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-3">Download Statement</h3>
                    <p className="text-gray-600">Get your professionally formatted statement</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Generate Form Section */}
          <div className="max-w-7xl mx-auto py-24 px-4 sm:px-6 lg:px-8">
            <div id="generate-form" className="bg-white rounded-lg shadow-sm p-8 max-w-2xl mx-auto">
              <h2 className="text-2xl font-semibold text-gray-900 mb-6">Generate Your Statement</h2>
              <WalletInfoForm onSubmit={saveWalletInfo} isLoading={isLoading} />
            </div>
          </div>

          {/* FAQ Section */}
          <div className="bg-gray-50 py-24">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Frequently Asked Questions</h2>
              <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto">
                <div className="bg-white p-6 rounded-lg shadow-sm">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">How does the security work?</h3>
                  <p className="text-gray-600">Your hardware wallet&apos;s security model ensures complete protection. Every operation requires explicit confirmation on your device&apos;s screen, and private keys never leave your wallet. We only read public information that you can verify directly on your hardware wallet&apos;s display.</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-sm">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">What information is included?</h3>
                  <p className="text-gray-600">Each statement includes your wallet addresses, current balances, and cryptographic signatures proving ownership. You&apos;ll need to provide your name and wallet label for professional presentation.</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-sm">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">How do I verify a statement?</h3>
                  <p className="text-gray-600">Use our <Link href="/verify" className="text-blue-500 hover:underline cursor-pointer">verification tool</Link> to independently verify any statement&apos;s authenticity. Simply enter the statement details and cryptographic signatures to confirm ownership.</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-sm">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">What wallets are supported?</h3>
                  <p className="text-gray-600">Currently supporting Trezor hardware wallets. Ledger support coming soon.</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-sm">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Is my data private?</h3>
                  <p className="text-gray-600">Yes. This is a front-end only application - all operations happen locally in your browser. No data is ever sent to servers or stored anywhere. You can verify this in our open source code or using your browser&apos;s network inspector.</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-sm">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">What can I use this for?</h3>
                  <p className="text-gray-600">Perfect for mortgage applications, proof of funds, business transactions, and any situation requiring verifiable proof of Bitcoin ownership. Each statement is professionally formatted and cryptographically secure. <Link href="/verify" className="text-blue-500 hover:underline cursor-pointer">Verify any statement</Link> using our verification tool.</p>
                </div>
              </div>
            </div>
          </div>
        </main>

        <footer className="bg-white border-t border-gray-200">
          <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col items-center">
              <p className="text-center text-sm text-gray-500">
                © {new Date().getFullYear()} WalletStatements.com - Professional Bitcoin Wallet Statements
              </p>
              <div className="mt-4 space-x-6">
                <Link href="/verify" className="text-sm text-blue-500 hover:underline cursor-pointer">
                  Verify Signatures
                </Link>
                <Link href="/privacy" className="text-sm text-gray-500 hover:text-gray-700 cursor-pointer">
                  Privacy Policy
                </Link>
                <Link href="/terms" className="text-sm text-gray-500 hover:text-gray-700 cursor-pointer">
                  Terms of Service
                </Link>
              </div>
              <div className="mt-4 flex items-center justify-center space-x-2">
                <svg className="w-5 h-5 text-orange-500" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M23.638 14.904c-1.602 6.43-8.113 10.34-14.542 8.736C2.67 22.05-1.244 15.525.362 9.105 1.962 2.67 8.475-1.243 14.9.358c6.43 1.605 10.342 8.115 8.738 14.548v-.002zm-6.35-4.613c.24-1.59-.974-2.45-2.64-3.03l.54-2.153-1.315-.33-.525 2.107c-.345-.087-.705-.167-1.064-.25l.526-2.127-1.32-.33-.54 2.165c-.285-.067-.565-.132-.84-.2l-1.815-.45-.35 1.407s.975.225.955.236c.535.136.63.486.615.766l-1.477 5.92c-.075.166-.24.406-.614.314.015.02-.96-.24-.96-.24l-.66 1.51 1.71.426.93.236-.54 2.19 1.32.327.54-2.17c.36.1.705.19 1.05.273l-.51 2.154 1.32.33.545-2.19c2.24.427 3.93.257 4.64-1.774.57-1.637-.03-2.58-1.217-3.196.854-.193 1.5-.76 1.68-1.93h.01zm-3.01 4.22c-.404 1.64-3.157.75-4.05.53l.72-2.9c.896.23 3.757.67 3.33 2.37zm.41-4.24c-.37 1.49-2.662.735-3.405.55l.654-2.64c.744.18 3.137.524 2.75 2.084v.006z" />
                </svg>
                <span className="text-sm text-gray-500">Support us: <span className="font-mono">bc1qdlugrqq6z6s624lqws9dc5nkz2x74e4f3znmsl</span></span>
              </div>
            </div>
          </div>
        </footer>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <Link href="/" className="text-xl font-bold text-gray-900 hover:text-gray-700">
            WalletStatements.com
          </Link>
          <div className="flex items-center space-x-4">
            {step === 'connect' || step === 'addresses' || step === 'sign' || step === 'statement' ? (
              <button
                onClick={reset}
                className="text-sm text-gray-500 hover:text-gray-700 cursor-pointer"
              >
                Start Over
              </button>
            ) : null}
            <GitHubLink />
            <ThemeToggle />
          </div>
        </div>
      </header>
      
      <main className="w-full max-w-5xl mx-auto py-8 px-4 sm:px-6 lg:px-8 flex-grow">
        {step === 'connect' && (
          <ConnectWallet 
            onConnect={connectWallet} 
            isLoading={isLoading} 
            error={error}
            currentStep={connectionStep}
          />
        )}
        
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
        
        {step === 'sign' && (
          <SignMessages
            addresses={selectedAddresses}
            onComplete={saveSignedMessages}
            reportDate={walletInfo.reportDate || new Date().toISOString().split('T')[0]}
            ownerName={walletInfo.ownerName || ''}
          />
        )}
        
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
              © {new Date().getFullYear()} WalletStatements.com - Professional Bitcoin Wallet Statements
            </p>
            <div className="mt-2">
              <Link href="/verify" className="text-xs text-blue-500 hover:underline cursor-pointer">
                Verify Signatures
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
