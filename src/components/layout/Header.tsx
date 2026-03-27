"use client";

import Link from "next/link";
import Image from "next/image";
import { ShoppingBag, Search, Menu, X, User, Loader2, Package } from "lucide-react";
import { useState, useEffect, useRef, useCallback } from "react";
import { useCartStore } from "@/store/cart-store";
import { useAuthStore } from "@/store/auth-store";
import { cn } from "@/lib/utils";

interface SearchProduct {
  id: number;
  name: string;
  slug: string;
  price: string;
  regular_price: string;
  sale_price: string;
  on_sale: boolean;
  stock_status: string;
  image: string | null;
  categories: string[];
  permalink: string;
}

const navLinks = [
  { key: "new", href: "/shop", label: "New" },
  { key: "women", href: "/shop?category=women", label: "Women" },
  { key: "men", href: "/shop?category=men", label: "Men" },
  { key: "kids", href: "/shop?category=kids", label: "Kids" },
  { key: "sale", href: "/shop?sale=true", label: "Sale" },
];

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<SearchProduct[]>([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const { totalItems } = useCartStore();
  const { isAuthenticated, customer, logout } = useAuthStore();
  const itemCount = totalItems();
  const userMenuRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const handleLogout = () => {
    logout();
    setUserMenuOpen(false);
  };

  const searchProducts = useCallback(async (query: string) => {
    if (query.length < 2) {
      setSearchResults([]);
      return;
    }

    setSearchLoading(true);
    try {
      const response = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
      const data = await response.json();
      setSearchResults(data.products || []);
    } catch (error) {
      console.error("Search error:", error);
      setSearchResults([]);
    } finally {
      setSearchLoading(false);
    }
  }, []);

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      if (searchQuery) {
        searchProducts(searchQuery);
      } else {
        setSearchResults([]);
      }
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [searchQuery, searchProducts]);

  useEffect(() => {
    if (searchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [searchOpen]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setUserMenuOpen(false);
      }
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setSearchOpen(false);
        setSearchQuery("");
        setSearchResults([]);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setSearchOpen(false);
        setSearchQuery("");
        setSearchResults([]);
      }
    }
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, []);

  const closeSearch = () => {
    setSearchOpen(false);
    setSearchQuery("");
    setSearchResults([]);
  };

  return (
    <>
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
              <Link href="/" className="text-2xl font-bold tracking-wider uppercase">
                Avero
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
              <button
                className="p-2 hover:bg-muted rounded-full transition-colors"
                onClick={() => setSearchOpen(true)}
              >
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
              <div className="relative" ref={userMenuRef}>
                <button
                  className="p-2 hover:bg-muted rounded-full transition-colors"
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                >
                  <User size={20} />
                </button>
                <div
                  className={cn(
                    "absolute right-0 top-full mt-1 w-48 bg-white border border-border shadow-lg rounded-md overflow-hidden transition-opacity duration-200",
                    userMenuOpen ? "opacity-100 visible" : "opacity-0 invisible"
                  )}
                >
                  {isAuthenticated ? (
                    <>
                      <div className="px-4 py-3 border-b border-border">
                        <p className="text-sm font-medium">{customer?.first_name} {customer?.last_name}</p>
                        <p className="text-xs text-gray-500">{customer?.email}</p>
                      </div>
                      <Link
                        href="/account"
                        className="block px-4 py-2 text-sm hover:bg-muted transition-colors"
                        onClick={() => setUserMenuOpen(false)}
                      >
                        My Account
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2 text-sm hover:bg-muted transition-colors text-red-600"
                      >
                        Logout
                      </button>
                    </>
                  ) : (
                    <>
                      <Link
                        href="/login"
                        className="block px-4 py-2 text-sm hover:bg-muted transition-colors"
                        onClick={() => setUserMenuOpen(false)}
                      >
                        Login
                      </Link>
                      <Link
                        href="/register"
                        className="block px-4 py-2 text-sm hover:bg-muted transition-colors"
                        onClick={() => setUserMenuOpen(false)}
                      >
                        Register
                      </Link>
                    </>
                  )}
                </div>
              </div>
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

      {/* Search Modal */}
      <div
        ref={searchRef}
        className={cn(
          "fixed inset-0 z-[60] transition-all duration-300",
          searchOpen ? "opacity-100 visible" : "opacity-0 invisible pointer-events-none"
        )}
      >
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={closeSearch} />
        <div className="relative w-full max-w-3xl mx-auto mt-20 px-4">
          <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
            <div className="flex items-center border-b border-gray-100">
              <div className="flex-1 flex items-center px-4">
                <Search size={22} className="text-gray-400" />
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search for products..."
                  className="w-full px-4 py-5 text-lg outline-none placeholder:text-gray-400"
                />
                {searchLoading && <Loader2 size={20} className="animate-spin text-gray-400" />}
              </div>
              <button
                onClick={closeSearch}
                className="p-4 hover:bg-gray-50 transition-colors"
              >
                <X size={22} className="text-gray-500" />
              </button>
            </div>

            <div className="max-h-[60vh] overflow-y-auto">
              {searchQuery.length >= 2 && searchResults.length > 0 && (
                <div className="p-2">
                  <p className="px-4 py-2 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Products
                  </p>
                  {searchResults.map((product) => (
                    <Link
                      key={product.id}
                      href={`/product/${product.slug}`}
                      onClick={closeSearch}
                      className="flex items-center gap-4 p-3 hover:bg-gray-50 rounded-xl transition-colors group"
                    >
                      <div className="w-16 h-16 relative bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                        {product.image ? (
                          <Image
                            src={product.image}
                            alt={product.name}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Package size={24} className="text-gray-300" />
                          </div>
                        )}
                        {product.on_sale && (
                          <span className="absolute top-1 left-1 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded">
                            SALE
                          </span>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-gray-900 group-hover:text-stone-700 truncate">
                          {product.name}
                        </h4>
                        <div className="flex items-center gap-2 mt-1">
                          {product.categories.slice(0, 2).map((cat, idx) => (
                            <span key={idx} className="text-xs text-gray-500">
                              {cat}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div className="text-right flex-shrink-0">
                        {product.on_sale ? (
                          <div>
                            <span className="text-red-600 font-semibold">₹{product.sale_price}</span>
                            <span className="text-gray-400 text-sm line-through ml-2">₹{product.regular_price}</span>
                          </div>
                        ) : (
                          <span className="font-semibold text-gray-900">₹{product.price}</span>
                        )}
                      </div>
                    </Link>
                  ))}
                  <Link
                    href={`/shop?search=${encodeURIComponent(searchQuery)}`}
                    onClick={closeSearch}
                    className="flex items-center justify-center gap-2 p-4 text-sm font-medium text-stone-700 hover:bg-stone-50 rounded-xl transition-colors border-t border-gray-100 mt-2"
                  >
                    View all results for "{searchQuery}"
                    <Search size={16} />
                  </Link>
                </div>
              )}

              {searchQuery.length >= 2 && searchResults.length === 0 && !searchLoading && (
                <div className="p-12 text-center">
                  <Package size={48} className="mx-auto text-gray-300 mb-4" />
                  <p className="text-gray-500">No products found for "{searchQuery}"</p>
                  <p className="text-sm text-gray-400 mt-1">Try different keywords</p>
                </div>
              )}

              {searchQuery.length < 2 && (
                <div className="p-6">
                  <p className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-4">
                    Popular Categories
                  </p>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { name: "Women", slug: "women", image: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=200&q=80" },
                      { name: "Men", slug: "men", image: "https://images.unsplash.com/photo-1507680434567-5739c80be1ac?w=200&q=80" },
                      { name: "Accessories", slug: "accessories", image: "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?w=200&q=80" },
                      { name: "Sale", slug: "sale", image: "https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=200&q=80" },
                    ].map((cat) => (
                      <Link
                        key={cat.slug}
                        href={cat.slug === "sale" ? "/shop?sale=true" : `/shop?category=${cat.slug}`}
                        onClick={closeSearch}
                        className="relative h-24 rounded-xl overflow-hidden group"
                      >
                        <Image
                          src={cat.image}
                          alt={cat.name}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors" />
                        <span className="absolute inset-0 flex items-center justify-center text-white font-semibold">
                          {cat.name}
                        </span>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
