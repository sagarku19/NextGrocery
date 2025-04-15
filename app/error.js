'use client';

import { useEffect } from 'react';
import Link from 'next/link';

export default function Error({ error, reset }) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Application error:', error);
  }, [error]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-16 bg-gray-50">
      <div className="text-center">
        <h1 className="text-5xl font-bold text-gray-900 mb-4">Something went wrong</h1>
        <p className="text-lg text-gray-600 mb-8">
          We're sorry, but there was an error with your request.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => reset()}
            className="px-5 py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-medium rounded-lg focus:outline-none transition-colors"
          >
            Try Again
          </button>
          <Link 
            href="/"
            className="px-5 py-2.5 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium rounded-lg focus:outline-none transition-colors"
          >
            Go Home
          </Link>
        </div>
      </div>
    </div>
  );
} 