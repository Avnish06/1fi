import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const API = import.meta.env.VITE_API_URL;

// Helper to format currency in Indian style
const formatINR = (n) =>
  '₹' + Number(n).toLocaleString('en-IN');

// Badge style mapper
const badgeClass = (badge = '') => {
  const b = badge.toUpperCase();
  if (b === 'NEW') return 'product-card-badge badge-new';
  if (b === 'HOT DEAL') return 'product-card-badge badge-hot';
  if (b === 'BESTSELLER') return 'product-card-badge badge-best';
  return 'product-card-badge badge-new';
};

export default function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    document.title = 'EasyEMI — Buy Smartphones on Easy EMI Plans';
    axios
      .get(`${API}/products`)
      .then((res) => setProducts(res.data.data))
      .catch(() => setError('Failed to load products. Make sure the backend is running.'))
      .finally(() => setLoading(false));
  }, []);

  const saving = (mrp, price) => Math.round(((mrp - price) / mrp) * 100);

  return (
    <>
      {/* ── Navbar ── */}
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

      {/* ── Hero ── */}
      <section className="hero animate-fade-in">
        <div className="container">
          <div className="hero-eyebrow">✨ 0% Interest Available</div>
          <h1>Buy Smartphones<br />on Easy EMI Plans</h1>
          <p>Choose from top brands with flexible payment options — no credit card needed. EMI plans backed by mutual funds.</p>
        </div>
      </section>

      {/* ── Products ── */}
      <section className="products-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Featured Smartphones</h2>
            {!loading && !error && (
              <span className="section-count">{products.length} Products</span>
            )}
          </div>

          {loading && (
            <div className="loading-wrap">
              <div className="spinner"></div>
              <p>Loading products…</p>
            </div>
          )}

          {error && <div className="error-box">⚠️ {error}</div>}

          {!loading && !error && (
            <div className="products-grid">
              {products.map((p) => (
                <Link to={`/products/${p.slug}`} className="product-card" key={p._id}>
                  {/* Badge */}
                  {p.badge && (
                    <span className={badgeClass(p.badge)}>{p.badge}</span>
                  )}

                  {/* Image */}
                  <div className="product-card-image-wrap">
                    <img
                      src={p.image}
                      alt={p.name}
                      className="product-card-img"
                      onError={(e) => { e.target.src = 'https://via.placeholder.com/300x300/12121a/6c63ff?text=' + encodeURIComponent(p.name); }}
                    />
                  </div>

                  {/* Body */}
                  <div className="product-card-body">
                    <div className="product-card-brand">{p.brand}</div>
                    <div className="product-card-name">{p.name}</div>

                    {/* Price */}
                    <div className="product-card-price-row">
                      <span className="price-current">{formatINR(p.price)}</span>
                      {p.mrp > p.price && (
                        <>
                          <span className="price-mrp">{formatINR(p.mrp)}</span>
                          <span className="price-saving">{saving(p.mrp, p.price)}% off</span>
                        </>
                      )}
                    </div>

                    {/* EMI hint */}
                    {p.lowestEmiAmount && (
                      <div className="product-card-emi">
                        EMI from <strong>{formatINR(p.lowestEmiAmount)}/mo</strong> × {p.lowestEmiTenure} months
                      </div>
                    )}

                    {/* Color swatches */}
                    <div className="product-card-colors">
                      {p.colorCount > 0 && Array.from({ length: Math.min(p.colorCount, 4) }).map((_, i) => (
                        <div key={i} className="color-dot" style={{ background: ['#C0C0C0','#C2A882','#2C2C2C','#8BA7B8'][i] || '#888' }} />
                      ))}
                      <span className="colors-label">{p.colorCount} finish{p.colorCount !== 1 ? 'es' : ''}</span>
                    </div>

                    <button className="product-card-cta">View EMI Plans →</button>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

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
