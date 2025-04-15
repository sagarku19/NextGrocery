import React from 'react';
import Link from 'next/link';

export default function ReturnPolicyPage() {
  return (
    <div className="bg-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-teal-500 to-emerald-600 py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl md:text-4xl font-bold text-white text-center">Return Policy</h1>
          <p className="text-white text-center mt-4 max-w-2xl mx-auto">
            Our comprehensive guidelines for returns, refunds, and exchanges.
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

            <h2 className="text-2xl font-semibold text-gray-800 mt-8">1. Return Policy Overview</h2>
            <p className="text-gray-600">
              At NextGrocery, we're committed to ensuring your satisfaction with every purchase. We understand that sometimes items may not meet your expectations or may arrive damaged. Our return policy is designed to make the return process as simple and hassle-free as possible.
            </p>

            <h2 className="text-2xl font-semibold text-gray-800 mt-8">2. Return Eligibility</h2>
            <p className="text-gray-600">
              Most items purchased from NextGrocery can be returned within 14 days of delivery, subject to the following conditions:
            </p>
            
            <h3 className="text-xl font-medium text-gray-700 mt-4">2.1 Eligible Items</h3>
            <ul className="list-disc pl-6 text-gray-600">
              <li>Items in original, unopened packaging</li>
              <li>Damaged or defective items (reported within 24 hours of delivery)</li>
              <li>Incorrect items (different from what was ordered)</li>
              <li>Items that do not meet quality standards</li>
            </ul>
            
            <h3 className="text-xl font-medium text-gray-700 mt-4">2.2 Non-Returnable Items</h3>
            <p className="text-gray-600">
              For health, safety, and quality reasons, the following items cannot be returned:
            </p>
            <ul className="list-disc pl-6 text-gray-600">
              <li>Perishable food items (unless spoiled or damaged at time of delivery)</li>
              <li>Personal care products that have been opened or used</li>
              <li>Gift cards and promotional codes</li>
              <li>Clearance items marked as "final sale"</li>
              <li>Custom or personalized orders</li>
            </ul>

            <h2 className="text-2xl font-semibold text-gray-800 mt-8">3. Return Process</h2>
            <p className="text-gray-600">
              To initiate a return, please follow these steps:
            </p>
            <ol className="list-decimal pl-6 text-gray-600">
              <li className="mb-2">
                <span className="font-medium">Contact Customer Service:</span> Call us at +1 (800) GROCERY or email returns@nextgrocery.com within 14 days of delivery.
              </li>
              <li className="mb-2">
                <span className="font-medium">Provide Order Information:</span> Have your order number and details about the items you wish to return ready.
              </li>
              <li className="mb-2">
                <span className="font-medium">Return Authorization:</span> Our customer service team will provide you with a Return Authorization Number (RAN) and instructions.
              </li>
              <li className="mb-2">
                <span className="font-medium">Package the Items:</span> Pack the items securely in their original packaging if possible.
              </li>
              <li>
                <span className="font-medium">Return Shipment:</span> For non-perishable items, use our prepaid shipping label or schedule a pickup. For perishable items, our delivery team will collect them at the next delivery.
              </li>
            </ol>

            <h2 className="text-2xl font-semibold text-gray-800 mt-8">4. Refunds</h2>
            <p className="text-gray-600">
              Once we receive and inspect your return, we will process your refund according to the following guidelines:
            </p>
            
            <h3 className="text-xl font-medium text-gray-700 mt-4">4.1 Refund Processing Time</h3>
            <p className="text-gray-600">
              Refunds are typically processed within 3-5 business days after we receive your return. The time it takes for the refund to appear in your account depends on your payment method:
            </p>
            <ul className="list-disc pl-6 text-gray-600">
              <li>Credit/Debit Cards: 5-10 business days</li>
              <li>Digital Wallets: 2-3 business days</li>
              <li>Store Credit: Immediate upon approval</li>
            </ul>
            
            <h3 className="text-xl font-medium text-gray-700 mt-4">4.2 Refund Methods</h3>
            <p className="text-gray-600">
              Refunds will be issued to the original payment method used for the purchase. If this is not possible, we will issue store credit.
            </p>
            
            <h3 className="text-xl font-medium text-gray-700 mt-4">4.3 Partial Refunds</h3>
            <p className="text-gray-600">
              We may issue partial refunds in cases where:
            </p>
            <ul className="list-disc pl-6 text-gray-600">
              <li>Only part of the order is returned</li>
              <li>Items show signs of use or damage not caused by NextGrocery</li>
              <li>Items are returned without original packaging</li>
            </ul>

            <h2 className="text-2xl font-semibold text-gray-800 mt-8">5. Exchanges</h2>
            <p className="text-gray-600">
              We're happy to exchange items that are damaged, defective, or incorrect. To request an exchange:
            </p>
            <ol className="list-decimal pl-6 text-gray-600">
              <li>Contact our customer service team</li>
              <li>Provide your order details and information about the item you wish to exchange</li>
              <li>Specify the replacement item you prefer</li>
            </ol>
            <p className="text-gray-600">
              We'll arrange for the pickup of the original item and delivery of the replacement as soon as possible.
            </p>

            <h2 className="text-2xl font-semibold text-gray-800 mt-8">6. Damaged or Missing Items</h2>
            <p className="text-gray-600">
              If your order arrives damaged or items are missing:
            </p>
            <ul className="list-disc pl-6 text-gray-600">
              <li>Contact us within 24 hours of delivery</li>
              <li>Provide photos of damaged items when possible</li>
              <li>We'll arrange for an immediate replacement or refund</li>
            </ul>

            <h2 className="text-2xl font-semibold text-gray-800 mt-8">7. Return Shipping Costs</h2>
            <p className="text-gray-600">
              Return shipping is free for:
            </p>
            <ul className="list-disc pl-6 text-gray-600">
              <li>Damaged or defective items</li>
              <li>Incorrect items (different from what was ordered)</li>
              <li>Items that do not meet quality standards</li>
            </ul>
            <p className="text-gray-600">
              For returns due to change of mind or preference, a shipping fee may apply.
            </p>

            <h2 className="text-2xl font-semibold text-gray-800 mt-8">8. Special Circumstances</h2>
            
            <h3 className="text-xl font-medium text-gray-700 mt-4">8.1 Sale Items</h3>
            <p className="text-gray-600">
              Sale items with discounts less than 50% follow our standard return policy. Items discounted by 50% or more are final sale unless damaged or defective.
            </p>
            
            <h3 className="text-xl font-medium text-gray-700 mt-4">8.2 Gift Returns</h3>
            <p className="text-gray-600">
              If you received an item as a gift, we can issue a gift card or store credit for the return. The gift giver will not be notified of the return.
            </p>

            <h2 className="text-2xl font-semibold text-gray-800 mt-8">9. Contact Us</h2>
            <p className="text-gray-600">
              If you have questions about our return policy or need assistance with a return, please contact us:
            </p>
            <p className="text-gray-600">
              Email: returns@nextgrocery.com<br />
              Phone: +1 (800) GROCERY<br />
              Customer Service Hours: 7am-11pm EST, 7 days a week
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