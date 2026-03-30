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
        const baseUrl = process.env.NEXT_PUBLIC_WOOCOMMERCE_URL;
        const key = process.env.WOOCOMMERCE_CONSUMER_KEY;
        const secret = process.env.WOOCOMMERCE_CONSUMER_SECRET;

        const productId = parseInt(slug);
        let url = `${baseUrl}/wp-json/wc/v3/products?consumer_key=${key}&consumer_secret=${secret}&slug=${slug}`;

        if (!isNaN(productId)) {
          url = `${baseUrl}/wp-json/wc/v3/products/${productId}?consumer_key=${key}&consumer_secret=${secret}`;
        }

        const res = await fetch(url);
        const data = await res.json();

        if (Array.isArray(data) && data.length > 0) {
          setProduct(data[0]);
        } else if (data.id) {
          setProduct(data);
        } else {
          setError('Product not found');
        }
      } catch (err) {
        setError('Failed to load product');
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchProduct();
  }, [slug]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black" />
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <h1 className="text-2xl font-bold mb-4">Product Not Found</h1>
        <p className="text-neutral-500 mb-8">{error || 'The product you are looking for does not exist.'}</p>
        <a href="/shop" className="text-sm hover:underline">Return to Shop</a>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <ProductDetails product={product} />
    </div>
  );
}
