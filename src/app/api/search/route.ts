import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q");

    if (!query || query.length < 2) {
      return NextResponse.json({ products: [] });
    }

    const woocommerceUrl = process.env.NEXT_PUBLIC_WOOCOMMERCE_URL;
    const consumerKey = process.env.NEXT_PUBLIC_WOOCOMMERCE_CONSUMER_KEY;
    const consumerSecret = process.env.NEXT_PUBLIC_WOOCOMMERCE_CONSUMER_SECRET;

    const credentials = Buffer.from(`${consumerKey}:${consumerSecret}`).toString("base64");

    const response = await fetch(
      `${woocommerceUrl}/wp-json/wc/v3/products?search=${encodeURIComponent(query)}&per_page=10&status=publish`,
      {
        headers: {
          Authorization: `Basic ${credentials}`,
        },
      }
    );

    if (!response.ok) {
      return NextResponse.json(
        { error: "Failed to search products" },
        { status: response.status }
      );
    }

    const products = await response.json();

    const formattedProducts = products.map((product: any) => ({
      id: product.id,
      name: product.name,
      slug: product.slug,
      price: product.price,
      regular_price: product.regular_price,
      sale_price: product.sale_price,
      on_sale: product.on_sale,
      stock_status: product.stock_status,
      stock_quantity: product.stock_quantity,
      image: product.images?.[0]?.src || null,
      image_alt: product.images?.[0]?.alt || product.name,
      categories: product.categories?.map((cat: any) => cat.name) || [],
      permalink: product.permalink,
    }));

    return NextResponse.json({ products: formattedProducts });
  } catch (error) {
    console.error("Search error:", error);
    return NextResponse.json(
      { error: "Search failed" },
      { status: 500 }
    );
  }
}
