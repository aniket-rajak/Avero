"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/store/cart-store";
import { formatPrice } from "@/lib/utils";
import { ordersApi } from "@/lib/api";
import { CheckCircle, ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";

export default function CheckoutPage() {
  const router = useRouter();
  const { items, totalPrice, clearCart } = useCartStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [orderComplete, setOrderComplete] = useState(false);
  const [orderId, setOrderId] = useState<number | null>(null);

  const [formData, setFormData] = useState({
    email: "",
    phone: "",
    firstName: "",
    lastName: "",
    address1: "",
    address2: "",
    city: "",
    state: "",
    postcode: "",
    country: "US",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const orderData = {
        payment_method: "bacs",
        payment_method_title: "Direct Bank Transfer",
        set_paid: false,
        billing: {
          first_name: formData.firstName,
          last_name: formData.lastName,
          address_1: formData.address1,
          address_2: formData.address2 || "",
          city: formData.city,
          state: formData.state,
          postcode: formData.postcode,
          country: formData.country,
          email: formData.email,
          phone: formData.phone,
        },
        shipping: {
          first_name: formData.firstName,
          last_name: formData.lastName,
          address_1: formData.address1,
          address_2: formData.address2 || "",
          city: formData.city,
          state: formData.state,
          postcode: formData.postcode,
          country: formData.country,
        },
        line_items: items.map((item) => ({
          product_id: item.product_id,
          quantity: item.quantity,
        })),
      };

      const order = await ordersApi.create(orderData);
      setOrderId(order.id);
      setOrderComplete(true);
      clearCart();
    } catch (err: any) {
      console.error("Order error:", err);
      if (err.response?.status === 401) {
        setError("API authentication failed. Please check your WooCommerce API keys.");
      } else {
        setError("Failed to place order. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  if (orderComplete) {
    return (
      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center space-y-6 max-w-md mx-auto">
          <CheckCircle size={64} className="mx-auto text-green-500" />
          <h1 className="text-2xl font-bold">Thank You!</h1>
          <p className="text-accent">
            Your order #{orderId} has been placed successfully. You will receive a confirmation email shortly.
          </p>
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 bg-black text-white px-6 py-3 text-sm uppercase tracking-wide hover:bg-gray-800 transition-colors"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  if (items.length === 0 && !orderComplete) {
    return (
      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center space-y-4">
          <p className="text-accent">Your cart is empty.</p>
          <Link
            href="/shop"
            className="text-sm uppercase tracking-wide hover:text-accent transition-colors"
          >
            Go to Shop
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex items-center gap-4 mb-12">
        <Link
          href="/cart"
          className="p-2 hover:bg-muted rounded-full transition-colors"
        >
          <ArrowLeft size={20} />
        </Link>
        <h1 className="text-2xl font-bold uppercase tracking-wider">
          Checkout
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="grid lg:grid-cols-12 gap-12">
        {/* Form Section */}
        <div className="lg:col-span-7 space-y-8">
          {/* Contact */}
          <div>
            <h2 className="text-lg font-semibold uppercase tracking-wider mb-6">
              Contact Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm text-accent mb-2">Email *</label>
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full border border-border p-3 focus:outline-none focus:border-black"
                  placeholder="your@email.com"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm text-accent mb-2">Phone *</label>
                <input
                  type="tel"
                  name="phone"
                  required
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full border border-border p-3 focus:outline-none focus:border-black"
                  placeholder="+1 (555) 000-0000"
                />
              </div>
            </div>
          </div>

          {/* Shipping */}
          <div>
            <h2 className="text-lg font-semibold uppercase tracking-wider mb-6">
              Shipping Address
            </h2>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-accent mb-2">First Name *</label>
                  <input
                    type="text"
                    name="firstName"
                    required
                    value={formData.firstName}
                    onChange={handleChange}
                    className="w-full border border-border p-3 focus:outline-none focus:border-black"
                  />
                </div>
                <div>
                  <label className="block text-sm text-accent mb-2">Last Name *</label>
                  <input
                    type="text"
                    name="lastName"
                    required
                    value={formData.lastName}
                    onChange={handleChange}
                    className="w-full border border-border p-3 focus:outline-none focus:border-black"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm text-accent mb-2">Address *</label>
                <input
                  type="text"
                  name="address1"
                  required
                  value={formData.address1}
                  onChange={handleChange}
                  className="w-full border border-border p-3 focus:outline-none focus:border-black"
                  placeholder="Street address"
                />
              </div>
              <div>
                <label className="block text-sm text-accent mb-2">Apartment, suite, etc.</label>
                <input
                  type="text"
                  name="address2"
                  value={formData.address2}
                  onChange={handleChange}
                  className="w-full border border-border p-3 focus:outline-none focus:border-black"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-accent mb-2">City *</label>
                  <input
                    type="text"
                    name="city"
                    required
                    value={formData.city}
                    onChange={handleChange}
                    className="w-full border border-border p-3 focus:outline-none focus:border-black"
                  />
                </div>
                <div>
                  <label className="block text-sm text-accent mb-2">Postal Code *</label>
                  <input
                    type="text"
                    name="postcode"
                    required
                    value={formData.postcode}
                    onChange={handleChange}
                    className="w-full border border-border p-3 focus:outline-none focus:border-black"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm text-accent mb-2">State/Province *</label>
                <input
                  type="text"
                  name="state"
                  required
                  value={formData.state}
                  onChange={handleChange}
                  className="w-full border border-border p-3 focus:outline-none focus:border-black"
                />
              </div>
              <div>
                <label className="block text-sm text-accent mb-2">Country *</label>
                <select
                  name="country"
                  required
                  value={formData.country}
                  onChange={handleChange}
                  className="w-full border border-border p-3 focus:outline-none focus:border-black bg-white"
                >
                  <option value="US">United States</option>
                  <option value="GB">United Kingdom</option>
                  <option value="CA">Canada</option>
                  <option value="AU">Australia</option>
                  <option value="IN">India</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-5">
          <div className="bg-muted p-6 space-y-6 sticky top-24">
            <h2 className="text-lg font-semibold uppercase tracking-wider">
              Order Summary
            </h2>

            <div className="space-y-3 border-b border-border pb-6 max-h-60 overflow-y-auto">
              {items.map((item) => (
                <div key={item.id} className="flex justify-between text-sm">
                  <span className="text-accent">
                    {item.name} x {item.quantity}
                  </span>
                  <span>{formatPrice(item.price * item.quantity)}</span>
                </div>
              ))}
            </div>

            <div className="space-y-3 border-b border-border pb-6">
              <div className="flex justify-between text-sm">
                <span className="text-accent">Subtotal</span>
                <span>{formatPrice(totalPrice())}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-accent">Shipping</span>
                <span className="text-green-600">Free</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-accent">Tax</span>
                <span>Calculated at checkout</span>
              </div>
            </div>

            <div className="flex justify-between font-semibold text-lg">
              <span>Total</span>
              <span>{formatPrice(totalPrice())}</span>
            </div>

            {error && (
              <div className="text-red-500 text-sm p-3 bg-red-50 border border-red-200">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-black text-white py-4 uppercase tracking-wide hover:bg-gray-800 transition-colors disabled:bg-gray-400 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin" size={18} />
                  Processing...
                </>
              ) : (
                `Place Order - ${formatPrice(totalPrice())}`
              )}
            </button>

            <p className="text-xs text-accent text-center">
              Your personal data will be used to process your order.
            </p>
          </div>
        </div>
      </form>
    </div>
  );
}
