export default function Header({ highCount }) {
  return (
    <header className="header">
      <div className="header-inner">
        <div className="brand">
          <svg width="36" height="36" viewBox="0 0 36 36" aria-hidden="true">
            <rect x="4" y="14" width="28" height="8" rx="4" fill="#1C7293" opacity="0.25" />
            <rect x="8" y="15.5" width="20" height="5" rx="2.5" fill="#1C7293" />
            <polyline points="6,28 12,22 18,26 24,18 30,22" fill="none" stroke="#F2A541" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <div>
            <h1>PharmaPulse AI</h1>
            <p className="tagline">Demand forecasting &amp; stockout early-warning for Indian pharma supply chains.</p>
          </div>
        </div>
        <div className="header-meta">
          <div className="risk-chip" aria-live="polite">
            <span className="dot" />
            <span>{highCount} SKU{highCount !== 1 ? 's' : ''} at high risk</span>
          </div>
          <span className="header-note">Synthetic demo data · NLEM-aware essential medicine tagging</span>
        </div>
      </div>
    </header>
  );
}
