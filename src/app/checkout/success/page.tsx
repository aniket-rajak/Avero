'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle } from 'lucide-react';

function OrderSuccessContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('order_id');

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
      <div className="mb-8">
        <CheckCircle size={64} className="mx-auto text-green-500 mb-6" />
        <h1 className="text-2xl md:text-3xl font-bold tracking-wider mb-4">THANK YOU!</h1>
        <p className="text-neutral-600">
          Your order has been placed successfully.
        </p>
        {orderId && (
          <p className="mt-2 text-sm text-neutral-500">
            Order ID: #{orderId}
          </p>
        )}
      </div>

      <div className="bg-neutral-50 p-6 mb-8 text-left">
        <h2 className="font-bold mb-4">What happens next?</h2>
        <ul className="space-y-3 text-sm text-neutral-600">
          <li className="flex items-start gap-3">
            <span className="w-6 h-6 bg-black text-white text-xs rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">1</span>
            <span>You will receive an order confirmation email shortly.</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="w-6 h-6 bg-black text-white text-xs rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">2</span>
            <span>We will prepare your order for shipment.</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="w-6 h-6 bg-black text-white text-xs rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">3</span>
            <span>You will receive tracking information once your order ships.</span>
          </li>
        </ul>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Link
          href="/shop"
          className="cursor-pointer inline-block bg-black text-white px-8 py-4 text-sm tracking-wider hover:bg-neutral-800 transition-colors"
        >
          CONTINUE SHOPPING
        </Link>
        <Link
          href="/account"
          className="cursor-pointer inline-block border border-neutral-300 px-8 py-4 text-sm tracking-wider hover:bg-neutral-50 transition-colors"
        >
          VIEW ORDERS
        </Link>
      </div>
    </div>
  );
}

function LoadingFallback() {
  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
      <div className="mb-8">
        <div className="w-16 h-16 mx-auto mb-6 bg-neutral-200 animate-pulse rounded-full" />
        <div className="h-8 w-48 mx-auto bg-neutral-200 animate-pulse mb-4" />
        <div className="h-5 w-64 mx-auto bg-neutral-200 animate-pulse" />
      </div>
    </div>
  );
}

export default function OrderSuccessPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <OrderSuccessContent />
    </Suspense>
  );
}
