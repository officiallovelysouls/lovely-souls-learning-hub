import { supabase } from '@/lib/supabase';
import { notFound } from 'next/navigation';
import Link from 'next/link';

interface PageProps {
  params: Promise<{ id: string }>;
}

export const revalidate = 0;

export default async function CenterDetailPage({ params }: PageProps) {
  const { id } = await params;

  // Fetch Center Details
  const { data: center, error } = await supabase
    .from('centers')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !center) {
    notFound();
  }

  // Fetch Approved Reviews
  const { data: reviews } = await supabase
    .from('reviews')
    .select('*')
    .eq('center_id', id)
    .order('created_at', { ascending: false });

  // Compute Average Rating
  const avgRating =
    reviews && reviews.length > 0
      ? (reviews.reduce((acc, r) => acc + (r.rating || 5), 0) / reviews.length).toFixed(1)
      : null;

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        {/* Back Link */}
        <Link
          href="/"
          className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800 font-medium mb-6"
        >
          ← Back to All Centers
        </Link>

        {/* Main Content Card */}
        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
          {/* Header Image */}
          <div className="relative h-72 sm:h-96 w-full bg-slate-200">
            <img
              src={center.image_url || 'https://images.unsplash.com/photo-1576495199011-eb94736d05d6?q=80&w=1200'}
              alt={center.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/20 to-transparent flex items-end p-6 sm:p-8">
              <div className="text-white">
                <span className="inline-block px-3 py-1 bg-blue-600 text-white text-xs font-semibold rounded-full mb-2 uppercase tracking-wide">
                  Licensed Daycare
                </span>
                <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">{center.name}</h1>
                <p className="text-sm sm:text-base text-slate-200 mt-1 flex items-center gap-1">
                  📍 {center.address}
                </p>
              </div>
            </div>
          </div>

          <div className="p-6 sm:p-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column: Details & Reviews */}
            <div className="lg:col-span-2 space-y-8">
              {/* Ratings Summary */}
              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-200">
                <div className="flex items-center gap-3">
                  <span className="text-3xl font-extrabold text-slate-900">
                    {avgRating ? avgRating : 'New'}
                  </span>
                  <div>
                    <div className="flex text-amber-400 text-sm">
                      {'★'.repeat(Math.round(Number(avgRating) || 5))}
                      {'☆'.repeat(5 - Math.round(Number(avgRating) || 5))}
                    </div>
                    <span className="text-xs text-slate-500">
                      {reviews ? `${reviews.length} parent review(s)` : 'No reviews yet'}
                    </span>
                  </div>
                </div>
                <span className="text-xs font-semibold px-2.5 py-1 bg-emerald-100 text-emerald-800 rounded-md">
                  Verified Facility
                </span>
              </div>

              {/* Fee Structure Grid */}
              <div className="bg-blue-50/50 border border-blue-100 rounded-xl p-5 grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <span className="text-xs text-blue-600 font-semibold uppercase tracking-wider">
                    Monthly Tuition
                  </span>
                  <p className="text-2xl font-black text-slate-900 mt-1">
                    R{center.monthly_fee ?? 2500}
                  </p>
                </div>
                <div>
                  <span className="text-xs text-blue-600 font-semibold uppercase tracking-wider">
                    Registration Fee
                  </span>
                  <p className="text-2xl font-black text-slate-900 mt-1">
                    R{center.registration_fee ?? 500}
                  </p>
                </div>
                <div>
                  <span className="text-xs text-blue-600 font-semibold uppercase tracking-wider">
                    Age Group
                  </span>
                  <p className="text-base font-bold text-slate-900 mt-1">
                    {center.age_group ?? '18m - 6 yrs'}
                  </p>
                </div>
              </div>

              {/* Map & Location Block (Integrated Below Fee Structure) */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-5">
                <h3 className="text-base font-bold text-slate-900 mb-1">Location & Directions</h3>
                <p className="text-xs text-slate-500 mb-3 flex items-center gap-1">
                  📍 {center.address}
                </p>
                <div className="w-full h-64 rounded-lg overflow-hidden border border-slate-200 bg-slate-100">
                  <iframe
                    width="100%"
                    height="100%"
                    frameBorder="0"
                    scrolling="no"
                    marginHeight={0}
                    marginWidth={0}
                    src={`https://maps.google.com/maps?q=${encodeURIComponent(center.address)}&t=&z=14&ie=UTF8&iwloc=&output=embed`}
                    className="w-full h-full border-0"
                    allowFullScreen
                  ></iframe>
                </div>
                <div className="mt-3 text-right">
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(center.address)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-semibold text-blue-600 hover:text-blue-800 hover:underline inline-flex items-center gap-1"
                  >
                    Open in Google Maps →
                  </a>
                </div>
              </div>

              {/* Description */}
              <div>
                <h2 className="text-lg font-bold text-slate-900 mb-2">About Our Center</h2>
                <p className="text-slate-600 text-sm leading-relaxed whitespace-pre-line">
                  {center.description || 'Welcome to Lovely Souls Learning Hub! We provide a safe, nurturing, and engaging educational environment for young learners.'}
                </p>
              </div>

              {/* Reviews Section */}
              <div className="border-t border-slate-200 pt-8">
                <h2 className="text-lg font-bold text-slate-900 mb-4">Parent Reviews</h2>
                {reviews && reviews.length > 0 ? (
                  <div className="space-y-4">
                    {reviews.map((rev) => (
                      <div key={rev.id} className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-semibold text-sm text-slate-900">{rev.parent_name}</span>
                          <span className="text-amber-400 text-xs">
                            {'★'.repeat(rev.rating || 5)}{'☆'.repeat(5 - (rev.rating || 5))}
                          </span>
                        </div>
                        <p className="text-xs text-slate-600 mt-1">{rev.comment}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-slate-500 italic">
                    No reviews yet. Submit an inquiry to get in touch with this center!
                  </p>
                )}
              </div>
            </div>

            {/* Right Column: Inquiry Sidebar */}
            <div>
              <div className="bg-slate-50 border border-slate-200 p-6 rounded-2xl sticky top-6">
                <h3 className="text-lg font-bold text-slate-900 mb-1">Enquire Now</h3>
                <p className="text-xs text-slate-500 mb-4">
                  Send a direct message to the administration to schedule a visit or ask questions.
                </p>

                <form action="/api/inquire" method="POST" className="space-y-4">
                  <input type="hidden" name="center_id" value={center.id} />
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Full Name</label>
                    <input
                      type="text"
                      name="parent_name"
                      required
                      placeholder="e.g. Sarah Molefe"
                      className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Email Address</label>
                    <input
                      type="email"
                      name="email"
                      required
                      placeholder="sarah@example.com"
                      className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Phone Number</label>
                    <input
                      type="tel"
                      name="phone"
                      required
                      placeholder="082 123 4567"
                      className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Message</label>
                    <textarea
                      name="message"
                      rows={3}
                      required
                      placeholder="Hi, I would like to check availability for my 3-year-old child..."
                      className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    ></textarea>
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 rounded-lg text-xs transition-colors shadow-sm"
                  >
                    Submit Inquiry
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}