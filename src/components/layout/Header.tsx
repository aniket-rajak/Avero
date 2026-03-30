'use client';

import Link from 'next/link';
import { ShoppingBag, Search, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { useCart } from '@/components/providers/CartProvider';
import SearchModal from './SearchModal';
import UserMenu from './UserMenu';

export default function Header() {
  const { itemCount } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-neutral-100">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="cursor-pointer lg:hidden p-2 -ml-2"
              aria-label="Menu"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>

            <div className="flex items-center">
              <Link href="/" className="cursor-pointer text-2xl font-bold tracking-wider">
                AVERO
              </Link>
            </div>

            <div className="hidden lg:flex items-center space-x-8">
              <Link href="/shop" className="cursor-pointer text-sm tracking-wide hover:text-neutral-600 transition-colors">
                NEW IN
              </Link>
              <Link href="/shop?category=women" className="cursor-pointer text-sm tracking-wide hover:text-neutral-600 transition-colors">
                WOMEN
              </Link>
              <Link href="/shop?category=men" className="cursor-pointer text-sm tracking-wide hover:text-neutral-600 transition-colors">
                MEN
              </Link>
              <Link href="/shop" className="cursor-pointer text-sm tracking-wide hover:text-neutral-600 transition-colors">
                SALE
              </Link>
            </div>

            <div className="flex items-center space-x-4">
              <button
                onClick={() => setSearchOpen(true)}
                className="cursor-pointer p-2 hover:bg-neutral-100 rounded-full transition-colors"
                aria-label="Search"
              >
                <Search size={20} />
              </button>
              <UserMenu />
              <Link href="/cart" className="cursor-pointer p-2 hover:bg-neutral-100 rounded-full transition-colors relative" aria-label="Cart">
                <ShoppingBag size={20} />
                {itemCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-black text-white text-xs flex items-center justify-center rounded-full">
                    {itemCount}
                  </span>
                )}
              </Link>
            </div>
          </div>
        </nav>

        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-neutral-100 bg-white">
            <div className="px-4 py-6 space-y-4">
              <Link href="/shop" className="cursor-pointer block text-lg tracking-wide" onClick={() => setMobileMenuOpen(false)}>
                NEW IN
              </Link>
              <Link href="/shop?category=women" className="cursor-pointer block text-lg tracking-wide" onClick={() => setMobileMenuOpen(false)}>
                WOMEN
              </Link>
              <Link href="/shop?category=men" className="cursor-pointer block text-lg tracking-wide" onClick={() => setMobileMenuOpen(false)}>
                MEN
              </Link>
              <Link href="/shop" className="cursor-pointer block text-lg tracking-wide" onClick={() => setMobileMenuOpen(false)}>
                SALE
              </Link>
            </div>
          </div>
        )}
      </header>

      <SearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
