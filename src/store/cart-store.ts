import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { CartItem, CartState, Product } from "@/lib/types";

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (product: Product, quantity = 1) => {
        const existingItem = get().items.find(
          (item) => item.product_id === product.id
        );

        if (existingItem) {
          set((state) => ({
            items: state.items.map((item) =>
              item.product_id === product.id
                ? { ...item, quantity: item.quantity + quantity }
                : item
            ),
          }));
        } else {
          const newItem: CartItem = {
            id: Date.now(),
            product_id: product.id,
            name: product.name,
            price: parseFloat(product.price),
            quantity,
            image: product.images[0]?.src || "",
          };
          set((state) => ({ items: [...state.items, newItem] }));
        }
      },

      removeItem: (productId: number) => {
        set((state) => ({
          items: state.items.filter((item) => item.product_id !== productId),
        }));
      },

      updateQuantity: (productId: number, quantity: number) => {
        if (quantity <= 0) {
          get().removeItem(productId);
          return;
        }
        set((state) => ({
          items: state.items.map((item) =>
            item.product_id === productId ? { ...item, quantity } : item
          ),
        }));
      },

      clearCart: () => {
        set({ items: [] });
      },

      totalItems: () => {
        return get().items.reduce((sum, item) => sum + item.quantity, 0);
      },

      totalPrice: () => {
        return get().items.reduce(
          (sum, item) => sum + item.price * item.quantity,
          0
        );
      },
    }),
    {
      name: "cart-storage",
    }
  )
);
