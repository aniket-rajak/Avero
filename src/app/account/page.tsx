"use client";

import { useAuthStore } from "@/store/auth-store";
import Link from "next/link";
import { User, Package, MapPin, Settings, LogOut, ChevronRight, Clock } from "lucide-react";

export default function AccountPage() {
  const { customer, isAuthenticated, logout } = useAuthStore();

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-stone-100 to-stone-200">
        <div className="text-center bg-white p-12 rounded-3xl shadow-2xl max-w-md">
          <div className="w-20 h-20 bg-stone-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <User size={40} className="text-stone-600" />
          </div>
          <h2 className="text-2xl font-bold text-stone-900 mb-4">Welcome Back</h2>
          <p className="text-gray-600 mb-8">Sign in to access your Avero account, track orders, and more.</p>
          <Link
            href="/login"
            className="inline-flex items-center justify-center gap-2 bg-stone-900 text-white px-8 py-3 rounded-lg hover:bg-stone-800 transition-colors font-medium"
          >
            Sign In
            <ChevronRight size={18} />
          </Link>
        </div>
      </div>
    );
  }

  const menuItems = [
    {
      icon: Package,
      title: "My Orders",
      description: "Track, return or buy again",
      href: "/cart",
      color: "bg-blue-50 text-blue-600",
    },
    {
      icon: MapPin,
      title: "Addresses",
      description: "Manage delivery addresses",
      href: "/account/#",
      color: "bg-green-50 text-green-600",
    },
    {
      icon: Settings,
      title: "Edit Profile",
      description: "Update personal details",
      href: "/account/#",
      color: "bg-purple-50 text-purple-600",
    },
    {
      icon: Clock,
      title: "Track Order",
      description: "Check your order status",
      href: "/account/track-order",
      color: "bg-amber-50 text-amber-600",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-50 via-white to-stone-100">
      <div className="bg-stone-900 text-white py-16">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex items-center gap-6">
            <div className="w-24 h-24 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center text-4xl font-bold text-white shadow-xl">
              {customer?.first_name?.charAt(0)?.toUpperCase()}
              {customer?.last_name?.charAt(0)?.toUpperCase()}
            </div>
            <div>
              <h1 className="text-3xl font-bold">
                {customer?.first_name} {customer?.last_name}
              </h1>
              <p className="text-stone-400 mt-1">{customer?.email}</p>
              <div className="flex items-center gap-2 mt-3">
                <span className="px-3 py-1 bg-amber-500/20 text-amber-300 text-xs font-medium rounded-full">
                  Premium Member
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 -mt-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {menuItems.map((item) => (
            <Link
              key={item.title}
              href={item.href}
              className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group"
            >
              <div className={`w-14 h-14 ${item.color} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                <item.icon size={28} />
              </div>
              <h3 className="text-lg font-semibold text-stone-900 mb-1">{item.title}</h3>
              <p className="text-sm text-gray-500">{item.description}</p>
              <div className="mt-4 flex items-center text-stone-900 text-sm font-medium group-hover:gap-2 transition-all">
                <span>Access</span>
                <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-10 bg-white rounded-3xl shadow-xl overflow-hidden">
          <div className="p-8 border-b border-stone-100">
            <h2 className="text-2xl font-bold text-stone-900">Profile Information</h2>
            <p className="text-gray-500 mt-1">Your personal details</p>
          </div>
          <div className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <label className="text-sm font-medium text-gray-500 uppercase tracking-wider">First Name</label>
                <p className="text-lg text-stone-900 mt-1">{customer?.first_name || "Not set"}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500 uppercase tracking-wider">Last Name</label>
                <p className="text-lg text-stone-900 mt-1">{customer?.last_name || "Not set"}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500 uppercase tracking-wider">Email</label>
                <p className="text-lg text-stone-900 mt-1">{customer?.email}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500 uppercase tracking-wider">Username</label>
                <p className="text-lg text-stone-900 mt-1">@{customer?.username}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-col sm:flex-row gap-4">
          <Link
            href="/shop"
            className="flex-1 text-center bg-stone-900 text-white py-4 rounded-xl font-medium hover:bg-stone-800 transition-colors"
          >
            Continue Shopping
          </Link>
          <button
            onClick={logout}
            className="flex-1 flex items-center justify-center gap-2 bg-red-50 text-red-600 py-4 rounded-xl font-medium hover:bg-red-100 transition-colors"
          >
            <LogOut size={18} />
            Sign Out
          </button>
        </div>
      </div>
    </div>
  );
}
