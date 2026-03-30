'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Product } from '@/types/woocommerce';
import { useCart } from '@/components/providers/CartProvider';
import { cn } from '@/lib/wooApi';
import { Minus, Plus, Heart, Share2 } from 'lucide-react';

interface ProductDetailsProps {
  product: Product;
}

export default function ProductDetails({ product }: ProductDetailsProps) {
  const { addItem } = useCart();
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({});

  const mainImage = product.images[selectedImage];
  const isOnSale = product.sale_price && parseFloat(product.sale_price) < parseFloat(product.regular_price);
  const isOutOfStock = product.stock_status === 'outofstock';

  const handleAddToCart = () => {
    if (!isOutOfStock) {
      addItem(product, quantity);
    }
  };

  const attributes = product.attributes.filter(attr => attr.variation);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid lg:grid-cols-2 gap-8 lg:gap-16">
        <div className="space-y-4">
          <div className="relative aspect-[3/4] bg-neutral-100 overflow-hidden">
            {mainImage ? (
              <Image
                src={mainImage.src}
                alt={mainImage.alt || product.name}
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
                priority
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center text-neutral-400">
                No Image
              </div>
            )}
          </div>

          {product.images.length > 1 && (
            <div className="grid grid-cols-4 gap-2">
              {product.images.map((image, index) => (
                <button
                  key={image.id}
                  onClick={() => setSelectedImage(index)}
                  className={cn(
                    'cursor-pointer relative aspect-square bg-neutral-100 overflow-hidden',
                    selectedImage === index && 'ring-2 ring-black'
                  )}
                >
                  <Image
                    src={image.src}
                    alt={image.alt || `${product.name} - Image ${index + 1}`}
                    fill
                    sizes="80px"
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="lg:sticky lg:top-24 lg:self-start">
          <div className="space-y-6">
            <div>
              {product.categories.length > 0 && (
                <p className="text-sm text-neutral-500 tracking-wider mb-2">
                  {product.categories.map(c => c.name).join(', ')}
                </p>
              )}
              <h1 className="text-2xl md:text-3xl font-bold">{product.name}</h1>
            </div>

            <div className="flex items-center space-x-3">
              {isOnSale ? (
                <>
                  <span className="text-2xl font-bold">₹{product.sale_price}</span>
                  <span className="text-lg text-neutral-400 line-through">₹{product.regular_price}</span>
                </>
              ) : (
                <span className="text-2xl font-bold">₹{product.price || '0.00'}</span>
              )}
            </div>

            <div className="space-y-4">
              {attributes.map(attr => (
                <div key={attr.id}>
                  <label className="block text-sm font-medium mb-2">
                    {attr.name}: {selectedOptions[attr.name] || 'Select'}
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {attr.options.map(option => (
                      <button
                        key={option}
                        onClick={() => setSelectedOptions(prev => ({ ...prev, [attr.name]: option }))}
                        className={cn(
                          'cursor-pointer px-4 py-2 text-sm border tracking-wide transition-colors',
                          selectedOptions[attr.name] === option
                            ? 'border-black bg-black text-white'
                            : 'border-neutral-300 hover:border-black'
                        )}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">QUANTITY</label>
              <div className="flex items-center border border-neutral-300 w-fit">
                <button
                  onClick={() => setQuantity(q => Math.max(1, q - 1))}
                  className="cursor-pointer p-3 hover:bg-neutral-100 transition-colors"
                  aria-label="Decrease quantity"
                >
                  <Minus size={18} />
                </button>
                <span className="px-6 py-3 text-center min-w-[60px]">{quantity}</span>
                <button
                  onClick={() => setQuantity(q => q + 1)}
                  className="cursor-pointer p-3 hover:bg-neutral-100 transition-colors"
                  aria-label="Increase quantity"
                >
                  <Plus size={18} />
                </button>
              </div>
            </div>

            <div className="flex gap-4">
              <button
                onClick={handleAddToCart}
                disabled={isOutOfStock}
                className="cursor-pointer flex-1 bg-black text-white py-4 text-sm tracking-wider hover:bg-neutral-800 transition-colors disabled:bg-neutral-300 disabled:cursor-not-allowed"
              >
                {isOutOfStock ? 'OUT OF STOCK' : 'ADD TO BAG'}
              </button>
              <button
                className="cursor-pointer p-4 border border-neutral-300 hover:border-black transition-colors"
                aria-label="Add to wishlist"
              >
                <Heart size={20} />
              </button>
              <button
                className="cursor-pointer p-4 border border-neutral-300 hover:border-black transition-colors"
                aria-label="Share"
              >
                <Share2 size={20} />
              </button>
            </div>

            <div className="border-t border-neutral-200 pt-6 space-y-4">
              <div
                className="prose prose-sm max-w-none text-neutral-600"
                dangerouslySetInnerHTML={{ __html: product.description }}
              />
            </div>

            {product.stock_quantity !== null && product.stock_quantity > 0 && (
              <p className="text-sm text-neutral-500">
                Only {product.stock_quantity} left in stock
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
