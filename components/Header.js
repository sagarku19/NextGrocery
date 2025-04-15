'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import CartButton from './CartButton';
import AuthButton from './AuthButton';
import LocationSelector from './LocationSelector';
import Image from 'next/image';
import CategoryList from './CategoryList';
import { useAuth } from '@/hooks/useAuth';

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);
  const menuRef = useRef(null);
  const categoryDropdownRef = useRef(null);
  const { user, isAdmin, isDriver } = useAuth();

  // Handle scroll effects
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
      if (categoryDropdownRef.current && !categoryDropdownRef.current.contains(event.target)) {
        setIsCategoryDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <>
      {/* Top Bar with Location Selector */}
      <div className="bg-teal-600 text-white py-2 hidden md:block">
        <div className="container mx-auto px-4 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="flex items-center text-sm">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              <span>1-800-GROCERY</span>
            </div>
            <div className="flex items-center text-sm">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>Open: 8AM - 10PM</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/about" className="text-sm hover:text-teal-100 transition-colors">About</Link>
            <Link href="/contact" className="text-sm hover:text-teal-100 transition-colors">Contact</Link>
            <Link href="/help" className="text-sm hover:text-teal-100 transition-colors">Help</Link>
          </div>
        </div>
      </div>
      
      {/* Main Header */}
      <header className={`sticky top-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-white shadow-md' : 'bg-white'
      }`}>
        <div className="container mx-auto">
          <div className="flex items-center justify-between h-16 px-4 md:px-0">
            {/* Mobile menu button */}
            <div className="relative md:hidden" ref={menuRef}>
              <button
                className="p-2 rounded-md text-slate-600 hover:bg-slate-100 transition-all"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                aria-label="Toggle menu"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
              
              {/* Mobile Menu Dropdown */}
              {isMenuOpen && (
                <div className="absolute left-0 mt-2 w-72 bg-white rounded-lg shadow-xl py-2 z-50 border border-slate-200 animate-fadeIn">
                  {/* Profile button for mobile */}
                  {user && (
                    <Link href="/profile" 
                      className="flex items-center px-4 py-3 text-teal-600 font-medium border-b border-slate-100 hover:bg-slate-50"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-teal-100 text-teal-600 mr-3">
                        {user.name?.charAt(0).toUpperCase() || user.phone?.charAt(0) || 'U'}
                      </div>
                      <div>
                        <span className="block">My Profile</span>
                        <span className="text-xs text-slate-500">
                          {isAdmin() ? 'Admin' : isDriver() ? 'Driver' : 'Customer'}
                        </span>
                      </div>
                    </Link>
                  )}
                  
                  <div className="pt-1">
                    <Link href="/" 
                      className="flex items-center px-4 py-3 text-slate-700 hover:bg-slate-50 hover:text-teal-600"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                      </svg>
                      <span>Home</span>
                    </Link>
                    
                    <Link href="/search" 
                      className="flex items-center px-4 py-3 text-slate-700 hover:bg-slate-50 hover:text-teal-600"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                      <span>Search</span>
                    </Link>
                    
                    <Link href="/search" 
                      className="flex items-center px-4 py-3 text-slate-700 hover:bg-slate-50 hover:text-teal-600"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                      </svg>
                      <span>Categories</span>
                    </Link>
                    
                    <Link href="/offers" 
                      className="flex items-center px-4 py-3 text-slate-700 hover:bg-slate-50 hover:text-teal-600"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
                      </svg>
                      <span>Offers</span>
                    </Link>
                    
                    <Link href="/subscription" 
                      className="flex items-center px-4 py-3 text-slate-700 hover:bg-slate-50 hover:text-teal-600"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                      <span>Premium</span>
                    </Link>
                    
                    <Link href="/about" 
                      className="flex items-center px-4 py-3 text-slate-700 hover:bg-slate-50 hover:text-teal-600"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span>About</span>
                    </Link>
                    
                    <Link href="/contact" 
                      className="flex items-center px-4 py-3 text-slate-700 hover:bg-slate-50 hover:text-teal-600"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      <span>Contact</span>
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* Logo */}
            <Link href="/" className="flex items-center">
              <span className="text-2xl font-bold text-teal-600 tracking-tight">NextGrocery</span>
            </Link>

            {/* Desktop Navigation - Updated with full navigation menu */}
            <div className="hidden md:block">
              <nav className="flex items-center space-x-8">
                <Link href="/" className="font-medium text-slate-700 hover:text-teal-600 transition-colors">
                  Home
                </Link>
                
                <Link href="/search" className="font-medium text-slate-700 hover:text-teal-600 transition-colors">
                  Search
                </Link>
                
                <div className="relative" ref={categoryDropdownRef}>
                  <button
                    onClick={() => setIsCategoryDropdownOpen(!isCategoryDropdownOpen)}
                    className="font-medium text-slate-700 hover:text-teal-600 transition-colors flex items-center"
                  >
                    Categories
                    <svg className={`w-4 h-4 ml-1 transition-transform ${isCategoryDropdownOpen ? 'transform rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  
                  {isCategoryDropdownOpen && (
                    <div className="absolute left-0 mt-2 w-56 bg-white rounded-md shadow-lg py-2 z-50 border border-slate-100">
                      <CategoryList />
                    </div>
                  )}
                </div>
                
                <Link href="/offers" className="font-medium text-slate-700 hover:text-teal-600 transition-colors">
                  Offers
                </Link>
                
                <Link href="/subscription" className="font-medium text-slate-700 hover:text-teal-600 transition-colors">
                  Premium
                </Link>
                
                <Link href="/about" className="font-medium text-slate-700 hover:text-teal-600 transition-colors">
                  About
                </Link>
                
                <Link href="/contact" className="font-medium text-slate-700 hover:text-teal-600 transition-colors">
                  Contact
                </Link>
              </nav>
            </div>

            {/* Right side controls */}
            <div className="flex items-center space-x-2 md:space-x-3">
              {/* Profile button (visible to all) */}
              {user && (
                <Link href="/profile" className="hidden md:flex items-center px-3 py-1.5 bg-teal-50 text-teal-600 rounded-full hover:bg-teal-100 transition-all">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <span>Profile</span>
                </Link>
              )}
              
              <div className="hidden md:block md:min-w-32">
                <LocationSelector />
              </div>
              
              <AuthButton />
              
              <CartButton />
            </div>
          </div>
        </div>
      </header>
    </>
  );
}
