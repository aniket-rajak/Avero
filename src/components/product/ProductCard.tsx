"use client";

import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/lib/types";
import { formatPrice } from "@/lib/utils";
import { ShoppingBag } from "lucide-react";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const imageUrl = product.images[0]?.src || "/placeholder.jpg";
  const productUrl = `/product/${product.slug}`;

  return (
    <Link href={productUrl} className="group block">
      <div className="relative overflow-hidden bg-muted aspect-[3/4] mb-4">
        <Image
          src={imageUrl}
          alt={product.name}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
        />
        {product.on_sale && (
          <span className="absolute top-4 left-4 bg-black text-white text-xs px-3 py-1 uppercase">
            Sale
          </span>
        )}
        <div className="absolute bottom-0 left-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <button className="w-full bg-white text-black py-3 flex items-center justify-center gap-2 hover:bg-gray-100 transition-colors">
            <ShoppingBag size={18} />
            <span className="text-sm uppercase tracking-wide">Quick Add</span>
          </button>
        </div>
      </div>
      <div className="space-y-1">
        <h3 className="text-sm font-medium truncate">{product.name}</h3>
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold">
            {formatPrice(product.price)}
          </span>
          {product.on_sale && product.regular_price && (
            <span className="text-sm text-accent line-through">
              {formatPrice(product.regular_price)}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
