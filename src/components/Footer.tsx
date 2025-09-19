import Link from 'next/link'
import { Instagram, Twitter, Facebook } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-gray-50 border-t">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="py-12 md:flex md:items-center md:justify-between">
          <div className="flex justify-center space-x-6 md:order-2">
            <Link href="#" className="text-gray-400 hover:text-brand-red">
              <span className="sr-only">Instagram</span>
              <Instagram className="h-6 w-6" />
            </Link>
            <Link href="#" className="text-gray-400 hover:text-brand-red">
              <span className="sr-only">Twitter</span>
              <Twitter className="h-6 w-6" />
            </Link>
            <Link href="#" className="text-gray-400 hover:text-brand-red">
              <span className="sr-only">Facebook</span>
              <Facebook className="h-6 w-6" />
            </Link>
          </div>
          <div className="mt-8 md:order-1 md:mt-0">
            <div className="flex justify-center space-x-8 md:justify-start">
              <Link
                href="/about"
                className="text-sm text-gray-600 hover:text-brand-red"
              >
                About
              </Link>
              <Link
                href="/contact"
                className="text-sm text-gray-600 hover:text-brand-red"
              >
                Contact
              </Link>
              <Link
                href="/privacy"
                className="text-sm text-gray-600 hover:text-brand-red"
              >
                Privacy
              </Link>
              <Link
                href="/terms"
                className="text-sm text-gray-600 hover:text-brand-red"
              >
                Terms
              </Link>
            </div>
            <p className="mt-4 text-center text-sm text-gray-600 md:text-left">
              &copy; 2024 What's Eating Nashville. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
