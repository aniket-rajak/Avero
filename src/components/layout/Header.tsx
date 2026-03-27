"use client";

import Link from "next/link";
import { ShoppingBag, Search, Menu, X } from "lucide-react";
import { useState } from "react";
import { useCartStore } from "@/store/cart-store";
import { cn } from "@/lib/utils";

const navLinks = [
  { key: "new", href: "/shop", label: "New" },
  { key: "women", href: "/shop?category=women", label: "Women" },
  { key: "men", href: "/shop?category=men", label: "Men" },
  { key: "kids", href: "/shop?category=kids", label: "Kids" },
  { key: "sale", href: "/shop?sale=true", label: "Sale" },
];

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { totalItems } = useCartStore();
  const itemCount = totalItems();

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-border">
      <nav className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-8">
            <button
              className="lg:hidden p-2"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
            <Link
              href="/"
              className="text-2xl font-bold tracking-wider uppercase"
            >
              Store
            </Link>
            <div className="hidden lg:flex items-center gap-6">
              {navLinks.map((link) => (
                <Link
                  key={link.key}
                  href={link.href}
                  className={cn(
                    "text-sm uppercase tracking-wide transition-colors",
                    link.key === "sale" ? "text-red-600 hover:text-red-700" : "hover:text-accent"
                  )}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button className="p-2 hover:bg-muted rounded-full transition-colors">
              <Search size={20} />
            </button>
            <Link
              href="/cart"
              className="p-2 hover:bg-muted rounded-full transition-colors relative"
            >
              <ShoppingBag size={20} />
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-black text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                  {itemCount}
                </span>
              )}
            </Link>
          </div>
        </div>
      </nav>

      <div
        className={cn(
          "lg:hidden fixed inset-0 top-16 bg-white z-40 transition-transform duration-300",
          mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex flex-col p-6 gap-4">
          {navLinks.map((link) => (
            <Link
              key={link.key}
              href={link.href}
              className={cn(
                "text-lg uppercase tracking-wide py-2 border-b border-border transition-colors",
                link.key === "sale" ? "text-red-600" : "hover:text-accent"
              )}
              onClick={() => setMobileMenuOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/cart"
            className="text-lg uppercase tracking-wide py-2 border-b border-border"
            onClick={() => setMobileMenuOpen(false)}
          >
            Cart {itemCount > 0 && `(${itemCount})`}
          </Link>
        </div>
      </div>
    </header>
  );
}
