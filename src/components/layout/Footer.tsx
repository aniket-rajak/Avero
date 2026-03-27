import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-black text-white mt-20">
      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          <div>
            <h3 className="text-sm uppercase tracking-wider font-semibold mb-4">
              Help
            </h3>
            <ul className="space-y-2">
              <li>
                <Link href="#" className="text-sm text-gray-400 hover:text-white">
                  Customer Service
                </Link>
              </li>
              <li>
                <Link href="#" className="text-sm text-gray-400 hover:text-white">
                  Payment Methods
                </Link>
              </li>
              <li>
                <Link href="#" className="text-sm text-gray-400 hover:text-white">
                  Shipping
                </Link>
              </li>
              <li>
                <Link href="#" className="text-sm text-gray-400 hover:text-white">
                  Returns
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm uppercase tracking-wider font-semibold mb-4">
              Quick Links
            </h3>
            <ul className="space-y-2">
              <li>
                <Link href="/shop" className="text-sm text-gray-400 hover:text-white">
                  All Products
                </Link>
              </li>
              <li>
                <Link href="/cart" className="text-sm text-gray-400 hover:text-white">
                  Cart
                </Link>
              </li>
              <li>
                <Link href="/checkout" className="text-sm text-gray-400 hover:text-white">
                  Checkout
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm uppercase tracking-wider font-semibold mb-4">
              About
            </h3>
            <ul className="space-y-2">
              <li>
                <Link href="#" className="text-sm text-gray-400 hover:text-white">
                  Our Story
                </Link>
              </li>
              <li>
                <Link href="#" className="text-sm text-gray-400 hover:text-white">
                  Careers
                </Link>
              </li>
              <li>
                <Link href="#" className="text-sm text-gray-400 hover:text-white">
                  Sustainability
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm uppercase tracking-wider font-semibold mb-4">
              Connect
            </h3>
            <div className="flex gap-4">
              <Link href="#" className="text-gray-400 hover:text-white">
                Instagram
              </Link>
              <Link href="#" className="text-gray-400 hover:text-white">
                Twitter
              </Link>
              <Link href="#" className="text-gray-400 hover:text-white">
                Facebook
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-800 text-center">
          <p className="text-sm text-gray-400">
            &copy; {new Date().getFullYear()} Store. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
