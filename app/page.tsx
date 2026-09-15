'use client';

import { useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

export default function HomePage() {
  const [parentName, setParentName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleSubmitInquiry = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setStatusMessage(null);

    const { error } = await supabase.from('inquiries').insert([
      {
        parent_name: parentName,
        email,
        phone,
        message,
        status: 'pending',
      },
    ]);

    setSubmitting(false);

    if (error) {
      setStatusMessage({ type: 'error', text: 'Failed to send inquiry. Please try again.' });
    } else {
      setStatusMessage({ type: 'success', text: 'Thank you! Your inquiry has been sent.' });
      setParentName('');
      setEmail('');
      setPhone('');
      setMessage('');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col">
      {/* Header */}
      <header className="w-full bg-white border-b border-slate-200 py-4 px-8 flex justify-between items-center shadow-sm">
        <h1 className="text-xl font-bold text-blue-600">
          Lovely Souls Learning Hub
        </h1>
        <Link 
          href="/owner/login" 
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded-md text-sm transition-colors"
        >
          Owner Portal
        </Link>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-4xl mx-auto flex flex-col items-center text-center px-4 py-12">
        <h2 className="text-4xl font-extrabold tracking-tight text-slate-900 mb-4">
          Welcome to Lovely Souls Learning Hub
        </h2>
        <p className="text-lg text-slate-600 max-w-2xl mb-12">
          Connecting families with quality early childhood development programs and local learning centers.
        </p>

        {/* Parent Inquiry Form */}
        <div className="w-full max-w-md bg-white border border-slate-200 rounded-2xl p-6 shadow-sm text-left">
          <h3 className="text-xl font-bold text-slate-900 mb-1">Inquire About Enrollment</h3>
          <p className="text-sm text-slate-500 mb-6">Send a direct message to our admissions team.</p>

          {statusMessage && (
            <div
              className={`p-3 rounded-lg text-sm mb-4 ${
                statusMessage.type === 'success'
                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                  : 'bg-red-50 text-red-700 border border-red-200'
              }`}
            >
              {statusMessage.text}
            </div>
          )}

          <form onSubmit={handleSubmitInquiry} className="flex flex-col gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Parent Name</label>
              <input
                type="text"
                value={parentName}
                onChange={(e) => setParentName(e.target.value)}
                className="w-full border border-slate-300 rounded-lg p-2.5 text-sm text-slate-900 focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., Jane Doe"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border border-slate-300 rounded-lg p-2.5 text-sm text-slate-900 focus:ring-2 focus:ring-blue-500"
                placeholder="jane@example.com"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Phone Number</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full border border-slate-300 rounded-lg p-2.5 text-sm text-slate-900 focus:ring-2 focus:ring-blue-500"
                placeholder="+27 82 123 4567"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Message</label>
              <textarea
                rows={3}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full border border-slate-300 rounded-lg p-2.5 text-sm text-slate-900 focus:ring-2 focus:ring-blue-500"
                placeholder="How can we help your child?"
                required
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 rounded-lg text-sm transition-colors disabled:opacity-50 mt-2"
            >
              {submitting ? 'Sending Inquiry...' : 'Submit Inquiry'}
            </button>
          </form>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full bg-white border-t border-slate-200 py-6 text-center text-sm text-slate-500">
        © {new Date().getFullYear()} Lovely Souls Learning Hub. All rights reserved.
      </footer>
    </div>
  );
}