'use client';

import { useEffect, useState } from 'react';
import { use } from 'react';
import ProductDetails from '@/components/product/ProductDetails';
import { Product } from '@/types/woocommerce';

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export default function ProductPage({ params }: ProductPageProps) {
  const { slug } = use(params);
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchProduct() {
      try {
        const res = await fetch(`/api/products/${encodeURIComponent(slug)}`);
        const data = await res.json();

        if (res.ok && data && data.id) {
          setProduct(data);
        } else {
          setError(data.error || 'Product not found');
        }
      } catch (err) {
        console.error('Error fetching product:', err);
        setError('Failed to load product');
      } finally {
        setLoading(false);
      }
    }

    if (slug) {
      fetchProduct();
    }
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black" />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-4">
        <h1 className="text-3xl font-bold mb-4">Product Not Found</h1>
        <p className="text-neutral-500 mb-8 text-center">{error || 'The product you are looking for does not exist.'}</p>
        <a href="/shop" className="bg-black text-white px-8 py-3 text-sm tracking-wide hover:bg-neutral-800 transition-colors">
          Return to Shop
        </a>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <ProductDetails product={product} />
    </div>
  );
}
