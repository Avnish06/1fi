import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const API = import.meta.env.VITE_API_URL;

const formatINR = (n) => '₹' + Number(n).toLocaleString('en-IN');

const badgeClass = (badge = '') => {
  const b = badge.toUpperCase();
  const base = "absolute top-4 right-4 z-10 px-3 py-1 text-[11px] font-extrabold uppercase tracking-wider rounded-full shadow-sm ";
  if (b === 'NEW') return base + 'bg-accent text-white shadow-button';
  if (b === 'HOT DEAL') return base + 'bg-red-500 text-white shadow-[0_4px_12px_rgba(239,68,68,0.25)]';
  if (b === 'BESTSELLER') return base + 'bg-emerald-500 text-white shadow-[0_4px_12px_rgba(16,185,129,0.25)]';
  return base + 'bg-accent text-white';
};

export default function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    document.title = 'EasyEMI — Buy Smartphones on Easy EMI Plans';
    axios
      .get(`${API}/products`)
      .then((res) => setProducts(res.data.data || []))
      .catch(() => setError('Failed to load products. Make sure the backend is running.'))
      .finally(() => setLoading(false));
  }, []);

  const saving = (mrp, price) => Math.round(((mrp - price) / mrp) * 100);

  return (
    <>
      {/* ── Navbar ── */}
      <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-200 py-4 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          <Link to="/" className="flex items-center">
            <img src="/1fi.svg" alt="1Fi" className="h-9" />
          </Link>
          <div className="hidden md:flex items-center gap-8">
            <a href="#" className="font-semibold text-[15px] text-slate-600 hover:text-slate-900 transition-colors flex items-center gap-1">Product <span className="text-[10px] opacity-60">▼</span></a>
            <a href="#" className="font-semibold text-[15px] text-slate-600 hover:text-slate-900 transition-colors flex items-center gap-1">Solutions <span className="text-[10px] opacity-60">▼</span></a>
            <a href="#" className="font-semibold text-[15px] text-slate-600 hover:text-slate-900 transition-colors flex items-center gap-1">Resources <span className="text-[10px] opacity-60">▼</span></a>
            <a href="#" className="font-semibold text-[15px] text-slate-600 hover:text-slate-900 transition-colors">Pricing</a>
            <a href="#" className="font-semibold text-[15px] text-slate-600 hover:text-slate-900 transition-colors">Enterprise</a>
          </div>
          <div className="flex items-center gap-4">
            <a href="#" className="hidden sm:block font-bold text-[15px] text-slate-900 py-2.5 px-5 rounded-full border border-slate-200 hover:bg-slate-50 transition-colors">Sign in</a>
            <a href="#" className="font-bold text-[15px] text-white py-2.5 px-6 rounded-full bg-accent shadow-button hover:bg-accent-hover hover:-translate-y-0.5 transition-all">Start free trial</a>
          </div>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section className="pt-24 pb-20 text-center relative border-b border-slate-200 overflow-hidden bg-gradient-to-b from-indigo-50/50 to-transparent">
        <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-indigo-200/40 rounded-full blur-[80px] -z-10 mix-blend-multiply pointer-events-none"></div>
        <div className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] bg-purple-200/40 rounded-full blur-[100px] -z-10 mix-blend-multiply pointer-events-none"></div>
        
        <div className="max-w-7xl mx-auto px-6 animate-[fadeInUp_0.6s_ease-out_forwards]">
          <div className="inline-block bg-white text-accent font-bold px-4 py-1.5 rounded-full border border-indigo-100 shadow-sm text-[13px] mb-6 uppercase tracking-wider">
            ✨ 0% Interest Available
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-[64px] font-extrabold text-slate-900 mb-6 leading-[1.1] tracking-tight">
            Buy Smartphones<br />on Easy EMI Plans
          </h1>
          <p className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto mb-10 leading-relaxed">
            Choose from top brands with flexible payment options — no credit card needed. EMI plans backed by mutual funds.
          </p>
        </div>
      </section>

      {/* ── Products ── */}
      <section className="py-20 md:py-32 relative">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-4">
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">Featured Smartphones</h2>
            {!loading && !error && (
              <span className="text-sm font-bold text-accent bg-accent/10 px-4 py-1.5 rounded-full border border-accent/20">
                {products.length} Products
              </span>
            )}
          </div>

          {loading && (
            <div className="text-center py-20">
              <div className="inline-block w-8 h-8 border-4 border-slate-200 border-t-accent rounded-full animate-spin mb-4"></div>
              <p className="text-slate-500 font-medium">Loading products…</p>
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 p-6 rounded-2xl text-center font-medium shadow-sm">
              ⚠️ {error}
            </div>
          )}

          {!loading && !error && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {products.map((p) => (
                <Link to={`/products/${p.slug}`} className="group relative flex flex-col bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-card hover:shadow-hover hover:-translate-y-1.5 transition-all duration-300" key={p._id}>
                  {/* Badge */}
                  {p.badge && (
                    <span className={badgeClass(p.badge)}>{p.badge}</span>
                  )}

                  {/* Image */}
                  <div className="bg-slate-50/50 w-full pt-[100%] relative flex items-center justify-center p-8 group-hover:scale-[1.03] transition-transform duration-500 overflow-hidden border-b border-slate-100">
                    <img
                      src={p.image}
                      alt={p.name}
                      className="absolute inset-0 w-full h-full object-contain p-10 mix-blend-multiply drop-shadow-sm"
                      onError={(e) => { e.target.src = 'https://via.placeholder.com/300x300/12121a/6c63ff?text=' + encodeURIComponent(p.name); }}
                    />
                  </div>

                  {/* Body */}
                  <div className="p-6 sm:p-8 flex-1 flex flex-col relative bg-white">
                    <div className="text-xs font-extrabold text-accent tracking-widest uppercase mb-2">{p.brand}</div>
                    <div className="text-xl md:text-2xl font-extrabold text-slate-900 mb-4 line-clamp-2 leading-tight">{p.name}</div>

                    {/* Price */}
                    <div className="flex items-center flex-wrap gap-2.5 mb-5">
                      <span className="text-[28px] font-extrabold text-slate-900 leading-none">{formatINR(p.price)}</span>
                      {p.mrp > p.price && (
                        <>
                          <span className="text-sm text-slate-400 line-through font-semibold translate-y-0.5">{formatINR(p.mrp)}</span>
                          <span className="text-[11px] font-extrabold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-md uppercase tracking-wide translate-y-0.5">{saving(p.mrp, p.price)}% off</span>
                        </>
                      )}
                    </div>

                    {/* EMI hint */}
                    {p.lowestEmiAmount && (
                      <div className="text-sm text-slate-600 mb-8 bg-slate-50 p-3.5 rounded-xl border border-slate-200 flex items-center gap-2">
                        <svg className="w-5 h-5 text-accent opacity-70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>
                          EMI from <strong className="text-slate-900 font-extrabold">{formatINR(p.lowestEmiAmount)}/mo</strong>
                        </span>
                      </div>
                    )}

                    {/* Color swatches */}
                    <div className="flex items-center gap-2 mt-auto pt-5 border-t border-slate-100 mb-6">
                      <div className="flex -space-x-1">
                        {p.colorCount > 0 && Array.from({ length: Math.min(p.colorCount, 4) }).map((_, i) => (
                          <div key={i} className="w-6 h-6 rounded-full shadow-inner border-2 border-white relative z-10" style={{ background: ['#C0C0C0','#C2A882','#2C2C2C','#8BA7B8'][i] || '#888' }} />
                        ))}
                      </div>
                      <span className="text-[13px] font-semibold text-slate-500 ml-2">{p.colorCount} finish{p.colorCount !== 1 ? 'es' : ''}</span>
                    </div>

                    <button className="w-full py-3.5 text-[15px] font-bold text-accent bg-accent/5 rounded-xl group-hover:bg-accent group-hover:text-white transition-colors duration-300">
                      View EMI Plans &rarr;
                    </button>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="bg-white border-t border-slate-200 py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-10 mb-16">
            <div>
              <h4 className="font-bold text-slate-900 mb-6 uppercase text-[11px] tracking-widest">Product</h4>
              <ul className="space-y-4">
                <li><a href="#" className="text-slate-500 hover:text-accent font-medium text-[15px] transition-colors">Features</a></li>
                <li><a href="#" className="text-slate-500 hover:text-accent font-medium text-[15px] transition-colors">Integrations</a></li>
                <li><a href="#" className="text-slate-500 hover:text-accent font-medium text-[15px] transition-colors">Pricing</a></li>
                <li><a href="#" className="text-slate-500 hover:text-accent font-medium text-[15px] transition-colors">Changelog</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-slate-900 mb-6 uppercase text-[11px] tracking-widest">Solutions</h4>
              <ul className="space-y-4">
                <li><a href="#" className="text-slate-500 hover:text-accent font-medium text-[15px] transition-colors">Customer Success</a></li>
                <li><a href="#" className="text-slate-500 hover:text-accent font-medium text-[15px] transition-colors">Sales</a></li>
                <li><a href="#" className="text-slate-500 hover:text-accent font-medium text-[15px] transition-colors">Marketing</a></li>
                <li><a href="#" className="text-slate-500 hover:text-accent font-medium text-[15px] transition-colors">IT & Ops</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-slate-900 mb-6 uppercase text-[11px] tracking-widest">Resources</h4>
              <ul className="space-y-4">
                <li><a href="#" className="text-slate-500 hover:text-accent font-medium text-[15px] transition-colors">Blog</a></li>
                <li><a href="#" className="text-slate-500 hover:text-accent font-medium text-[15px] transition-colors">Help Center</a></li>
                <li><a href="#" className="text-slate-500 hover:text-accent font-medium text-[15px] transition-colors">Community</a></li>
                <li><a href="#" className="text-slate-500 hover:text-accent font-medium text-[15px] transition-colors">Templates</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-slate-900 mb-6 uppercase text-[11px] tracking-widest">Company</h4>
              <ul className="space-y-4">
                <li><a href="#" className="text-slate-500 hover:text-accent font-medium text-[15px] transition-colors">About Us</a></li>
                <li><a href="#" className="text-slate-500 hover:text-accent font-medium text-[15px] transition-colors">Careers</a></li>
                <li><a href="#" className="text-slate-500 hover:text-accent font-medium text-[15px] transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="text-slate-500 hover:text-accent font-medium text-[15px] transition-colors">Terms of Service</a></li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t border-slate-100 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-slate-500 text-[14px] font-medium">© 2025 <strong className="text-slate-900">1Fi / EasyEMI</strong> — EMI plans backed by mutual funds.</p>
            <div className="flex items-center gap-4">
              <a href="#" className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-50 text-slate-400 hover:bg-accent hover:text-white transition-colors">in</a>
              <a href="#" className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-50 text-slate-400 hover:bg-accent hover:text-white transition-colors">tw</a>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
