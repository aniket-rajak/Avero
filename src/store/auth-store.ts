import { create } from "zustand";
import { persist } from "zustand/middleware";

interface Customer {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  username: string;
}

interface AuthState {
  customer: Customer | null;
  isAuthenticated: boolean;
  setCustomer: (customer: Customer | null) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      customer: null,
      isAuthenticated: false,

      setCustomer: (customer) =>
        set({
          customer,
          isAuthenticated: customer !== null,
        }),

      logout: () =>
        set({
          customer: null,
          isAuthenticated: false,
        }),
    }),
    {
      name: "auth-storage",
    }
  )
);
