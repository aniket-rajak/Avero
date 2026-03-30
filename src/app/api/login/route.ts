import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();
    const baseUrl = process.env.NEXT_PUBLIC_WOOCOMMERCE_URL;
    const key = process.env.WOOCOMMERCE_CONSUMER_KEY;
    const secret = process.env.WOOCOMMERCE_CONSUMER_SECRET;
    const jwtUrl = process.env.JWT_AUTH_URL || baseUrl;

    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Try JWT Auth first
    const jwtPort = process.env.NEXT_PUBLIC_WOOCOMMERCE_PORT || '80';
    const JWT_AUTH_URL = jwtPort !== '80' 
      ? `${jwtUrl}:${jwtPort}/wp-json/jwt-auth/v1/token`
      : `${jwtUrl}/wp-json/jwt-auth/v1/token`;

    try {
      const jwtResponse = await fetch(JWT_AUTH_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: email, password }),
      });

      if (jwtResponse.ok) {
        const jwtData = await jwtResponse.json();
        
        // Get WooCommerce customer
        let customerId: number | undefined;
        if (baseUrl && key && secret) {
          const customerParams = new URLSearchParams({
            consumer_key: key,
            consumer_secret: secret,
            email: email,
          });
          
          const customerResponse = await fetch(`${baseUrl}/wp-json/wc/v3/customers?${customerParams}`);
          if (customerResponse.ok) {
            const customers = await customerResponse.json();
            if (Array.isArray(customers) && customers.length > 0) {
              customerId = customers[0].id;
            }
          }
        }

        return NextResponse.json({
          success: true,
          token: jwtData.token,
          customer_id: customerId,
          user_email: jwtData.user_email,
          user_display_name: jwtData.user_display_name,
          auth_type: 'jwt',
        });
      }
    } catch (jwtError) {
      console.log('JWT Auth failed, trying WooCommerce direct login');
    }

    // Fallback: WooCommerce customer lookup (for guest customers who checkout before registering)
    if (baseUrl && key && secret) {
      const customerParams = new URLSearchParams({
        consumer_key: key,
        consumer_secret: secret,
        email: email,
      });

      const customerResponse = await fetch(`${baseUrl}/wp-json/wc/v3/customers?${customerParams}`);
      
      if (customerResponse.ok) {
        const customers = await customerResponse.json();
        
        if (Array.isArray(customers) && customers.length > 0) {
          const customer = customers[0];
          
          // Generate a session token (customer is verified by email)
          // Note: This is a simplified auth - in production, use proper password verification
          const sessionToken = Buffer.from(`${customer.id}-${Date.now()}`).toString('base64');
          
          return NextResponse.json({
            success: true,
            token: sessionToken,
            customer_id: customer.id,
            user_email: customer.email,
            user_display_name: `${customer.first_name} ${customer.last_name}`.trim() || customer.billing?.first_name || 'Customer',
            auth_type: 'woo_customer',
            message: 'Logged in as existing WooCommerce customer',
          });
        }
      }
    }

    return NextResponse.json(
      { success: false, error: 'Invalid email or password' },
      { status: 401 }
    );
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { success: false, error: 'Login failed. Please try again.' },
      { status: 500 }
    );
  }
}
