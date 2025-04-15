'use client';

import './globals.css';
import Link from 'next/link';
import { CartProvider } from '@/hooks/useCart';
import { LocationProvider } from '@/hooks/useLocation';
import { AuthProvider } from '@/hooks/useAuth';
import Header from '@/components/Header';
import LocationSelector from '@/components/LocationSelector';

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="icon" href="/logo.svg" type="image/svg+xml" />
        <link rel="shortcut icon" href="/logo.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/logo.svg" />
      </head>
      <body>
        <AuthProvider>
          <LocationProvider>
            <CartProvider>
              <div className="flex flex-col min-h-screen">
                <Header />
                <main className="flex-grow animate-fadeIn">
                  {children}
                </main>
                <footer className="bg-slate-800 text-white p-6 mt-auto">
                  <div className="container mx-auto px-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
                      <div className="text-center sm:text-left">
                        <div className="flex items-center justify-center sm:justify-start space-x-2 mb-4">
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-6 h-6 text-teal-400">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                          </svg>
                          <h3 className="text-lg font-bold text-teal-400">NextGrocery</h3>
                        </div>
                        <p className="text-slate-300">
                          Fresh groceries delivered to your doorstep.
                        </p>
                      </div>
                      <div className="mt-6 sm:mt-0 text-center sm:text-left">
                        <h3 className="text-lg font-bold mb-4 text-teal-400">Quick Links</h3>
                        <ul className="grid grid-cols-2 sm:grid-cols-1 gap-y-2">
                          <li><Link href="/" className="text-slate-300 hover:text-white transition-colors">Home</Link></li>
                          <li><Link href="/about" className="text-slate-300 hover:text-white transition-colors">About Us</Link></li>
                          <li><Link href="/contact" className="text-slate-300 hover:text-white transition-colors">Contact</Link></li>
                          <li><Link href="/privacy-policy" className="text-slate-300 hover:text-white transition-colors">Privacy Policy</Link></li>
                          <li><Link href="/return-policy" className="text-slate-300 hover:text-white transition-colors">Return Policy</Link></li>
                        </ul>
                      </div>
                      <div className="mt-6 md:mt-0 text-center sm:text-left">
                        <h3 className="text-lg font-bold mb-4 text-teal-400">Contact Us</h3>
                        <address className="text-slate-300 not-italic">
                          <p>123 Grocery Street</p>
                          <p>Food City, FC 12345</p>
                          <p className="mt-2">Phone: (123) 456-7890</p>
                          <p>Email: info@nextgrocery.com</p>
                        </address>
                      </div>
                    </div>
                    <div className="border-t border-slate-700 mt-8 pt-6 text-center text-slate-400 text-sm">
                      <p>&copy; {new Date().getFullYear()} NextGrocery. All rights reserved.</p>
                    </div>
                  </div>
                </footer>
              </div>
            </CartProvider>
          </LocationProvider>
        </AuthProvider>
      </body>
    </html>
  );
}