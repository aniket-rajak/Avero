"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { ArrowRight, Loader2, ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import { productsApi } from "@/lib/api";
import type { Product } from "@/lib/types";
import ProductCard from "@/components/product/ProductCard";

const bannerSlides = [
  {
    id: 1,
    image: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=1600&q=80",
    title: "Ethnic Elegance",
    subtitle: "Traditional meets modern fashion",
    link: "/shop",
  },
  {
    id: 2,
    image: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=1600&q=80",
    title: "Wedding Collection",
    subtitle: "Grand designs for your special day",
    link: "/shop?category=women",
  },
  {
    id: 3,
    image: "https://images.unsplash.com/photo-1507680434567-5739c80be1ac?w=1600&q=80",
    title: "Festive Styles",
    subtitle: "Celebrate in style with our festive range",
    link: "/shop?category=men",
  },
  {
    id: 4,
    image: "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?w=1600&q=80",
    title: "Casual Chic",
    subtitle: "Everyday luxury, everyday comfort",
    link: "/shop?sale=true",
  },
];

export default function Home() {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % bannerSlides.length);
  }, []);

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + bannerSlides.length) % bannerSlides.length);
  };

  useEffect(() => {
    const interval = setInterval(nextSlide, 5000);
    return () => clearInterval(interval);
  }, [nextSlide]);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const data = await productsApi.getAll({ per_page: 8, status: "publish" });
        setFeaturedProducts(data);
      } catch (err) {
        console.error("Failed to fetch products:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
  }, []);

  return (
    <div>
      {/* Premium Banner Carousel */}
      <section className="relative h-[70vh] overflow-hidden">
        {bannerSlides.map((slide, index) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-700 ${
              index === currentSlide ? "opacity-100 z-10" : "opacity-0 z-0"
            }`}
          >
            <Image
              src={slide.image}
              alt={slide.title}
              fill
              className="object-cover"
              priority={index === 0}
            />
            <div className="absolute inset-0 bg-black/40" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center text-white space-y-4 px-4">
                <h2 className="text-4xl md:text-6xl font-bold uppercase tracking-wider">
                  {slide.title}
                </h2>
                <p className="text-lg md:text-xl text-gray-200">{slide.subtitle}</p>
                <Link
                  href={slide.link}
                  className="inline-flex items-center gap-2 bg-white text-black px-8 py-3 text-sm uppercase tracking-wide hover:bg-gray-100 transition-colors"
                >
                  Shop Now
                  <ArrowRight size={18} />
                </Link>
              </div>
            </div>
          </div>
        ))}
        <button
          onClick={prevSlide}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-white/80 hover:bg-white p-3 rounded-full transition-colors"
        >
          <ChevronLeft size={24} />
        </button>
        <button
          onClick={nextSlide}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-white/80 hover:bg-white p-3 rounded-full transition-colors"
        >
          <ChevronRight size={24} />
        </button>
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex gap-2">
          {bannerSlides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-3 h-3 rounded-full transition-colors ${
                index === currentSlide ? "bg-white" : "bg-white/50 hover:bg-white/80"
              }`}
            />
          ))}
        </div>
      </section>

      {/* Hero Section */}
      <section className="relative min-h-[60vh] bg-gradient-to-br from-stone-100 via-stone-50 to-amber-50 flex items-center justify-center overflow-hidden py-6">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-20 left-20 w-72 h-72 bg-amber-200 rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-orange-200 rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-rose-100 rounded-full blur-3xl" />
        </div>
        <div className="relative text-center space-y-8 px-4 max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-sm">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span className="text-sm font-medium text-gray-700">New Arrivals 2024</span>
          </div>
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight">
            <span className="block text-stone-900">Elevate Your</span>
            <span className="block bg-gradient-to-r from-amber-600 via-orange-600 to-rose-600 bg-clip-text text-transparent">
              Style Statement
            </span>
          </h1>
          <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Discover exquisite ethnic wear, contemporary fashion, and timeless elegance 
            curated for the modern Indian lifestyle.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/shop"
              className="group inline-flex items-center gap-3 bg-stone-900 text-white px-10 py-4 text-sm uppercase tracking-widest hover:bg-stone-800 transition-all duration-300 shadow-xl hover:shadow-2xl"
            >
              Explore Collection
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="/shop?sale=true"
              className="inline-flex items-center gap-2 border-2 border-stone-300 text-stone-700 px-8 py-4 text-sm uppercase tracking-widest hover:border-stone-900 hover:text-stone-900 transition-all duration-300"
            >
              Flat 40% Off
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="flex items-center justify-between mb-12">
          <h2 className="text-2xl font-bold uppercase tracking-wider">
            Featured Products
          </h2>
          <Link
            href="/shop"
            className="text-sm uppercase tracking-wide hover:text-accent transition-colors flex items-center gap-2"
          >
            View All
            <ArrowRight size={16} />
          </Link>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="animate-spin text-accent" size={40} />
          </div>
        ) : featuredProducts.length > 0 ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="text-accent mb-4">No products available yet.</p>
            <p className="text-sm text-accent">
              Make sure your WooCommerce store has published products and API keys are configured.
            </p>
          </div>
        )}
      </section>

      {/* Categories */}
      <section className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="flex items-center justify-between mb-12">
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-stone-900">Shop by Category</h2>
            <p className="text-gray-500 mt-2">Find your perfect style</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              name: "Women",
              category: "women",
              image: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800&q=80",
              description: "Sarees, Kurtas & More",
            },
            {
              name: "Men",
              category: "men",
              image: "https://images.unsplash.com/photo-1507680434567-5739c80be1ac?w=800&q=80",
              description: "Sherwanis, Kurta Sets & More",
            },
            {
              name: "Accessories",
              category: "accessories",
              image: "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?w=800&q=80",
              description: "Jewelry, Bags & More",
            },
          ].map((cat) => (
            <Link
              key={cat.name}
              href={`/shop?category=${cat.category}`}
              className="relative aspect-[3/4] overflow-hidden group rounded-2xl shadow-lg"
            >
              <Image
                src={cat.image}
                alt={cat.name}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
              <div className="absolute inset-0 flex flex-col justify-end p-8">
                <span className="text-sm text-amber-300 uppercase tracking-widest mb-2">{cat.description}</span>
                <h3 className="text-3xl font-bold text-white mb-4">{cat.name}</h3>
                <span className="inline-flex items-center gap-2 text-white text-sm font-medium group-hover:gap-4 transition-all">
                  Explore <ArrowRight size={16} />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Promo Banner */}
      <section className="relative bg-stone-900 text-white py-24 overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <Image
            src="https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=1600&q=80"
            alt="Promo"
            fill
            className="object-cover"
          />
        </div>
        <div className="relative max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="inline-block bg-amber-500 text-stone-900 px-4 py-1 text-sm font-bold uppercase tracking-widest mb-6">
            Free Delivery
          </span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold uppercase tracking-tight mb-6">
            On Orders Above ₹999
          </h2>
          <p className="text-stone-400 max-w-lg mx-auto mb-10 text-lg">
            Fast & reliable delivery across India. Cash on delivery available.
          </p>
          <Link
            href="/shop"
            className="inline-flex items-center gap-3 bg-white text-stone-900 px-10 py-4 text-sm uppercase tracking-widest font-medium hover:bg-amber-400 transition-colors"
          >
            Start Shopping
            <ArrowRight size={18} />
          </Link>
        </div>
      </section>
    </div>
  );
}
