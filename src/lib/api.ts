import axios, { AxiosInstance } from "axios";
import type { Product } from "./types";

const WOOCOMMERCE_URL = process.env.NEXT_PUBLIC_WOOCOMMERCE_URL || "";
const CK = process.env.NEXT_PUBLIC_WOOCOMMERCE_CONSUMER_KEY || "";
const CS = process.env.NEXT_PUBLIC_WOOCOMMERCE_CONSUMER_SECRET || "";

console.log("🔧 WooCommerce Config:", {
  url: WOOCOMMERCE_URL,
  hasKey: !!CK && CK !== "YOUR_WC_CONSUMER_KEY_HERE",
  hasSecret: !!CS && CS !== "YOUR_WC_CONSUMER_SECRET_HERE",
});

const api: AxiosInstance = axios.create({
  baseURL: `${WOOCOMMERCE_URL}/wp-json/wc/v3`,
  params: {
    consumer_key: CK,
    consumer_secret: CS,
  },
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("❌ API Error:", {
      status: error.response?.status,
      message: error.message,
      url: error.config?.url,
    });
    return Promise.reject(error);
  }
);

export const productsApi = {
  getAll: async (params?: {
    per_page?: number;
    page?: number;
    category?: number;
    search?: string;
    status?: string;
  }): Promise<Product[]> => {
    console.log("📦 Fetching products...");
    const response = await api.get<Product[]>("/products", { params });
    console.log(`✅ Got ${response.data.length} products`);
    return response.data;
  },

  getBySlug: async (slug: string): Promise<Product | null> => {
    console.log("📦 Fetching product by slug:", slug);
    const response = await api.get<Product[]>("/products", {
      params: { slug },
    });
    return response.data[0] || null;
  },

  getById: async (id: number): Promise<Product | null> => {
    console.log("📦 Fetching product by ID:", id);
    const response = await api.get<Product>(`/products/${id}`);
    return response.data;
  },
};

export const categoriesApi = {
  getAll: async () => {
    console.log("📂 Fetching categories...");
    const response = await api.get("/products/categories", {
      params: { per_page: 100 },
    });
    console.log(`✅ Got ${response.data.length} categories`);
    return response.data;
  },
};

export const ordersApi = {
  create: async (orderData: any) => {
    console.log("📝 Creating order...");
    const response = await api.post("/orders", orderData);
    console.log("✅ Order created:", response.data.id);
    return response.data;
  },
};

export const testConnection = async (): Promise<{
  success: boolean;
  message: string;
  productCount?: number;
}> => {
  try {
    console.log("🔍 Testing WooCommerce connection...");
    
    if (!CK || CK === "YOUR_WC_CONSUMER_KEY_HERE" || !CS || CS === "YOUR_WC_CONSUMER_SECRET_HERE") {
      return {
        success: false,
        message: "❌ API keys not configured. Please update .env.local with real WooCommerce API keys.",
      };
    }

    const response = await api.get("/products", { params: { per_page: 1 } });
    return {
      success: true,
      message: "✅ Connected to WooCommerce successfully!",
      productCount: Number(response.headers["x-wp-total"] || response.data.length),
    };
  } catch (error: any) {
    if (error.response?.status === 401) {
      return {
        success: false,
        message: "❌ Invalid API keys. Please check your Consumer Key and Secret.",
      };
    }
    if (error.response?.status === 404) {
      return {
        success: false,
        message: "❌ API endpoint not found. Check your WooCommerce URL.",
      };
    }
    return {
      success: false,
      message: `❌ Connection failed: ${error.message}`,
    };
  }
};

export default api;
