'use client';

import Image from 'next/image';
import Link from 'next/link';
import { X, ShoppingBag } from 'lucide-react';
import { useWishlist } from '@/components/providers/WishlistProvider';
import { useCart } from '@/components/providers/CartProvider';
import { Product } from '@/types/woocommerce';
import { cn } from '@/lib/wooApi';

export default function WishlistPage() {
  const { items, removeItem } = useWishlist();
  const { addItem } = useCart();

  const handleMoveToCart = (product: Product) => {
    addItem(product, 1);
    removeItem(product.id);
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <h1 className="text-3xl font-bold mb-8">My Wishlist</h1>
          <div className="text-center py-20">
            <p className="text-neutral-500 mb-6">Your wishlist is empty</p>
            <Link 
              href="/shop"
              className="inline-block bg-black text-white px-8 py-4 text-sm tracking-wider hover:bg-neutral-800 transition-colors"
            >
              CONTINUE SHOPPING
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold">My Wishlist</h1>
          <span className="text-sm text-neutral-500">{items.length} {items.length === 1 ? 'item' : 'items'}</span>
        </div>

        <div className="space-y-4">
          {items.map((product) => {
            const mainImage = product.images[0];
            const isOnSale = product.sale_price && parseFloat(product.sale_price) < parseFloat(product.regular_price);
            const isOutOfStock = product.stock_status === 'outofstock';

            return (
              <div 
                key={product.id} 
                className="bg-white border border-neutral-200 p-4 sm:p-6 transition-colors hover:border-neutral-300"
              >
                <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
                  <div className="relative w-full sm:w-32 h-48 sm:h-32 bg-neutral-100 flex-shrink-0">
                    {mainImage ? (
                      <Link href={`/products/${product.slug}`}>
                        <Image
                          src={mainImage.src}
                          alt={mainImage.alt || product.name}
                          fill
                          sizes="(max-width: 640px) 100vw, 128px"
                          className="object-cover"
                        />
                      </Link>
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center text-neutral-400 text-sm">
                        No Image
                      </div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <Link href={`/products/${product.slug}`} className="cursor-pointer">
                          <h3 className="text-base sm:text-lg font-medium mb-2 hover:text-neutral-600 transition-colors">
                            {product.name}
                          </h3>
                        </Link>
                        
                        {product.categories.length > 0 && (
                          <p className="text-sm text-neutral-500 mb-2">
                            {product.categories.map(c => c.name).join(', ')}
                          </p>
                        )}

                        <div className="flex items-center gap-3 mb-4">
                          {isOnSale ? (
                            <>
                              <span className="text-lg font-bold">₹{product.sale_price}</span>
                              <span className="text-sm text-neutral-400 line-through">₹{product.regular_price}</span>
                            </>
                          ) : (
                            <span className="text-lg font-bold">₹{product.price || '0.00'}</span>
                          )}
                        </div>

                        <div className="flex flex-col sm:flex-row gap-2">
                          <button
                            onClick={() => handleMoveToCart(product)}
                            disabled={isOutOfStock}
                            className={cn(
                              'cursor-pointer flex items-center justify-center gap-2 px-6 py-3 text-sm tracking-wide transition-colors',
                              isOutOfStock 
                                ? 'bg-neutral-200 text-neutral-500 cursor-not-allowed' 
                                : 'bg-black text-white hover:bg-neutral-800'
                            )}
                          >
                            <ShoppingBag size={16} />
                            {isOutOfStock ? 'OUT OF STOCK' : 'MOVE TO BAG'}
                          </button>
                        </div>
                      </div>

                      <button
                        onClick={() => removeItem(product.id)}
                        className="cursor-pointer p-2 hover:bg-neutral-100 rounded-full transition-colors flex-shrink-0"
                        aria-label="Remove from wishlist"
                      >
                        <X size={20} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-12 pt-8 border-t border-neutral-200">
          <Link 
            href="/shop"
            className="inline-block text-sm hover:underline"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
}
