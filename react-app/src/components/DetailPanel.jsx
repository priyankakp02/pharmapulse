import { formatINR, formatUnits, formatDate } from '@lib/format.js';
import ForecastChart from './ForecastChart';
import StockRunway from './StockRunway';

function Recommendation({ sku }) {
  if (!sku) return null;
  const reorderValue = sku.reorderQty * sku.unitCost;

  if (sku.risk === 'HIGH' || sku.risk === 'MEDIUM') {
    const daysText = sku.reorderByDays === 0 ? 'immediately' : `within ${sku.reorderByDays} day${sku.reorderByDays !== 1 ? 's' : ''}`;
    const cls = sku.risk === 'HIGH' ? 'urgent' : 'warn';
    return (
      <div className={`recommendation ${cls}`}>
        Reorder <strong>{formatINR(reorderValue)}</strong> worth (<strong>{formatUnits(sku.reorderQty)} units</strong>) {daysText} to avoid a stockout around <strong>{formatDate(sku.stockoutDate)}</strong>. Current cover: <strong>{Math.round(sku.daysOfCover)} days</strong> against a {sku.replenishmentDays}-day replenishment window.
      </div>
    );
  }
  if (sku.risk === 'OVERSTOCK') {
    const excess = Math.round(sku.stock - 120 * sku.avgForecastDaily);
    return (
      <div className="recommendation healthy">
        Holding <strong>{formatUnits(excess)} excess units</strong> beyond 120-day cover — <strong>{formatINR(excess * sku.unitCost)}</strong> in capital at expiry risk. Consider redistributing to high-demand hubs or slowing inbound orders.
      </div>
    );
  }
  return (
    <div className="recommendation healthy">
      Stock is healthy at <strong>{Math.round(sku.daysOfCover)} days</strong> of cover. No reorder needed now; next review in ~4 weeks. Forecast accuracy for this SKU: <strong>{(100 - sku.mape).toFixed(1)}%</strong> (8-week backtest).
    </div>
  );
}

export default function DetailPanel({ sku, safetyBufferDays }) {
  if (!sku) return <aside className="detail-panel" />;

  const essential = sku.isEssential ? ' · NLEM essential medicine' : '';

  return (
    <aside className="detail-panel" aria-label="SKU forecast detail">
      <h2>{sku.name}</h2>
      <p className="detail-meta">{sku.id} · {sku.category} · {sku.region}{essential}</p>
      <ForecastChart sku={sku} />
      <div className="runway-expanded">
        <div className="runway-label">
          <span>Stock Runway</span>
          <span>{Math.round(sku.daysOfCover)}d cover · reorder point at {sku.replenishmentDays}d</span>
        </div>
        <StockRunway
          daysOfCover={sku.daysOfCover}
          replenishmentDays={sku.replenishmentDays}
          safetyBuffer={safetyBufferDays}
          risk={sku.risk}
          width={300}
          height={32}
          expanded
        />
      </div>
      <Recommendation sku={sku} />
    </aside>
  );
}
