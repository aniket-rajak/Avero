import { NextResponse } from 'next/server';
import { ProductCategory } from '@/types/woocommerce';

const SAMPLE_CATEGORIES: ProductCategory[] = [
  { id: 1, name: 'Men', slug: 'men' },
  { id: 2, name: 'Women', slug: 'women' },
  { id: 3, name: 'Footwear', slug: 'footwear' },
  { id: 4, name: 'Accessories', slug: 'accessories' },
];

export async function GET() {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_WOOCOMMERCE_URL;
    const key = process.env.WOOCOMMERCE_CONSUMER_KEY;
    const secret = process.env.WOOCOMMERCE_CONSUMER_SECRET;

    if (!baseUrl || !key || !secret) {
      return NextResponse.json(SAMPLE_CATEGORIES);
    }

    const response = await fetch(
      `${baseUrl}/wp-json/wc/v3/products/categories?consumer_key=${key}&consumer_secret=${secret}&per_page=100`,
      { next: { revalidate: 60 } }
    );

    if (!response.ok) {
      return NextResponse.json(SAMPLE_CATEGORIES);
    }

    const data = await response.json();
    return NextResponse.json(Array.isArray(data) ? data : SAMPLE_CATEGORIES);
  } catch (error) {
    return NextResponse.json(SAMPLE_CATEGORIES);
  }
}
