import React from 'react';
import Link from 'next/link';

export default function PrivacyPolicyPage() {
  return (
    <div className="bg-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-teal-500 to-emerald-600 py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl md:text-4xl font-bold text-white text-center">Privacy Policy</h1>
          <p className="text-white text-center mt-4 max-w-2xl mx-auto">
            Your privacy is important to us. This policy outlines how we collect, use, and protect your personal information.
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="prose prose-lg">
            <p className="text-gray-600">
              Last Updated: April 10, 2025
            </p>

            <h2 className="text-2xl font-semibold text-gray-800 mt-8">1. Introduction</h2>
            <p className="text-gray-600">
              NextGrocery ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website and use our services.
            </p>
            <p className="text-gray-600">
              Please read this privacy policy carefully. By accessing or using our services, you acknowledge that you have read, understood, and agree to be bound by all the terms outlined in this privacy policy.
            </p>

            <h2 className="text-2xl font-semibold text-gray-800 mt-8">2. Information We Collect</h2>
            <h3 className="text-xl font-medium text-gray-700 mt-4">2.1 Personal Information</h3>
            <p className="text-gray-600">
              We may collect personal information that you voluntarily provide when using our services, including but not limited to:
            </p>
            <ul className="list-disc pl-6 text-gray-600">
              <li>Name, email address, phone number, and billing address</li>
              <li>Account credentials (username and password)</li>
              <li>Payment information (processed securely through third-party payment processors)</li>
              <li>Delivery addresses and preferences</li>
              <li>Communication history and customer service interactions</li>
            </ul>

            <h3 className="text-xl font-medium text-gray-700 mt-4">2.2 Automatically Collected Information</h3>
            <p className="text-gray-600">
              When you access our services, we may automatically collect certain information, including:
            </p>
            <ul className="list-disc pl-6 text-gray-600">
              <li>Device information (type, operating system, browser)</li>
              <li>IP address and browsing behavior</li>
              <li>Location information (with your consent)</li>
              <li>Cookies and similar tracking technologies</li>
            </ul>

            <h2 className="text-2xl font-semibold text-gray-800 mt-8">3. How We Use Your Information</h2>
            <p className="text-gray-600">
              We use the information we collect for various purposes, including:
            </p>
            <ul className="list-disc pl-6 text-gray-600">
              <li>Processing and fulfilling your orders</li>
              <li>Creating and maintaining your account</li>
              <li>Providing customer support</li>
              <li>Sending transactional emails and order updates</li>
              <li>Personalizing your shopping experience</li>
              <li>Improving our services and website</li>
              <li>Marketing and promotional communications (with your consent)</li>
              <li>Fraud prevention and security</li>
            </ul>

            <h2 className="text-2xl font-semibold text-gray-800 mt-8">4. Sharing Your Information</h2>
            <p className="text-gray-600">
              We may share your information with:
            </p>
            <ul className="list-disc pl-6 text-gray-600">
              <li>Service providers who help us operate our business (payment processors, delivery partners, etc.)</li>
              <li>Third-party vendors who provide services on our behalf</li>
              <li>Legal authorities when required by law or to protect our rights</li>
            </ul>
            <p className="text-gray-600">
              We do not sell your personal information to third parties.
            </p>

            <h2 className="text-2xl font-semibold text-gray-800 mt-8">5. Cookies and Tracking Technologies</h2>
            <p className="text-gray-600">
              We use cookies and similar tracking technologies to collect information about your browsing activities. These technologies help us analyze website traffic, personalize content, and improve your experience.
            </p>
            <p className="text-gray-600">
              You can manage cookie preferences through your browser settings. Disabling cookies may affect the functionality of our website.
            </p>

            <h2 className="text-2xl font-semibold text-gray-800 mt-8">6. Data Security</h2>
            <p className="text-gray-600">
              We implement appropriate security measures to protect your personal information from unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the internet or electronic storage is 100% secure, and we cannot guarantee absolute security.
            </p>

            <h2 className="text-2xl font-semibold text-gray-800 mt-8">7. Your Rights</h2>
            <p className="text-gray-600">
              Depending on your location, you may have certain rights regarding your personal information, including:
            </p>
            <ul className="list-disc pl-6 text-gray-600">
              <li>Access to your personal information</li>
              <li>Correction of inaccurate information</li>
              <li>Deletion of your personal information</li>
              <li>Restriction of processing</li>
              <li>Data portability</li>
              <li>Objection to processing</li>
            </ul>
            <p className="text-gray-600">
              To exercise these rights, please contact us using the information provided in the "Contact Us" section.
            </p>

            <h2 className="text-2xl font-semibold text-gray-800 mt-8">8. Children's Privacy</h2>
            <p className="text-gray-600">
              Our services are not directed to individuals under the age of 18. We do not knowingly collect personal information from children. If we learn that we have collected personal information from a child, we will take steps to delete that information as quickly as possible.
            </p>

            <h2 className="text-2xl font-semibold text-gray-800 mt-8">9. Changes to This Privacy Policy</h2>
            <p className="text-gray-600">
              We may update this privacy policy from time to time to reflect changes in our practices or legal requirements. We will notify you of any material changes by posting the updated policy on our website with a revised "Last Updated" date.
            </p>

            <h2 className="text-2xl font-semibold text-gray-800 mt-8">10. Contact Us</h2>
            <p className="text-gray-600">
              If you have questions, concerns, or requests regarding this privacy policy or our data practices, please contact us at:
            </p>
            <p className="text-gray-600">
              Email: privacy@nextgrocery.com<br />
              Phone: +1 (800) GROCERY<br />
              Address: 123 Grocery Street, San Francisco, CA 94103, United States
            </p>
          </div>

          <div className="mt-12 flex justify-center">
            <Link href="/" className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500">
              Return to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
} 