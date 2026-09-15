'use client';

import { useEffect, useState, use } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

interface Center {
  id: string;
  name: string;
  address: string;
  phone: string;
  capacity: number;
  description: string;
}

export default function CenterDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const centerId = resolvedParams.id;

  const [center, setCenter] = useState<Center | null>(null);
  const [loading, setLoading] = useState(true);

  // Inquiry Form State
  const [parentName, setParentName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    async function fetchCenterDetails() {
      setLoading(true);
      const { data, error } = await supabase
        .from('centers')
        .select('*')
        .eq('id', centerId)
        .single();

      if (!error && data) {
        setCenter(data as Center);
      } else {
        // Fallback demo center if ID isn't in DB yet
        setCenter({
          id: centerId,
          name: 'Lovely Souls Early Learning Hub',
          address: '123 Primary Street, Vanderbijlpark, Gauteng',
          phone: '+27 11 987 6543',
          capacity: 45,
          description:
            'Lovely Souls Early Learning Hub provides a safe, engaging, and structured environment for toddlers and preschoolers. Our curriculum covers literacy, numeracy, creative arts, and foundational motor development with certified staff.',
        });
      }
      setLoading(false);
    }

    fetchCenterDetails();
  }, [centerId]);

  const handleSubmitInquiry = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setStatusMessage(null);

    const { error } = await supabase.from('inquiries').insert([
      {
        center_id: center?.id,
        parent_name: parentName,
        email,
        phone,
        message,
        status: 'pending',
      },
    ]);

    setSubmitting(false);

    if (error) {
      setStatusMessage({ type: 'error', text: 'Failed to submit inquiry. Please try again.' });
    } else {
      setStatusMessage({ type: 'success', text: 'Inquiry submitted successfully! The owner will contact you shortly.' });
      setParentName('');
      setEmail('');
      setPhone('');
      setMessage('');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col justify-between">
        <Navbar />
        <div className="py-20 text-center text-slate-500">Loading center details...</div>
        <Footer />
      </div>
    );
  }

  if (!center) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col justify-between">
        <Navbar />
        <div className="py-20 text-center">
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Center Not Found</h2>
          <Link href="/" className="text-blue-600 hover:underline text-sm">
            ← Return to Homepage
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between">
      <div>
        <Navbar />

        {/* Back Link Header */}
        <div className="max-w-7xl mx-auto px-6 pt-6">
          <Link href="/" className="text-sm font-semibold text-blue-600 hover:underline flex items-center gap-1">
            ← Back to all centers
          </Link>
        </div>

        {/* Main Content Layout */}
        <main className="max-w-7xl mx-auto px-6 py-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Center Info */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm">
              <span className="text-xs bg-emerald-100 text-emerald-800 font-semibold px-3 py-1 rounded-full uppercase tracking-wider">
                Accredited Hub
              </span>
              <h1 className="text-3xl font-extrabold text-slate-900 mt-3 mb-2">{center.name}</h1>
              <p className="text-sm text-slate-500 mb-6 flex items-center gap-2">
                📍 {center.address}
              </p>

              <div className="grid grid-cols-2 gap-4 border-y border-slate-100 py-4 mb-6">
                <div>
                  <p className="text-xs text-slate-400 uppercase font-semibold">Contact Phone</p>
                  <p className="text-sm font-bold text-slate-800 mt-0.5">{center.phone}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-400 uppercase font-semibold">Student Capacity</p>
                  <p className="text-sm font-bold text-slate-800 mt-0.5">{center.capacity} Children</p>
                </div>
              </div>

              <h2 className="text-lg font-bold text-slate-900 mb-2">About Our Program</h2>
              <p className="text-slate-600 text-sm leading-relaxed">{center.description}</p>
            </div>
          </div>

          {/* Right Column: Inquiry Form Card */}
          <div className="lg:col-span-1">
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm sticky top-24">
              <h2 className="text-xl font-bold text-slate-900 mb-1">Inquire for Admission</h2>
              <p className="text-xs text-slate-500 mb-6">Send a message directly to {center.name}.</p>

              {statusMessage && (
                <div
                  className={`p-3 rounded-lg text-xs mb-4 ${
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
                    placeholder="Jane Doe"
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
                    placeholder="Inquiring about open spots..."
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 rounded-lg text-sm transition-colors disabled:opacity-50 mt-1"
                >
                  {submitting ? 'Submitting...' : 'Send Inquiry'}
                </button>
              </form>
            </div>
          </div>
        </main>
      </div>

      <Footer />
    </div>
  );
}