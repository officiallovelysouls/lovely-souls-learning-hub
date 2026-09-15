import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-400 border-t border-slate-800 py-12 mt-auto">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <h3 className="text-white text-lg font-bold mb-3">Lovely Souls Learning Hub</h3>
          <p className="text-sm text-slate-400 leading-relaxed">
            Connecting parents with accredited early childhood development centers and preschools in South Africa.
          </p>
        </div>

        <div>
          <h4 className="text-white text-sm font-semibold mb-3 uppercase tracking-wider">Quick Links</h4>
          <ul className="space-y-2 text-sm">
            <li>
              <Link href="/" className="hover:text-white transition-colors">
                Browse Centers
              </Link>
            </li>
            <li>
              <Link href="/owner/login" className="hover:text-white transition-colors">
                Center Owner Login
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="text-white text-sm font-semibold mb-3 uppercase tracking-wider">Support</h4>
          <p className="text-sm text-slate-400">
            Need assistance listing your center or submitting an inquiry? Reach out to our portal team directly.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 pt-8 mt-8 border-t border-slate-800 text-center text-xs text-slate-500">
        © {new Date().getFullYear()} Lovely Souls Learning Hub. All rights reserved.
      </div>
    </footer>
  );
}