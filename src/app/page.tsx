"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, Loader2 } from "lucide-react";
import { productsApi } from "@/lib/api";
import type { Product } from "@/lib/types";
import ProductCard from "@/components/product/ProductCard";

export default function Home() {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

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
      {/* Hero Section */}
      <section className="relative h-[80vh] bg-muted flex items-center justify-center">
        <div className="text-center space-y-6 px-4">
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight uppercase">
            New Collection
          </h1>
          <p className="text-lg text-accent max-w-xl mx-auto">
            Discover our latest arrivals. Timeless pieces designed for the modern wardrobe.
          </p>
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 bg-black text-white px-8 py-4 text-sm uppercase tracking-wide hover:bg-gray-800 transition-colors"
          >
            Shop Now
            <ArrowRight size={18} />
          </Link>
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
      <section className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <h2 className="text-2xl font-bold uppercase tracking-wider mb-10">
          Shop by Category
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { name: "Women", category: "women", color: "bg-gray-200" },
            { name: "Men", category: "men", color: "bg-gray-300" },
            { name: "Accessories", category: "accessories", color: "bg-gray-400" },
          ].map((cat) => (
            <Link
              key={cat.name}
              href={`/shop?category=${cat.category}`}
              className={`relative aspect-[4/5] ${cat.color} overflow-hidden group`}
            >
              <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors" />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-3xl font-bold uppercase tracking-wider text-white drop-shadow-lg">
                  {cat.name}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Promo Banner */}
      <section className="bg-black text-white py-20">
        <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold uppercase tracking-wider mb-6">
            Free Shipping
          </h2>
          <p className="text-gray-400 max-w-lg mx-auto mb-8">
            On orders over $100. Fast and reliable delivery worldwide.
          </p>
          <Link
            href="/shop"
            className="inline-block border border-white px-8 py-4 text-sm uppercase tracking-wide hover:bg-white hover:text-black transition-colors"
          >
            Start Shopping
          </Link>
        </div>
      </section>
    </div>
  );
}
