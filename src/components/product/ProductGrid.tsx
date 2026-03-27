import type { Product } from "@/lib/types";

interface ProductGridProps {
  products: Product[];
}

export default function ProductGrid({ products }: ProductGridProps) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
      {products.map((product) => (
        <ProductGridItem key={product.id} product={product} />
      ))}
    </div>
  );
}

import ProductCard from "./ProductCard";

function ProductGridItem({ product }: { product: Product }) {
  return <ProductCard product={product} />;
}
