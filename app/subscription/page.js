'use client';

import { useState } from 'react';
import Link from 'next/link';
import { CheckIcon } from '@heroicons/react/20/solid';
import Image from 'next/image';

export default function SubscriptionPage() {
  const [selectedPlan, setSelectedPlan] = useState('monthly');
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const plans = [
    {
      id: 'monthly',
      name: 'Monthly',
      price: '₹749',
      description: 'Perfect for regular shoppers who want to save on groceries',
      features: [
        'Free delivery on orders over ₹3750',
        '5% discount on all products',
        'Early access to weekly deals',
        'Member-only exclusive offers',
      ],
      popular: false,
    },
    {
      id: 'annual',
      name: 'Annual',
      price: '₹7499',
      description: 'Our best value plan with maximum savings and benefits',
      features: [
        'Free delivery on all orders',
        '10% discount on all products',
        'Early access to weekly deals',
        'Member-only exclusive offers',
        'Birthday gift voucher',
        'Priority customer support',
      ],
      popular: true,
    },
    {
      id: 'family',
      name: 'Family',
      price: '₹1124',
      description: 'Designed for families with enhanced benefits',
      features: [
        'Free delivery on orders over ₹2250',
        '8% discount on all products',
        'Early access to weekly deals',
        'Member-only exclusive offers',
        'Family-sized product discounts',
        'Shared account for up to 4 family members',
      ],
      popular: false,
    },
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // In a real application, this would submit the form data to the server
    console.log({ name, email, phone, selectedPlan });
    
    // Show success message
    setSubmitted(true);
    
    // Reset form
    setName('');
    setEmail('');
    setPhone('');
  };

  return (
    <div className="bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl lg:text-5xl">
            NextGrocery Premium Membership
          </h1>
          <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">
            Join our premium membership program and enjoy exclusive discounts, free delivery, and early access to special offers.
          </p>
        </div>

        {/* Benefits */}
        <div className="mb-16 bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="px-6 py-8 sm:p-10">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">
              Why Join NextGrocery Premium?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="flex flex-col items-center text-center p-4">
                <div className="bg-green-100 p-3 rounded-full mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Save Money</h3>
                <p className="text-gray-600">Enjoy significant discounts on all products, helping you save on your grocery bill every month.</p>
              </div>
              <div className="flex flex-col items-center text-center p-4">
                <div className="bg-blue-100 p-3 rounded-full mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Fast & Free Delivery</h3>
                <p className="text-gray-600">Skip delivery fees and get your groceries delivered faster with priority shipping.</p>
              </div>
              <div className="flex flex-col items-center text-center p-4">
                <div className="bg-purple-100 p-3 rounded-full mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Exclusive Offers</h3>
                <p className="text-gray-600">Access members-only deals and be the first to shop new product releases and special promotions.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Pricing Plans */}
        <div className="mb-16">
          <h2 className="text-2xl font-semibold text-gray-900 mb-8 text-center">
            Choose Your Membership Plan
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {plans.map((plan) => (
              <div 
                key={plan.id}
                className={`bg-white rounded-lg shadow-lg overflow-hidden border-2 transition-all duration-200 ${
                  selectedPlan === plan.id 
                    ? 'border-green-500 transform scale-105' 
                    : plan.popular 
                      ? 'border-yellow-400' 
                      : 'border-transparent'
                }`}
              >
                {plan.popular && (
                  <div className="bg-yellow-400 text-white text-sm text-center py-1 font-medium">
                    MOST POPULAR
                  </div>
                )}
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900">{plan.name}</h3>
                  <div className="mt-4 flex items-baseline">
                    <span className="text-4xl font-extrabold text-gray-900">{plan.price}</span>
                    {plan.id === 'monthly' || plan.id === 'family' ? (
                      <span className="ml-1 text-xl font-medium text-gray-500">/month</span>
                    ) : (
                      <span className="ml-1 text-xl font-medium text-gray-500">/year</span>
                    )}
                  </div>
                  <p className="mt-2 text-gray-600">{plan.description}</p>
                  <ul className="mt-6 space-y-3">
                    {plan.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start">
                        <CheckIcon className="h-5 w-5 text-green-500 flex-shrink-0 mr-2" />
                        <span className="text-gray-600">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <button
                    type="button"
                    className={`mt-8 w-full py-3 px-4 rounded-md font-medium text-white ${
                      selectedPlan === plan.id 
                        ? 'bg-green-600 hover:bg-green-700' 
                        : 'bg-gray-800 hover:bg-gray-900'
                    } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500`}
                    onClick={() => setSelectedPlan(plan.id)}
                  >
                    {selectedPlan === plan.id ? 'Selected' : 'Select Plan'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Testimonials */}
        <div className="mb-16 bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="px-6 py-8 sm:p-10">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6 text-center">
              What Our Members Say
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="bg-gray-50 p-6 rounded-lg">
                <div className="flex items-center mb-4">
                  <div className="h-10 w-10 rounded-full bg-gray-200 flex-shrink-0 overflow-hidden">
                    <Image 
                      src="/images/avatar-1.jpg" 
                      alt="Customer" 
                      width={40} 
                      height={40}
                      className="h-full w-full object-cover"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='40' viewBox='0 0 40 40'%3E%3Crect width='40' height='40' fill='%23f3f4f6'/%3E%3Ctext x='50%25' y='50%25' font-size='20' text-anchor='middle' dominant-baseline='middle' font-family='Arial' fill='%239ca3af'%3EJS%3C/text%3E%3C/svg%3E";
                      }}
                    />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-900">Jessica Smith</p>
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <svg key={i} className="h-4 w-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                  </div>
                </div>
                <p className="text-gray-600 italic">"The membership has paid for itself in just two months! I'm saving so much on delivery fees and the extra discounts really add up."</p>
              </div>
              <div className="bg-gray-50 p-6 rounded-lg">
                <div className="flex items-center mb-4">
                  <div className="h-10 w-10 rounded-full bg-gray-200 flex-shrink-0 overflow-hidden">
                    <Image 
                      src="/images/avatar-2.jpg" 
                      alt="Customer" 
                      width={40} 
                      height={40}
                      className="h-full w-full object-cover"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='40' viewBox='0 0 40 40'%3E%3Crect width='40' height='40' fill='%23f3f4f6'/%3E%3Ctext x='50%25' y='50%25' font-size='20' text-anchor='middle' dominant-baseline='middle' font-family='Arial' fill='%239ca3af'%3EMT%3C/text%3E%3C/svg%3E";
                      }}
                    />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-900">Michael Thomas</p>
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <svg key={i} className="h-4 w-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                  </div>
                </div>
                <p className="text-gray-600 italic">"The family plan has been fantastic for us. We shop weekly and the free delivery alone makes it worth it, not to mention all the other benefits."</p>
              </div>
              <div className="bg-gray-50 p-6 rounded-lg">
                <div className="flex items-center mb-4">
                  <div className="h-10 w-10 rounded-full bg-gray-200 flex-shrink-0 overflow-hidden">
                    <Image 
                      src="/images/avatar-3.jpg" 
                      alt="Customer" 
                      width={40} 
                      height={40}
                      className="h-full w-full object-cover"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='40' viewBox='0 0 40 40'%3E%3Crect width='40' height='40' fill='%23f3f4f6'/%3E%3Ctext x='50%25' y='50%25' font-size='20' text-anchor='middle' dominant-baseline='middle' font-family='Arial' fill='%239ca3af'%3EAR%3C/text%3E%3C/svg%3E";
                      }}
                    />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-900">Alicia Rodriguez</p>
                    <div className="flex items-center">
                      {[...Array(4)].map((_, i) => (
                        <svg key={i} className="h-4 w-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                      <svg className="h-4 w-4 text-gray-300" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    </div>
                  </div>
                </div>
                <p className="text-gray-600 italic">"I love the early access to weekly deals. I've gotten some amazing discounts on premium products that would have sold out otherwise."</p>
              </div>
            </div>
          </div>
        </div>

        {/* Sign Up Form */}
        <div className="max-w-3xl mx-auto">
          <div className="bg-white shadow-lg rounded-lg overflow-hidden">
            <div className="px-6 py-8 sm:p-10">
              <h2 className="text-2xl font-semibold text-gray-900 mb-6 text-center">
                {submitted ? 'Thank You for Subscribing!' : 'Sign Up for NextGrocery Premium'}
              </h2>
              
              {submitted ? (
                <div className="text-center">
                  <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
                    <CheckIcon className="h-6 w-6 text-green-600" />
                  </div>
                  <p className="text-lg text-gray-700 mb-4">
                    We've received your subscription request for the <span className="font-semibold">{
                      plans.find(plan => plan.id === selectedPlan)?.name
                    } Plan</span>.
                  </p>
                  <p className="text-gray-600 mb-6">
                    Check your email for confirmation and next steps to activate your premium membership.
                  </p>
                  <div className="flex justify-center">
                    <Link 
                      href="/"
                      className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                    >
                      Return to Home
                    </Link>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit}>
                  <div className="grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-6">
                    <div className="sm:col-span-2">
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                        Full Name
                      </label>
                      <div className="mt-1">
                        <input
                          type="text"
                          name="name"
                          id="name"
                          required
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          className="py-3 px-4 block w-full shadow-sm focus:ring-green-500 focus:border-green-500 border-gray-300 rounded-md"
                          placeholder="Your full name"
                        />
                      </div>
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                        Email Address
                      </label>
                      <div className="mt-1">
                        <input
                          type="email"
                          name="email"
                          id="email"
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="py-3 px-4 block w-full shadow-sm focus:ring-green-500 focus:border-green-500 border-gray-300 rounded-md"
                          placeholder="you@example.com"
                        />
                      </div>
                    </div>
                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                        Phone Number
                      </label>
                      <div className="mt-1">
                        <input
                          type="tel"
                          name="phone"
                          id="phone"
                          required
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          className="py-3 px-4 block w-full shadow-sm focus:ring-green-500 focus:border-green-500 border-gray-300 rounded-md"
                          placeholder="(123) 456-7890"
                        />
                      </div>
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Selected Plan
                      </label>
                      <div className="bg-gray-50 rounded-md p-4 flex items-center justify-between">
                        <div>
                          <p className="font-medium text-gray-900">
                            {plans.find(plan => plan.id === selectedPlan)?.name} Plan
                          </p>
                          <p className="text-gray-600">
                            {plans.find(plan => plan.id === selectedPlan)?.price}
                            {selectedPlan === 'annual' ? '/year' : '/month'}
                          </p>
                        </div>
                        <button
                          type="button"
                          className="text-sm text-green-600 hover:text-green-700 font-medium"
                          onClick={() => window.scrollTo({
                            top: document.querySelector('h2')?.offsetTop - 100,
                            behavior: 'smooth'
                          })}
                        >
                          Change Plan
                        </button>
                      </div>
                    </div>
                    <div className="sm:col-span-2">
                      <div className="flex items-start">
                        <div className="flex-shrink-0">
                          <input
                            id="terms"
                            name="terms"
                            type="checkbox"
                            required
                            className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                          />
                        </div>
                        <div className="ml-3">
                          <p className="text-sm text-gray-500">
                            By signing up, you agree to our{' '}
                            <Link href="/terms" className="font-medium text-green-600 hover:text-green-500">
                              Terms of Service
                            </Link>{' '}
                            and{' '}
                            <Link href="/privacy-policy" className="font-medium text-green-600 hover:text-green-500">
                              Privacy Policy
                            </Link>.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="mt-6">
                    <button
                      type="submit"
                      className="w-full inline-flex items-center justify-center px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                    >
                      Subscribe Now
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
          <p className="text-center mt-4 text-sm text-gray-500">
            Questions about our membership? <Link href="/contact" className="font-medium text-green-600 hover:text-green-500">Contact us</Link>
          </p>
        </div>
      </div>
    </div>
  );
} 