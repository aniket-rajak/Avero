"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { productsApi, categoriesApi } from "@/lib/api";
import type { Product, ProductCategory } from "@/lib/types";
import ProductGrid from "@/components/product/ProductGrid";
import { Loader2 } from "lucide-react";

function ShopContent() {
  const searchParams = useSearchParams();
  const categorySlug = searchParams.get("category");
  
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<ProductCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const [catsData, prodsData] = await Promise.all([
          categoriesApi.getAll(),
          productsApi.getAll({ per_page: 50, status: "publish" })
        ]);
        
        setCategories(catsData);
        
        if (categorySlug) {
          setSelectedCategory(categorySlug);
          const filtered = prodsData.filter((p: Product) => 
            p.categories.some((c: ProductCategory) => 
              c.slug.toLowerCase() === categorySlug.toLowerCase()
            )
          );
          setProducts(filtered);
        } else {
          setProducts(prodsData);
        }
      } catch (err: any) {
        console.error("API Error:", err);
        if (err.response?.status === 401) {
          setError("Authentication failed. Please check your WooCommerce API keys in .env.local");
        } else if (err.code === "ECONNREFUSED") {
          setError("Cannot connect to WooCommerce. Please check your site URL.");
        } else {
          setError("Failed to load products. Please check your API configuration.");
        }
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [categorySlug]);

  const getCategoryName = () => {
    if (!selectedCategory) return "All Products";
    const cat = categories.find(c => c.slug === selectedCategory);
    return cat ? cat.name : selectedCategory;
  };

  if (loading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <Loader2 className="animate-spin text-accent" size={40} />
      </div>
    );
  }

  return (
    <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold uppercase tracking-wider">{getCategoryName()}</h1>
        <span className="text-accent text-sm">{products.length} items</span>
      </div>

      {/* Category Filter */}
      <div className="flex gap-4 mb-8 overflow-x-auto pb-4">
        <button
          onClick={() => setSelectedCategory(null)}
          className={`text-sm uppercase tracking-wide whitespace-nowrap px-4 py-2 border transition-colors ${
            !selectedCategory ? "bg-black text-white border-black" : "border-border hover:border-black"
          }`}
        >
          All
        </button>
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.slug)}
            className={`text-sm uppercase tracking-wide whitespace-nowrap px-4 py-2 border transition-colors ${
              selectedCategory === cat.slug ? "bg-black text-white border-black" : "border-border hover:border-black"
            }`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {error ? (
        <div className="text-center py-20 space-y-4">
          <p className="text-red-500">{error}</p>
          <div className="text-sm text-accent space-y-1">
            <p>Please check your configuration in .env.local:</p>
            <code className="block bg-muted p-2 rounded mt-2">
              NEXT_PUBLIC_WOOCOMMERCE_URL=https://aliceblue-eagle-633498.hostingersite.com
            </code>
          </div>
        </div>
      ) : products.length > 0 ? (
        <ProductGrid products={products} />
      ) : (
        <div className="text-center py-20">
          <p className="text-accent">No products found in this category.</p>
        </div>
      )}
    </div>
  );
}

export default function ShopPage() {
  return (
    <Suspense fallback={
      <div className="min-h-[50vh] flex items-center justify-center">
        <Loader2 className="animate-spin text-accent" size={40} />
      </div>
    }>
      <ShopContent />
    </Suspense>
  );
}
