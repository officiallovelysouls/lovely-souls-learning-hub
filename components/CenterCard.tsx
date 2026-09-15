import Link from 'next/link';

interface CenterProps {
  id: string;
  name: string;
  address: string;
  phone: string;
  capacity: number;
  description: string;
  image_url?: string;
  monthly_fee?: number;
  age_group?: string;
}

export default function CenterCard({ center }: { center: CenterProps }) {
  const imageUrl =
    center.image_url ||
    'https://images.unsplash.com/photo-1587654780291-39c9404d746b?auto=format&fit=crop&q=80&w=800';

  return (
    <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
      <div>
        <div className="h-48 w-full overflow-hidden relative bg-slate-100">
          <img
            src={imageUrl}
            alt={center.name}
            className="w-full h-full object-cover"
          />
          <span className="absolute top-3 right-3 text-xs bg-emerald-500 text-white font-semibold px-2.5 py-1 rounded-full shadow-sm">
            Verified Hub
          </span>
        </div>

        <div className="p-6">
          <h3 className="text-xl font-bold text-slate-900 mb-1">{center.name}</h3>
          <p className="text-xs text-slate-500 mb-3 flex items-center gap-1">
            📍 {center.address}
          </p>

          <p className="text-sm text-slate-600 line-clamp-2 mb-4">
            {center.description}
          </p>

          <div className="grid grid-cols-2 gap-2 bg-slate-50 p-3 rounded-xl text-xs text-slate-600 mb-2">
            <div>
              <span className="block font-semibold text-slate-400 uppercase text-[10px]">Monthly Fee</span>
              <strong className="text-slate-900 text-sm">R{center.monthly_fee ?? 2500}</strong> / pm
            </div>
            <div>
              <span className="block font-semibold text-slate-400 uppercase text-[10px]">Age Group</span>
              <strong className="text-slate-900">{center.age_group ?? '18m - 6 yrs'}</strong>
            </div>
          </div>
        </div>
      </div>

      <div className="px-6 pb-6 pt-2 border-t border-slate-100 flex items-center justify-between">
        <span className="text-xs font-medium text-slate-500">
          Capacity: <strong className="text-slate-800">{center.capacity} kids</strong>
        </span>
        <Link
          href={`/centers/${center.id}`}
          className="text-sm font-semibold text-blue-600 hover:text-blue-700 hover:underline"
        >
          View Details & Reviews →
        </Link>
      </div>
    </div>
  );
}