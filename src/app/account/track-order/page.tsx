"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Search, Package, ChevronLeft, CheckCircle, Clock, Truck, XCircle, RotateCcw } from "lucide-react";
import { useAuthStore } from "@/store/auth-store";

interface OrderItem {
  name: string;
  quantity: number;
  price: string;
  image: string | null;
}

interface Order {
  id: number;
  status: string;
  date_created: string;
  total: string;
  payment_method: string;
  items: OrderItem[];
  shipping_address: {
    first_name: string;
    last_name: string;
    address_1: string;
    city: string;
    state: string;
    postcode: string;
  };
  tracking_number: string | null;
  tracking_company: string | null;
}

const statusConfig: Record<string, { label: string; color: string; icon: any }> = {
  pending: { label: "Pending", color: "bg-yellow-100 text-yellow-700", icon: Clock },
  processing: { label: "Processing", color: "bg-blue-100 text-blue-700", icon: Package },
  "on-hold": { label: "On Hold", color: "bg-orange-100 text-orange-700", icon: Clock },
  completed: { label: "Delivered", color: "bg-green-100 text-green-700", icon: CheckCircle },
  cancelled: { label: "Cancelled", color: "bg-red-100 text-red-700", icon: XCircle },
  refunded: { label: "Refunded", color: "bg-purple-100 text-purple-700", icon: RotateCcw },
  failed: { label: "Failed", color: "bg-red-100 text-red-700", icon: XCircle },
};

export default function TrackOrderPage() {
  const [searchType, setSearchType] = useState<"email" | "order">("email");
  const [email, setEmail] = useState("");
  const [orderId, setOrderId] = useState("");
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [error, setError] = useState("");

  const { customer, isAuthenticated } = useAuthStore();

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSearched(true);

    try {
      const searchEmail = searchType === "email" ? email : (customer?.email || "");
      const searchOrderId = searchType === "order" ? orderId : "";

      if (!searchEmail && !searchOrderId) {
        setError("Please enter an email or order ID");
        setLoading(false);
        return;
      }

      const params = new URLSearchParams();
      if (searchEmail) params.append("email", searchEmail);
      if (searchOrderId) params.append("order_id", searchOrderId);

      const response = await fetch(`/api/auth/orders?${params.toString()}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch orders");
      }

      setOrders(data.orders || []);
    } catch (err: any) {
      setError(err.message || "Something went wrong");
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-50 via-white to-stone-100">
      <div className="bg-stone-900 text-white py-12">
        <div className="max-w-4xl mx-auto px-4">
          <Link href="/account" className="inline-flex items-center gap-2 text-stone-400 hover:text-white mb-6 transition-colors">
            <ChevronLeft size={20} />
            Back to Account
          </Link>
          <h1 className="text-3xl font-bold">Track Your Order</h1>
          <p className="text-stone-400 mt-2">Enter your order details to track your shipment</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 -mt-6">
        <div className="bg-white rounded-3xl shadow-xl p-8">
          <form onSubmit={handleSearch} className="space-y-6">
            <div className="flex gap-4 mb-6">
              <button
                type="button"
                onClick={() => setSearchType("email")}
                className={`flex-1 py-3 px-6 rounded-xl font-medium transition-all ${
                  searchType === "email"
                    ? "bg-stone-900 text-white"
                    : "bg-stone-100 text-stone-600 hover:bg-stone-200"
                }`}
              >
                Track by Email
              </button>
              <button
                type="button"
                onClick={() => setSearchType("order")}
                className={`flex-1 py-3 px-6 rounded-xl font-medium transition-all ${
                  searchType === "order"
                    ? "bg-stone-900 text-white"
                    : "bg-stone-100 text-stone-600 hover:bg-stone-200"
                }`}
              >
                Track by Order ID
              </button>
            </div>

            {searchType === "email" ? (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  value={isAuthenticated ? customer?.email || "" : email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-stone-900 focus:border-transparent outline-none transition-all"
                  readOnly={isAuthenticated}
                />
                {isAuthenticated && (
                  <p className="text-sm text-green-600 mt-2">Using your logged-in email</p>
                )}
              </div>
            ) : (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Order ID
                </label>
                <input
                  type="text"
                  value={orderId}
                  onChange={(e) => setOrderId(e.target.value)}
                  placeholder="Enter your order ID (e.g., 1234)"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-stone-900 focus:border-transparent outline-none transition-all"
                />
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-amber-500 to-orange-500 text-white py-4 rounded-xl font-semibold hover:from-amber-600 hover:to-orange-600 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Searching...
                </>
              ) : (
                <>
                  <Search size={20} />
                  Track Order
                </>
              )}
            </button>
          </form>

          {error && (
            <div className="mt-6 p-4 bg-red-50 text-red-600 rounded-xl text-center">
              {error}
            </div>
          )}
        </div>

        {searched && orders.length > 0 && (
          <div className="mt-8 space-y-6">
            <h2 className="text-2xl font-bold text-stone-900">Your Orders</h2>
            {orders.map((order) => {
              const status = statusConfig[order.status] || statusConfig.pending;
              const StatusIcon = status.icon;

              return (
                <div key={order.id} className="bg-white rounded-3xl shadow-xl overflow-hidden">
                  <div className="p-6 bg-gradient-to-r from-stone-50 to-stone-100 border-b border-stone-200">
                    <div className="flex flex-wrap items-center justify-between gap-4">
                      <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 ${status.color} rounded-xl flex items-center justify-center`}>
                          <StatusIcon size={24} />
                        </div>
                        <div>
                          <p className="font-bold text-stone-900">Order #{order.id}</p>
                          <p className="text-sm text-gray-500">
                            {new Date(order.date_created).toLocaleDateString("en-IN", {
                              day: "numeric",
                              month: "long",
                              year: "numeric",
                            })}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className={`inline-flex items-center gap-1 px-4 py-2 rounded-full text-sm font-medium ${status.color}`}>
                          <StatusIcon size={16} />
                          {status.label}
                        </span>
                        <p className="text-lg font-bold text-stone-900 mt-1">₹{order.total}</p>
                      </div>
                    </div>
                  </div>

                  <div className="p-6">
                    <h3 className="font-semibold text-stone-900 mb-4">Order Items</h3>
                    <div className="space-y-4">
                      {order.items.map((item, idx) => (
                        <div key={idx} className="flex items-center gap-4">
                          {item.image ? (
                            <div className="w-20 h-20 relative rounded-xl overflow-hidden flex-shrink-0">
                              <Image src={item.image} alt={item.name} fill className="object-cover" />
                            </div>
                          ) : (
                            <div className="w-20 h-20 bg-stone-100 rounded-xl flex items-center justify-center flex-shrink-0">
                              <Package size={24} className="text-stone-400" />
                            </div>
                          )}
                          <div className="flex-1">
                            <p className="font-medium text-stone-900">{item.name}</p>
                            <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                          </div>
                          <p className="font-semibold text-stone-900">₹{item.price}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {order.tracking_number && (
                    <div className="p-6 bg-green-50 border-t border-green-100">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                          <Truck size={24} className="text-green-600" />
                        </div>
                        <div>
                          <p className="text-sm text-green-600 font-medium">{order.tracking_company || "Tracking"}</p>
                          <p className="font-semibold text-stone-900">{order.tracking_number}</p>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="p-6 bg-stone-50 border-t border-stone-200">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-2">Shipping Address</h4>
                        <p className="text-stone-900">
                          {order.shipping_address.first_name} {order.shipping_address.last_name}
                        </p>
                        <p className="text-stone-600 text-sm">
                          {order.shipping_address.address_1}
                        </p>
                        <p className="text-stone-600 text-sm">
                          {order.shipping_address.city}, {order.shipping_address.state} - {order.shipping_address.postcode}
                        </p>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-2">Payment Method</h4>
                        <p className="text-stone-900">{order.payment_method}</p>
                        <p className="text-sm text-gray-500 mt-1">
                          Paid via {order.payment_method}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="p-6 flex flex-wrap gap-4">
                    <button className="flex-1 min-w-[150px] bg-stone-900 text-white py-3 rounded-xl font-medium hover:bg-stone-800 transition-colors">
                      View Details
                    </button>
                    <button className="flex-1 min-w-[150px] border-2 border-stone-300 text-stone-700 py-3 rounded-xl font-medium hover:bg-stone-50 transition-colors">
                      Reorder
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {searched && orders.length === 0 && !loading && !error && (
          <div className="mt-8 bg-white rounded-3xl shadow-xl p-12 text-center">
            <Package size={64} className="mx-auto text-stone-300 mb-4" />
            <h3 className="text-xl font-bold text-stone-900 mb-2">No Orders Found</h3>
            <p className="text-gray-500">We couldn't find any orders with the provided details.</p>
          </div>
        )}
      </div>
    </div>
  );
}
