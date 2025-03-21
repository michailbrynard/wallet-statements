import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  webpack: (config) => {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      crypto: require.resolve('crypto-browserify'),
      stream: require.resolve('stream-browserify'),
      buffer: require.resolve('buffer'),
    };
    return config;
  },
  transpilePackages: ['@trezor/connect'],
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: `
              default-src 'self';
              script-src 'self' 'unsafe-eval' 'unsafe-inline' https://connect.trezor.io;
              style-src 'self' 'unsafe-inline';
              connect-src 'self' https://connect.trezor.io https://*.trezor.io https://api.blockcypher.com wss://*.trezor.io;
              frame-src 'self' https://connect.trezor.io;
              img-src 'self' data:;
            `.replace(/\s+/g, ' ').trim(),
          }
        ],
      },
    ];
  },
};

export default nextConfig;
