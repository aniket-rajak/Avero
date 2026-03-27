"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import { productsApi } from "@/lib/api";
import type { Product } from "@/lib/types";
import { formatPrice, stripHtml } from "@/lib/utils";
import { useCartStore } from "@/store/cart-store";
import { ShoppingBag, Minus, Plus, Check } from "lucide-react";

export default function ProductPage() {
  const params = useParams();
  const slug = params.slug as string;
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const { addItem } = useCartStore();

  useEffect(() => {
    async function fetchProduct() {
      try {
        const data = await productsApi.getBySlug(slug);
        setProduct(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchProduct();
  }, [slug]);

  const handleAddToCart = () => {
    if (product) {
      addItem(product, quantity);
      setAdded(true);
      setTimeout(() => setAdded(false), 2000);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-accent">Loading...</div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-accent">Product not found</p>
      </div>
    );
  }

  const imageUrl = product.images[0]?.src || "/placeholder.jpg";

  return (
    <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="grid lg:grid-cols-2 gap-12">
        {/* Image */}
        <div className="relative aspect-square bg-muted">
          <Image
            src={imageUrl}
            alt={product.name}
            fill
            className="object-cover"
            priority
          />
        </div>

        {/* Details */}
        <div className="space-y-6">
          <div>
            <p className="text-accent text-sm uppercase tracking-wider mb-2">
              {product.categories[0]?.name}
            </p>
            <h1 className="text-3xl font-bold">{product.name}</h1>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-2xl font-semibold">
              {formatPrice(product.price)}
            </span>
            {product.on_sale && product.regular_price && (
              <span className="text-lg text-accent line-through">
                {formatPrice(product.regular_price)}
              </span>
            )}
          </div>

          <div className="border-t border-border pt-6">
            <p className="text-accent leading-relaxed">
              {stripHtml(product.short_description || product.description.slice(0, 200))}
            </p>
          </div>

          {/* Quantity */}
          <div className="flex items-center gap-4">
            <span className="text-sm uppercase tracking-wider">Quantity</span>
            <div className="flex items-center border border-border">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="p-3 hover:bg-muted transition-colors"
              >
                <Minus size={16} />
              </button>
              <span className="w-12 text-center">{quantity}</span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="p-3 hover:bg-muted transition-colors"
              >
                <Plus size={16} />
              </button>
            </div>
          </div>

          {/* Add to Cart */}
          <button
            onClick={handleAddToCart}
            className="w-full bg-black text-white py-4 flex items-center justify-center gap-2 hover:bg-gray-800 transition-colors uppercase tracking-wide"
          >
            {added ? (
              <>
                <Check size={20} />
                Added to Cart
              </>
            ) : (
              <>
                <ShoppingBag size={20} />
                Add to Cart
              </>
            )}
          </button>

          {/* Stock Info */}
          <div className="text-sm text-accent">
            {product.stock_status === "instock" ? (
              <span>In Stock</span>
            ) : (
              <span className="text-red-500">Out of Stock</span>
            )}
          </div>

          {/* Full Description */}
          <div className="border-t border-border pt-6 space-y-4">
            <h3 className="text-sm uppercase tracking-wider font-semibold">
              Description
            </h3>
            <div
              className="text-accent leading-relaxed prose prose-sm"
              dangerouslySetInnerHTML={{ __html: product.description }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
