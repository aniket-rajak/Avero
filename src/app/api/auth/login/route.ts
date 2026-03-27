import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    const woocommerceUrl = process.env.NEXT_PUBLIC_WOOCOMMERCE_URL;
    const consumerKey = process.env.NEXT_PUBLIC_WOOCOMMERCE_CONSUMER_KEY;
    const consumerSecret = process.env.NEXT_PUBLIC_WOOCOMMERCE_CONSUMER_SECRET;

    const credentials = Buffer.from(`${consumerKey}:${consumerSecret}`).toString("base64");

    const response = await fetch(
      `${woocommerceUrl}/wp-json/wc/v3/customers?email=${encodeURIComponent(email)}`,
      {
        headers: {
          Authorization: `Basic ${credentials}`,
        },
      }
    );

    const customers = await response.json();

    if (!customers || customers.length === 0) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }

    const customer = customers[0];

    const verifyResponse = await fetch(
      `${woocommerceUrl}/wp-json/wc/v3/customers/${customer.id}`,
      {
        headers: {
          Authorization: `Basic ${credentials}`,
        },
      }
    );

    const verifyCustomer = await verifyResponse.json();

    return NextResponse.json({
      customer: {
        id: verifyCustomer.id,
        email: verifyCustomer.email,
        first_name: verifyCustomer.first_name,
        last_name: verifyCustomer.last_name,
        username: verifyCustomer.username,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { error: "Login failed" },
      { status: 500 }
    );
  }
}
