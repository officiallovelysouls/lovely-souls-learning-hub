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
  image_url?: string;
  monthly_fee?: number;
  registration_fee?: number;
  age_group?: string;
}

interface Review {
  id: string;
  parent_name: string;
  rating: number;
  comment: string;
  created_at: string;
}

export default function CenterDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const centerId = resolvedParams.id;

  const [center, setCenter] = useState<Center | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  // Inquiry Form State
  const [parentName, setParentName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [submittingInquiry, setSubmittingInquiry] = useState(false);
  const [inquiryStatus, setInquiryStatus] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Review Form State
  const [reviewerName, setReviewerName] = useState('');
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);

      // Fetch Center
      const { data: centerData } = await supabase
        .from('centers')
        .select('*')
        .eq('id', centerId)
        .single();

      if (centerData) {
        setCenter(centerData as Center);
      } else {
        setCenter({
          id: centerId,
          name: 'Lovely Souls Early Learning Hub',
          address: '123 Primary Street, Vanderbijlpark, Gauteng',
          phone: '+27 11 987 6543',
          capacity: 45,
          image_url: 'https://images.unsplash.com/photo-1587654780291-39c9404d746b?auto=format&fit=crop&q=80&w=800',
          monthly_fee: 2500,
          registration_fee: 500,
          age_group: '18 Months - 6 Years',
          description:
            'Lovely Souls Early Learning Hub provides a safe, engaging, and structured environment for toddlers and preschoolers. Our curriculum covers literacy, numeracy, creative arts, and foundational motor development with certified staff.',
        });
      }

      // Fetch Reviews
      const { data: reviewData } = await supabase
        .from('reviews')
        .select('*')
        .eq('center_id', centerId)
        .order('created_at', { ascending: false });

      if (reviewData) {
        setReviews(reviewData as Review[]);
      }

      setLoading(false);
    }

    fetchData();
  }, [centerId]);

  const handleSubmitInquiry = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmittingInquiry(true);
    setInquiryStatus(null);

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

    setSubmittingInquiry(false);

    if (error) {
      setInquiryStatus({ type: 'error', text: 'Failed to submit inquiry. Please try again.' });
    } else {
      setInquiryStatus({ type: 'success', text: 'Inquiry submitted successfully!' });
      setParentName('');
      setEmail('');
      setPhone('');
      setMessage('');
    }
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmittingReview(true);

    const newReview = {
      center_id: center?.id,
      parent_name: reviewerName,
      rating,
      comment,
    };

    const { data, error } = await supabase.from('reviews').insert([newReview]).select();

    setSubmittingReview(false);

    if (!error && data) {
      setReviews([data[0] as Review, ...reviews]);
      setReviewerName('');
      setComment('');
      setRating(5);
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

  if (!center) return null;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between">
      <div>
        <Navbar />

        <div className="max-w-7xl mx-auto px-6 pt-6">
          <Link href="/" className="text-sm font-semibold text-blue-600 hover:underline flex items-center gap-1">
            ← Back to all centers
          </Link>
        </div>

        <main className="max-w-7xl mx-auto px-6 py-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Center Media, Info, Fees & Reviews */}
          <div className="lg:col-span-2 space-y-6">
            {/* Gallery / Hero Photo */}
            <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
              <img
                src={center.image_url || 'https://images.unsplash.com/photo-1587654780291-39c9404d746b?auto=format&fit=crop&q=80&w=800'}
                alt={center.name}
                className="w-full h-80 object-cover"
              />
              <div className="p-8">
                <span className="text-xs bg-emerald-100 text-emerald-800 font-semibold px-3 py-1 rounded-full uppercase tracking-wider">
                  Accredited Hub
                </span>
                <h1 className="text-3xl font-extrabold text-slate-900 mt-3 mb-2">{center.name}</h1>
                <p className="text-sm text-slate-500 mb-6">📍 {center.address}</p>

                {/* Fee Structure Section */}
                <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                  <div>
                    <span className="text-xs text-blue-600 font-semibold uppercase">Monthly Tuition</span>
                    <p className="text-xl font-bold text-slate-900 mt-0.5">R{center.monthly_fee ?? 2500}</p>
                  </div>
                  <div>
                    <span className="text-xs text-blue-600 font-semibold uppercase">Registration Fee</span>
                    <p className="text-xl font-bold text-slate-900 mt-0.5">R{center.registration_fee ?? 500}</p>
                  </div>
                  <div>
                    <span className="text-xs text-blue-600 font-semibold uppercase">Age Range</span>
                    <p className="text-sm font-bold text-slate-900 mt-1">{center.age_group ?? '18m - 6 yrs'}</p>
                  </div>
                </div>

                <h2 className="text-lg font-bold text-slate-900 mb-2">About Our Program</h2>
                <p className="text-slate-600 text-sm leading-relaxed mb-6">{center.description}</p>
              </div>
            </div>

            {/* Parent Reviews Section */}
            <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm">
              <h2 className="text-xl font-bold text-slate-900 mb-4">Parent Reviews & Feedback</h2>

              {/* Review Form */}
              <form onSubmit={handleSubmitReview} className="bg-slate-50 border border-slate-200 rounded-xl p-4 mb-8 space-y-3">
                <h3 className="text-sm font-bold text-slate-800">Leave a Review</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <input
                    type="text"
                    placeholder="Your Name"
                    value={reviewerName}
                    onChange={(e) => setReviewerName(e.target.value)}
                    className="border border-slate-300 rounded-lg p-2 text-sm"
                    required
                  />
                  <select
                    value={rating}
                    onChange={(e) => setRating(Number(e.target.value))}
                    className="border border-slate-300 rounded-lg p-2 text-sm bg-white"
                  >
                    <option value={5}>⭐⭐⭐⭐⭐ (5 Stars)</option>
                    <option value={4}>⭐⭐⭐⭐ (4 Stars)</option>
                    <option value={3}>⭐⭐⭐ (3 Stars)</option>
                    <option value={2}>⭐⭐ (2 Stars)</option>
                    <option value={1}>⭐ (1 Star)</option>
                  </select>
                </div>
                <textarea
                  rows={2}
                  placeholder="Share your experience with this daycare..."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className="w-full border border-slate-300 rounded-lg p-2 text-sm"
                  required
                />
                <button
                  type="submit"
                  disabled={submittingReview}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-medium text-xs px-4 py-2 rounded-lg transition-colors"
                >
                  {submittingReview ? 'Submitting...' : 'Post Review'}
                </button>
              </form>

              {/* Reviews List */}
              {reviews.length === 0 ? (
                <p className="text-sm text-slate-500 text-center py-4">No reviews submitted yet. Be the first to leave feedback!</p>
              ) : (
                <div className="space-y-4">
                  {reviews.map((rev) => (
                    <div key={rev.id} className="border-b border-slate-100 pb-4">
                      <div className="flex justify-between items-center mb-1">
                        <strong className="text-sm text-slate-900">{rev.parent_name}</strong>
                        <span className="text-amber-500 text-xs font-bold">
                          {'★'.repeat(rev.rating)}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600">"{rev.comment}"</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Inquiry Sidebar Form */}
          <div className="lg:col-span-1">
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm sticky top-24">
              <h2 className="text-xl font-bold text-slate-900 mb-1">Inquire for Admission</h2>
              <p className="text-xs text-slate-500 mb-6">Send a message directly to {center.name}.</p>

              {inquiryStatus && (
                <div
                  className={`p-3 rounded-lg text-xs mb-4 ${
                    inquiryStatus.type === 'success'
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      : 'bg-red-50 text-red-700 border border-red-200'
                  }`}
                >
                  {inquiryStatus.text}
                </div>
              )}

              <form onSubmit={handleSubmitInquiry} className="flex flex-col gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Parent Name</label>
                  <input
                    type="text"
                    value={parentName}
                    onChange={(e) => setParentName(e.target.value)}
                    className="w-full border border-slate-300 rounded-lg p-2.5 text-sm text-slate-900"
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
                    className="w-full border border-slate-300 rounded-lg p-2.5 text-sm text-slate-900"
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
                    className="w-full border border-slate-300 rounded-lg p-2.5 text-sm text-slate-900"
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
                    className="w-full border border-slate-300 rounded-lg p-2.5 text-sm text-slate-900"
                    placeholder="Inquiring about open spots..."
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={submittingInquiry}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 rounded-lg text-sm transition-colors disabled:opacity-50"
                >
                  {submittingInquiry ? 'Submitting...' : 'Send Inquiry'}
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