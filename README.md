# WalletStatements.com

The open-source codebase for [WalletStatements.com](https://walletstatements.com) - a professional Bitcoin statement and proof of funds generator for Trezor hardware wallets.

## About

WalletStatements.com helps Bitcoin holders create professional, verifiable statements and proof of funds documents using their Trezor hardware wallets. Perfect for mortgage applications, financial verification, and business transactions.

## Features

- **Professional Statements**: Generate clean, institution-ready PDF statements
- **Hardware Wallet Integration**: Secure connection with Trezor devices
- **Cryptographic Proof**: Sign messages to verify Bitcoin address ownership
- **Zero Data Storage**: All operations happen client-side for maximum privacy
- **Bank-Grade Documents**: Professional formatting suitable for financial institutions
- **Open Source**: Transparent, verifiable codebase

## Technology Stack

- **Frontend**: Next.js & React
- **Hardware Integration**: Trezor Connect API
- **Bitcoin Operations**: bitcoinjs-lib
- **Document Generation**: pdf-lib
- **Styling**: TailwindCSS
- **Form Handling**: react-hook-form with Zod validation

## Development

### Prerequisites

- Node.js (v16+)
- npm or yarn
- Git

### Local Setup

```bash
# Clone the repository
git clone https://github.com/yourusername/walletstatements.git
cd walletstatements

# Install dependencies
npm install

# Start development server
npm run dev
```

Visit `http://localhost:3000` to view the application.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## Security

- No private keys ever leave the Trezor device
- All operations happen client-side
- No data storage or transmission of sensitive information
- Open-source code for security auditing

## Support

If you find this project useful, consider supporting its development:

Bitcoin: `bc1qdlugrqq6z6s624lqws9dc5nkz2x74e4f3znmsl`

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Legal Disclaimer

This application is provided as-is. Users are responsible for verifying the accuracy of generated statements and ensuring compliance with local regulations.
