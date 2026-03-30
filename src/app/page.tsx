'use client';

import { useEffect, useState, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Product } from '@/types/woocommerce';
import ProductCard from '@/components/product/ProductCard';
import { ChevronLeft, ChevronRight, Pause, Play } from 'lucide-react';

const sliderImages = [
  {
    url: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1920&q=80',
    alt: 'Fashion model in elegant dress',
    title: 'Spring Essentials',
    subtitle: 'Fresh styles for the new season'
  },
  {
    url: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=1920&q=80',
    alt: 'Modern streetwear collection',
    title: 'Urban Elegance',
    subtitle: 'Where comfort meets sophistication'
  },
  {
    url: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=1920&q=80',
    alt: 'Luxury fashion accessories',
    title: 'Timeless Luxury',
    subtitle: 'Premium pieces that last'
  },
  {
    url: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=1920&q=80',
    alt: 'Minimalist fashion editorial',
    title: 'Minimal Chic',
    subtitle: 'Simplicity at its finest'
  },
  {
    url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1920&q=80',
    alt: 'Designer handbags and accessories',
    title: 'Accessory Edit',
    subtitle: 'Complete your look'
  },
  {
    url: 'https://images.unsplash.com/photo-1558171813-4c088753af8f?w=1920&q=80',
    alt: 'Casual street style fashion',
    title: 'Street Style',
    subtitle: 'Effortless everyday elegance'
  }
];

const newCollectionItems = [
  {
    image: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=800&q=80',
    title: 'Tailored Blazers',
    description: 'Sharp silhouettes for every occasion',
    tag: 'New Arrival'
  },
  {
    image: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=800&q=80',
    title: 'Premium Knitwear',
    description: 'Luxurious comfort in every stitch',
    tag: 'Trending'
  },
  {
    image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800&q=80',
    title: 'Designer Denim',
    description: 'Perfect fit, timeless style',
    tag: 'Bestseller'
  }
];

export default function HomePage() {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [newArrivals, setNewArrivals] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const nextSlide = useCallback(() => {
    setCurrentSlide(prev => (prev + 1) % sliderImages.length);
  }, []);

  const prevSlide = () => {
    setCurrentSlide(prev => (prev - 1 + sliderImages.length) % sliderImages.length);
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  useEffect(() => {
    if (!isAutoPlaying) return;
    const interval = setInterval(nextSlide, 5000);
    return () => clearInterval(interval);
  }, [isAutoPlaying, nextSlide]);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const [featuredRes, newRes] = await Promise.all([
          fetch('/api/products?per_page=4&orderby=popularity'),
          fetch('/api/products?per_page=4&orderby=date&order=desc'),
        ]);

        const [featured, newData] = await Promise.all([featuredRes.json(), newRes.json()]);

        setFeaturedProducts(Array.isArray(featured) ? featured : []);
        setNewArrivals(Array.isArray(newData) ? newData : []);
      } catch (error) {
        console.error('Failed to fetch products:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, []);

  return (
    <div className="overflow-hidden">
      <section className="relative h-[85vh] lg:h-[90vh] overflow-hidden">
        <div
          className="flex transition-transform duration-700 ease-out h-full"
          style={{ transform: `translateX(-${currentSlide * 100}%)` }}
        >
          {sliderImages.map((image, index) => (
            <div
              key={index}
              className="relative min-w-full h-full flex-shrink-0"
            >
              <Image
                src={image.url}
                alt={image.alt}
                fill
                sizes="100vw"
                className="object-cover"
                priority={index === 0}
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
            </div>
          ))}
        </div>

        <div className="absolute inset-0 flex items-center">
          <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 w-full">
            <div className="max-w-xl">
              <div className="flex items-center gap-3 mb-6">
                <span className="w-12 h-px bg-white/50" />
                <span className="text-white/80 text-xs tracking-[0.3em] uppercase">
                  {sliderImages[currentSlide].subtitle}
                </span>
              </div>
              <h2 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white tracking-tight mb-6 leading-tight">
                {sliderImages[currentSlide].title}
              </h2>
              <p className="text-white/70 text-lg mb-8 max-w-md">
                Discover our curated selection of premium fashion pieces designed for the modern individual.
              </p>
              <Link
                href="/shop"
                className="cursor-pointer inline-flex items-center gap-4 bg-white text-black px-8 py-4 text-sm tracking-[0.2em] hover:bg-neutral-100 transition-all duration-300 group"
              >
                <span>EXPLORE</span>
                <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </div>
          </div>
        </div>

        <button
          onClick={prevSlide}
          className="cursor-pointer absolute left-4 lg:left-8 top-1/2 -translate-y-1/2 w-12 h-12 lg:w-14 lg:h-14 bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-colors flex items-center justify-center group"
          aria-label="Previous slide"
        >
          <ChevronLeft className="w-5 h-5 lg:w-6 lg:h-6 text-white group-hover:scale-110 transition-transform" />
        </button>
        <button
          onClick={nextSlide}
          className="cursor-pointer absolute right-4 lg:right-8 top-1/2 -translate-y-1/2 w-12 h-12 lg:w-14 lg:h-14 bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-colors flex items-center justify-center group"
          aria-label="Next slide"
        >
          <ChevronRight className="w-5 h-5 lg:w-6 lg:h-6 text-white group-hover:scale-110 transition-transform" />
        </button>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-3">
          {sliderImages.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`cursor-pointer transition-all duration-300 ${
                index === currentSlide
                  ? 'w-8 h-1 bg-white'
                  : 'w-2 h-2 bg-white/40 hover:bg-white/60'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>

        <button
          onClick={() => setIsAutoPlaying(!isAutoPlaying)}
          className="cursor-pointer absolute bottom-8 right-8 w-10 h-10 bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-colors flex items-center justify-center"
          aria-label={isAutoPlaying ? 'Pause slider' : 'Play slider'}
        >
          {isAutoPlaying ? (
            <Pause className="w-4 h-4 text-white" />
          ) : (
            <Play className="w-4 h-4 text-white ml-0.5" />
          )}
        </button>
      </section>

      <section className="py-24 md:py-32 bg-white">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          <div className="text-center mb-16">
            <span className="text-[11px] tracking-[0.3em] uppercase text-neutral-400 block mb-4">Discover</span>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">NEW COLLECTION</h2>
            <div className="w-20 h-px bg-neutral-200 mx-auto mt-6" />
          </div>

          <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
            {newCollectionItems.map((item, index) => (
              <div
                key={index}
                className="group cursor-pointer"
              >
                <div className="relative aspect-[3/4] overflow-hidden mb-6">
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="bg-white/95 backdrop-blur-sm px-3 py-1.5 text-[10px] tracking-[0.2em] uppercase font-medium">
                      {item.tag}
                    </span>
                  </div>
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
                </div>
                <div className="text-center">
                  <h3 className="text-xl md:text-2xl font-bold tracking-tight mb-2 group-hover:text-neutral-600 transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-sm text-neutral-500">{item.description}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-16">
            <Link
              href="/shop"
              className="cursor-pointer inline-flex items-center gap-3 border-2 border-black px-10 py-4 text-sm tracking-[0.2em] hover:bg-black hover:text-white transition-all duration-300 group"
            >
              <span>VIEW ALL PRODUCTS</span>
              <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {!loading && newArrivals.length > 0 && (
        <section className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-24 md:py-32">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-16">
            <div>
              <span className="text-[11px] tracking-[0.3em] uppercase text-neutral-400 block mb-3">Just Landed</span>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">NEW IN</h2>
            </div>
            <Link href="/shop" className="cursor-pointer mt-6 md:mt-0 group flex items-center gap-2 text-sm tracking-wide text-neutral-500 hover:text-black transition-colors">
              <span>VIEW ALL</span>
              <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
            {newArrivals.slice(0, 4).map((product, index) => (
              <ProductCard key={product.id} product={product} priority={index < 2} />
            ))}
          </div>
        </section>
      )}

      <section className="py-24 md:py-32 bg-neutral-100/50">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          <div className="text-center mb-16">
            <span className="text-[11px] tracking-[0.3em] uppercase text-neutral-400 block mb-3">Explore</span>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">SHOP BY CATEGORY</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-6 lg:gap-10">
            <Link href="/shop?category=women" className="cursor-pointer group relative aspect-[4/5] lg:aspect-[3/4] overflow-hidden bg-neutral-200">
              <Image
                src="https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1200&q=80"
                alt="Women's Fashion Collection"
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover group-hover:scale-105 transition-transform duration-1000 ease-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent group-hover:via-black/30 transition-all duration-700" />
              <div className="absolute inset-0 border border-white/0 group-hover:border-white/20 transition-all duration-500 m-4" />
              <div className="absolute bottom-0 left-0 right-0 p-8 lg:p-12">
                <span className="text-[11px] tracking-[0.3em] uppercase text-white/70 block mb-3">Collection</span>
                <h3 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-white mb-4">WOMEN</h3>
                <div className="flex items-center gap-3 text-white/80 group-hover:text-white transition-colors">
                  <span className="text-sm tracking-wide">EXPLORE</span>
                  <svg className="w-5 h-5 transform group-hover:translate-x-2 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </div>
              </div>
            </Link>
            <Link href="/shop?category=men" className="cursor-pointer group relative aspect-[4/5] lg:aspect-[3/4] overflow-hidden bg-neutral-200">
              <Image
                src="https://images.unsplash.com/photo-1617137968427-85924c800a22?w=1200&q=80"
                alt="Men's Fashion Collection"
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover group-hover:scale-105 transition-transform duration-1000 ease-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent group-hover:via-black/30 transition-all duration-700" />
              <div className="absolute inset-0 border border-white/0 group-hover:border-white/20 transition-all duration-500 m-4" />
              <div className="absolute bottom-0 left-0 right-0 p-8 lg:p-12">
                <span className="text-[11px] tracking-[0.3em] uppercase text-white/70 block mb-3">Collection</span>
                <h3 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-white mb-4">MEN</h3>
                <div className="flex items-center gap-3 text-white/80 group-hover:text-white transition-colors">
                  <span className="text-sm tracking-wide">EXPLORE</span>
                  <svg className="w-5 h-5 transform group-hover:translate-x-2 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {!loading && featuredProducts.length > 0 && (
        <section className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-24 md:py-32">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-16">
            <div>
              <span className="text-[11px] tracking-[0.3em] uppercase text-neutral-400 block mb-3">Most Popular</span>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">BEST SELLERS</h2>
            </div>
            <Link href="/shop" className="cursor-pointer mt-6 md:mt-0 group flex items-center gap-2 text-sm tracking-wide text-neutral-500 hover:text-black transition-colors">
              <span>VIEW ALL</span>
              <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
            {featuredProducts.slice(0, 4).map((product, index) => (
              <ProductCard key={product.id} product={product} priority={index < 2} />
            ))}
          </div>
        </section>
      )}

      <section className="bg-neutral-900 text-white py-24 md:py-32">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 text-center">
          <span className="text-[11px] tracking-[0.3em] uppercase text-neutral-500 block mb-6">Newsletter</span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6">JOIN THE LIST</h2>
          <div className="w-12 h-px bg-neutral-700 mx-auto mb-8" />
          <p className="text-neutral-400 mb-12 max-w-md mx-auto leading-relaxed">
            Be the first to know about new arrivals, exclusive offers, and more.
          </p>
          <form className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="cursor-pointer flex-1 bg-transparent border border-neutral-700 px-6 py-4 text-sm tracking-wide focus:outline-none focus:border-white transition-colors placeholder:text-neutral-600"
            />
            <button
              type="submit"
              className="cursor-pointer bg-white text-black px-10 py-4 text-sm tracking-[0.2em] hover:bg-neutral-200 transition-colors"
            >
              SUBSCRIBE
            </button>
          </form>
        </div>
      </section>

      <section className="bg-black text-white py-16">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 text-center md:text-left">
            <div className="cursor-pointer">
              <h4 className="text-[11px] tracking-[0.2em] uppercase text-neutral-500 mb-4">Shop</h4>
              <ul className="space-y-3">
                <li><Link href="/shop" className="cursor-pointer text-sm text-neutral-400 hover:text-white transition-colors">All Products</Link></li>
                <li><Link href="/shop?category=women" className="cursor-pointer text-sm text-neutral-400 hover:text-white transition-colors">Women</Link></li>
                <li><Link href="/shop?category=men" className="cursor-pointer text-sm text-neutral-400 hover:text-white transition-colors">Men</Link></li>
              </ul>
            </div>
            <div className="cursor-pointer">
              <h4 className="text-[11px] tracking-[0.2em] uppercase text-neutral-500 mb-4">Help</h4>
              <ul className="space-y-3">
                <li><Link href="#" className="cursor-pointer text-sm text-neutral-400 hover:text-white transition-colors">Shipping</Link></li>
                <li><Link href="#" className="cursor-pointer text-sm text-neutral-400 hover:text-white transition-colors">Returns</Link></li>
                <li><Link href="#" className="cursor-pointer text-sm text-neutral-400 hover:text-white transition-colors">Size Guide</Link></li>
              </ul>
            </div>
            <div className="cursor-pointer">
              <h4 className="text-[11px] tracking-[0.2em] uppercase text-neutral-500 mb-4">Company</h4>
              <ul className="space-y-3">
                <li><Link href="#" className="cursor-pointer text-sm text-neutral-400 hover:text-white transition-colors">About</Link></li>
                <li><Link href="#" className="cursor-pointer text-sm text-neutral-400 hover:text-white transition-colors">Contact</Link></li>
                <li><Link href="#" className="cursor-pointer text-sm text-neutral-400 hover:text-white transition-colors">Careers</Link></li>
              </ul>
            </div>
            <div className="cursor-pointer">
              <h4 className="text-[11px] tracking-[0.2em] uppercase text-neutral-500 mb-4">Follow Us</h4>
              <div className="flex gap-4 mt-4 md:mt-0 justify-center md:justify-start">
                <Link href="#" className="cursor-pointer text-neutral-400 hover:text-white transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/></svg>
                </Link>
                <Link href="#" className="cursor-pointer text-neutral-400 hover:text-white transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
                </Link>
                <Link href="#" className="cursor-pointer text-neutral-400 hover:text-white transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"/></svg>
                </Link>
              </div>
            </div>
          </div>
          <div className="mt-16 pt-8 border-t border-neutral-800 text-center">
            <p className="text-[11px] tracking-[0.2em] uppercase text-neutral-600">© 2026 AVERO. All rights reserved. Proudly designed and developed by Four I. Special thanks to ANIKET RAJAK</p>
          </div>
        </div>
      </section>
    </div>
  );
}
