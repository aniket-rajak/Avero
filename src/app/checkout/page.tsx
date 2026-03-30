'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCart } from '@/components/providers/CartProvider';
import { ChevronLeft, Lock, CreditCard, Truck } from 'lucide-react';

interface FormData {
  billing_first_name: string;
  billing_last_name: string;
  billing_address_1: string;
  billing_address_2: string;
  billing_city: string;
  billing_state: string;
  billing_postcode: string;
  billing_country: string;
  billing_email: string;
  billing_phone: string;
  shipping_first_name: string;
  shipping_last_name: string;
  shipping_address_1: string;
  shipping_address_2: string;
  shipping_city: string;
  shipping_state: string;
  shipping_postcode: string;
  shipping_country: string;
  payment_method: string;
  customer_note: string;
}

const INDIAN_STATES = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
  'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka',
  'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya',
  'Mizoram', 'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim',
  'Tamil Nadu', 'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand',
  'West Bengal', 'Delhi'
];

export default function CheckoutPage() {
  const router = useRouter();
  const { items, subtotal, clearCart } = useCart();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sameAsBilling, setSameAsBilling] = useState(true);
  const [step, setStep] = useState<'shipping' | 'payment'>('shipping');

  const [formData, setFormData] = useState<FormData>({
    billing_first_name: '',
    billing_last_name: '',
    billing_address_1: '',
    billing_address_2: '',
    billing_city: '',
    billing_state: '',
    billing_postcode: '',
    billing_country: 'IN',
    billing_email: '',
    billing_phone: '',
    shipping_first_name: '',
    shipping_last_name: '',
    shipping_address_1: '',
    shipping_address_2: '',
    shipping_city: '',
    shipping_state: '',
    shipping_postcode: '',
    shipping_country: 'IN',
    payment_method: 'cod',
    customer_note: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const copyBillingToShipping = () => {
    setFormData(prev => ({
      ...prev,
      shipping_first_name: prev.billing_first_name,
      shipping_last_name: prev.billing_last_name,
      shipping_address_1: prev.billing_address_1,
      shipping_address_2: prev.billing_address_2,
      shipping_city: prev.billing_city,
      shipping_state: prev.billing_state,
      shipping_postcode: prev.billing_postcode,
      shipping_country: prev.billing_country,
    }));
  };

  const validateShipping = () => {
    const required = [
      'billing_first_name', 'billing_last_name', 'billing_address_1',
      'billing_city', 'billing_state', 'billing_postcode', 'billing_email', 'billing_phone'
    ];
    if (sameAsBilling) {
      return required.every(field => formData[field as keyof FormData].trim());
    }
    const shippingRequired = [
      'shipping_first_name', 'shipping_last_name', 'shipping_address_1',
      'shipping_city', 'shipping_state', 'shipping_postcode'
    ];
    return required.every(field => formData[field as keyof FormData].trim()) &&
           shippingRequired.every(field => formData[field as keyof FormData].trim());
  };

  const handleShippingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateShipping()) {
      setStep('payment');
    }
  };

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const line_items = items.map(item => ({
        product_id: item.product.id,
        quantity: item.quantity,
        variation_id: item.variationId,
      }));

      const orderData = {
        line_items,
        billing: {
          first_name: formData.billing_first_name,
          last_name: formData.billing_last_name,
          address_1: formData.billing_address_1,
          address_2: formData.billing_address_2,
          city: formData.billing_city,
          state: formData.billing_state,
          postcode: formData.billing_postcode,
          country: formData.billing_country,
          email: formData.billing_email,
          phone: formData.billing_phone,
        },
        shipping: sameAsBilling ? {
          first_name: formData.billing_first_name,
          last_name: formData.billing_last_name,
          address_1: formData.billing_address_1,
          address_2: formData.billing_address_2,
          city: formData.billing_city,
          state: formData.billing_state,
          postcode: formData.billing_postcode,
          country: formData.billing_country,
        } : {
          first_name: formData.shipping_first_name,
          last_name: formData.shipping_last_name,
          address_1: formData.shipping_address_1,
          address_2: formData.shipping_address_2,
          city: formData.shipping_city,
          state: formData.shipping_state,
          postcode: formData.shipping_postcode,
          country: formData.shipping_country,
        },
        payment_method: formData.payment_method,
        customer_note: formData.customer_note,
      };

      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create order');
      }

      clearCart();
      router.push(`/checkout/success?order_id=${data.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <h1 className="text-2xl font-bold mb-4">Your cart is empty</h1>
        <p className="text-neutral-500 mb-8">Add items to your cart before checking out.</p>
        <Link
          href="/shop"
          className="cursor-pointer inline-block bg-black text-white px-8 py-4 text-sm tracking-wider hover:bg-neutral-800 transition-colors"
        >
          CONTINUE SHOPPING
        </Link>
      </div>
    );
  }

  const shipping = subtotal >= 5000 ? 0 : 100;
  const total = subtotal + shipping;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl md:text-3xl font-bold tracking-wider">CHECKOUT</h1>
        <Link
          href="/cart"
          className="cursor-pointer flex items-center gap-2 text-sm text-neutral-600 hover:text-black transition-colors"
        >
          <ChevronLeft size={16} />
          Back to cart
        </Link>
      </div>

      <div className="grid lg:grid-cols-3 gap-8 lg:gap-16">
        <div className="lg:col-span-2">
          <div className="flex gap-8 mb-8">
            <button
              onClick={() => setStep('shipping')}
              className={`flex items-center gap-2 pb-2 border-b-2 transition-colors ${
                step === 'shipping' ? 'border-black' : 'border-transparent'
              }`}
            >
              <Truck size={18} />
              <span className="text-sm font-medium">Shipping</span>
            </button>
            <button
              onClick={() => step === 'payment' && setStep('payment')}
              className={`flex items-center gap-2 pb-2 border-b-2 transition-colors ${
                step === 'payment' ? 'border-black' : 'border-transparent text-neutral-400'
              }`}
            >
              <CreditCard size={18} />
              <span className="text-sm font-medium">Payment</span>
            </button>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 text-sm">
              {error}
            </div>
          )}

          {step === 'shipping' && (
            <form onSubmit={handleShippingSubmit} className="space-y-8">
              <div>
                <h2 className="text-lg font-bold tracking-wider mb-4">BILLING ADDRESS</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-neutral-600 mb-1">First Name *</label>
                    <input
                      type="text"
                      name="billing_first_name"
                      value={formData.billing_first_name}
                      onChange={handleChange}
                      required
                      className="w-full border border-neutral-300 px-4 py-3 text-sm focus:outline-none focus:border-black"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-neutral-600 mb-1">Last Name *</label>
                    <input
                      type="text"
                      name="billing_last_name"
                      value={formData.billing_last_name}
                      onChange={handleChange}
                      required
                      className="w-full border border-neutral-300 px-4 py-3 text-sm focus:outline-none focus:border-black"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm text-neutral-600 mb-1">Address *</label>
                    <input
                      type="text"
                      name="billing_address_1"
                      value={formData.billing_address_1}
                      onChange={handleChange}
                      required
                      placeholder="Street address"
                      className="w-full border border-neutral-300 px-4 py-3 text-sm focus:outline-none focus:border-black mb-2"
                    />
                    <input
                      type="text"
                      name="billing_address_2"
                      value={formData.billing_address_2}
                      onChange={handleChange}
                      placeholder="Apartment, suite, etc. (optional)"
                      className="w-full border border-neutral-300 px-4 py-3 text-sm focus:outline-none focus:border-black"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-neutral-600 mb-1">City *</label>
                    <input
                      type="text"
                      name="billing_city"
                      value={formData.billing_city}
                      onChange={handleChange}
                      required
                      className="w-full border border-neutral-300 px-4 py-3 text-sm focus:outline-none focus:border-black"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-neutral-600 mb-1">State *</label>
                    <select
                      name="billing_state"
                      value={formData.billing_state}
                      onChange={handleChange}
                      required
                      className="w-full border border-neutral-300 px-4 py-3 text-sm focus:outline-none focus:border-black"
                    >
                      <option value="">Select State</option>
                      {INDIAN_STATES.map(state => (
                        <option key={state} value={state}>{state}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm text-neutral-600 mb-1">PIN Code *</label>
                    <input
                      type="text"
                      name="billing_postcode"
                      value={formData.billing_postcode}
                      onChange={handleChange}
                      required
                      pattern="[0-9]{6}"
                      maxLength={6}
                      className="w-full border border-neutral-300 px-4 py-3 text-sm focus:outline-none focus:border-black"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-neutral-600 mb-1">Country</label>
                    <input
                      type="text"
                      value="India"
                      disabled
                      className="w-full border border-neutral-300 px-4 py-3 text-sm bg-neutral-50 text-neutral-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-neutral-600 mb-1">Email *</label>
                    <input
                      type="email"
                      name="billing_email"
                      value={formData.billing_email}
                      onChange={handleChange}
                      required
                      className="w-full border border-neutral-300 px-4 py-3 text-sm focus:outline-none focus:border-black"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-neutral-600 mb-1">Phone *</label>
                    <input
                      type="tel"
                      name="billing_phone"
                      value={formData.billing_phone}
                      onChange={handleChange}
                      required
                      pattern="[0-9]{10}"
                      maxLength={10}
                      className="w-full border border-neutral-300 px-4 py-3 text-sm focus:outline-none focus:border-black"
                    />
                  </div>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-bold tracking-wider">SHIPPING ADDRESS</h2>
                  <label className="flex items-center gap-2 text-sm cursor-pointer">
                    <input
                      type="checkbox"
                      checked={sameAsBilling}
                      onChange={(e) => {
                        setSameAsBilling(e.target.checked);
                        if (e.target.checked) copyBillingToShipping();
                      }}
                      className="w-4 h-4"
                    />
                    Same as billing
                  </label>
                </div>

                {sameAsBilling ? (
                  <div className="p-4 bg-neutral-50 text-sm text-neutral-600">
                    Shipping address same as billing address
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm text-neutral-600 mb-1">First Name *</label>
                      <input
                        type="text"
                        name="shipping_first_name"
                        value={formData.shipping_first_name}
                        onChange={handleChange}
                        required
                        className="w-full border border-neutral-300 px-4 py-3 text-sm focus:outline-none focus:border-black"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-neutral-600 mb-1">Last Name *</label>
                      <input
                        type="text"
                        name="shipping_last_name"
                        value={formData.shipping_last_name}
                        onChange={handleChange}
                        required
                        className="w-full border border-neutral-300 px-4 py-3 text-sm focus:outline-none focus:border-black"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm text-neutral-600 mb-1">Address *</label>
                      <input
                        type="text"
                        name="shipping_address_1"
                        value={formData.shipping_address_1}
                        onChange={handleChange}
                        required
                        className="w-full border border-neutral-300 px-4 py-3 text-sm focus:outline-none focus:border-black mb-2"
                      />
                      <input
                        type="text"
                        name="shipping_address_2"
                        value={formData.shipping_address_2}
                        onChange={handleChange}
                        className="w-full border border-neutral-300 px-4 py-3 text-sm focus:outline-none focus:border-black"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-neutral-600 mb-1">City *</label>
                      <input
                        type="text"
                        name="shipping_city"
                        value={formData.shipping_city}
                        onChange={handleChange}
                        required
                        className="w-full border border-neutral-300 px-4 py-3 text-sm focus:outline-none focus:border-black"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-neutral-600 mb-1">State *</label>
                      <select
                        name="shipping_state"
                        value={formData.shipping_state}
                        onChange={handleChange}
                        required
                        className="w-full border border-neutral-300 px-4 py-3 text-sm focus:outline-none focus:border-black"
                      >
                        <option value="">Select State</option>
                        {INDIAN_STATES.map(state => (
                          <option key={state} value={state}>{state}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm text-neutral-600 mb-1">PIN Code *</label>
                      <input
                        type="text"
                        name="shipping_postcode"
                        value={formData.shipping_postcode}
                        onChange={handleChange}
                        required
                        pattern="[0-9]{6}"
                        maxLength={6}
                        className="w-full border border-neutral-300 px-4 py-3 text-sm focus:outline-none focus:border-black"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-neutral-600 mb-1">Country</label>
                      <input
                        type="text"
                        value="India"
                        disabled
                        className="w-full border border-neutral-300 px-4 py-3 text-sm bg-neutral-50 text-neutral-500"
                      />
                    </div>
                  </div>
                )}
              </div>

              <button
                type="submit"
                className="cursor-pointer w-full bg-black text-white py-4 text-sm tracking-wider hover:bg-neutral-800 transition-colors"
              >
                CONTINUE TO PAYMENT
              </button>
            </form>
          )}

          {step === 'payment' && (
            <form onSubmit={handlePlaceOrder} className="space-y-8">
              <div>
                <h2 className="text-lg font-bold tracking-wider mb-4">PAYMENT METHOD</h2>
                <div className="space-y-3">
                  <label className="flex items-center gap-4 p-4 border border-neutral-300 cursor-pointer hover:border-black transition-colors">
                    <input
                      type="radio"
                      name="payment_method"
                      value="cod"
                      checked={formData.payment_method === 'cod'}
                      onChange={handleChange}
                      className="w-4 h-4"
                    />
                    <div>
                      <span className="font-medium">Cash on Delivery</span>
                      <p className="text-sm text-neutral-500">Pay when you receive your order</p>
                    </div>
                  </label>
                  <label className="flex items-center gap-4 p-4 border border-neutral-300 cursor-pointer hover:border-black transition-colors">
                    <input
                      type="radio"
                      name="payment_method"
                      value="bacs"
                      checked={formData.payment_method === 'bacs'}
                      onChange={handleChange}
                      className="w-4 h-4"
                    />
                    <div>
                      <span className="font-medium">Direct Bank Transfer</span>
                      <p className="text-sm text-neutral-500">Pay via bank transfer (UPI/NEFT/RTGS)</p>
                    </div>
                  </label>
                </div>
              </div>

              <div>
                <h2 className="text-lg font-bold tracking-wider mb-4">ORDER NOTES (OPTIONAL)</h2>
                <textarea
                  name="customer_note"
                  value={formData.customer_note}
                  onChange={handleChange}
                  rows={3}
                  placeholder="Special instructions for your order..."
                  className="w-full border border-neutral-300 px-4 py-3 text-sm focus:outline-none focus:border-black resize-none"
                />
              </div>

              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => setStep('shipping')}
                  className="cursor-pointer flex-1 border border-neutral-300 py-4 text-sm tracking-wider hover:bg-neutral-50 transition-colors"
                >
                  BACK
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="cursor-pointer flex-1 bg-black text-white py-4 text-sm tracking-wider hover:bg-neutral-800 transition-colors disabled:bg-neutral-400 flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    'Processing...'
                  ) : (
                    <>
                      <Lock size={16} />
                      PLACE ORDER
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>

        <div>
          <div className="bg-neutral-50 p-6 sticky top-24">
            <h2 className="text-lg font-bold tracking-wider mb-6">ORDER SUMMARY</h2>
            
            <div className="space-y-4 max-h-64 overflow-y-auto mb-4">
              {items.map(item => (
                <div key={`${item.product.id}-${item.variationId}`} className="flex gap-3">
                  <div className="relative w-16 h-20 bg-white flex-shrink-0">
                    {item.product.images[0] ? (
                      <Image
                        src={item.product.images[0].src}
                        alt={item.product.name}
                        fill
                        sizes="64px"
                        className="object-cover"
                      />
                    ) : (
                      <div className="absolute inset-0 bg-neutral-200" />
                    )}
                    <span className="absolute -top-2 -right-2 w-5 h-5 bg-black text-white text-xs flex items-center justify-center rounded-full">
                      {item.quantity}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{item.product.name}</p>
                    {item.product.attributes.filter(a => a.variation).map(attr => (
                      <p key={attr.id} className="text-xs text-neutral-500">{attr.options[0]}</p>
                    ))}
                    <p className="text-sm mt-1">₹{parseFloat(item.product.price || '0') * item.quantity}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="space-y-3 border-t border-neutral-200 pt-4">
              <div className="flex justify-between text-sm">
                <span className="text-neutral-600">Subtotal</span>
                <span>₹{subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-neutral-600">Shipping</span>
                <span>{shipping === 0 ? 'FREE' : `₹${shipping}`}</span>
              </div>
              {subtotal < 5000 && (
                <p className="text-xs text-green-600">
                  Add ₹{(5000 - subtotal).toFixed(2)} more for free shipping!
                </p>
              )}
            </div>

            <div className="flex justify-between font-bold text-lg border-t border-neutral-200 pt-4 mt-4">
              <span>Total</span>
              <span>₹{total.toFixed(2)}</span>
            </div>

            <div className="flex items-center gap-2 mt-4 text-xs text-neutral-500">
              <Lock size={14} />
              Secure checkout
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
