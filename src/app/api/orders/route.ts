import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_WOOCOMMERCE_URL;
    const key = process.env.WOOCOMMERCE_CONSUMER_KEY;
    const secret = process.env.WOOCOMMERCE_CONSUMER_SECRET;

    if (!baseUrl || !key || !secret) {
      return NextResponse.json({ error: 'WooCommerce not configured' }, { status: 500 });
    }

    const { searchParams } = new URL(request.url);
    const customerId = searchParams.get('customer_id');

    if (!customerId) {
      return NextResponse.json({ error: 'Customer ID required' }, { status: 400 });
    }

    const params = new URLSearchParams({
      consumer_key: key,
      consumer_secret: secret,
      customer: customerId,
      per_page: '10',
    });

    const response = await fetch(`${baseUrl}/wp-json/wc/v3/orders?${params}`, {
      headers: { 'Content-Type': 'application/json' },
    });

    if (!response.ok) {
      return NextResponse.json({ error: 'Failed to fetch orders' }, { status: response.status });
    }

    const orders = await response.json();
    return NextResponse.json(orders);
  } catch (error) {
    console.error('Orders fetch error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
