"use client";

import { useEffect } from 'react';

export default function ThemeInitializer() {
  // This component will only run on the client
  useEffect(() => {
    try {
      // Get stored theme or check system preference
      const storedTheme = localStorage.getItem('theme');
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      
      // Apply theme based on stored value or system preference
      if (storedTheme === 'dark' || (!storedTheme && prefersDark)) {
        applyDarkStyles();
      } else {
        document.documentElement.classList.remove('dark');
      }
    } catch (err) {
      // Safely handle any errors
      console.error('Error initializing theme:', err);
    }
  }, []);

  // Apply dark mode styles
  function applyDarkStyles() {
    document.documentElement.classList.add('dark');
    document.documentElement.style.backgroundColor = '#0a0a0a';
    document.body.style.backgroundColor = '#0a0a0a';
    
    // Apply to major components
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
    
    document.querySelectorAll('.bg-gray-50').forEach(el => {
      if (el instanceof HTMLElement) {
        el.style.backgroundColor = '#222222';
      }
    });
  }

  // This component doesn't render anything visible
  return null;
} 