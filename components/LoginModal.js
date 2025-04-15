'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase/client';

export default function LoginModal({ isOpen, onClose, onSuccess, roleType = 'customer' }) {
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [showProfileForm, setShowProfileForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [countdown, setCountdown] = useState(0);
  const [serviceSid, setServiceSid] = useState(null);
  const [verifiedUser, setVerifiedUser] = useState(null);

  // Display different titles based on role type
  const getRoleTitle = () => {
    switch(roleType) {
      case 'driver': return 'Driver Login';
      case 'admin': return 'Admin Login';
      default: return 'Customer Login';
    }
  };

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  // Clear all state when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setPhone('');
      setOtp('');
      setName('');
      setEmail('');
      setShowOtpInput(false);
      setShowProfileForm(false);
      setError(null);
      setCountdown(0);
      setServiceSid(null);
      setVerifiedUser(null);
    }
  }, [isOpen, roleType]);

  const handleSendOTP = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const formattedPhone = phone.startsWith('+') ? phone : `+${phone}`;
      
      // Ensure we're using the correct App Router API path
      const response = await fetch('/api/auth/otp', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          phone: formattedPhone,
          roleType: roleType // Pass the roleType to the API
        }),
        // Add cache control to avoid Next.js caching the request
        cache: 'no-store'
      });

      console.log('OTP API Response Status:', response.status);

      let data;
      try {
        const responseText = await response.text();
        console.log('Raw API Response:', responseText);
        
        // Only try to parse if the response has content
        if (responseText) {
          try {
            data = JSON.parse(responseText);
          } catch (parseError) {
            console.error('Error parsing response as JSON:', parseError);
            throw new Error(`Invalid response format: ${responseText}`);
          }
        } else {
          throw new Error('Empty response from server');
        }
      } catch (error) {
        console.error('Error handling response:', error);
        throw new Error('Invalid response from server');
      }

      if (data?.success) {
        // Store the service SID for verification
        if (data.serviceSid) {
          console.log('Received service SID:', data.serviceSid);
          setServiceSid(data.serviceSid);
        }
        
        // Store the verification channel for better user experience
        const channel = data.channel || 'sms';
        
        // Show appropriate message based on the channel
        let successMessage = '';
        if (channel === 'sms') {
          successMessage = 'Verification code sent via SMS.';
        } else if (channel === 'whatsapp') {
          successMessage = 'Verification code sent via WhatsApp. Please check your WhatsApp messages.';
        } else if (channel === 'call') {
          successMessage = 'You will receive a phone call with your verification code shortly.';
        } else {
          successMessage = `Verification code sent via ${channel}.`;
        }
        
        // Set success message in a state if you have one, or alert it
        console.log(successMessage);
        // If you have a setMessage state, use it: setMessage(successMessage);
        
        setShowOtpInput(true);
        setCountdown(60); // Start 60-second countdown
      } else {
        throw new Error(data?.error || data?.details || 'Failed to send verification code');
      }
    } catch (error) {
      console.error('Error sending OTP:', error);
      setError(error.message || 'Failed to send verification code');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const formattedPhone = phone.startsWith('+') ? phone : `+${phone}`;
      
      // Ensure we're using the correct App Router API path
      const verifyResponse = await fetch('/api/auth/verify', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          phone: formattedPhone,
          code: otp,
          requestServiceSid: serviceSid,
          roleType: roleType // Pass the roleType to the API
        }),
        // Add cache control to avoid Next.js caching the request
        cache: 'no-store'
      });

      console.log('Verify API Response Status:', verifyResponse.status);

      let verifyData;
      try {
        const responseText = await verifyResponse.text();
        console.log('Raw Verify API Response:', responseText);
        
        // Only try to parse if the response has content
        if (responseText) {
          try {
            verifyData = JSON.parse(responseText);
          } catch (parseError) {
            console.error('Error parsing verify response as JSON:', parseError);
            throw new Error(`Invalid response format: ${responseText}`);
          }
        } else {
          throw new Error('Empty response from server');
        }
      } catch (error) {
        console.error('Error handling verify response:', error);
        throw new Error('Invalid response from server');
      }

      if (!verifyResponse.ok) {
        throw new Error(verifyData?.error || verifyData?.details || 'Failed to verify code');
      }

      if (!verifyData?.valid) {
        throw new Error(verifyData?.message || 'Invalid verification code');
      }

      console.log('Verification successful:', verifyData);

      // First approach: Check if user exists in database using client-side Supabase
      console.log('Checking for existing user with phone:', formattedPhone);
      const { data: existingUsers, error: queryError } = await supabase
        .from('users')
        .select('id, phone, name, email, role')
        .eq('phone', formattedPhone)
        .limit(1);
      
      console.log('Existing users query result:', { data: existingUsers, error: queryError });
      
      // User exists - check if role matches
      if (!queryError && existingUsers && existingUsers.length > 0) {
        console.log('User exists - checking role:', existingUsers[0]);
        
        // If role doesn't match, show error
        if (roleType !== 'customer' && existingUsers[0].role !== roleType) {
          throw new Error(`This phone number is not registered as a ${roleType}. Please use the correct login option.`);
        }
        
        // Role matches or is a customer, proceed with login
        localStorage.setItem('userPhone', formattedPhone);
        localStorage.setItem('userId', existingUsers[0].id);
        localStorage.setItem('userRole', existingUsers[0].role || 'customer');
        if (existingUsers[0].name) localStorage.setItem('userName', existingUsers[0].name);
        if (existingUsers[0].email) localStorage.setItem('userEmail', existingUsers[0].email);
        
        // Call success handler with existing user data
        onSuccess?.(existingUsers[0]);
        onClose();
        return;
      }
      
      // Second approach: Try to check user via the create-user API which has admin privileges
      try {
        console.log('Trying to check user existence via server API');
        const checkResponse = await fetch('/api/auth/create-user', {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            phone: formattedPhone,
            checkOnly: true,
            roleType: roleType
          }),
        });
        
        const checkResult = await checkResponse.json();
        console.log('Check user API response:', checkResult);
        
        if (checkResult.isExisting && checkResult.user) {
          // If role doesn't match, show error
          if (roleType !== 'customer' && checkResult.user.role !== roleType) {
            throw new Error(`This phone number is not registered as a ${roleType}. Please use the correct login option.`);
          }
          
          console.log('User exists according to server API - logging in:', checkResult.user);
          
          // Store user info in local storage
          localStorage.setItem('userPhone', formattedPhone);
          localStorage.setItem('userId', checkResult.user.id);
          localStorage.setItem('userRole', checkResult.user.role || 'customer');
          if (checkResult.user.name) localStorage.setItem('userName', checkResult.user.name);
          if (checkResult.user.email) localStorage.setItem('userEmail', checkResult.user.email);
          
          // Call success handler with existing user data
          onSuccess?.(checkResult.user);
          onClose();
          return;
        }
      } catch (checkError) {
        console.error('Error using check user API:', checkError);
        // Continue to profile form if this fails
      }
      
      // If trying to login as admin or driver, don't allow registration
      if (roleType !== 'customer') {
        throw new Error(`No ${roleType} account found with this phone number. Please contact the administrator.`);
      }
      
      // If we get here, user doesn't exist - show profile form for customers only
      console.log('New user - showing profile form');
      setVerifiedUser({
        phone: formattedPhone
      });
      setShowProfileForm(true);
      
    } catch (error) {
      console.error('Error verifying OTP:', error);
      setError(error.message || 'Failed to verify code');
    } finally {
      setLoading(false);
    }
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (!verifiedUser || !verifiedUser.phone) {
        throw new Error('Phone verification information missing');
      }

      console.log('Creating user account with server API:', {
        phone: verifiedUser.phone,
        name: name,
        email: email,
        role: roleType
      });
      
      // Updated API route path for App Router
      const response = await fetch('/api/auth/create-user', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          phone: verifiedUser.phone,
          name: name,
          email: email || null,
          role: roleType
        }),
      });

      // Log the raw response for debugging
      console.log('API response status:', response.status);
      
      let result;
      try {
        const text = await response.text();
        console.log('Raw API response:', text);
        result = JSON.parse(text);
      } catch (parseError) {
        console.error('Error parsing response:', parseError);
        throw new Error('Failed to parse server response');
      }
      
      if (!response.ok) {
        console.error('Error from server API:', result);
        throw new Error(result.error || 'Failed to create user account');
      }
      
      console.log('Successfully created user via server API:', result);
      
      // Store user info in local storage
      localStorage.setItem('userPhone', verifiedUser.phone);
      localStorage.setItem('userId', result.user.id);
      localStorage.setItem('userRole', result.user.role || 'customer');
      localStorage.setItem('userName', name);
      if (email) localStorage.setItem('userEmail', email);
      
      // Call success handler with new user data
      onSuccess?.(result.user);
      onClose();
    } catch (error) {
      console.error('Error creating user:', error);
      setError(error.message || 'Failed to create user account');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  // Profile form for new users
  if (showProfileForm) {
    return (
      <div className="fixed inset-0 z-50 overflow-y-auto">
        <div className="flex min-h-full items-center justify-center p-4">
          <div className="fixed inset-0 bg-black bg-opacity-50" onClick={onClose} />
          
          <div className="relative bg-white rounded-xl p-5 sm:p-6 md:p-8 max-w-md w-full mx-auto shadow-2xl">
            <button 
              className="absolute top-3 right-3 sm:top-4 sm:right-4 text-gray-400 hover:text-gray-600"
              onClick={onClose}
              aria-label="Close"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
            
            <h2 className="text-xl sm:text-2xl font-semibold mb-4 sm:mb-6 text-gray-800">Complete Your Profile</h2>
            
            {error && (
              <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-red-50 text-red-700 text-sm rounded-lg border border-red-100">
                {error}
                {error.includes && error.includes('RLS policy') && (
                  <div className="mt-2 text-xs">
                    <p>Admin action required: Please update Supabase RLS policies for the users table.</p>
                    <button 
                      className="mt-1 text-blue-600 underline"
                      onClick={async () => {
                        // Try checking if the user exists despite the RLS error
                        try {
                          const { data: checkUser, error: checkError } = await supabase
                            .from('users')
                            .select('id, phone, name, email, role')
                            .eq('phone', verifiedUser.phone)
                            .limit(1);
                            
                          if (!checkError && checkUser && checkUser.length > 0) {
                            console.log('User exists despite RLS error - continuing with login:', checkUser[0]);
                            
                            // Store user info in local storage
                            localStorage.setItem('userPhone', verifiedUser.phone);
                            localStorage.setItem('userId', checkUser[0].id);
                            localStorage.setItem('userRole', checkUser[0].role || 'customer');
                            localStorage.setItem('userName', name);
                            if (email) localStorage.setItem('userEmail', email);
                            
                            // Call success handler with new user data
                            onSuccess?.(checkUser[0]);
                            onClose();
                            return;
                          } else {
                            setError('User not found. Please try again or contact support.');
                          }
                        } catch (e) {
                          console.error('Error checking user:', e);
                        }
                      }}
                    >
                      Check if account was created anyway
                    </button>
                  </div>
                )}
              </div>
            )}
            
            <form onSubmit={handleProfileSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                  Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your full name"
                  className="w-full px-3 sm:px-4 py-2 sm:py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all"
                  required
                />
              </div>
              
              <div className="mb-5 sm:mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                  Email (optional)
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Your email address"
                  className="w-full px-3 sm:px-4 py-2 sm:py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all"
                />
              </div>
              
              <div className="space-y-3">
                <button
                  type="submit"
                  disabled={loading || !name}
                  className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white py-2 sm:py-2.5 px-4 rounded-lg disabled:opacity-70 disabled:cursor-not-allowed font-medium transition-all shadow-sm"
                >
                  {loading ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Creating Account...
                    </span>
                  ) : 'Create Account'}
                </button>
                
                <button
                  type="button"
                  onClick={() => {
                    setShowProfileForm(false);
                    setShowOtpInput(false);
                    setVerifiedUser(null);
                  }}
                  className="w-full text-teal-600 py-2 sm:py-2.5 px-4 rounded-lg hover:bg-teal-50 border border-teal-200 font-medium transition-all"
                >
                  Back to Phone Number
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }

  // OTP verification flow
  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="fixed inset-0 bg-black bg-opacity-50" onClick={onClose} />
        
        <div className="relative bg-white rounded-xl p-5 sm:p-6 md:p-8 max-w-md w-full mx-auto shadow-2xl">
          <button 
            className="absolute top-3 right-3 sm:top-4 sm:right-4 text-gray-400 hover:text-gray-600"
            onClick={onClose}
            aria-label="Close"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
          
          <h2 className="text-xl sm:text-2xl font-semibold mb-4 sm:mb-6 text-gray-800">
            {showOtpInput ? 'Enter Verification Code' : getRoleTitle()}
          </h2>

          {error && (
            <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-red-50 text-red-700 text-sm rounded-lg border border-red-100">
              {error}
            </div>
          )}

          <form onSubmit={showOtpInput ? handleVerifyOTP : handleSendOTP} className="w-full">
            {!showOtpInput ? (
              <div className="mb-5 sm:mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+1234567890"
                  className="w-full px-3 sm:px-4 py-2 sm:py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all"
                  required
                  inputMode="tel"
                />
                <p className="mt-1 sm:mt-2 text-xs sm:text-sm text-gray-500">
                  Include country code (e.g., +1 for US)
                </p>
                {roleType !== 'customer' && (
                  <p className="mt-1 sm:mt-2 text-xs text-amber-600">
                    Note: Only registered {roleType}s can log in. Contact administrator if you need access.
                  </p>
                )}
              </div>
            ) : (
              <div className="mb-5 sm:mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                  Verification Code
                </label>
                <input
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/[^0-9]/g, ''))}
                  placeholder="Enter 6-digit code"
                  className="w-full px-3 sm:px-4 py-2 sm:py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all text-center tracking-widest text-lg"
                  required
                  maxLength={6}
                  inputMode="numeric"
                  pattern="[0-9]*"
                />
                <p className="mt-1 sm:mt-2 text-xs sm:text-sm text-gray-500 text-center">
                  Enter the verification code sent to <span className="font-medium">{phone}</span>
                </p>
              </div>
            )}

            <div className="space-y-3">
              <button
                type="submit"
                disabled={loading || (showOtpInput && countdown > 0 && otp.length === 0)}
                className={`w-full ${roleType === 'admin' ? 'bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700' :
                  roleType === 'driver' ? 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700' :
                  'bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700'} 
                  text-white py-2 sm:py-2.5 px-4 rounded-lg disabled:opacity-70 disabled:cursor-not-allowed font-medium transition-all shadow-sm`}
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </span>
                ) : showOtpInput ? 'Verify Code' : 'Send Code'}
              </button>

              {showOtpInput && (
                <button
                  type="button"
                  onClick={() => {
                    setShowOtpInput(false);
                    setOtp('');
                    setError(null);
                  }}
                  className={`w-full ${roleType === 'admin' ? 'text-purple-600 hover:bg-purple-50 border-purple-200' :
                    roleType === 'driver' ? 'text-blue-600 hover:bg-blue-50 border-blue-200' :
                    'text-teal-600 hover:bg-teal-50 border-teal-200'} 
                    py-2 sm:py-2.5 px-4 rounded-lg border font-medium transition-all`}
                >
                  Change Phone Number
                </button>
              )}

              {showOtpInput && countdown > 0 && (
                <p className="text-center text-xs sm:text-sm text-gray-500 mt-3 sm:mt-4">
                  Resend code in <span className="font-medium text-teal-600">{countdown}s</span>
                </p>
              )}
              
              {showOtpInput && countdown === 0 && (
                <button
                  type="button"
                  onClick={handleSendOTP}
                  className="w-full text-gray-600 py-2 sm:py-2.5 px-4 rounded-lg hover:bg-gray-100 border border-gray-200 font-medium transition-all"
                >
                  Resend Code
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}