"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function Error({ 
  error, 
  reset 
}: { 
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error("Application error:", error);
  }, [error]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="max-w-md w-full p-6 bg-white rounded-lg shadow-lg">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-red-600 mb-4">Something&apos;s gone wrong!</h1>
          <div className="mb-6">
            <p className="text-gray-700 mb-2">
              We&apos;re sorry, but we encountered an error processing your request.
            </p>
            <p className="text-gray-500 text-sm mb-4">
              Error details: {error.message || "Unknown error"}
            </p>
            <div className="bg-gray-100 p-4 rounded text-left mb-4 overflow-auto max-h-32">
              <pre className="text-xs text-gray-700">{error.stack}</pre>
            </div>
          </div>
          <div className="flex flex-col space-y-2">
            <button
              onClick={() => reset()}
              className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors"
            >
              Try again
            </button>
            <Link href="/" className="w-full py-2 px-4 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-md transition-colors text-center">
              Go back to home
            </Link>
            <Link href="/debug" className="text-sm text-blue-500 hover:underline mt-2">
              Go to Debug Page
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
} 