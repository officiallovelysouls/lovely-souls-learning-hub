'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

interface Center {
  id: string;
  name: string;
  address: string;
  phone: string;
  description: string;
  image_url: string;
  monthly_fee: number;
  registration_fee: number;
  age_group: string;
}

interface Inquiry {
  id: string;
  parent_name: string;
  email: string;
  phone: string;
  message: string;
  status: string;
  created_at: string;
}

export default function OwnerDashboardPage() {
  const [center, setCenter] = useState<Center | null>(null);
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchOwnerData();
  }, []);

  async function fetchOwnerData() {
    setLoading(true);

    // Fetch primary center
    const { data: centerData } = await supabase
      .from('centers')
      .select('*')
      .limit(1)
      .single();

    if (centerData) {
      setCenter(centerData);

      // Fetch inquiries for this center
      const { data: inquiryData } = await supabase
        .from('inquiries')
        .select('*')
        .eq('center_id', centerData.id)
        .order('created_at', { ascending: false });

      if (inquiryData) setInquiries(inquiryData);
    }
    setLoading(false);
  }

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    try {
      setUploading(true);
      setMessage('');

      if (!e.target.files || e.target.files.length === 0) {
        return;
      }

      const file = e.target.files[0];
      const fileExt = file.name.split('.').pop();
      const fileName = `${center?.id || 'center'}-${Math.random()}.${fileExt}`;
      const filePath = `${fileName}`;

      // Upload file to Supabase Storage bucket
      const { error: uploadError } = await supabase.storage
        .from('center-photos')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: publicUrlData } = supabase.storage
        .from('center-photos')
        .getPublicUrl(filePath);

      const publicUrl = publicUrlData.publicUrl;

      // Update database record
      if (center) {
        const { error: updateError } = await supabase
          .from('centers')
          .update({ image_url: publicUrl })
          .eq('id', center.id);

        if (updateError) throw updateError;

        setCenter({ ...center, image_url: publicUrl });
        setMessage('Photo uploaded and profile updated successfully!');
      }
    } catch (err: any) {
      setMessage(`Upload failed: ${err.message}`);
    } finally {
      setUploading(false);
    }
  }

  async function updateInquiryStatus(id: string, newStatus: string) {
    await supabase.from('inquiries').update({ status: newStatus }).eq('id', id);
    setInquiries(
      inquiries.map((inq) => (inq.id === id ? { ...inq, status: newStatus } : inq))
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <p className="text-sm font-semibold text-slate-600">Loading Dashboard...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <div>
          <h1 className="text-2xl font-black text-slate-900">Owner Dashboard</h1>
          <p className="text-xs text-slate-500 mt-1">
            Manage your center profile, photo uploads, and parent inquiries.
          </p>
        </div>

        {message && (
          <div className="p-4 bg-blue-50 border border-blue-200 text-blue-800 text-xs rounded-xl font-medium">
            {message}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Center Media & Settings */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-6">
            <h2 className="text-base font-bold text-slate-900">Center Media & Photo</h2>

            {/* Current Image Preview */}
            <div className="relative h-48 w-full bg-slate-100 rounded-xl overflow-hidden border border-slate-200">
              <img
                src={center?.image_url || 'https://images.unsplash.com/photo-1576495199011-eb94736d05d6?q=80&w=1200'}
                alt={center?.name || 'Center photo'}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Upload Control */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-2">
                Upload New Profile Photo
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                disabled={uploading}
                className="block w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"
              />
              {uploading && (
                <p className="text-xs text-blue-600 font-medium mt-2">Uploading image to storage...</p>
              )}
            </div>

            <hr className="border-slate-100" />

            <div>
              <h3 className="text-sm font-bold text-slate-900 mb-1">{center?.name}</h3>
              <p className="text-xs text-slate-500">{center?.address}</p>
              <div className="mt-3 text-xs text-slate-600 space-y-1">
                <p><strong>Monthly Fee:</strong> R{center?.monthly_fee ?? 2500}</p>
                <p><strong>Registration Fee:</strong> R{center?.registration_fee ?? 500}</p>
                <p><strong>Age Group:</strong> {center?.age_group ?? '18m - 6 yrs'}</p>
              </div>
            </div>
          </div>

          {/* Right Column: Inquiry Management Pipeline */}
          <div className="lg:col-span-2 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <h2 className="text-base font-bold text-slate-900 mb-4">
              Parent Inquiries ({inquiries.length})
            </h2>

            {inquiries.length === 0 ? (
              <p className="text-xs text-slate-500 italic">No inquiries received yet.</p>
            ) : (
              <div className="space-y-4">
                {inquiries.map((inq) => (
                  <div
                    key={inq.id}
                    className="p-4 border border-slate-200 rounded-xl bg-slate-50/50 space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-sm font-bold text-slate-900">{inq.parent_name}</h4>
                        <p className="text-xs text-slate-500">
                          {inq.email} • {inq.phone}
                        </p>
                      </div>
                      <select
                        value={inq.status || 'pending'}
                        onChange={(e) => updateInquiryStatus(inq.id, e.target.value)}
                        className="text-xs font-semibold px-2.5 py-1 rounded-lg border border-slate-300 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="pending">Pending</option>
                        <option value="contacted">Contacted</option>
                        <option value="enrolled">Enrolled</option>
                      </select>
                    </div>

                    <p className="text-xs text-slate-700 bg-white p-3 rounded-lg border border-slate-200">
                      "{inq.message}"
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}