'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function ProfilePage() {
  const { user, userRole, signOut, isAdmin, isDriver, isCustomer } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('profile');
  
  // Redirect if not logged in
  useEffect(() => {
    if (!user) {
      router.push('/');
    }
  }, [user, router]);

  if (!user) {
    return <div className="container mx-auto px-4 py-8 text-center">Loading...</div>;
  }

  // Extract user information
  const name = user.name || 'User';
  const phone = user.phone || 'Not provided';
  const email = user.email || 'Not provided';
  const role = isAdmin() ? 'Admin' : isDriver() ? 'Driver' : 'Customer';
  const joinDate = user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Unknown';

  // Get role badge color
  const getRoleBadgeColor = () => {
    if (isAdmin()) return 'bg-purple-100 text-purple-700';
    if (isDriver()) return 'bg-blue-100 text-blue-700';
    return 'bg-emerald-100 text-emerald-700';
  };

  return (
    <div className="bg-gray-50 min-h-screen pb-12">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-teal-500 to-emerald-600 text-white pt-8 pb-24 px-4">
        <div className="container mx-auto">
          <h1 className="text-3xl font-bold mb-2">My Profile</h1>
          <p className="opacity-90">Manage your account and preferences</p>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="container mx-auto px-4 -mt-16">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {/* User Information Bar */}
          <div className="flex flex-col md:flex-row items-center p-6 border-b border-gray-100">
            <div className="flex items-center mb-4 md:mb-0">
              <div className={`flex items-center justify-center w-16 h-16 rounded-full ${getRoleBadgeColor()} font-bold text-xl mr-4`}>
                {name.charAt(0).toUpperCase()}
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-800">{name}</h2>
                <div className="flex items-center mt-1">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRoleBadgeColor()}`}>
                    {role}
                  </span>
                  <span className="text-sm text-gray-500 ml-2">Member since {joinDate}</span>
                </div>
              </div>
            </div>
            <div className="md:ml-auto flex flex-wrap gap-2">
              <button 
                onClick={signOut}
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                Logout
              </button>
              <Link 
                href={isAdmin() ? '/admin' : isDriver() ? '/driver' : '/orders'}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
              >
                {isAdmin() ? 'Admin Dashboard' : isDriver() ? 'Driver Dashboard' : 'My Orders'}
              </Link>
            </div>
          </div>
          
          {/* Tabs */}
          <div className="border-b border-gray-200">
            <nav className="flex -mb-px">
              <button
                onClick={() => setActiveTab('profile')}
                className={`py-4 px-6 text-center border-b-2 text-sm font-medium ${
                  activeTab === 'profile'
                    ? 'border-teal-500 text-teal-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Profile Information
              </button>
              <button
                onClick={() => setActiveTab('settings')}
                className={`py-4 px-6 text-center border-b-2 text-sm font-medium ${
                  activeTab === 'settings'
                    ? 'border-teal-500 text-teal-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Account Settings
              </button>
              <button
                onClick={() => setActiveTab('about')}
                className={`py-4 px-6 text-center border-b-2 text-sm font-medium ${
                  activeTab === 'about'
                    ? 'border-teal-500 text-teal-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                About NextGrocery
              </button>
            </nav>
          </div>
          
          {/* Tab Content */}
          <div className="p-6">
            {activeTab === 'profile' && (
              <div className="space-y-6">
                <h3 className="text-lg font-medium text-gray-900">Personal Information</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="text-sm font-medium text-gray-500 mb-1">Full Name</div>
                    <div className="text-gray-900">{name}</div>
                  </div>
                  
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="text-sm font-medium text-gray-500 mb-1">Phone Number</div>
                    <div className="text-gray-900">{phone}</div>
                  </div>
                  
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="text-sm font-medium text-gray-500 mb-1">Email Address</div>
                    <div className="text-gray-900">{email}</div>
                  </div>
                  
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="text-sm font-medium text-gray-500 mb-1">Account Type</div>
                    <div className="text-gray-900">{role}</div>
                  </div>
                </div>
                
                <div className="mt-6">
                  <button
                    type="button"
                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
                  >
                    Edit Profile
                  </button>
                </div>
              </div>
            )}
            
            {activeTab === 'settings' && (
              <div className="space-y-6">
                <h3 className="text-lg font-medium text-gray-900">Account Settings</h3>
                
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-base font-medium text-gray-900">Notifications</h4>
                      <p className="text-sm text-gray-500">Receive updates about your orders and account</p>
                    </div>
                    <div className="relative inline-block w-10 mr-2 align-middle select-none">
                      <input type="checkbox" name="toggle" id="toggle-notifications" className="sr-only peer" defaultChecked />
                      <label 
                        htmlFor="toggle-notifications" 
                        className="block h-6 w-11 bg-gray-300 rounded-full cursor-pointer peer-checked:bg-teal-500 peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all">
                      </label>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-base font-medium text-gray-900">Marketing Emails</h4>
                      <p className="text-sm text-gray-500">Receive promotional offers and updates</p>
                    </div>
                    <div className="relative inline-block w-10 mr-2 align-middle select-none">
                      <input type="checkbox" name="toggle" id="toggle-marketing" className="sr-only peer" />
                      <label 
                        htmlFor="toggle-marketing" 
                        className="block h-6 w-11 bg-gray-300 rounded-full cursor-pointer peer-checked:bg-teal-500 peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all">
                      </label>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-base font-medium text-gray-900">Two-Factor Authentication</h4>
                      <p className="text-sm text-gray-500">Add an extra layer of security to your account</p>
                    </div>
                    <div className="relative inline-block w-10 mr-2 align-middle select-none">
                      <input type="checkbox" name="toggle" id="toggle-2fa" className="sr-only peer" />
                      <label 
                        htmlFor="toggle-2fa" 
                        className="block h-6 w-11 bg-gray-300 rounded-full cursor-pointer peer-checked:bg-teal-500 peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all">
                      </label>
                    </div>
                  </div>
                </div>
                
                <div className="mt-6">
                  <button
                    type="button"
                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
                  >
                    Save Settings
                  </button>
                </div>
              </div>
            )}
            
            {activeTab === 'about' && (
              <div className="space-y-6">
                <h3 className="text-lg font-medium text-gray-900">About NextGrocery</h3>
                
                <p className="text-gray-700">
                  NextGrocery is a modern, user-friendly grocery delivery platform designed to make shopping for groceries 
                  convenient and hassle-free. Our mission is to connect customers with fresh produce and quality products 
                  at competitive prices, all delivered right to your doorstep.
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                  <div className="bg-gray-50 p-6 rounded-lg shadow-sm">
                    <h4 className="text-lg font-medium text-gray-900 mb-2">Developer</h4>
                    <div className="flex items-center">
                      <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center mr-4">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                        </svg>
                      </div>
                      <div>
                        <h5 className="font-medium text-gray-900">John Developer</h5>
                        <p className="text-sm text-gray-500">Full Stack Developer</p>
                        <div className="mt-2 flex space-x-3">
                          <a href="https://github.com/johndeveloper" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-gray-900">
                            <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                              <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                            </svg>
                          </a>
                          <a href="https://linkedin.com/in/johndeveloper" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-gray-900">
                            <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                              <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                            </svg>
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 p-6 rounded-lg shadow-sm">
                    <h4 className="text-lg font-medium text-gray-900 mb-2">Designer</h4>
                    <div className="flex items-center">
                      <div className="h-12 w-12 rounded-full bg-pink-100 flex items-center justify-center mr-4">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-pink-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                        </svg>
                      </div>
                      <div>
                        <h5 className="font-medium text-gray-900">Jane Designer</h5>
                        <p className="text-sm text-gray-500">UI/UX Designer</p>
                        <div className="mt-2 flex space-x-3">
                          <a href="https://dribbble.com/janedesigner" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-gray-900">
                            <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                              <path fillRule="evenodd" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10c5.51 0 10-4.48 10-10S17.51 2 12 2zm6.605 4.61a8.502 8.502 0 011.93 5.314c-.281-.054-3.101-.629-5.943-.271-.065-.141-.12-.293-.184-.445a25.416 25.416 0 00-.564-1.236c3.145-1.28 4.577-3.124 4.761-3.362zM12 3.475c2.17 0 4.154.813 5.662 2.148-.152.216-1.443 1.941-4.48 3.08-1.399-2.57-2.95-4.675-3.189-5A8.687 8.687 0 0112 3.475zm-3.633.803a53.896 53.896 0 013.167 4.935c-3.992 1.063-7.517 1.04-7.896 1.04a8.581 8.581 0 014.729-5.975zM3.453 12.01v-.26c.37.01 4.512.065 8.775-1.215.25.477.477.965.694 1.453-.109.033-.228.065-.336.098-4.404 1.42-6.747 5.303-6.942 5.629a8.522 8.522 0 01-2.19-5.705zM12 20.547a8.482 8.482 0 01-5.239-1.8c.152-.315 1.888-3.656 6.703-5.337.022-.01.033-.01.054-.022a35.318 35.318 0 011.823 6.475 8.4 8.4 0 01-3.341.684zm4.761-1.465c-.086-.52-.542-3.015-1.659-6.084 2.679-.423 5.022.271 5.314.369a8.468 8.468 0 01-3.655 5.715z" clipRule="evenodd" />
                            </svg>
                          </a>
                          <a href="https://behance.net/janedesigner" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-gray-900">
                            <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                              <path d="M8.84 10.835h-1.965v-1.859h1.783c1.878 0 1.646 1.859.182 1.859zm5.789 1.058h2.624c-.115-1.687-2.36-1.81-2.624 0zm-5.9.396h-1.854v1.947h1.824c1.782-.001 1.673-1.947.03-1.947zm15.271-.289c0 6.627-5.373 12-12 12s-12-5.373-12-12 5.373-12 12-12 12 5.373 12 12zm-13.357-.733c1.668-.853 1.607-3.981-1.587-4.028h-4.14v8.73h3.988c3.529.048 4.175-2.158 1.739-4.702zm7.172-1.665h-4.979v1.152h4.979v-1.152zm-2.601 2.317c-.756-.415-1.786-.258-2.309.346-.59.686-.477 2.14.692 2.425-.624.001.829.001 2.367.001.121-1.866-1.604-1.978-1.9-1.238h2.559c.288-.595.071-1.174-.459-1.534z" />
                            </svg>
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="mt-8 bg-gray-50 p-6 rounded-lg">
                  <h4 className="text-lg font-medium text-gray-900 mb-4">Technologies Used</h4>
                  <div className="flex flex-wrap gap-3">
                    <span className="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium bg-indigo-100 text-indigo-800">
                      Next.js
                    </span>
                    <span className="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                      React
                    </span>
                    <span className="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium bg-cyan-100 text-cyan-800">
                      Tailwind CSS
                    </span>
                    <span className="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium bg-green-100 text-green-800">
                      MongoDB
                    </span>
                    <span className="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">
                      Node.js
                    </span>
                    <span className="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium bg-purple-100 text-purple-800">
                      Twilio
                    </span>
                    <span className="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium bg-red-100 text-red-800">
                      Stripe
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 