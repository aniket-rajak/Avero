const JWT_URL = process.env.JWT_AUTH_URL || 'http://localhost';
const JWT_PORT = process.env.NEXT_PUBLIC_WOOCOMMERCE_PORT || '80';
const JWT_SECRET = process.env.JWT_AUTH_SECRET_KEY;

const AUTH_URL = JWT_PORT !== '80' 
  ? `${JWT_URL}:${JWT_PORT}/wp-json/jwt-auth/v1`
  : `${JWT_URL}/wp-json/jwt-auth/v1`;

export interface AuthUser {
  token: string;
  user_email: string;
  user_nicename: string;
  user_display_name: string;
  customer_id?: number;
}

export interface WooCustomer {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  username: string;
  billing: BillingAddress;
  shipping: ShippingAddress;
}

export interface BillingAddress {
  first_name: string;
  last_name: string;
  company: string;
  address_1: string;
  address_2: string;
  city: string;
  state: string;
  postcode: string;
  country: string;
  phone: string;
}

export interface ShippingAddress {
  first_name: string;
  last_name: string;
  company: string;
  address_1: string;
  address_2: string;
  city: string;
  state: string;
  postcode: string;
  country: string;
}

export interface Order {
  id: number;
  status: string;
  number: string;
  date_created: string;
  total: string;
  line_items: LineItem[];
  billing: BillingAddress;
  shipping: ShippingAddress;
}

export interface LineItem {
  id: number;
  name: string;
  product_id: number;
  quantity: number;
  total: string;
  price: number;
}

export interface AuthResponse {
  success: boolean;
  status: number;
  token?: string;
  user_email?: string;
  user_nicename?: string;
  user_display_name?: string;
  error?: string;
}

export async function login(email: string, password: string): Promise<AuthResponse & { customer_id?: number }> {
  try {
    const response = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      return { 
        success: false, 
        status: response.status, 
        error: data.error || 'Login failed' 
      };
    }

    return {
      success: true,
      status: 200,
      token: data.token,
      customer_id: data.customer_id,
      user_email: data.user_email,
      user_nicename: data.user_email?.split('@')[0] || 'user',
      user_display_name: data.user_display_name,
    };
  } catch {
    return { success: false, status: 500, error: 'Network error' };
  }
}

export async function validateToken(token: string): Promise<boolean> {
  try {
    const response = await fetch(`${AUTH_URL}/token/validate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    const data = await response.json();
    return data.code === 'jwt_auth_valid_token';
  } catch {
    return false;
  }
}

export function logout(): void {
  localStorage.removeItem('auth_token');
  localStorage.removeItem('auth_user');
  localStorage.removeItem('woo_customer_id');
}

export async function register(
  username: string, 
  email: string, 
  password: string,
  firstName?: string,
  lastName?: string
): Promise<AuthResponse & { customer_id?: number }> {
  try {
    const response = await fetch('/api/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        username, 
        email, 
        password,
        first_name: firstName,
        last_name: lastName
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      return { 
        success: false, 
        status: response.status, 
        error: data.error || 'Registration failed' 
      };
    }

    return {
      success: true,
      status: 200,
      token: data.token || null,
      customer_id: data.customer_id,
      user_email: data.user_email || email,
      user_nicename: username,
      user_display_name: data.user_display_name || username,
    };
  } catch {
    return { success: false, status: 500, error: 'Network error' };
  }
}

export async function getWooCustomerByEmail(email: string): Promise<WooCustomer | null> {
  try {
    const response = await fetch(`/api/customer/find?email=${encodeURIComponent(email)}`);
    if (!response.ok) return null;
    const data = await response.json();
    return data.id ? data : null;
  } catch {
    return null;
  }
}

export async function getWooCustomer(customerId: number): Promise<WooCustomer | null> {
  try {
    const response = await fetch(`/api/customer?id=${customerId}`);
    if (!response.ok) return null;
    return await response.json();
  } catch {
    return null;
  }
}

export async function getWooCustomerOrders(customerId: number): Promise<Order[]> {
  try {
    const response = await fetch(`/api/orders?customer_id=${customerId}`);
    if (!response.ok) return [];
    return await response.json();
  } catch {
    return [];
  }
}

export async function updateWooCustomer(customerId: number, data: Partial<WooCustomer>): Promise<WooCustomer | null> {
  try {
    const response = await fetch('/api/customer', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: customerId, ...data }),
    });
    if (!response.ok) return null;
    return await response.json();
  } catch {
    return null;
  }
}
