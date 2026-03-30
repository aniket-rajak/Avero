import { NextResponse } from 'next/server';

interface OrderLineItem {
  product_id: number;
  quantity: number;
  variation_id?: number;
}

interface CreateOrderRequest {
  line_items: OrderLineItem[];
  billing: {
    first_name: string;
    last_name: string;
    address_1: string;
    address_2?: string;
    city: string;
    state: string;
    postcode: string;
    country: string;
    email: string;
    phone: string;
  };
  shipping: {
    first_name: string;
    last_name: string;
    address_1: string;
    address_2?: string;
    city: string;
    state: string;
    postcode: string;
    country: string;
  };
  payment_method: string;
  customer_note?: string;
}

export async function POST(request: Request) {
  try {
    const body: CreateOrderRequest = await request.json();
    const baseUrl = process.env.NEXT_PUBLIC_WOOCOMMERCE_URL;
    const key = process.env.WOOCOMMERCE_CONSUMER_KEY;
    const secret = process.env.WOOCOMMERCE_CONSUMER_SECRET;

    if (!baseUrl || !key || !secret) {
      return NextResponse.json(
        { error: 'WooCommerce not configured' },
        { status: 500 }
      );
    }

    const orderData = {
      payment_method: body.payment_method || 'bacs',
      payment_method_title: body.payment_method === 'cod' ? 'Cash on Delivery' : 'Direct Bank Transfer',
      set_paid: false,
      billing: body.billing,
      shipping: body.shipping,
      line_items: body.line_items.map(item => ({
        product_id: item.product_id,
        quantity: item.quantity,
        variation_id: item.variation_id,
      })),
      customer_note: body.customer_note || false,
    };

    const response = await fetch(`${baseUrl}/wp-json/wc/v3/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...orderData,
        consumer_key: key,
        consumer_secret: secret,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return NextResponse.json(
        { error: 'Failed to create order', details: errorData },
        { status: response.status }
      );
    }

    const order = await response.json();
    return NextResponse.json(order);
  } catch (error) {
    console.error('Checkout error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
