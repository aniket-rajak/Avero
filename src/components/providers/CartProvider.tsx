'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Product, CartItem } from '@/types/woocommerce';

interface CartContextType {
  items: CartItem[];
  addItem: (product: Product, quantity?: number, variationId?: number) => void;
  removeItem: (productId: number, variationId?: number) => void;
  updateQuantity: (productId: number, quantity: number, variationId?: number) => void;
  clearCart: () => void;
  itemCount: number;
  subtotal: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem('cart');
    if (saved) {
      try {
        setItems(JSON.parse(saved));
      } catch {
        setItems([]);
      }
    }
  }, []);

  useEffect(() => {
    if (mounted) {
      localStorage.setItem('cart', JSON.stringify(items));
    }
  }, [items, mounted]);

  const addItem = (product: Product, quantity = 1, variationId?: number) => {
    setItems(prev => {
      const existingIndex = prev.findIndex(
        item => item.product.id === product.id && item.variationId === variationId
      );

      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex].quantity += quantity;
        return updated;
      }

      return [...prev, { product, quantity, variationId }];
    });
  };

  const removeItem = (productId: number, variationId?: number) => {
    setItems(prev => prev.filter(
      item => !(item.product.id === productId && item.variationId === variationId)
    ));
  };

  const updateQuantity = (productId: number, quantity: number, variationId?: number) => {
    if (quantity <= 0) {
      removeItem(productId, variationId);
      return;
    }

    setItems(prev => prev.map(item => {
      if (item.product.id === productId && item.variationId === variationId) {
        return { ...item, quantity };
      }
      return item;
    }));
  };

  const clearCart = () => setItems([]);

  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = items.reduce((sum, item) => {
    const price = parseFloat(item.product.price || '0');
    return sum + (price * item.quantity);
  }, 0);

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, updateQuantity, clearCart, itemCount, subtotal }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within CartProvider');
  }
  return context;
}
