import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';

const API = import.meta.env.VITE_API_URL;

const formatINR = (n) => '₹' + Number(n).toLocaleString('en-IN');

const badgeClass = (badge = '') => {
  const b = badge.toUpperCase();
  if (b === 'NEW') return 'product-card-badge badge-new';
  if (b === 'HOT DEAL') return 'product-card-badge badge-hot';
  if (b === 'BESTSELLER') return 'product-card-badge badge-best';
  return 'product-card-badge badge-new';
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
        // Auto-select default plan
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
        <div className="container loading-wrap" style={{ minHeight: '60vh' }}>
          <div className="spinner"></div>
          <p>Loading product details…</p>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <Navbar />
        <div className="container" style={{ padding: '60px 24px' }}>
          <div className="error-box">⚠️ {error}</div>
          <Link to="/" className="back-btn" style={{ marginTop: 24, display: 'inline-flex' }}>← Back to Products</Link>
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

      <main className="detail-page animate-fade-in">
        <div className="container">
          {/* Breadcrumb */}
          <nav className="detail-breadcrumb">
            <Link to="/">Home</Link>
            <span>›</span>
            <span>{product.brand}</span>
            <span>›</span>
            <span>{product.name}</span>
          </nav>

          <div className="detail-grid">
            {/* ── LEFT: Product Image ── */}
            <div>
              <div className="product-image-card">
                {product.badge && (
                  <div className="product-badge-wrap">
                    <span className={badgeClass(product.badge)}
                      style={{ position: 'static', display: 'inline-block' }}>
                      {product.badge}
                    </span>
                  </div>
                )}

                <div className="product-image-wrap">
                  <img
                    src={variant.image}
                    alt={`${product.name} ${variant.color}`}
                    className="product-main-img"
                    onError={(e) => {
                      e.target.src = 'https://via.placeholder.com/400x400/12121a/6c63ff?text=' + encodeURIComponent(product.name);
                    }}
                  />
                </div>

                <div className="product-image-footer">
                  <p className="variant-label">
                    Available in {product.variants.length} finish{product.variants.length !== 1 ? 'es' : ''}
                  </p>
                  <div className="variant-swatches">
                    {product.variants.map((v, i) => (
                      <button
                        key={v.variantId}
                        className={`swatch-btn ${i === selectedVariantIdx ? 'active' : ''}`}
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
            <div className="product-info-wrap">
              {/* Brand + Name */}
              <div style={{ marginBottom: 8, fontSize: 13, fontWeight: 600, letterSpacing: '1.5px', color: 'var(--accent-light)', textTransform: 'uppercase' }}>
                {product.brand}
              </div>
              <h1 className="product-name">{product.name}</h1>

              {/* Variant tag */}
              <span className="product-variant-tag">
                💾 {variant.storage && `${variant.storage} · `}{variant.color}
              </span>

              {/* Price */}
              <div className="product-price-section">
                <div className="price-big">{formatINR(variant.price)}</div>
                <div className="price-meta">
                  {variant.mrp > variant.price && (
                    <>
                      <span className="price-mrp-big">{formatINR(variant.mrp)}</span>
                      <span className="price-saving-badge">Save {saving}%</span>
                    </>
                  )}
                </div>
              </div>

              {/* EMI Plans */}
              <div className="emi-section-title">
                <div className="emi-icon">💳</div>
                EMI plans backed by mutual funds
              </div>

              <div className="emi-plans-list">
                {product.emiPlans.map((plan, i) => (
                  <div
                    key={i}
                    id={`emi-plan-${i}`}
                    className={`emi-plan-card ${selectedPlanIdx === i ? 'selected' : ''}`}
                    onClick={() => setSelectedPlanIdx(i)}
                    role="radio"
                    aria-checked={selectedPlanIdx === i}
                    tabIndex={0}
                    onKeyDown={(e) => e.key === 'Enter' && setSelectedPlanIdx(i)}
                  >
                    <div className="emi-plan-main">
                      <div className="emi-radio-wrap">
                        <div className="emi-radio" />
                        <div>
                          <div className="emi-monthly">{formatINR(plan.monthlyAmount)}</div>
                          <div className="emi-tenure">× {plan.tenure} months</div>
                        </div>
                      </div>
                      <span className={`emi-interest-badge ${plan.interestRate === 0 ? 'interest-zero' : 'interest-paid'}`}>
                        {plan.interestRate === 0 ? '0% interest' : `${plan.interestRate}% interest`}
                      </span>
                    </div>

                    {plan.cashback > 0 && (
                      <div className="emi-cashback">
                        🎁 Additional cashback of {formatINR(plan.cashback)}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Proceed Button */}
              <div className="proceed-btn-wrap">
                <button
                  id="proceed-btn"
                  className={`proceed-btn ${plan ? 'active' : 'inactive'}`}
                  onClick={handleProceed}
                  disabled={!plan}
                >
                  {plan
                    ? `🚀 Proceed — ${formatINR(plan.monthlyAmount)}/mo × ${plan.tenure} months`
                    : 'Select an EMI plan to proceed'}
                </button>
                {plan && (
                  <p className="proceed-btn-sub">
                    🔒 Secured by mutual fund SIP · No credit card needed
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* ── Success Modal ── */}
      {showModal && plan && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-icon">🎉</div>
            <h2 className="modal-title">Plan Selected!</h2>
            <p className="modal-desc">
              You've selected the <strong>{formatINR(plan.monthlyAmount)}/month</strong> plan for{' '}
              <strong>{plan.tenure} months</strong> at{' '}
              <strong>{plan.interestRate === 0 ? '0% interest' : `${plan.interestRate}% interest`}</strong>.
              <br /><br />
              For <strong>{product.name}</strong> ({variant.color} · {variant.storage})
              {plan.cashback > 0 && (
                <> with an additional cashback of <strong style={{ color: 'var(--green)' }}>{formatINR(plan.cashback)}</strong>!</>
              )}
            </p>
            <button className="modal-close-btn" onClick={() => setShowModal(false)}>
              Got it! ✓
            </button>
          </div>
        </div>
      )}

      {/* ── Footer ── */}
      <footer className="footer">
        <div className="container">
          <div className="footer-inner">
            <div className="footer-col">
              <h4>Product</h4>
              <ul>
                <li><a href="#">Features</a></li>
                <li><a href="#">Integrations</a></li>
                <li><a href="#">Pricing</a></li>
                <li><a href="#">Changelog</a></li>
              </ul>
            </div>
            <div className="footer-col">
              <h4>Solutions</h4>
              <ul>
                <li><a href="#">Customer Success</a></li>
                <li><a href="#">Sales</a></li>
                <li><a href="#">Marketing</a></li>
                <li><a href="#">IT & Ops</a></li>
              </ul>
            </div>
            <div className="footer-col">
              <h4>Resources</h4>
              <ul>
                <li><a href="#">Blog</a></li>
                <li><a href="#">Help Center</a></li>
                <li><a href="#">Community</a></li>
                <li><a href="#">Templates</a></li>
              </ul>
            </div>
            <div className="footer-col">
              <h4>Company</h4>
              <ul>
                <li><a href="#">About Us</a></li>
                <li><a href="#">Careers</a></li>
                <li><a href="#">Privacy Policy</a></li>
                <li><a href="#">Terms of Service</a></li>
              </ul>
            </div>
          </div>
          <div className="footer-bottom">
            <p>© 2025 <span>1Fi / EasyEMI</span> — EMI plans backed by mutual funds. All prices in INR.</p>
          </div>
        </div>
      </footer>
    </>
  );
}

// Reusable Navbar
function Navbar() {
  return (
    <nav className="navbar">
      <div className="container navbar-inner">
        <Link to="/" className="navbar-logo">
          <img src="/1fi.svg" alt="1Fi" className="logo-img" />
        </Link>
        <div className="navbar-links">
          <a href="#">Product <span className="chevron">▼</span></a>
          <a href="#">Solutions <span className="chevron">▼</span></a>
          <a href="#">Resources <span className="chevron">▼</span></a>
          <a href="#">Pricing</a>
          <a href="#">Enterprise</a>
        </div>
        <div className="navbar-actions">
          <a href="#" className="nav-btn-outline">Sign in</a>
          <a href="#" className="nav-btn-solid">Start free trial</a>
        </div>
      </div>
    </nav>
  );
}
