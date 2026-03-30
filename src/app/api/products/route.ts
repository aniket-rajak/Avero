import { NextResponse } from 'next/server';
import { Product } from '@/types/woocommerce';

const SAMPLE_PRODUCTS: Product[] = [
  {
    id: 1,
    name: 'Classic White T-Shirt',
    slug: 'classic-white-t-shirt',
    permalink: '#',
    price: '29.99',
    regular_price: '29.99',
    sale_price: '',
    stock_status: 'instock',
    stock_quantity: 50,
    description: '<p>Premium cotton white t-shirt</p>',
    short_description: '<p>Comfortable everyday wear</p>',
    categories: [{ id: 1, name: 'Men', slug: 'men' }],
    images: [{ id: 1, src: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500', name: 'White T-Shirt', alt: '' }],
    tags: [],
    attributes: [],
  },
  {
    id: 2,
    name: 'Slim Fit Jeans',
    slug: 'slim-fit-jeans',
    permalink: '#',
    price: '49.99',
    regular_price: '59.99',
    sale_price: '49.99',
    stock_status: 'instock',
    stock_quantity: 30,
    description: '<p>Modern slim fit denim jeans</p>',
    short_description: '<p>Perfect for any occasion</p>',
    categories: [{ id: 2, name: 'Women', slug: 'women' }],
    images: [{ id: 2, src: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=500', name: 'Jeans', alt: '' }],
    tags: [],
    attributes: [],
  },
  {
    id: 3,
    name: 'Leather Jacket',
    slug: 'leather-jacket',
    permalink: '#',
    price: '199.99',
    regular_price: '199.99',
    sale_price: '',
    stock_status: 'instock',
    stock_quantity: 15,
    description: '<p>Premium leather jacket</p>',
    short_description: '<p>Classic biker style</p>',
    categories: [{ id: 1, name: 'Men', slug: 'men' }],
    images: [{ id: 3, src: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=500', name: 'Leather Jacket', alt: '' }],
    tags: [],
    attributes: [],
  },
  {
    id: 4,
    name: 'Summer Dress',
    slug: 'summer-dress',
    permalink: '#',
    price: '59.99',
    regular_price: '79.99',
    sale_price: '59.99',
    stock_status: 'instock',
    stock_quantity: 25,
    description: '<p>Light and breezy summer dress</p>',
    short_description: '<p>Perfect for warm days</p>',
    categories: [{ id: 2, name: 'Women', slug: 'women' }],
    images: [{ id: 4, src: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=500', name: 'Summer Dress', alt: '' }],
    tags: [],
    attributes: [],
  },
  {
    id: 5,
    name: 'Running Sneakers',
    slug: 'running-sneakers',
    permalink: '#',
    price: '89.99',
    regular_price: '89.99',
    sale_price: '',
    stock_status: 'instock',
    stock_quantity: 40,
    description: '<p>Lightweight running sneakers</p>',
    short_description: '<p>Designed for performance</p>',
    categories: [{ id: 3, name: 'Footwear', slug: 'footwear' }],
    images: [{ id: 5, src: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500', name: 'Sneakers', alt: '' }],
    tags: [],
    attributes: [],
  },
  {
    id: 6,
    name: 'Cotton Hoodie',
    slug: 'cotton-hoodie',
    permalink: '#',
    price: '49.99',
    regular_price: '49.99',
    sale_price: '39.99',
    stock_status: 'instock',
    stock_quantity: 35,
    description: '<p>Cozy cotton hoodie</p>',
    short_description: '<p>Perfect for layering</p>',
    categories: [{ id: 1, name: 'Men', slug: 'men' }],
    images: [{ id: 6, src: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=500', name: 'Hoodie', alt: '' }],
    tags: [],
    attributes: [],
  },
  {
    id: 7,
    name: 'Floral Blouse',
    slug: 'floral-blouse',
    permalink: '#',
    price: '34.99',
    regular_price: '34.99',
    sale_price: '',
    stock_status: 'instock',
    stock_quantity: 28,
    description: '<p>Elegant floral print blouse</p>',
    short_description: '<p>Office to evening wear</p>',
    categories: [{ id: 2, name: 'Women', slug: 'women' }],
    images: [{ id: 7, src: 'https://images.unsplash.com/photo-1564257631407-4deb1f99d992?w=500', name: 'Blouse', alt: '' }],
    tags: [],
    attributes: [],
  },
  {
    id: 8,
    name: 'Denim Jacket',
    slug: 'denim-jacket',
    permalink: '#',
    price: '79.99',
    regular_price: '79.99',
    sale_price: '69.99',
    stock_status: 'instock',
    stock_quantity: 20,
    description: '<p>Classic denim jacket</p>',
    short_description: '<p>Timeless style</p>',
    categories: [{ id: 1, name: 'Men', slug: 'men' }],
    images: [{ id: 8, src: 'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=500', name: 'Denim Jacket', alt: '' }],
    tags: [],
    attributes: [],
  },
];

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const baseUrl = process.env.NEXT_PUBLIC_WOOCOMMERCE_URL;
    const key = process.env.WOOCOMMERCE_CONSUMER_KEY;
    const secret = process.env.WOOCOMMERCE_CONSUMER_SECRET;

    if (!baseUrl || !key || !secret) {
      return NextResponse.json(SAMPLE_PRODUCTS, { 
        headers: { 'X-WP-TotalPages': '1', 'X-Sample-Mode': 'true' } 
      });
    }

    const params = new URLSearchParams({
      consumer_key: key,
      consumer_secret: secret,
    });

    searchParams.forEach((value, key) => {
      if (key !== 'consumer_key' && key !== 'consumer_secret') {
        params.append(key, value);
      }
    });

    const response = await fetch(`${baseUrl}/wp-json/wc/v3/products?${params}`, {
      next: { revalidate: 60 },
    });

    if (!response.ok) {
      return NextResponse.json(SAMPLE_PRODUCTS, { 
        headers: { 'X-WP-TotalPages': '1', 'X-Sample-Mode': 'true' } 
      });
    }

    const data = await response.json();
    const totalPages = response.headers.get('X-WP-TotalPages') || '1';

    if (!Array.isArray(data) || data.length === 0) {
      return NextResponse.json(SAMPLE_PRODUCTS, { 
        headers: { 'X-WP-TotalPages': '1', 'X-Sample-Mode': 'true' } 
      });
    }

    return NextResponse.json(data, {
      headers: { 'X-WP-TotalPages': totalPages },
    });
  } catch (error) {
    return NextResponse.json(SAMPLE_PRODUCTS, { 
      headers: { 'X-WP-TotalPages': '1', 'X-Sample-Mode': 'true' } 
    });
  }
}
