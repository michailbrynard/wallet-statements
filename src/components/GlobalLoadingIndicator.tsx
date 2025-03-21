"use client";

import { useState, useEffect } from 'react';

export default function GlobalLoadingIndicator() {
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Create event listeners for API request start and end
    const startLoading = () => setLoading(true);
    const stopLoading = () => setLoading(false);

    // Add event listeners for fetch start and completion
    window.addEventListener('fetch-start', startLoading);
    window.addEventListener('fetch-complete', stopLoading);
    window.addEventListener('fetch-error', stopLoading);

    // Intercept fetch to trigger the events
    const originalFetch = window.fetch;
    window.fetch = function(...args) {
      // Only show for API calls to prevent flashing on static resource loading
      const url = args[0]?.toString() || '';
      if (url.includes('/api/')) {
        window.dispatchEvent(new Event('fetch-start'));
        
        return originalFetch.apply(this, args)
          .then((response) => {
            window.dispatchEvent(new Event('fetch-complete'));
            return response;
          })
          .catch((error) => {
            window.dispatchEvent(new Event('fetch-error'));
            throw error;
          });
      }
      
      return originalFetch.apply(this, args);
    };

    return () => {
      // Clean up event listeners
      window.removeEventListener('fetch-start', startLoading);
      window.removeEventListener('fetch-complete', stopLoading);
      window.removeEventListener('fetch-error', stopLoading);
      
      // Restore original fetch
      window.fetch = originalFetch;
    };
  }, []);

  if (!loading) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-blue-600 h-1">
      <div className="h-full w-1/3 bg-white opacity-25 animate-[loading_1s_ease-in-out_infinite]"></div>
    </div>
  );
} 