import { formatUnits } from '@lib/format.js';
import StockRunway from './StockRunway';

function SkuRow({ s, selected, safetyBufferDays, categoryBadge, onSelect }) {
  return (
    <tr className={s.id === selected ? 'selected' : ''} onClick={() => onSelect(s.id)} style={{ cursor: 'pointer' }}>
      <td>
        <span className="sku-name">{s.name}</span>
        {s.isEssential && <span className="essential-tag">NLEM</span>}
        <br /><span className="sku-id">{s.id}</span>
      </td>
      <td><span className={`badge ${categoryBadge[s.category] || 'badge-pain'}`}>{s.category}</span></td>
      <td>{s.region}</td>
      <td className="mono">{formatUnits(s.stock)}</td>
      <td className="mono">{Math.round(s.daysOfCover)}</td>
      <td>
        <StockRunway daysOfCover={s.daysOfCover} replenishmentDays={s.replenishmentDays} safetyBuffer={safetyBufferDays} risk={s.risk} />
      </td>
      <td><span className={`risk-badge risk-${s.risk}`}>{s.risk}</span></td>
      <td>
        <button type="button" className="btn-view" onClick={e => { e.stopPropagation(); onSelect(s.id); }}>View forecast</button>
      </td>
    </tr>
  );
}

function SkuCard({ s, selected, safetyBufferDays, onSelect }) {
  return (
    <div className={`sku-card${s.id === selected ? ' selected' : ''}`} onClick={() => onSelect(s.id)}>
      <div className="sku-card-header">
        <div>
          <span className="sku-name">{s.name}</span>
          {s.isEssential && <span className="essential-tag">NLEM</span>}
          <br /><span className="sku-id">{s.id}</span>
        </div>
        <span className={`risk-badge risk-${s.risk}`}>{s.risk}</span>
      </div>
      <dl className="sku-card-meta">
        <dt>Region</dt><dd>{s.region}</dd>
        <dt>Stock</dt><dd>{formatUnits(s.stock)}</dd>
        <dt>Days cover</dt><dd>{Math.round(s.daysOfCover)}</dd>
        <dt>Category</dt><dd>{s.category}</dd>
      </dl>
      <StockRunway daysOfCover={s.daysOfCover} replenishmentDays={s.replenishmentDays} safetyBuffer={safetyBufferDays} risk={s.risk} width={280} height={24} />
      <button type="button" className="btn-view" style={{ marginTop: '0.5rem', width: '100%' }} onClick={e => { e.stopPropagation(); onSelect(s.id); }}>View forecast</button>
    </div>
  );
}

export default function SkuTable({
  skus, selectedId, safetyBufferDays, categories, regions,
  filters, sort, onFilterChange, onSortChange, onSelect, categoryBadge
}) {
  const handleSort = (key) => {
    if (sort.key === key) {
      onSortChange({ key, dir: sort.dir === 'asc' ? 'desc' : 'asc' });
    } else {
      onSortChange({ key, dir: 'asc' });
    }
  };

  const sortArrow = (key) => {
    if (sort.key !== key) return '↕';
    return sort.dir === 'asc' ? '↑' : '↓';
  };

  return (
    <section className="table-panel" aria-label="SKU inventory table">
      <h2>SKU Inventory</h2>
      <div className="filters">
        <input
          id="searchFilter"
          type="search"
          placeholder="Search SKU, name, region…"
          value={filters.search}
          onChange={e => onFilterChange({ ...filters, search: e.target.value })}
          aria-label="Search SKUs"
        />
        <select value={filters.category} onChange={e => onFilterChange({ ...filters, category: e.target.value })} aria-label="Filter by category">
          <option value="">All categories</option>
          {categories.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        <select value={filters.region} onChange={e => onFilterChange({ ...filters, region: e.target.value })} aria-label="Filter by region">
          <option value="">All regions</option>
          {regions.map(r => <option key={r} value={r}>{r}</option>)}
        </select>
        <div className="risk-toggle" role="group" aria-label="Filter by risk level">
          {['all', 'alert', 'high'].map(r => (
            <button
              key={r}
              type="button"
              className={filters.risk === r ? 'active' : ''}
              onClick={() => onFilterChange({ ...filters, risk: r })}
            >
              {r === 'all' ? 'All' : r === 'alert' ? 'High + Medium' : 'High only'}
            </button>
          ))}
        </div>
      </div>
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              {['name', 'category', 'region', 'stock', 'daysOfCover'].map(key => (
                <th key={key} className={sort.key === key ? 'sorted' : ''} onClick={() => handleSort(key)}>
                  {key === 'daysOfCover' ? 'Days Cover' : key.charAt(0).toUpperCase() + key.slice(1)} <span className="sort-arrow">{sortArrow(key)}</span>
                </th>
              ))}
              <th>Runway</th>
              <th className={sort.key === 'risk' ? 'sorted' : ''} onClick={() => handleSort('risk')}>Risk <span className="sort-arrow">{sortArrow('risk')}</span></th>
              <th />
            </tr>
          </thead>
          <tbody>
            {skus.map(s => (
              <SkuRow key={s.id} s={s} selected={selectedId} safetyBufferDays={safetyBufferDays} categoryBadge={categoryBadge} onSelect={onSelect} />
            ))}
          </tbody>
        </table>
      </div>
      <div className="card-list">
        {skus.map(s => (
          <SkuCard key={s.id} s={s} selected={selectedId} safetyBufferDays={safetyBufferDays} onSelect={onSelect} />
        ))}
      </div>
    </section>
  );
}
