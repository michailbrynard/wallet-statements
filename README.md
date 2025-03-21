# Trezor Hardware Wallet Statement Generator

A professional web application that allows Trezor hardware wallet users to generate official-looking statements and proof of funds documents. This application integrates with Trezor Connect to access your Bitcoin addresses and securely sign messages that verify ownership of funds.

## Features

- **Connect to Trezor Hardware Wallet**: Securely connect your Trezor device to access your Bitcoin addresses.
- **Address Selection**: Choose which addresses to include in your statement.
- **Proof of Funds**: Cryptographically sign messages to prove ownership of funds.
- **Professional Statement**: Generate a clean, professional PDF statement with all your wallet information.
- **Security First**: Your private keys never leave your device - all signing is done on the Trezor.

## How It Works

1. **Enter Basic Information**: Provide your name, wallet name, and other optional information.
2. **Connect Wallet**: Connect your Trezor hardware wallet.
3. **Select Addresses**: Choose which Bitcoin addresses to include in your statement.
4. **Sign Messages**: Use your Trezor to sign proof of funds messages for selected addresses.
5. **Generate Statement**: View your statement online or download as a PDF.

## Technology Stack

- **Frontend**: Next.js, React, TailwindCSS
- **Wallet Integration**: Trezor Connect API
- **Bitcoin**: bitcoinjs-lib
- **PDF Generation**: pdf-lib
- **Form Handling**: react-hook-form with Zod validation

## Getting Started

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/hardware-statement.git
cd hardware-statement

# Install dependencies
npm install

# Start development server
npm run dev
```

### Usage

1. Navigate to http://localhost:3000 in your browser
2. Connect your Trezor device to your computer
3. Follow the on-screen instructions to generate your statement

## Security Considerations

- This application doesn't store or transmit your private keys
- All cryptographic operations happen on your Trezor device
- For maximum security, consider running this application locally

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Disclaimer

This application is for educational and informational purposes only. Always verify the accuracy of generated statements and use at your own risk.
