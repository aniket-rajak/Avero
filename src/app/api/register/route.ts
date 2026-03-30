import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { username, email, password, first_name, last_name } = await request.json();
    const baseUrl = process.env.NEXT_PUBLIC_WOOCOMMERCE_URL;
    const key = process.env.WOOCOMMERCE_CONSUMER_KEY;
    const secret = process.env.WOOCOMMERCE_CONSUMER_SECRET;

    if (!baseUrl || !key || !secret) {
      return NextResponse.json(
        { success: false, error: 'WooCommerce not configured' },
        { status: 500 }
      );
    }

    const wooCustomerResponse = await fetch(`${baseUrl}/wp-json/wc/v3/customers?consumer_key=${key}&consumer_secret=${secret}&email=${encodeURIComponent(email)}`);
    const existingCustomers = await wooCustomerResponse.json();
    
    if (Array.isArray(existingCustomers) && existingCustomers.length > 0) {
      return NextResponse.json(
        { success: false, error: 'An account with this email already exists' },
        { status: 400 }
      );
    }

    const createCustomerResponse = await fetch(`${baseUrl}/wp-json/wc/v3/customers?consumer_key=${key}&consumer_secret=${secret}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: email,
        first_name: first_name || username,
        last_name: last_name || '',
        username: username,
        password: password,
        billing: {
          first_name: first_name || username,
          last_name: last_name || '',
          email: email,
        },
        shipping: {
          first_name: first_name || username,
          last_name: last_name || '',
        },
      }),
    });

    if (!createCustomerResponse.ok) {
      const errorData = await createCustomerResponse.json();
      const errorMessage = errorData?.message || 'Failed to create account';
      return NextResponse.json(
        { success: false, error: errorMessage },
        { status: createCustomerResponse.status }
      );
    }

    const customer = await createCustomerResponse.json();

    const loginResponse = await fetch(`${baseUrl}/wp-json/jwt-auth/v1/token`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: email, password }),
    });

    let token = null;
    if (loginResponse.ok) {
      const loginData = await loginResponse.json();
      token = loginData.token;
    }

    return NextResponse.json({
      success: true,
      customer_id: customer.id,
      token: token,
      user_email: customer.email,
      user_display_name: `${customer.first_name} ${customer.last_name}`.trim() || username,
    });
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { success: false, error: 'Network error. Please try again.' },
      { status: 500 }
    );
  }
}
