import { NextResponse } from 'next/server';
import { Product } from '@/types/woocommerce';

const WC_URL = process.env.NEXT_PUBLIC_WOOCOMMERCE_URL;
const WC_PORT = process.env.NEXT_PUBLIC_WOOCOMMERCE_PORT;
const CONSUMER_KEY = process.env.WOOCOMMERCE_CONSUMER_KEY;
const CONSUMER_SECRET = process.env.WOOCOMMERCE_CONSUMER_SECRET;

const BASE_URL = WC_PORT 
  ? `${WC_URL}:${WC_PORT}/wp-json/wc/v3`
  : `${WC_URL}/wp-json/wc/v3`;

export async function GET(
  request: Request,
  context: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await context.params;
    const cleanSlug = decodeURIComponent(slug);
    const productId = parseInt(cleanSlug);

    if (!WC_URL || !CONSUMER_KEY || !CONSUMER_SECRET) {
      return NextResponse.json({ error: 'WooCommerce not configured' }, { status: 503 });
    }

    let productData: Product | null = null;

    if (!isNaN(productId) && productId > 0) {
      const numericRes = await fetch(
        `${BASE_URL}/products/${productId}?consumer_key=${CONSUMER_KEY}&consumer_secret=${CONSUMER_SECRET}`
      );
      if (numericRes.ok) {
        productData = await numericRes.json();
      }
    }

    if (!productData) {
      const slugRes = await fetch(
        `${BASE_URL}/products?consumer_key=${CONSUMER_KEY}&consumer_secret=${CONSUMER_SECRET}&slug=${encodeURIComponent(cleanSlug)}`
      );
      if (slugRes.ok) {
        const slugData = await slugRes.json();
        if (Array.isArray(slugData) && slugData.length > 0) {
          productData = slugData[0];
        }
      }
    }

    if (!productData) {
      const searchRes = await fetch(
        `${BASE_URL}/products?consumer_key=${CONSUMER_KEY}&consumer_secret=${CONSUMER_SECRET}&search=${encodeURIComponent(cleanSlug)}&per_page=100`
      );
      if (searchRes.ok) {
        const searchData = await searchRes.json();
        if (Array.isArray(searchData) && searchData.length > 0) {
          productData = searchData.find((p: Product) => p.slug === cleanSlug || p.slug === slug);
          if (!productData) productData = searchData[0];
        }
      }
    }

    if (productData && productData.id) {
      return NextResponse.json(productData);
    }

    return NextResponse.json({ error: 'Product not found' }, { status: 404 });
  } catch (error) {
    console.error('Error fetching product:', error);
    return NextResponse.json({ error: 'Failed to fetch product' }, { status: 500 });
  }
}
