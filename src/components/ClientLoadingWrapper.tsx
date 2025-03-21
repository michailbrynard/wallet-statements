'use client';

import dynamic from 'next/dynamic';

// Dynamically import the GlobalLoadingIndicator with no SSR
const GlobalLoadingIndicator = dynamic(
  () => import("@/components/GlobalLoadingIndicator"),
  { ssr: false }
);

export default function ClientLoadingWrapper() {
  return <GlobalLoadingIndicator />;
} 