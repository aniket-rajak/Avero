'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Heart } from 'lucide-react';
import { Product } from '@/types/woocommerce';
import { useCart } from '@/components/providers/CartProvider';
import { useWishlist } from '@/components/providers/WishlistProvider';
import { cn } from '@/lib/wooApi';

interface ProductCardProps {
  product: Product;
  priority?: boolean;
}

export default function ProductCard({ product, priority = false }: ProductCardProps) {
  const { addItem } = useCart();
  const { toggleItem, isInWishlist } = useWishlist();
  const inWishlist = isInWishlist(product.id);
  const mainImage = product.images[0];
  const secondaryImage = product.images[1];
  const isOnSale = product.sale_price && parseFloat(product.sale_price) < parseFloat(product.regular_price);
  const isOutOfStock = product.stock_status === 'outofstock';

  const handleWishlistClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleItem(product);
  };

  const handleAddToCartClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!isOutOfStock) {
      addItem(product, 1);
    }
  };

  return (
    <div className="group">
      <Link 
        href={`/products/${product.slug}`}
        className="block cursor-pointer"
      >
        <div className="relative aspect-[3/4] overflow-hidden bg-neutral-100 mb-4">
          {mainImage ? (
            <Image
              src={mainImage.src}
              alt={mainImage.alt || product.name}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
              className="object-cover transition-transform duration-700 group-hover:scale-105"
              priority={priority}
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center text-neutral-400">
              No Image
            </div>
          )}
          
          {secondaryImage && (
            <Image
              src={secondaryImage.src}
              alt={secondaryImage.alt || product.name}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
              className="object-cover transition-opacity duration-500 opacity-0 group-hover:opacity-100"
            />
          )}

          {isOutOfStock && (
            <div className="absolute top-4 left-4 bg-black text-white text-xs px-3 py-1 tracking-wider">
              SOLD OUT
            </div>
          )}

          {isOnSale && !isOutOfStock && (
            <div className="absolute top-4 left-4 bg-neutral-900 text-white text-xs px-3 py-1 tracking-wider">
              SALE
            </div>
          )}

          <button
            onClick={handleWishlistClick}
            className={cn(
              'absolute top-4 right-4 p-2 rounded-full transition-all cursor-pointer z-10',
              inWishlist ? 'bg-black text-white' : 'bg-white/90 text-black hover:bg-black hover:text-white'
            )}
            aria-label={inWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
          >
            <Heart size={18} fill={inWishlist ? 'currentColor' : 'none'} />
          </button>

          <button
            onClick={handleAddToCartClick}
            disabled={isOutOfStock}
            className="absolute bottom-0 left-0 right-0 bg-black text-white py-4 text-sm tracking-wide translate-y-full group-hover:translate-y-0 transition-transform duration-300 disabled:bg-neutral-300 disabled:cursor-not-allowed cursor-pointer z-10"
          >
            {isOutOfStock ? 'OUT OF STOCK' : 'ADD TO BAG'}
          </button>
        </div>
      </Link>

      <Link href={`/products/${product.slug}`} className="cursor-pointer block">
        <h3 className="text-sm font-medium mb-1 hover:text-neutral-600 transition-colors">{product.name}</h3>
        <div className="flex items-center space-x-2">
          {isOnSale ? (
            <>
              <span className="text-sm font-medium">₹{product.sale_price}</span>
              <span className="text-sm text-neutral-400 line-through">₹{product.regular_price}</span>
            </>
          ) : (
            <span className={cn('text-sm font-medium', isOutOfStock && 'text-neutral-400')}>
              ₹{product.price || '0.00'}
            </span>
          )}
        </div>
      </Link>
    </div>
  );
}
