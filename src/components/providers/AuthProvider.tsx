'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { AuthUser, login as apiLogin, logout as apiLogout, register as apiRegister, validateToken, getWooCustomerByEmail } from '@/lib/auth';

interface AuthContextType {
  user: AuthUser | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  register: (username: string, email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  refreshCustomerId: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('auth_user');
    const token = localStorage.getItem('auth_token');
    const storedCustomerId = localStorage.getItem('woo_customer_id');
    
    if (storedUser && token) {
      // Check if it's a WooCommerce customer session (base64 encoded, not JWT)
      const isWooSession = token.length < 50 && !token.includes('.');
      
      if (isWooSession) {
        // WooCommerce customer session - just use it
        const parsedUser = JSON.parse(storedUser);
        setUser({ 
          ...parsedUser, 
          customer_id: storedCustomerId ? parseInt(storedCustomerId) : parsedUser.customer_id 
        });
        setIsLoading(false);
      } else {
        // JWT token - validate it
        validateToken(token).then(async (isValid) => {
          if (isValid) {
            const parsedUser = JSON.parse(storedUser);
            let customerId = storedCustomerId ? parseInt(storedCustomerId) : undefined;
            
            if (!customerId && parsedUser.user_email) {
              const wooCustomer = await getWooCustomerByEmail(parsedUser.user_email);
              if (wooCustomer) {
                customerId = wooCustomer.id;
                localStorage.setItem('woo_customer_id', customerId.toString());
              }
            }
            
            setUser({ ...parsedUser, customer_id: customerId });
          } else {
            localStorage.removeItem('auth_user');
            localStorage.removeItem('auth_token');
            localStorage.removeItem('woo_customer_id');
          }
          setIsLoading(false);
        });
      }
    } else {
      setIsLoading(false);
    }
  }, []);

  const refreshCustomerId = async () => {
    if (user?.user_email) {
      const wooCustomer = await getWooCustomerByEmail(user.user_email);
      if (wooCustomer) {
        localStorage.setItem('woo_customer_id', wooCustomer.id.toString());
        setUser(prev => prev ? { ...prev, customer_id: wooCustomer.id } : null);
      }
    }
  };

  const login = async (email: string, password: string) => {
    const response = await apiLogin(email, password);
    
    if (response.success && response.token) {
      const customerId = (response as { customer_id?: number }).customer_id;
      
      if (customerId) {
        localStorage.setItem('woo_customer_id', customerId.toString());
      }
      
      const userData: AuthUser = {
        token: response.token,
        user_email: response.user_email!,
        user_nicename: response.user_nicename!,
        user_display_name: response.user_display_name!,
        customer_id: customerId,
      };
      setUser(userData);
      localStorage.setItem('auth_user', JSON.stringify(userData));
      localStorage.setItem('auth_token', response.token);
      return { success: true };
    }
    
    return { success: false, error: response.error };
  };

  const logout = () => {
    apiLogout();
    setUser(null);
    localStorage.removeItem('auth_user');
    localStorage.removeItem('auth_token');
    localStorage.removeItem('woo_customer_id');
  };

  const register = async (username: string, email: string, password: string) => {
    const response = await apiRegister(username, email, password);
    
    if (response.success) {
      const userData: AuthUser = {
        token: response.token || '',
        user_email: response.user_email!,
        user_nicename: response.user_nicename || username,
        user_display_name: response.user_display_name!,
        customer_id: (response as { customer_id?: number }).customer_id,
      };
      setUser(userData);
      localStorage.setItem('auth_user', JSON.stringify(userData));
      if (response.token) {
        localStorage.setItem('auth_token', response.token);
      }
      if (userData.customer_id) {
        localStorage.setItem('woo_customer_id', userData.customer_id.toString());
      }
      return { success: true };
    }
    
    return { success: false, error: response.error };
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout, register, refreshCustomerId }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
