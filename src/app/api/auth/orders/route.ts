import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get("email");
    const orderId = searchParams.get("order_id");

    if (!email && !orderId) {
      return NextResponse.json(
        { error: "Email or Order ID is required" },
        { status: 400 }
      );
    }

    const woocommerceUrl = process.env.NEXT_PUBLIC_WOOCOMMERCE_URL;
    const consumerKey = process.env.NEXT_PUBLIC_WOOCOMMERCE_CONSUMER_KEY;
    const consumerSecret = process.env.NEXT_PUBLIC_WOOCOMMERCE_CONSUMER_SECRET;

    const credentials = Buffer.from(`${consumerKey}:${consumerSecret}`).toString("base64");

    let url = `${woocommerceUrl}/wp-json/wc/v3/orders?per_page=20`;
    
    if (orderId) {
      url = `${woocommerceUrl}/wp-json/wc/v3/orders/${orderId}`;
    } else if (email) {
      url += `&customer=${encodeURIComponent(email)}`;
    }

    const response = await fetch(url, {
      headers: {
        Authorization: `Basic ${credentials}`,
      },
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: "Failed to fetch orders" },
        { status: response.status }
      );
    }

    const orders = await response.json();

    const formattedOrders = Array.isArray(orders) 
      ? orders.map((order: any) => ({
          id: order.id,
          status: order.status,
          date_created: order.date_created,
          total: order.total,
          payment_method: order.payment_method_title,
          items: order.line_items.map((item: any) => ({
            name: item.name,
            quantity: item.quantity,
            price: item.price,
            image: item.image?.src || null,
          })),
          shipping_address: order.shipping,
          billing_address: order.billing,
          tracking_number: order.meta_data?.find((m: any) => m.key === "_tracking_number")?.value || null,
          tracking_company: order.meta_data?.find((m: any) => m.key === "_tracking_company")?.value || null,
        }))
      : [{
          id: orders.id,
          status: orders.status,
          date_created: orders.date_created,
          total: orders.total,
          payment_method: orders.payment_method_title,
          items: orders.line_items.map((item: any) => ({
            name: item.name,
            quantity: item.quantity,
            price: item.price,
            image: item.image?.src || null,
          })),
          shipping_address: orders.shipping,
          billing_address: orders.billing,
          tracking_number: orders.meta_data?.find((m: any) => m.key === "_tracking_number")?.value || null,
          tracking_company: orders.meta_data?.find((m: any) => m.key === "_tracking_company")?.value || null,
        }];

    return NextResponse.json({ orders: formattedOrders });
  } catch (error) {
    console.error("Error fetching orders:", error);
    return NextResponse.json(
      { error: "Failed to fetch orders" },
      { status: 500 }
    );
  }
}
