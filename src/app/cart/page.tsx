"use client";

import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, X, ShoppingBag, ArrowRight } from "lucide-react";
import { useCartStore } from "@/store/cart-store";
import { formatPrice } from "@/lib/utils";
import { useRouter } from "next/navigation";

export default function CartPage() {
  const { items, removeItem, updateQuantity, totalPrice } = useCartStore();
  const router = useRouter();
  const total = totalPrice();

  if (items.length === 0) {
    return (
      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center space-y-6">
          <ShoppingBag size={64} className="mx-auto text-accent" />
          <h1 className="text-2xl font-bold">Your cart is empty</h1>
          <p className="text-accent">Add some products to get started.</p>
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

  return (
    <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex items-center justify-between mb-12">
        <h1 className="text-2xl font-bold uppercase tracking-wider">
          Shopping Cart
        </h1>
        <span className="text-accent text-sm">{items.length} items</span>
      </div>

      <div className="grid lg:grid-cols-12 gap-12">
        {/* Cart Items */}
        <div className="lg:col-span-8 space-y-4">
          {items.map((item) => (
            <div
              key={item.id}
              className="flex gap-6 p-4 border border-border"
            >
              <div className="relative w-24 h-32 bg-muted flex-shrink-0 overflow-hidden">
                {item.image ? (
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    className="object-cover"
                    sizes="96px"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full text-xs text-accent">
                    No Image
                  </div>
                )}
              </div>
              <div className="flex-1 flex flex-col justify-between">
                <div className="flex justify-between items-start">
                  <div>
                    <Link
                      href={`/product/${item.product_id}`}
                      className="font-medium hover:text-accent transition-colors"
                    >
                      {item.name}
                    </Link>
                    <p className="text-sm text-accent mt-1">
                      {formatPrice(item.price)} each
                    </p>
                  </div>
                  <button
                    onClick={() => removeItem(item.product_id)}
                    className="text-accent hover:text-black transition-colors p-1"
                    aria-label="Remove item"
                  >
                    <X size={18} />
                  </button>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center border border-border">
                    <button
                      onClick={() => updateQuantity(item.product_id, item.quantity - 1)}
                      className="p-2 hover:bg-muted transition-colors"
                      aria-label="Decrease quantity"
                    >
                      <Minus size={14} />
                    </button>
                    <span className="w-12 text-center text-sm">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.product_id, item.quantity + 1)}
                      className="p-2 hover:bg-muted transition-colors"
                      aria-label="Increase quantity"
                    >
                      <Plus size={14} />
                    </button>
                  </div>
                  <span className="font-semibold">
                    {formatPrice(item.price * item.quantity)}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-4">
          <div className="bg-muted p-6 space-y-6 sticky top-24">
            <h2 className="text-lg font-semibold uppercase tracking-wider">
              Order Summary
            </h2>
            
            <div className="space-y-3 border-b border-border pb-6">
              <div className="flex justify-between text-sm">
                <span className="text-accent">Subtotal ({items.reduce((sum, i) => sum + i.quantity, 0)} items)</span>
                <span>{formatPrice(total)}</span>
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
              <span>Estimated Total</span>
              <span>{formatPrice(total)}</span>
            </div>

            <button
              onClick={() => router.push("/checkout")}
              className="w-full bg-black text-white py-4 flex items-center justify-center gap-2 hover:bg-gray-800 transition-colors uppercase tracking-wide"
            >
              Proceed to Checkout
              <ArrowRight size={18} />
            </button>

            <Link
              href="/shop"
              className="block text-center text-sm text-accent hover:text-black transition-colors"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
