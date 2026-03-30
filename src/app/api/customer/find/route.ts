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
    const email = searchParams.get('email');

    if (!email) {
      return NextResponse.json({ error: 'Email required' }, { status: 400 });
    }

    const params = new URLSearchParams({
      consumer_key: key,
      consumer_secret: secret,
      email: email,
    });

    const response = await fetch(`${baseUrl}/wp-json/wc/v3/customers?${params}`, {
      headers: { 'Content-Type': 'application/json' },
    });

    if (!response.ok) {
      return NextResponse.json({ error: 'Failed to search customer' }, { status: response.status });
    }

    const customers = await response.json();
    
    if (Array.isArray(customers) && customers.length > 0) {
      return NextResponse.json(customers[0]);
    }

    return NextResponse.json(null);
  } catch (error) {
    console.error('Customer search error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
