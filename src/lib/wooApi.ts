import { Product, ProductCategory } from '@/types/woocommerce';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const WC_URL = process.env.NEXT_PUBLIC_WOOCOMMERCE_URL;
const WC_PORT = process.env.NEXT_PUBLIC_WOOCOMMERCE_PORT;
const CONSUMER_KEY = process.env.WOOCOMMERCE_CONSUMER_KEY;
const CONSUMER_SECRET = process.env.WOOCOMMERCE_CONSUMER_SECRET;

const BASE_URL = WC_PORT 
  ? `${WC_URL}:${WC_PORT}/wp-json/wc/v3`
  : `${WC_URL}/wp-json/wc/v3`;

async function fetchWooCommerce<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const url = new URL(`${BASE_URL}${endpoint}`);
  url.searchParams.append('consumer_key', CONSUMER_KEY || '');
  url.searchParams.append('consumer_secret', CONSUMER_SECRET || '');

  const response = await fetch(url.toString(), {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  if (!response.ok) {
    throw new Error(`WooCommerce API Error: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

export async function getProducts(params?: {
  per_page?: number;
  page?: number;
  category?: string;
  search?: string;
  orderby?: string;
  order?: 'asc' | 'desc';
}): Promise<{ products: Product[]; totalPages: number }> {
  const queryParams = new URLSearchParams();
  
  if (params?.per_page) queryParams.append('per_page', params.per_page.toString());
  if (params?.page) queryParams.append('page', params.page.toString());
  if (params?.category) queryParams.append('category', params.category);
  if (params?.search) queryParams.append('search', params.search);
  if (params?.orderby) queryParams.append('orderby', params.orderby);
  if (params?.order) queryParams.append('order', params.order);

  const products = await fetchWooCommerce<Product[]>(`/products?${queryParams.toString()}`);
  
  const totalPagesHeader = products.length > 0 ? 100 : 0;
  
  return { products, totalPages: totalPagesHeader };
}

export async function getProduct(id: number): Promise<Product> {
  return fetchWooCommerce<Product>(`/products/${id}`);
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const { products } = await getProducts({ search: slug });
  return products.find(p => p.slug === slug) || null;
}

export async function getCategories(): Promise<ProductCategory[]> {
  return fetchWooCommerce<ProductCategory[]>('/products/categories?per_page=100');
}

export async function getFeaturedProducts(): Promise<Product[]> {
  const { products } = await getProducts({ per_page: 8, orderby: 'popularity' });
  return products;
}

export async function getNewArrivals(): Promise<Product[]> {
  const { products } = await getProducts({ per_page: 8, orderby: 'date', order: 'desc' });
  return products;
}
