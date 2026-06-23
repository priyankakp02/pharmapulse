import { formatINR } from '@lib/format.js';

export default function KpiRow({ kpis }) {
  return (
    <section className="kpi-row" aria-label="Key performance indicators">
      <div className={`kpi-card${kpis.highCount > 0 ? ' danger' : ''}`}>
        <div className="label">SKUs at High Risk</div>
        <div className="value">{kpis.highCount}</div>
        <div className="sub">Stockout before reorder arrives</div>
      </div>
      <div className="kpi-card">
        <div className="label">Inventory Health Score</div>
        <div className="value">{Math.round(kpis.health)}</div>
        <div className="sub">Composite across all SKUs</div>
      </div>
      <div className="kpi-card">
        <div className="label">Forecast Accuracy</div>
        <div className="value">{kpis.accuracy.toFixed(1)}%</div>
        <div className="sub">Backtested MAPE (8-week holdout)</div>
      </div>
      <div className="kpi-card">
        <div className="label">Capital Tied Up in Overstock</div>
        <div className="value">{formatINR(kpis.overstockCapital)}</div>
        <div className="sub">Excess beyond 120-day cover</div>
      </div>
    </section>
  );
}
