'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Search, X, Loader2, ArrowRight } from 'lucide-react';
import { Product } from '@/types/woocommerce';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
    if (!isOpen) {
      setQuery('');
      setResults([]);
      setShowResults(false);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  useEffect(() => {
    const timer = setTimeout(async () => {
      if (query.length >= 2) {
        setLoading(true);
        setShowResults(true);
        try {
          const response = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
          const data = await response.json();
          setResults(Array.isArray(data) ? data : []);
        } catch (error) {
          console.error('Search error:', error);
          setResults([]);
        } finally {
          setLoading(false);
        }
      } else {
        setResults([]);
        setShowResults(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm"
      onClick={handleBackdropClick}
    >
      <div
        ref={modalRef}
        className="absolute top-0 left-0 right-0 bg-white animate-slideDown"
      >
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4 py-4 border-b border-neutral-200">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search for products..."
                className="w-full pl-12 pr-4 py-3 text-lg bg-neutral-50 border border-neutral-200 focus:outline-none focus:border-black transition-colors"
              />
              {loading && (
                <Loader2 className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400 animate-spin" />
              )}
            </div>
            <button
              onClick={onClose}
              className="cursor-pointer p-2 hover:bg-neutral-100 rounded-full transition-colors"
              aria-label="Close search"
            >
              <X size={24} />
            </button>
          </div>

          {showResults && (
            <div className="py-6 max-h-[60vh] overflow-y-auto">
              {results.length > 0 ? (
                <>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-medium text-neutral-500">
                      {results.length} {results.length === 1 ? 'result' : 'results'} found
                    </h3>
                    <Link
                      href={`/shop?search=${encodeURIComponent(query)}`}
                      onClick={onClose}
                      className="cursor-pointer text-sm text-neutral-500 hover:text-black transition-colors flex items-center gap-1"
                    >
                      View all
                      <ArrowRight size={14} />
                    </Link>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {results.map((product) => (
                      <Link
                        key={product.id}
                        href={`/products/${product.slug}`}
                        onClick={onClose}
                        className="cursor-pointer group"
                      >
                        <div className="relative aspect-[4/3] bg-neutral-100 overflow-hidden mb-3">
                          {product.images[0] ? (
                            <Image
                              src={product.images[0].src}
                              alt={product.name}
                              fill
                              sizes="(max-width: 768px) 50vw, 33vw"
                              className="object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                          ) : (
                            <div className="absolute inset-0 flex items-center justify-center text-neutral-400">
                              No Image
                            </div>
                          )}
                        </div>
                        <h4 className="text-sm font-medium group-hover:text-neutral-600 transition-colors line-clamp-1">
                          {product.name}
                        </h4>
                        <p className="text-sm text-neutral-500">
                          ₹{product.price || '0.00'}
                        </p>
                      </Link>
                    ))}
                  </div>
                </>
              ) : !loading && query.length >= 2 ? (
                <div className="text-center py-12">
                  <p className="text-neutral-500 mb-2">No products found for "{query}"</p>
                  <p className="text-sm text-neutral-400">Try searching with different keywords</p>
                </div>
              ) : null}
            </div>
          )}

          {!showResults && (
            <div className="py-8">
              <div className="mb-6">
                <h3 className="text-sm font-medium text-neutral-500 mb-4">Popular Categories</h3>
                <div className="flex flex-wrap gap-2">
                  {['T-Shirts', 'Jeans', 'Dresses', 'Sneakers', 'Jackets'].map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setQuery(cat)}
                      className="cursor-pointer px-4 py-2 bg-neutral-100 hover:bg-neutral-200 text-sm transition-colors"
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="text-sm font-medium text-neutral-500 mb-4">Popular Searches</h3>
                <div className="flex flex-wrap gap-2">
                  {['Summer Collection', 'New Arrivals', 'Sale', 'Best Sellers'].map((term) => (
                    <button
                      key={term}
                      onClick={() => setQuery(term)}
                      className="cursor-pointer px-4 py-2 border border-neutral-300 hover:border-black hover:bg-black hover:text-white text-sm transition-colors"
                    >
                      {term}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      <style jsx>{`
        @keyframes slideDown {
          from {
            transform: translateY(-100%);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
        .animate-slideDown {
          animation: slideDown 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}
