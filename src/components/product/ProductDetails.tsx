'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Product } from '@/types/woocommerce';
import { useCart } from '@/components/providers/CartProvider';
import { useWishlist } from '@/components/providers/WishlistProvider';
import { cn } from '@/lib/wooApi';
import { Minus, Plus, Heart, Share2, Star, Check } from 'lucide-react';

interface ProductDetailsProps {
  product: Product;
}

interface Review {
  id: number;
  date_created: string;
  reviewer: string;
  reviewer_email: string;
  rating: number;
  review: string;
  verified: boolean;
}

export default function ProductDetails({ product }: ProductDetailsProps) {
  const { addItem } = useCart();
  const { toggleItem, isInWishlist } = useWishlist();
  const inWishlist = isInWishlist(product.id);
  
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({});
  const [activeTab, setActiveTab] = useState<'description' | 'details' | 'reviews'>('description');
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loadingReviews, setLoadingReviews] = useState(false);
  const [showAllImages, setShowAllImages] = useState(false);

  const mainImage = product.images[selectedImage];
  const isOnSale = product.sale_price && parseFloat(product.sale_price) < parseFloat(product.regular_price);
  const isOutOfStock = product.stock_status === 'outofstock';

  const attributes = product.attributes;
  const colorAttr = attributes.find(attr => 
    attr.name.toLowerCase() === 'color' || 
    attr.name.toLowerCase() === 'colour'
  );
  const sizeAttr = attributes.find(attr => 
    attr.name.toLowerCase() === 'size'
  );
  const otherAttributes = attributes.filter(attr => 
    attr.name.toLowerCase() !== 'color' && 
    attr.name.toLowerCase() !== 'colour' &&
    attr.name.toLowerCase() !== 'size' &&
    !attr.variation
  );

  const handleAddToCart = () => {
    if (!isOutOfStock) {
      addItem(product, quantity);
    }
  };

  const fetchReviews = async () => {
    if (reviews.length > 0) return;
    setLoadingReviews(true);
    try {
      const baseUrl = process.env.NEXT_PUBLIC_WOOCOMMERCE_URL;
      const key = process.env.WOOCOMMERCE_CONSUMER_KEY;
      const secret = process.env.WOOCOMMERCE_CONSUMER_SECRET;
      const res = await fetch(
        `${baseUrl}/wp-json/wc/v3/products/${product.id}/reviews?consumer_key=${key}&consumer_secret=${secret}`
      );
      if (res.ok) {
        const data = await res.json();
        setReviews(data);
      }
    } catch (err) {
      console.error('Failed to fetch reviews:', err);
    } finally {
      setLoadingReviews(false);
    }
  };

  const handleTabChange = (tab: 'description' | 'details' | 'reviews') => {
    setActiveTab(tab);
    if (tab === 'reviews') {
      fetchReviews();
    }
  };

  const displayedImages = showAllImages ? product.images : product.images.slice(0, 4);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-10">
      <nav className="text-sm text-neutral-500 mb-6">
        <Link href="/shop" className="hover:text-black transition-colors">Home</Link>
        <span className="mx-2">/</span>
        {product.categories.length > 0 && (
          <>
            <span className="hover:text-black transition-colors">{product.categories[0].name}</span>
            <span className="mx-2">/</span>
          </>
        )}
        <span className="text-black">{product.name}</span>
      </nav>

      <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 xl:gap-16">
        <div className="space-y-3">
          <div className="relative aspect-[3/4] bg-neutral-100 overflow-hidden rounded-lg">
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
            {isOutOfStock && (
              <div className="absolute top-4 left-4 bg-black text-white text-xs px-3 py-1.5 tracking-wider">
                SOLD OUT
              </div>
            )}
            {isOnSale && !isOutOfStock && (
              <div className="absolute top-4 left-4 bg-neutral-900 text-white text-xs px-3 py-1.5 tracking-wider">
                SALE
              </div>
            )}
          </div>

          {product.images.length > 1 && (
            <div className="space-y-2">
              <div className={cn(
                "grid gap-2",
                showAllImages ? "grid-cols-4" : product.images.length <= 4 ? `grid-cols-${Math.min(product.images.length, 4)}` : "grid-cols-4"
              )}>
                {displayedImages.map((image, index) => (
                  <button
                    key={image.id}
                    onClick={() => setSelectedImage(index)}
                    className={cn(
                      'cursor-pointer relative aspect-square bg-neutral-100 overflow-hidden rounded-md transition-all',
                      selectedImage === index ? 'ring-2 ring-black' : 'hover:opacity-80'
                    )}
                  >
                    <Image
                      src={image.src}
                      alt={image.alt || `${product.name} - Image ${index + 1}`}
                      fill
                      sizes="100px"
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
              {product.images.length > 4 && (
                <button
                  onClick={() => setShowAllImages(!showAllImages)}
                  className="w-full py-2 text-sm text-neutral-600 hover:text-black transition-colors cursor-pointer"
                >
                  {showAllImages ? 'Show Less' : `View All ${product.images.length} Images`}
                </button>
              )}
            </div>
          )}
        </div>

        <div className="lg:sticky lg:top-24 lg:self-start space-y-6">
          <div className="space-y-4">
            <div>
              {product.categories.length > 0 && (
                <p className="text-sm text-neutral-500 tracking-wider uppercase">
                  {product.categories.map(c => c.name).join(' / ')}
                </p>
              )}
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mt-1">{product.name}</h1>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} size={18} className="text-neutral-300" fill="currentColor" />
                ))}
              </div>
              <span className="text-sm text-neutral-500">(0 reviews)</span>
            </div>

            <div className="flex items-center gap-4">
              {isOnSale ? (
                <>
                  <span className="text-3xl font-bold">₹{product.sale_price}</span>
                  <span className="text-lg text-neutral-400 line-through">₹{product.regular_price}</span>
                  <span className="bg-red-100 text-red-600 text-xs px-2 py-1 rounded">
                    {Math.round((1 - parseFloat(product.sale_price) / parseFloat(product.regular_price)) * 100)}% OFF
                  </span>
                </>
              ) : (
                <span className="text-3xl font-bold">₹{product.price || '0.00'}</span>
              )}
            </div>

            {product.short_description && (
              <div 
                className="text-neutral-600 text-sm leading-relaxed"
                dangerouslySetInnerHTML={{ __html: product.short_description }}
              />
            )}
          </div>

          {colorAttr && colorAttr.options.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">
                  Color: <span className="font-normal">{selectedOptions['Color'] || selectedOptions['colour'] || 'Select'}</span>
                </label>
              </div>
              <div className="flex flex-wrap gap-2">
                {colorAttr.options.map(option => (
                  <button
                    key={option}
                    onClick={() => setSelectedOptions(prev => ({ ...prev, [colorAttr.name]: option }))}
                    className={cn(
                      'cursor-pointer px-4 py-2.5 text-sm border rounded-md tracking-wide transition-all',
                      selectedOptions[colorAttr.name] === option
                        ? 'border-black bg-black text-white'
                        : 'border-neutral-300 hover:border-black'
                    )}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>
          )}

          {sizeAttr && sizeAttr.options.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">
                  Size: <span className="font-normal">{selectedOptions['Size'] || 'Select'}</span>
                </label>
                <button className="text-sm text-neutral-500 hover:text-black underline cursor-pointer">
                  Size Guide
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {sizeAttr.options.map(option => (
                  <button
                    key={option}
                    onClick={() => setSelectedOptions(prev => ({ ...prev, [sizeAttr.name]: option }))}
                    className={cn(
                      'cursor-pointer min-w-[50px] px-4 py-2.5 text-sm border rounded-md tracking-wide transition-all',
                      selectedOptions[sizeAttr.name] === option
                        ? 'border-black bg-black text-white'
                        : 'border-neutral-300 hover:border-black'
                    )}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>
          )}

          {otherAttributes.length > 0 && (
            <div className="space-y-3">
              {otherAttributes.map(attr => (
                <div key={attr.id}>
                  <label className="text-sm font-medium block mb-2">{attr.name}</label>
                  <div className="flex flex-wrap gap-2">
                    {attr.options.map(option => (
                      <span key={option} className="px-3 py-1.5 text-sm bg-neutral-100 rounded">
                        {option}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="space-y-3">
            <label className="text-sm font-medium block">Quantity</label>
            <div className="flex items-center border border-neutral-300 w-fit rounded-md">
              <button
                onClick={() => setQuantity(q => Math.max(1, q - 1))}
                className="cursor-pointer p-3 hover:bg-neutral-100 transition-colors rounded-l-md"
                aria-label="Decrease quantity"
              >
                <Minus size={18} />
              </button>
              <span className="px-6 py-3 text-center min-w-[60px] font-medium">{quantity}</span>
              <button
                onClick={() => setQuantity(q => q + 1)}
                className="cursor-pointer p-3 hover:bg-neutral-100 transition-colors rounded-r-md"
                aria-label="Increase quantity"
              >
                <Plus size={18} />
              </button>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={handleAddToCart}
              disabled={isOutOfStock}
              className="cursor-pointer flex-1 bg-black text-white py-4 text-sm tracking-wider rounded-md hover:bg-neutral-800 transition-colors disabled:bg-neutral-300 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/>
                <path d="M3 6h18"/>
                <path d="M16 10a4 4 0 0 1-8 0"/>
              </svg>
              {isOutOfStock ? 'OUT OF STOCK' : 'ADD TO BAG'}
            </button>
            <button
              onClick={() => toggleItem(product)}
              className={cn(
                'cursor-pointer p-4 border rounded-md transition-all',
                inWishlist 
                  ? 'border-black bg-black text-white' 
                  : 'border-neutral-300 hover:border-black'
              )}
              aria-label={inWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
            >
              <Heart size={20} fill={inWishlist ? 'currentColor' : 'none'} />
            </button>
            <button
              className="cursor-pointer p-4 border border-neutral-300 hover:border-black rounded-md transition-colors"
              aria-label="Share"
            >
              <Share2 size={20} />
            </button>
          </div>

          <div className="border-t border-neutral-200 pt-6 space-y-3">
            <div className="flex items-center gap-2 text-sm">
              <Check size={16} className="text-green-600" />
              <span>Free shipping on orders over ₹999</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Check size={16} className="text-green-600" />
              <span>30-day returns policy</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Check size={16} className="text-green-600" />
              <span>Secure checkout</span>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-12 md:mt-16 border-t border-neutral-200 pt-8">
        <div className="flex border-b border-neutral-200">
          {['description', 'details', 'reviews'].map((tab) => (
            <button
              key={tab}
              onClick={() => handleTabChange(tab as 'description' | 'details' | 'reviews')}
              className={cn(
                'px-6 py-4 text-sm font-medium capitalize tracking-wide transition-colors cursor-pointer',
                activeTab === tab 
                  ? 'border-b-2 border-black text-black' 
                  : 'text-neutral-500 hover:text-black'
              )}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="py-8">
          {activeTab === 'description' && (
            <div className="prose prose-sm md:prose-base max-w-none">
              {product.description ? (
                <div dangerouslySetInnerHTML={{ __html: product.description }} />
              ) : (
                <p className="text-neutral-500">No description available.</p>
              )}
            </div>
          )}

          {activeTab === 'details' && (
            <div className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                {colorAttr && colorAttr.options.length > 0 && (
                  <div>
                    <h3 className="font-medium mb-3">Colors</h3>
                    <div className="flex flex-wrap gap-2">
                      {colorAttr.options.map(option => (
                        <span key={option} className="px-3 py-1.5 text-sm bg-neutral-100 rounded">
                          {option}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                {sizeAttr && sizeAttr.options.length > 0 && (
                  <div>
                    <h3 className="font-medium mb-3">Sizes</h3>
                    <div className="flex flex-wrap gap-2">
                      {sizeAttr.options.map(option => (
                        <span key={option} className="px-3 py-1.5 text-sm bg-neutral-100 rounded">
                          {option}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              
              {product.attributes.length > 0 && (
                <div className="space-y-4">
                  <h3 className="font-medium">Additional Information</h3>
                  <table className="w-full text-sm">
                    <tbody>
                      {attributes.map((attr, index) => (
                        <tr key={attr.id} className={cn(index % 2 === 0 ? 'bg-neutral-50' : '')}>
                          <td className="px-4 py-3 font-medium">{attr.name}</td>
                          <td className="px-4 py-3">{attr.options.join(', ')}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {product.tags.length > 0 && (
                <div>
                  <h3 className="font-medium mb-3">Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    {product.tags.map(tag => (
                      <Link 
                        key={tag.id} 
                        href={`/shop?tag=${tag.slug}`}
                        className="px-3 py-1.5 text-sm bg-neutral-100 hover:bg-neutral-200 rounded transition-colors"
                      >
                        {tag.name}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'reviews' && (
            <div className="space-y-8">
              <div className="flex flex-col sm:flex-row sm:items-center gap-4 pb-6 border-b border-neutral-200">
                <div className="flex items-center gap-2">
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star key={star} size={20} className="text-neutral-300" fill="currentColor" />
                    ))}
                  </div>
                  <span className="font-medium">0 out of 5</span>
                </div>
                <span className="text-neutral-500">Based on 0 reviews</span>
              </div>

              {loadingReviews ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black" />
                </div>
              ) : reviews.length > 0 ? (
                <div className="space-y-6">
                  {reviews.map(review => (
                    <div key={review.id} className="pb-6 border-b border-neutral-100 last:border-0">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{review.reviewer}</span>
                            {review.verified && (
                              <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded">Verified</span>
                            )}
                          </div>
                          <div className="flex items-center gap-2 mt-1">
                            <div className="flex">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <Star 
                                  key={star} 
                                  size={14} 
                                  className={star <= review.rating ? 'text-yellow-400' : 'text-neutral-300'} 
                                  fill="currentColor" 
                                />
                              ))}
                            </div>
                            <span className="text-xs text-neutral-500">
                              {new Date(review.date_created).toLocaleDateString('en-IN', { 
                                day: 'numeric', 
                                month: 'long', 
                                year: 'numeric' 
                              })}
                            </span>
                          </div>
                        </div>
                      </div>
                      <p className="text-neutral-600 text-sm leading-relaxed">{review.review}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-neutral-500 mb-4">No reviews yet</p>
                  <p className="text-sm text-neutral-400">Be the first to review this product</p>
                </div>
              )}

              <div className="bg-neutral-50 p-6 rounded-lg">
                <h3 className="font-medium mb-4">Write a Review</h3>
                <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
                  <div>
                    <label className="block text-sm font-medium mb-2">Your Rating</label>
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button key={star} type="button" className="cursor-pointer">
                          <Star size={24} className="text-neutral-300 hover:text-yellow-400 transition-colors" fill="currentColor" />
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Your Review</label>
                    <textarea 
                      rows={4}
                      className="w-full px-4 py-3 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black resize-none"
                      placeholder="Share your thoughts about this product..."
                    />
                  </div>
                  <button 
                    type="submit"
                    className="bg-black text-white px-6 py-3 text-sm tracking-wide rounded-md hover:bg-neutral-800 transition-colors cursor-pointer"
                  >
                    SUBMIT REVIEW
                  </button>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>

      {product.stock_quantity !== null && product.stock_quantity > 0 && product.stock_quantity <= 5 && (
        <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-md">
          <p className="text-sm text-red-700">
            <span className="font-medium">Hurry!</span> Only {product.stock_quantity} left in stock.
          </p>
        </div>
      )}
    </div>
  );
}
