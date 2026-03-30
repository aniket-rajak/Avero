import type { Metadata } from "next";
import { DM_Sans } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";
import { CartProvider } from "@/components/providers/CartProvider";
import { AuthProvider } from "@/components/providers/AuthProvider";

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "AVERO | Modern Fashion",
  description: "Discover the latest trends in fashion at AVERO. Shop new arrivals, women's and men's collections.",
  icons: {
    icon: [
      {
        url: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>A</text></svg>",
        type: "image/svg+xml",
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body className={`${dmSans.variable} h-full font-sans antialiased`}>
        <AuthProvider>
          <CartProvider>
          <Header />
          <main className="pt-16 flex-1">{children}</main>
          <footer className="bg-neutral-900 text-white py-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                <div>
                  <h2 className="text-2xl font-bold tracking-wider mb-4">AVERO</h2>
                  <p className="text-neutral-400 text-sm">Modern fashion for the contemporary wardrobe.</p>
                </div>
                <div>
                  <h3 className="font-medium mb-4 tracking-wider text-sm">SHOP</h3>
                  <ul className="space-y-2 text-sm text-neutral-400">
                    <li><a href="/shop" className="hover:text-white transition-colors">New In</a></li>
                    <li><a href="/shop?category=women" className="hover:text-white transition-colors">Women</a></li>
                    <li><a href="/shop?category=men" className="hover:text-white transition-colors">Men</a></li>
                    <li><a href="/shop" className="hover:text-white transition-colors">Sale</a></li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-medium mb-4 tracking-wider text-sm">HELP</h3>
                  <ul className="space-y-2 text-sm text-neutral-400">
                    <li><a href="#" className="hover:text-white transition-colors">Contact Us</a></li>
                    <li><a href="#" className="hover:text-white transition-colors">Shipping</a></li>
                    <li><a href="#" className="hover:text-white transition-colors">Returns</a></li>
                    <li><a href="#" className="hover:text-white transition-colors">Size Guide</a></li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-medium mb-4 tracking-wider text-sm">FOLLOW US</h3>
                  <ul className="space-y-2 text-sm text-neutral-400">
                    <li><a href="#" className="hover:text-white transition-colors">Instagram</a></li>
                    <li><a href="#" className="hover:text-white transition-colors">Facebook</a></li>
                    <li><a href="#" className="hover:text-white transition-colors">Pinterest</a></li>
                  </ul>
                </div>
              </div>
              <div className="border-t border-neutral-800 mt-12 pt-8 text-sm text-neutral-400">
                <p>&copy; {new Date().getFullYear()} AVERO. All rights reserved. Proudly designed and developed by Four I. Special thanks to ANIKET RAJAK</p>
              </div>
            </div>
          </footer>
        </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
