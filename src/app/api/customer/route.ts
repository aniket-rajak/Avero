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
    const customerId = searchParams.get('id');

    if (!customerId) {
      return NextResponse.json({ error: 'Customer ID required' }, { status: 400 });
    }

    const params = new URLSearchParams({
      consumer_key: key,
      consumer_secret: secret,
    });

    const response = await fetch(`${baseUrl}/wp-json/wc/v3/customers/${customerId}?${params}`, {
      headers: { 'Content-Type': 'application/json' },
    });

    if (!response.ok) {
      return NextResponse.json({ error: 'Failed to fetch customer' }, { status: response.status });
    }

    const customer = await response.json();
    return NextResponse.json(customer);
  } catch (error) {
    console.error('Customer fetch error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_WOOCOMMERCE_URL;
    const key = process.env.WOOCOMMERCE_CONSUMER_KEY;
    const secret = process.env.WOOCOMMERCE_CONSUMER_SECRET;

    if (!baseUrl || !key || !secret) {
      return NextResponse.json({ error: 'WooCommerce not configured' }, { status: 500 });
    }

    const body = await request.json();
    const customerId = body.id;

    if (!customerId) {
      return NextResponse.json({ error: 'Customer ID required' }, { status: 400 });
    }

    const customerData = {
      first_name: body.first_name,
      last_name: body.last_name,
      billing: body.billing,
      shipping: body.shipping,
    };

    const params = new URLSearchParams({
      consumer_key: key,
      consumer_secret: secret,
    });

    const response = await fetch(`${baseUrl}/wp-json/wc/v3/customers/${customerId}?${params}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(customerData),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return NextResponse.json({ error: 'Failed to update customer', details: errorData }, { status: response.status });
    }

    const customer = await response.json();
    return NextResponse.json(customer);
  } catch (error) {
    console.error('Customer update error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
