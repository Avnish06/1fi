import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';

const API = import.meta.env.VITE_API_URL;

const formatINR = (n) => '₹' + Number(n).toLocaleString('en-IN');

const badgeClass = (badge = '') => {
  const b = badge.toUpperCase();
  const base = "px-3 py-1 text-[11px] font-extrabold uppercase tracking-wider rounded-full shadow-sm ";
  if (b === 'NEW') return base + 'bg-accent text-white shadow-button';
  if (b === 'HOT DEAL') return base + 'bg-red-500 text-white shadow-[0_4px_12px_rgba(239,68,68,0.25)]';
  if (b === 'BESTSELLER') return base + 'bg-emerald-500 text-white shadow-[0_4px_12px_rgba(16,185,129,0.25)]';
  return base + 'bg-accent text-white';
};

export default function ProductDetail() {
  const { slug } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedVariantIdx, setSelectedVariantIdx] = useState(0);
  const [selectedPlanIdx, setSelectedPlanIdx] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    setLoading(true);
    setError('');
    axios
      .get(`${API}/products/${slug}`)
      .then((res) => {
        const data = res.data.data;
        setProduct(data);
        const defaultIdx = data.emiPlans.findIndex((p) => p.isDefault);
        setSelectedPlanIdx(defaultIdx >= 0 ? defaultIdx : null);
        document.title = `${data.name} — EMI Plans | EasyEMI`;
      })
      .catch(() => setError('Product not found or server is unavailable.'))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="max-w-7xl mx-auto px-6 text-center py-32 min-h-[60vh]">
          <div className="inline-block w-8 h-8 border-4 border-slate-200 border-t-accent rounded-full animate-spin mb-4"></div>
          <p className="text-slate-500 font-medium">Loading product details…</p>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <Navbar />
        <div className="max-w-7xl mx-auto px-6 py-16">
          <div className="bg-red-50 border border-red-200 text-red-600 p-6 rounded-2xl text-center font-medium shadow-sm">⚠️ {error}</div>
          <Link to="/" className="inline-flex items-center gap-2 mt-6 text-slate-500 hover:text-accent font-semibold transition-colors">← Back to Products</Link>
        </div>
      </>
    );
  }

  const variant = product.variants[selectedVariantIdx];
  const plan = selectedPlanIdx !== null ? product.emiPlans[selectedPlanIdx] : null;
  const saving = Math.round(((variant.mrp - variant.price) / variant.mrp) * 100);

  const handleProceed = () => {
    if (!plan) return;
    setShowModal(true);
  };

  return (
    <>
      <Navbar />

      <main className="py-8 md:py-12 bg-transparent animate-[fadeInUp_0.6s_ease-out_forwards]">
        <div className="max-w-7xl mx-auto px-6">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm font-semibold text-slate-500 mb-8 md:mb-12">
            <Link to="/" className="hover:text-accent transition-colors">Home</Link>
            <span className="opacity-50">›</span>
            <span>{product.brand}</span>
            <span className="opacity-50">›</span>
            <span className="text-slate-900">{product.name}</span>
          </nav>

          <div className="flex flex-col lg:flex-row gap-12 lg:gap-16">
            {/* ── LEFT: Product Image ── */}
            <div className="w-full lg:w-[45%] flex-shrink-0">
              <div className="bg-white rounded-[32px] p-8 border border-slate-200 shadow-sm relative flex flex-col items-center">
                {product.badge && (
                  <div className="w-full flex justify-end mb-4">
                    <span className={badgeClass(product.badge)}>
                      {product.badge}
                    </span>
                  </div>
                )}

                <div className="w-full pt-[90%] relative flex items-center justify-center mb-8">
                  <img
                    src={variant.image}
                    alt={`${product.name} ${variant.color}`}
                    className="absolute inset-0 w-full h-full object-contain p-4 mix-blend-multiply drop-shadow-lg"
                    onError={(e) => {
                      e.target.src = 'https://via.placeholder.com/400x400/12121a/6c63ff?text=' + encodeURIComponent(product.name);
                    }}
                  />
                </div>

                <div className="w-full flex items-center justify-between bg-slate-50 p-4 rounded-2xl border border-slate-100">
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-wide">
                    Available in {product.variants.length} finish{product.variants.length !== 1 ? 'es' : ''}
                  </p>
                  <div className="flex gap-2.5">
                    {product.variants.map((v, i) => (
                      <button
                        key={v.variantId}
                        className={`w-8 h-8 rounded-full border-[3px] shadow-sm transition-transform duration-200 ${i === selectedVariantIdx ? 'scale-125 border-white ring-2 ring-accent' : 'border-white hover:scale-110'}`}
                        style={{ background: v.colorHex }}
                        title={`${v.color}${v.storage ? ' · ' + v.storage : ''}`}
                        onClick={() => setSelectedVariantIdx(i)}
                        aria-label={`Select ${v.color} variant`}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* ── RIGHT: Product Info + EMI ── */}
            <div className="flex-1 max-w-2xl">
              {/* Brand + Name */}
              <div className="mb-2 text-[13px] font-bold tracking-[1.5px] text-accent-light uppercase">
                {product.brand}
              </div>
              <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-4 tracking-tight leading-[1.1]">{product.name}</h1>

              {/* Variant tag */}
              <span className="inline-flex items-center gap-1.5 bg-slate-100 text-slate-700 font-bold px-3 py-1.5 rounded-lg text-sm mb-8">
                💾 {variant.storage && `${variant.storage} · `}{variant.color}
              </span>

              {/* Price */}
              <div className="flex items-end gap-4 mb-10 pb-8 border-b border-slate-200">
                <div className="text-[40px] font-extrabold text-slate-900 leading-none tracking-tight">{formatINR(variant.price)}</div>
                <div className="flex flex-col">
                  {variant.mrp > variant.price && (
                    <>
                      <span className="text-lg text-slate-400 line-through font-semibold mb-0.5">{formatINR(variant.mrp)}</span>
                      <span className="text-[12px] font-extrabold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-md uppercase tracking-wide self-start">Save {saving}%</span>
                    </>
                  )}
                </div>
              </div>

              {/* EMI Plans */}
              <div className="flex items-center gap-3 text-lg font-extrabold text-slate-900 mb-6">
                <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-sm shadow-sm">💳</div>
                EMI plans backed by mutual funds
              </div>

              <div className="flex flex-col gap-3 mb-10">
                {product.emiPlans.map((plan, i) => (
                  <div
                    key={i}
                    id={`emi-plan-${i}`}
                    className={`relative p-5 rounded-2xl border-2 transition-all cursor-pointer ${selectedPlanIdx === i ? 'border-accent bg-accent/5 shadow-sm' : 'border-slate-200 bg-white hover:border-accent/40'}`}
                    onClick={() => setSelectedPlanIdx(i)}
                    role="radio"
                    aria-checked={selectedPlanIdx === i}
                    tabIndex={0}
                    onKeyDown={(e) => e.key === 'Enter' && setSelectedPlanIdx(i)}
                  >
                    <div className="flex items-center justify-between flex-wrap gap-4">
                      <div className="flex items-center gap-4">
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${selectedPlanIdx === i ? 'border-accent bg-accent' : 'border-slate-300'}`}>
                           {selectedPlanIdx === i && <div className="w-2 h-2 bg-white rounded-full"></div>}
                        </div>
                        <div>
                          <div className="text-[22px] font-extrabold text-slate-900 leading-tight">{formatINR(plan.monthlyAmount)}</div>
                          <div className="text-[15px] font-semibold text-slate-500">× {plan.tenure} months</div>
                        </div>
                      </div>
                      <span className={`px-3 py-1 text-[13px] font-bold rounded-lg border ${plan.interestRate === 0 ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-orange-50 text-orange-700 border-orange-200'}`}>
                        {plan.interestRate === 0 ? '0% interest' : `${plan.interestRate}% interest`}
                      </span>
                    </div>

                    {plan.cashback > 0 && (
                      <div className="mt-4 pt-3 border-t border-slate-200/60 text-sm font-bold text-slate-600 flex items-center gap-1.5">
                        <span className="text-base">🎁</span> Additional cashback of <span className="text-emerald-600">{formatINR(plan.cashback)}</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Proceed Button */}
              <div className="bg-slate-50 p-6 rounded-[24px] border border-slate-200 text-center shadow-inner">
                <button
                  id="proceed-btn"
                  className={`w-full py-4 px-6 rounded-2xl text-[17px] font-extrabold transition-all duration-300 shadow-button ${plan ? 'bg-accent text-white hover:bg-accent-hover hover:-translate-y-1' : 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none'}`}
                  onClick={handleProceed}
                  disabled={!plan}
                >
                  {plan
                    ? `🚀 Proceed — ${formatINR(plan.monthlyAmount)}/mo × ${plan.tenure} months`
                    : 'Select an EMI plan to proceed'}
                </button>
                {plan && (
                  <p className="mt-4 text-[13px] font-semibold text-slate-500 flex items-center justify-center gap-1.5">
                    <span className="opacity-80">🔒</span> Secured by mutual fund SIP · No credit card needed
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* ── Success Modal ── */}
      {showModal && plan && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-[fadeInUp_0.3s_ease-out]" onClick={() => setShowModal(false)}>
          <div className="bg-white w-full max-w-md rounded-[32px] p-8 md:p-10 text-center shadow-2xl relative border border-slate-100 transform scale-100" onClick={(e) => e.stopPropagation()}>
            <div className="w-20 h-20 mx-auto bg-green-100 text-[40px] rounded-full flex items-center justify-center mb-6 shadow-sm">🎉</div>
            <h2 className="text-3xl font-extrabold text-slate-900 mb-4 tracking-tight">Plan Selected!</h2>
            <p className="text-[17px] text-slate-600 leading-relaxed mb-8">
              You've selected the <strong className="text-slate-900">{formatINR(plan.monthlyAmount)}/month</strong> plan for{' '}
              <strong className="text-slate-900">{plan.tenure} months</strong> at{' '}
              <strong className="text-slate-900">{plan.interestRate === 0 ? '0% interest' : `${plan.interestRate}% interest`}</strong>.
              <br /><br />
              For <strong className="text-slate-900">{product.name}</strong> ({variant.color} · {variant.storage})
              {plan.cashback > 0 && (
                <> with an additional cashback of <strong className="text-emerald-600">{formatINR(plan.cashback)}</strong>!</>
              )}
            </p>
            <button className="w-full py-3.5 px-6 rounded-xl font-bold text-white bg-slate-900 hover:bg-slate-800 transition-colors shadow-md" onClick={() => setShowModal(false)}>
              Got it! ✓
            </button>
          </div>
        </div>
      )}

      {/* ── Footer ── */}
      <footer className="bg-white border-t border-slate-200 py-20 mt-20">
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

// Reusable Navbar
function Navbar() {
  return (
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
  );
}
