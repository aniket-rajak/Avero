export interface Product {
  id: number;
  name: string;
  slug: string;
  permalink: string;
  price: string;
  regular_price: string;
  sale_price: string;
  stock_status: 'instock' | 'outofstock' | 'onbackorder';
  stock_quantity: number | null;
  description: string;
  short_description: string;
  categories: ProductCategory[];
  images: ProductImage[];
  tags: ProductTag[];
  attributes: ProductAttribute[];
  variations?: ProductVariation[];
}

export interface ProductCategory {
  id: number;
  name: string;
  slug: string;
}

export interface ProductImage {
  id: number;
  src: string;
  name: string;
  alt: string;
}

export interface ProductTag {
  id: number;
  name: string;
  slug: string;
}

export interface ProductAttribute {
  id: number;
  name: string;
  options: string[];
  variation: boolean;
}

export interface ProductVariation {
  id: number;
  price: string;
  attributes: { name: string; option: string }[];
}

export interface CartItem {
  product: Product;
  quantity: number;
  variationId?: number;
}

export interface Cart {
  items: CartItem[];
  subtotal: number;
  tax: number;
  total: number;
}

export interface Customer {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  billing: BillingAddress;
  shipping: ShippingAddress;
}

export interface BillingAddress {
  first_name: string;
  last_name: string;
  address_1: string;
  address_2: string;
  city: string;
  state: string;
  postcode: string;
  country: string;
  email: string;
  phone: string;
}

export interface ShippingAddress extends BillingAddress {}

export interface Order {
  id: number;
  status: string;
  total: string;
  date_created: string;
  line_items: LineItem[];
}

export interface LineItem {
  product_id: number;
  quantity: number;
  total: string;
}
