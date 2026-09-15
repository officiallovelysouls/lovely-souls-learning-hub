'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';

export default function OwnerLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setErrorMsg(error.message);
      setLoading(false);
    } else {
      window.location.href = '/owner/dashboard';
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center p-4">
      <div className="w-full max-w-md bg-white border border-slate-200 rounded-xl shadow-md p-8">
        <h1 className="text-2xl font-bold text-slate-900 mb-2 text-center">
          Owner Portal Login
        </h1>
        <p className="text-sm text-slate-500 text-center mb-6">
          Sign in to manage your Learning Hub center
        </p>

        {errorMsg && (
          <div className="bg-red-50 text-red-600 border border-red-200 text-sm p-3 rounded-md mb-4">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Email Address
            </label>
            <input
              type="email"
              placeholder="officiallovelysouls@gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-slate-300 rounded-md p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Password
            </label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-slate-300 rounded-md p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-md transition-colors text-sm disabled:opacity-50"
          >
            {loading ? 'Logging in...' : 'Sign In'}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-slate-500">
          <Link href="/" className="text-blue-600 hover:underline">
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}