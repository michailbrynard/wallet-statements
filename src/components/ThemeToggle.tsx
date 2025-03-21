"use client";

import { useEffect, useState } from 'react';

export default function ThemeToggle() {
  // Initially set to undefined to avoid hydration mismatch
  const [isDarkMode, setIsDarkMode] = useState<boolean | undefined>(undefined);
  const [mounted, setMounted] = useState(false);

  // Initialize theme based on system preference or localStorage
  useEffect(() => {
    // Mark as mounted to avoid hydration mismatch
    setMounted(true);
    
    // Check localStorage first
    const savedTheme = localStorage.getItem('theme');
    
    if (savedTheme === 'dark') {
      setIsDarkMode(true);
      applyDarkMode(true);
    } else if (savedTheme === 'light') {
      setIsDarkMode(false);
      applyDarkMode(false);
    } else {
      // If no preference in localStorage, check system preference
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setIsDarkMode(prefersDark);
      
      if (prefersDark) {
        applyDarkMode(true);
        localStorage.setItem('theme', 'dark');
      } else {
        applyDarkMode(false);
        localStorage.setItem('theme', 'light');
      }
    }
  }, []);

  // Apply dark mode more aggressively
  const applyDarkMode = (isDark: boolean) => {
    if (isDark) {
      document.documentElement.classList.add('dark');
      document.documentElement.style.backgroundColor = '#0a0a0a';
      document.body.style.backgroundColor = '#0a0a0a';
      
      // Apply to major components
      const header = document.querySelector('header');
      if (header) header.style.backgroundColor = '#1a1a1a';
      
      const footer = document.querySelector('footer');
      if (footer) footer.style.backgroundColor = '#1a1a1a';
      
      // Apply to all white background elements
      document.querySelectorAll('.bg-white').forEach(el => {
        (el as HTMLElement).style.backgroundColor = '#1a1a1a';
      });
      
      document.querySelectorAll('.bg-gray-50').forEach(el => {
        (el as HTMLElement).style.backgroundColor = '#222222';
      });
    } else {
      document.documentElement.classList.remove('dark');
      document.documentElement.style.backgroundColor = '';
      document.body.style.backgroundColor = '';
      
      // Reset inline styles
      const header = document.querySelector('header');
      if (header) header.style.backgroundColor = '';
      
      const footer = document.querySelector('footer');
      if (footer) footer.style.backgroundColor = '';
      
      // Reset all white background elements
      document.querySelectorAll('.bg-white').forEach(el => {
        (el as HTMLElement).style.backgroundColor = '';
      });
      
      document.querySelectorAll('.bg-gray-50').forEach(el => {
        (el as HTMLElement).style.backgroundColor = '';
      });
    }
  };

  const toggleTheme = () => {
    setIsDarkMode(prev => {
      // Handle undefined case
      const currentValue = prev === undefined ? false : prev;
      const newValue = !currentValue;
      
      applyDarkMode(newValue);
      localStorage.setItem('theme', newValue ? 'dark' : 'light');
      
      return newValue;
    });
  };

  // Before mounted, render a placeholder button to avoid hydration mismatch
  if (!mounted) {
    return (
      <button
        className="p-2 rounded-md border border-gray-200 text-gray-600"
        aria-label="Loading theme preference"
      >
        <div style={{ width: '1.25rem', height: '1.25rem' }}></div>
      </button>
    );
  }

  return (
    <button
      onClick={toggleTheme}
      style={{
        backgroundColor: isDarkMode ? '#1f2937' : '#f9fafb', // Equivalent to bg-gray-800 : bg-gray-50
        borderColor: isDarkMode ? '#374151' : '#f3f4f6', // Equivalent to border-gray-700 : border-gray-100
        color: isDarkMode ? '#e5e7eb' : '#6b7280', // Equivalent to text-gray-200 : text-gray-500
        borderWidth: '1px',
        borderStyle: 'solid',
        borderRadius: '0.375rem', // Equivalent to rounded-md
        padding: '0.5rem', // Equivalent to p-2
        transition: 'all 150ms ease-in-out' // Smooth transitions
      }}
      aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      {isDarkMode ? (
        // Sun icon for light mode
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" style={{ width: '1.25rem', height: '1.25rem' }}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-4.773-4.227-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z" />
        </svg>
      ) : (
        // Moon icon for dark mode
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" style={{ width: '1.25rem', height: '1.25rem' }}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.72 9.72 0 0 1 18 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 0 0 3 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 0 0 9.002-5.998Z" />
        </svg>
      )}
    </button>
  );
} 