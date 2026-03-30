'use client';

import { useEffect, useState } from 'react';
import ProductCard from '@/components/product/ProductCard';
import { Product, ProductCategory } from '@/types/woocommerce';
import { cn } from '@/lib/wooApi';

interface ShopPageProps {
  searchParams: Promise<{ category?: string; page?: string }>;
}

export default function ShopPage({ searchParams }: ShopPageProps) {
  const [categories, setCategories] = useState<ProductCategory[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [categorySlug, setCategorySlug] = useState<string | null>(null);

  useEffect(() => {
    searchParams.then(params => {
      setCategorySlug(params.category || null);
      setCurrentPage(parseInt(params.page || '1'));
    });
  }, [searchParams]);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const params = new URLSearchParams({
          per_page: '12',
          page: currentPage.toString(),
        });
        if (categorySlug) params.append('category', categorySlug);

        const [productsRes, categoriesRes] = await Promise.all([
          fetch(`/api/products?${params}`),
          fetch('/api/categories'),
        ]);

        const productsData = await productsRes.json();
        const categoriesData = await categoriesRes.json();

        setProducts(Array.isArray(productsData) ? productsData : []);
        setCategories(Array.isArray(categoriesData) ? categoriesData : []);
        
        const total = productsRes.headers.get('X-WP-TotalPages') || '1';
        setTotalPages(parseInt(total));
      } catch (error) {
        console.error('Failed to fetch data:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [categorySlug, currentPage]);

  const selectedCategory = categories.find(c => c.slug === categorySlug);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black" />
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <h1 className="text-2xl md:text-3xl font-bold tracking-wider mb-4 md:mb-0">
          {selectedCategory ? selectedCategory.name.toUpperCase() : 'ALL PRODUCTS'}
        </h1>
        <p className="text-sm text-neutral-500">
          {products.length} products
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        <aside className="lg:w-48 flex-shrink-0">
          <nav className="space-y-2">
            <a
              href="/shop"
              className={cn('block text-sm tracking-wide', !categorySlug ? 'font-medium' : 'text-neutral-500 hover:text-black')}
            >
              ALL
            </a>
            {categories.map(category => (
              <button
                key={category.id}
                onClick={() => setCategorySlug(category.slug)}
                className={cn(
                  'cursor-pointer block text-sm tracking-wide text-left w-full',
                  categorySlug === category.slug ? 'font-medium' : 'text-neutral-500 hover:text-black'
                )}
              >
                {category.name.toUpperCase()}
              </button>
            ))}
          </nav>
        </aside>

        <main className="flex-1">
          {products.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
              {products.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <p className="text-neutral-500">No products found.</p>
            </div>
          )}

          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-12">
              {currentPage > 1 && (
                <button
                  onClick={() => setCurrentPage(p => p - 1)}
                  className="cursor-pointer px-4 py-2 text-sm border border-neutral-300 hover:bg-neutral-100 transition-colors"
                >
                  PREVIOUS
                </button>
              )}
              <span className="px-4 py-2 text-sm">
                Page {currentPage} of {totalPages}
              </span>
              {currentPage < totalPages && (
                <button
                  onClick={() => setCurrentPage(p => p + 1)}
                  className="cursor-pointer px-4 py-2 text-sm border border-neutral-300 hover:bg-neutral-100 transition-colors"
                >
                  NEXT
                </button>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
