'use client';

import { useEffect, useState } from 'react';
import ProductCard from '@/components/product/ProductCard';
import { Product, ProductCategory } from '@/types/woocommerce';
import { cn } from '@/lib/wooApi';
import { X, SlidersHorizontal, ChevronDown, Grid, LayoutGrid } from 'lucide-react';

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
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [sortBy, setSortBy] = useState('date');
  const [gridSize, setGridSize] = useState<'small' | 'large'>('small');

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
          orderby: sortBy,
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
  }, [categorySlug, currentPage, sortBy]);

  const selectedCategory = categories.find(c => c.slug === categorySlug);

  const FilterContent = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-sm font-semibold tracking-wide uppercase mb-4">Categories</h3>
        <div className="space-y-3">
          <button
            onClick={() => {
              setCategorySlug(null);
              setCurrentPage(1);
              setMobileFiltersOpen(false);
            }}
            className={cn(
              'block w-full text-left text-sm py-2 transition-colors',
              !categorySlug ? 'font-semibold text-black' : 'text-neutral-500 hover:text-black'
            )}
          >
            All Products
            <span className="text-neutral-400 ml-2">({products.length})</span>
          </button>
          {categories.map(category => (
            <button
              key={category.id}
              onClick={() => {
                setCategorySlug(category.slug);
                setCurrentPage(1);
                setMobileFiltersOpen(false);
              }}
              className={cn(
                'block w-full text-left text-sm py-2 transition-colors',
                categorySlug === category.slug ? 'font-semibold text-black' : 'text-neutral-500 hover:text-black'
              )}
            >
              {category.name}
            </button>
          ))}
        </div>
      </div>

      <div className="border-t border-neutral-200 pt-6">
        <h3 className="text-sm font-semibold tracking-wide uppercase mb-4">Price Range</h3>
        <div className="space-y-3">
          {['Under ₹500', '₹500 - ₹1000', '₹1000 - ₹2000', 'Above ₹2000'].map((range) => (
            <label key={range} className="flex items-center gap-3 cursor-pointer group">
              <input type="checkbox" className="w-4 h-4 border-neutral-300 rounded focus:ring-black" />
              <span className="text-sm text-neutral-600 group-hover:text-black transition-colors">{range}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="border-t border-neutral-200 pt-6">
        <h3 className="text-sm font-semibold tracking-wide uppercase mb-4">Size</h3>
        <div className="flex flex-wrap gap-2">
          {['XS', 'S', 'M', 'L', 'XL', 'XXL'].map((size) => (
            <button
              key={size}
              className="w-10 h-10 text-sm border border-neutral-300 hover:border-black hover:bg-black hover:text-white transition-all rounded"
            >
              {size}
            </button>
          ))}
        </div>
      </div>

      <div className="border-t border-neutral-200 pt-6">
        <h3 className="text-sm font-semibold tracking-wide uppercase mb-4">Color</h3>
        <div className="flex flex-wrap gap-3">
          {['Black', 'White', 'Navy', 'Red', 'Green'].map((color) => (
            <button
              key={color}
              className="flex items-center gap-2 text-sm text-neutral-600 hover:text-black transition-colors"
            >
              <span className="w-5 h-5 rounded-full border border-neutral-300 bg-neutral-100" />
              {color}
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-white">
      <div className="border-b border-neutral-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6">
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
              {selectedCategory ? selectedCategory.name : 'Shop All'}
            </h1>
            <p className="text-neutral-500 mt-2">
              {products.length > 0 ? `${products.length} products` : 'No products found'}
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setMobileFiltersOpen(true)}
              className="lg:hidden flex items-center gap-2 px-4 py-2.5 border border-neutral-300 rounded-lg hover:border-black transition-colors cursor-pointer"
            >
              <SlidersHorizontal size={18} />
              <span className="text-sm font-medium">Filters</span>
            </button>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden lg:flex items-center gap-2 border border-neutral-300 rounded-lg overflow-hidden">
              <button
                onClick={() => setGridSize('small')}
                className={cn(
                  'p-2.5 transition-colors cursor-pointer',
                  gridSize === 'small' ? 'bg-black text-white' : 'hover:bg-neutral-100'
                )}
              >
                <Grid size={18} />
              </button>
              <button
                onClick={() => setGridSize('large')}
                className={cn(
                  'p-2.5 transition-colors cursor-pointer',
                  gridSize === 'large' ? 'bg-black text-white' : 'hover:bg-neutral-100'
                )}
              >
                <LayoutGrid size={18} />
              </button>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-sm text-neutral-500 hidden sm:inline">Sort by:</span>
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="appearance-none bg-white border border-neutral-300 rounded-lg pl-4 pr-10 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-black cursor-pointer"
                >
                  <option value="date">Newest</option>
                  <option value="popularity">Popularity</option>
                  <option value="price">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                </select>
                <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none" />
              </div>
            </div>
          </div>
        </div>

        <div className="flex gap-10">
          <aside className="hidden lg:block w-64 flex-shrink-0">
            <div className="sticky top-24">
              <FilterContent />
            </div>
          </aside>

          <main className="flex-1">
            {loading ? (
              <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-black" />
              </div>
            ) : products.length > 0 ? (
              <div className={cn(
                "grid gap-4 md:gap-6",
                gridSize === 'small' ? "grid-cols-2 md:grid-cols-3" : "grid-cols-1 md:grid-cols-2"
              )}>
                {products.map((product, index) => (
                  <ProductCard key={product.id} product={product} priority={index < 4} />
                ))}
              </div>
            ) : (
              <div className="text-center py-20">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-neutral-100 flex items-center justify-center">
                  <svg className="w-8 h-8 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium mb-2">No products found</h3>
                <p className="text-neutral-500 mb-6">Try adjusting your filters or search terms</p>
                <button
                  onClick={() => setCategorySlug(null)}
                  className="px-6 py-3 bg-black text-white text-sm hover:bg-neutral-800 transition-colors cursor-pointer"
                >
                  Clear Filters
                </button>
              </div>
            )}

            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-12">
                <button
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="px-4 py-2 text-sm border border-neutral-300 hover:bg-neutral-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                >
                  Previous
                </button>
                <div className="flex items-center gap-1">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNum;
                    if (totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (currentPage <= 3) {
                      pageNum = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      pageNum = totalPages - 4 + i;
                    } else {
                      pageNum = currentPage - 2 + i;
                    }
                    return (
                      <button
                        key={pageNum}
                        onClick={() => setCurrentPage(pageNum)}
                        className={cn(
                          'w-10 h-10 text-sm transition-colors cursor-pointer',
                          currentPage === pageNum
                            ? 'bg-black text-white'
                            : 'border border-neutral-300 hover:bg-neutral-100'
                        )}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                </div>
                <button
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 text-sm border border-neutral-300 hover:bg-neutral-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                >
                  Next
                </button>
              </div>
            )}
          </main>
        </div>
      </div>

      {mobileFiltersOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setMobileFiltersOpen(false)} />
          <div className="absolute right-0 top-0 bottom-0 w-full max-w-sm bg-white shadow-xl overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-neutral-200 px-6 py-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold">Filters</h2>
              <button
                onClick={() => setMobileFiltersOpen(false)}
                className="p-2 hover:bg-neutral-100 rounded-full transition-colors cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>
            <div className="p-6">
              <FilterContent />
            </div>
            <div className="sticky bottom-0 bg-white border-t border-neutral-200 p-6">
              <button
                onClick={() => setMobileFiltersOpen(false)}
                className="w-full py-3 bg-black text-white text-sm font-medium hover:bg-neutral-800 transition-colors cursor-pointer"
              >
                Show {products.length} Results
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
