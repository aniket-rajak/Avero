'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { User, Package, Heart, LogOut, ChevronRight, Loader2 } from 'lucide-react';
import { useAuth } from '@/components/providers/AuthProvider';
import { getWooCustomerOrders, getWooCustomer, WooCustomer, Order } from '@/lib/auth';

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

function formatPrice(price: string) {
  return `₹${parseFloat(price).toFixed(2)}`;
}

function getStatusColor(status: string) {
  switch (status) {
    case 'completed':
      return 'bg-green-100 text-green-700';
    case 'processing':
      return 'bg-blue-100 text-blue-700';
    case 'pending':
      return 'bg-yellow-100 text-yellow-700';
    case 'cancelled':
    case 'refunded':
      return 'bg-red-100 text-red-700';
    case 'on-hold':
      return 'bg-orange-100 text-orange-700';
    default:
      return 'bg-neutral-100 text-neutral-700';
  }
}

export default function ProfilePage() {
  const router = useRouter();
  const { user, logout, isLoading } = useAuth();
  const [customer, setCustomer] = useState<WooCustomer | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loadingData, setLoadingData] = useState(true);
  const [showAllOrders, setShowAllOrders] = useState(false);

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/account');
    }
  }, [user, isLoading, router]);

  useEffect(() => {
    async function fetchData() {
      if (user?.customer_id) {
        setLoadingData(true);
        const [customerData, ordersData] = await Promise.all([
          getWooCustomer(user.customer_id),
          getWooCustomerOrders(user.customer_id),
        ]);
        setCustomer(customerData);
        setOrders(ordersData);
        setLoadingData(false);
      } else {
        setLoadingData(false);
      }
    }
    if (user) {
      fetchData();
    }
  }, [user]);

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  if (isLoading || !user) {
    return null;
  }

  const displayedOrders = showAllOrders ? orders : orders.slice(0, 3);
  const displayName = customer 
    ? `${customer.first_name} ${customer.last_name}`.trim() 
    : user.user_display_name;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl md:text-3xl font-bold tracking-wider mb-8">MY ACCOUNT</h1>

      <div className="grid md:grid-cols-3 gap-8">
        <div>
          <div className="bg-neutral-50 p-6 mb-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-black text-white rounded-full flex items-center justify-center">
                <User size={24} />
              </div>
              <div>
                <p className="font-medium">{displayName || 'Guest'}</p>
                <p className="text-sm text-neutral-500">{user.user_email}</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 text-sm text-neutral-500 hover:text-black transition-colors cursor-pointer"
            >
              <LogOut size={16} />
              Sign Out
            </button>
          </div>

          <nav className="space-y-2">
            <a href="#orders" className="flex items-center gap-3 p-3 bg-neutral-50 hover:bg-neutral-100 transition-colors">
              <Package size={20} />
              <span>My Orders</span>
            </a>
            <a href="#wishlist" className="flex items-center gap-3 p-3 hover:bg-neutral-50 transition-colors">
              <Heart size={20} />
              <span>Wishlist</span>
            </a>
            <Link href="/account" className="flex items-center gap-3 p-3 hover:bg-neutral-50 transition-colors">
              <User size={20} />
              <span>Profile</span>
            </Link>
          </nav>
        </div>

        <div className="md:col-span-2">
          <section id="orders" className="bg-white border border-neutral-200 p-6 mb-6">
            <h2 className="text-lg font-bold tracking-wider mb-4">MY ORDERS</h2>
            
            {loadingData ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 size={24} className="animate-spin text-neutral-400" />
              </div>
            ) : orders.length === 0 ? (
              <div className="text-center py-8">
                <Package size={48} className="mx-auto mb-4 text-neutral-300" />
                <p className="text-neutral-500 mb-4">No orders yet</p>
                <Link
                  href="/shop"
                  className="inline-block bg-black text-white px-6 py-3 text-sm tracking-wider hover:bg-neutral-800 transition-colors cursor-pointer"
                >
                  START SHOPPING
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {displayedOrders.map((order) => (
                  <div key={order.id} className="border border-neutral-200 p-4 hover:border-neutral-300 transition-colors">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-4">
                        <span className="text-sm font-medium">Order #{order.number}</span>
                        <span className={`px-2 py-1 text-xs rounded-full capitalize ${getStatusColor(order.status)}`}>
                          {order.status}
                        </span>
                      </div>
                      <span className="text-sm text-neutral-500">{formatDate(order.date_created)}</span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="text-sm text-neutral-600">
                        {order.line_items.length} item{order.line_items.length > 1 ? 's' : ''}
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="font-medium">{formatPrice(order.total)}</span>
                        <ChevronRight size={18} className="text-neutral-400" />
                      </div>
                    </div>
                  </div>
                ))}
                
                {orders.length > 3 && (
                  <button
                    onClick={() => setShowAllOrders(!showAllOrders)}
                    className="w-full py-3 text-sm text-neutral-600 hover:text-black transition-colors cursor-pointer"
                  >
                    {showAllOrders ? 'Show Less' : `View All ${orders.length} Orders`}
                  </button>
                )}
              </div>
            )}
          </section>

          <section className="bg-white border border-neutral-200 p-6">
            <h2 className="text-lg font-bold tracking-wider mb-4">ACCOUNT DETAILS</h2>
            
            {loadingData ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 size={24} className="animate-spin text-neutral-400" />
              </div>
            ) : customer ? (
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-sm text-neutral-500 mb-2">Contact Information</h3>
                  <p className="font-medium">{customer.first_name} {customer.last_name}</p>
                  <p className="text-sm text-neutral-600">{customer.email}</p>
                  {customer.billing.phone && (
                    <p className="text-sm text-neutral-600">{customer.billing.phone}</p>
                  )}
                </div>
                
                <div>
                  <h3 className="text-sm text-neutral-500 mb-2">Billing Address</h3>
                  {customer.billing.address_1 ? (
                    <>
                      <p className="text-sm">
                        {customer.billing.address_1}
                        {customer.billing.address_2 && `, ${customer.billing.address_2}`}
                      </p>
                      <p className="text-sm">
                        {customer.billing.city}, {customer.billing.state} {customer.billing.postcode}
                      </p>
                    </>
                  ) : (
                    <p className="text-sm text-neutral-500">No billing address saved</p>
                  )}
                </div>
                
                <div>
                  <h3 className="text-sm text-neutral-500 mb-2">Shipping Address</h3>
                  {customer.shipping.address_1 ? (
                    <>
                      <p className="text-sm">
                        {customer.shipping.first_name} {customer.shipping.last_name}
                      </p>
                      <p className="text-sm">
                        {customer.shipping.address_1}
                        {customer.shipping.address_2 && `, ${customer.shipping.address_2}`}
                      </p>
                      <p className="text-sm">
                        {customer.shipping.city}, {customer.shipping.state} {customer.shipping.postcode}
                      </p>
                    </>
                  ) : (
                    <p className="text-sm text-neutral-500">No shipping address saved</p>
                  )}
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <label className="text-sm text-neutral-500">Name</label>
                  <p className="font-medium">{user.user_display_name}</p>
                </div>
                <div>
                  <label className="text-sm text-neutral-500">Email</label>
                  <p className="font-medium">{user.user_email}</p>
                </div>
                <p className="text-sm text-neutral-500 mt-4">
                  WooCommerce account not linked yet. Place an order to link your account.
                </p>
              </div>
            )}
            
            <button className="mt-6 text-sm hover:underline cursor-pointer">
              Edit Profile
            </button>
          </section>
        </div>
      </div>
    </div>
  );
}
