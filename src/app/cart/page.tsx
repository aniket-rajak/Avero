'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useCart } from '@/components/providers/CartProvider';
import { Minus, Plus, X, ShoppingBag } from 'lucide-react';

export default function CartPage() {
  const router = useRouter();
  const { items, updateQuantity, removeItem, subtotal } = useCart();

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <ShoppingBag size={48} className="mx-auto mb-6 text-neutral-300" />
        <h1 className="text-2xl font-bold mb-4">Your bag is empty</h1>
        <p className="text-neutral-500 mb-8">Add items to your bag to get started.</p>
        <Link
          href="/shop"
          className="cursor-pointer inline-block bg-black text-white px-8 py-4 text-sm tracking-wider hover:bg-neutral-800 transition-colors"
        >
          CONTINUE SHOPPING
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl md:text-3xl font-bold tracking-wider mb-8">SHOPPING BAG</h1>

      <div className="grid lg:grid-cols-3 gap-8 lg:gap-16">
        <div className="lg:col-span-2">
          <div className="border-t border-neutral-200">
            {items.map(item => (
              <div key={`${item.product.id}-${item.variationId}`} className="py-6 border-b border-neutral-200">
                <div className="flex gap-6">
                  <div className="relative w-24 h-32 bg-neutral-100 flex-shrink-0">
                    {item.product.images[0] ? (
                      <Image
                        src={item.product.images[0].src}
                        alt={item.product.name}
                        fill
                        sizes="96px"
                        className="object-cover"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center text-neutral-400 text-xs">
                        No Image
                      </div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between">
                      <div>
                        <Link href={`/products/${item.product.slug}`} className="cursor-pointer font-medium hover:underline">
                          {item.product.name}
                        </Link>
                        {item.product.attributes.filter(a => a.variation).map(attr => (
                          <p key={attr.id} className="text-sm text-neutral-500 mt-1">
                            {attr.name}: {attr.options[0]}
                          </p>
                        ))}
                      </div>
                      <button
                        onClick={() => removeItem(item.product.id, item.variationId)}
                        className="cursor-pointer p-2 hover:bg-neutral-100 rounded-full transition-colors"
                        aria-label="Remove item"
                      >
                        <X size={18} />
                      </button>
                    </div>

                    <div className="flex items-end justify-between mt-4">
                      <div className="flex items-center border border-neutral-300">
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity - 1, item.variationId)}
                          className="cursor-pointer p-2 hover:bg-neutral-100 transition-colors"
                          aria-label="Decrease quantity"
                        >
                          <Minus size={16} />
                        </button>
                        <span className="px-4 py-2 text-center min-w-[48px]">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity + 1, item.variationId)}
                          className="cursor-pointer p-2 hover:bg-neutral-100 transition-colors"
                          aria-label="Increase quantity"
                        >
                          <Plus size={16} />
                        </button>
                      </div>

                      <p className="font-medium">
                        ₹{(parseFloat(item.product.price || '0') * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <Link
            href="/shop"
            className="cursor-pointer inline-block mt-6 text-sm tracking-wide hover:underline"
          >
            CONTINUE SHOPPING
          </Link>
        </div>

        <div>
          <div className="bg-neutral-50 p-6">
            <h2 className="text-lg font-bold tracking-wider mb-6">ORDER SUMMARY</h2>

            <div className="space-y-4 border-b border-neutral-200 pb-4 mb-4">
              <div className="flex justify-between text-sm">
                <span className="text-neutral-600">Subtotal</span>
                <span>₹{subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-neutral-600">Shipping</span>
                <span className="text-neutral-500">Calculated at checkout</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-neutral-600">Tax</span>
                <span className="text-neutral-500">Calculated at checkout</span>
              </div>
            </div>

            <div className="flex justify-between font-bold text-lg mb-6">
              <span>Total</span>
              <span>₹{subtotal.toFixed(2)}</span>
            </div>

            <button 
              onClick={() => router.push('/checkout')}
              className="cursor-pointer w-full bg-black text-white py-4 text-sm tracking-wider hover:bg-neutral-800 transition-colors"
            >
              CHECKOUT
            </button>

            <p className="text-xs text-neutral-500 text-center mt-4">
              Free shipping on orders over ₹5,000
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
