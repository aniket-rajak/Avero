'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { User, LogOut, UserCircle, ShoppingBag } from 'lucide-react';
import { useAuth } from '@/components/providers/AuthProvider';

export default function UserMenu() {
  const { user, logout, isLoading } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    setIsOpen(false);
  };

  if (isLoading) {
    return (
      <div className="cursor-pointer p-2 hover:bg-neutral-100 rounded-full transition-colors">
        <User size={20} />
      </div>
    );
  }

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="cursor-pointer p-2 hover:bg-neutral-100 rounded-full transition-colors"
        aria-label="Account"
        aria-expanded={isOpen}
      >
        <User size={20} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white border border-neutral-200 shadow-lg z-50">
          {user ? (
            <>
              <div className="px-4 py-3 border-b border-neutral-100">
                <p className="text-sm font-medium truncate">{user.user_display_name}</p>
                <p className="text-xs text-neutral-500 truncate">{user.user_email}</p>
              </div>
              <Link
                href="/account"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-3 px-4 py-3 text-sm hover:bg-neutral-50 transition-colors cursor-pointer"
              >
                <UserCircle size={18} />
                Account
              </Link>
              <Link
                href="/cart"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-3 px-4 py-3 text-sm hover:bg-neutral-50 transition-colors cursor-pointer"
              >
                <ShoppingBag size={18} />
                My Cart
              </Link>
              <button
                onClick={handleLogout}
                className="flex items-center gap-3 w-full px-4 py-3 text-sm hover:bg-neutral-50 transition-colors cursor-pointer text-left"
              >
                <LogOut size={18} />
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                href="/account"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-3 px-4 py-3 text-sm hover:bg-neutral-50 transition-colors cursor-pointer"
              >
                <UserCircle size={18} />
                Login
              </Link>
              <Link
                href="/account"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-3 px-4 py-3 text-sm hover:bg-neutral-50 transition-colors cursor-pointer"
              >
                <User size={18} />
                Register
              </Link>
            </>
          )}
        </div>
      )}
    </div>
  );
}
