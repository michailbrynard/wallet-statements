'use client';

import { useEffect } from 'react';
import GlobalLoadingIndicator from '@/components/GlobalLoadingIndicator';

export default function ClientLoadingWrapper() {
  // Apply dark mode styling when the component mounts
  useEffect(() => {
    // Check if dark mode is active
    if (document.documentElement.classList.contains('dark')) {
      // Apply dark mode styling to major components
      document.body.style.backgroundColor = '#0a0a0a';
      
      // Apply to core layout elements
      const header = document.querySelector('header');
      if (header) header.style.backgroundColor = '#1a1a1a';
      
      const footer = document.querySelector('footer');
      if (footer) footer.style.backgroundColor = '#1a1a1a';
      
      const mainContainer = document.querySelector('.min-h-screen');
      if (mainContainer instanceof HTMLElement) {
        mainContainer.style.backgroundColor = '#0a0a0a';
      }
      
      // Apply to all white background elements
      document.querySelectorAll('.bg-white').forEach(el => {
        if (el instanceof HTMLElement) {
          el.style.backgroundColor = '#1a1a1a';
        }
      });
    }
  }, []);

  return <GlobalLoadingIndicator />;
} 