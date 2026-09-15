'use client';

import Link from 'next/link';

export default function Navbar() {
  return (
    <header className="w-full bg-white border-b border-slate-200 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-2xl font-extrabold text-blue-600 tracking-tight">
            Lovely Souls
          </span>
          <span className="hidden sm:inline-block text-xs bg-blue-100 text-blue-800 font-semibold px-2.5 py-0.5 rounded-full">
            Learning Hub
          </span>
        </Link>

        <nav className="flex items-center gap-6">
          <Link
            href="/"
            className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors"
          >
            Find Centers
          </Link>
          <Link
            href="/owner/login"
            className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors shadow-sm"
          >
            Owner Portal
          </Link>
        </nav>
      </div>
    </header>
  );
}