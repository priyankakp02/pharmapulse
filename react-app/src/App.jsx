import { useMemo, useState, useCallback, useEffect } from 'react';
import { SKUS, RISK_ORDER, CATEGORY_BADGE } from '@lib/data.js';
import { generateHistory } from '@lib/rng.js';
import { computeSkuMetrics, aggregateKPIs, regionSummary } from '@lib/metrics.js';
import { formatINR, formatUnits, formatDate, weekLabel } from '@lib/format.js';
import Header from './components/Header';
import KpiRow from './components/KpiRow';
import Simulator from './components/Simulator';
import RegionSummary from './components/RegionSummary';
import SkuTable from './components/SkuTable';
import DetailPanel from './components/DetailPanel';
import AlertsFeed from './components/AlertsFeed';
import About from './components/About';
import Toolbar from './components/Toolbar';

const histories = SKUS.map(sku => ({
  ...sku,
  history: generateHistory(sku).map(w => ({
    ...w,
    weekStart: new Date(w.weekStart)
  }))
}));

export default function App() {
  const [safetyBufferDays, setSafetyBufferDays] = useState(10);
  const [surgePct, setSurgePct] = useState(0);
  const [selectedSkuId, setSelectedSkuId] = useState(null);
  const [acknowledged, setAcknowledged] = useState(new Set());
  const [filters, setFilters] = useState({ search: '', category: '', region: '', risk: 'all' });
  const [sort, setSort] = useState({ key: 'daysOfCover', dir: 'asc' });

  const surgeMultiplier = 1 + surgePct / 100;

  const skuData = useMemo(() =>
    histories.map(sku => ({
      ...sku,
      ...computeSkuMetrics(sku, sku.history, surgeMultiplier, safetyBufferDays)
    })),
    [surgeMultiplier, safetyBufferDays]
  );

  const kpis = useMemo(() => aggregateKPIs(skuData), [skuData]);
  const regions = useMemo(() => regionSummary(skuData), [skuData]);

  const filtered = useMemo(() => {
    let list = [...skuData];
    const { search, category, region, risk } = filters;
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(s =>
        s.id.toLowerCase().includes(q) ||
        s.name.toLowerCase().includes(q) ||
        s.region.toLowerCase().includes(q)
      );
    }
    if (category) list = list.filter(s => s.category === category);
    if (region) list = list.filter(s => s.region === region);
    if (risk === 'alert') list = list.filter(s => s.risk === 'HIGH' || s.risk === 'MEDIUM');
    if (risk === 'high') list = list.filter(s => s.risk === 'HIGH');

    const mult = sort.dir === 'asc' ? 1 : -1;
    list.sort((a, b) => {
      if (sort.key === 'risk') return (RISK_ORDER[a.risk] - RISK_ORDER[b.risk]) * mult;
      if (sort.key === 'name') return a.name.localeCompare(b.name) * mult;
      if (sort.key === 'category') return a.category.localeCompare(b.category) * mult;
      if (sort.key === 'region') return a.region.localeCompare(b.region) * mult;
      return ((a[sort.key] || 0) - (b[sort.key] || 0)) * mult;
    });
    return list;
  }, [skuData, filters, sort]);

  const selected = useMemo(() => {
    const id = selectedSkuId ?? [...skuData].sort((a, b) => a.daysOfCover - b.daysOfCover)[0]?.id;
    return skuData.find(s => s.id === id) ?? skuData[0];
  }, [skuData, selectedSkuId]);

  const categories = useMemo(() => [...new Set(SKUS.map(s => s.category))].sort(), []);
  const regionList = useMemo(() => [...new Set(SKUS.map(s => s.region))].sort(), []);

  const clearFilters = useCallback(() => {
    setFilters({ search: '', category: '', region: '', risk: 'all' });
  }, []);

  const exportReport = useCallback(() => {
    const report = {
      generatedAt: new Date().toISOString(),
      note: 'Synthetic demo data — PharmaPulse AI',
      safetyBufferDays,
      surgePct,
      kpis,
      skus: skuData.map(s => ({
        id: s.id, name: s.name, region: s.region, risk: s.risk,
        daysOfCover: Math.round(s.daysOfCover * 10) / 10,
        reorderQty: s.reorderQty, stockoutDate: formatDate(s.stockoutDate)
      }))
    };
    const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `pharmapulse-report-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(a.href);
  }, [skuData, kpis, safetyBufferDays, surgePct]);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === '/' && !['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement?.tagName)) {
        e.preventDefault();
        document.getElementById('searchFilter')?.focus();
      }
      if (e.key === 'Escape') clearFilters();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [clearFilters]);

  return (
    <>
      <Header highCount={kpis.highCount} />
      <main>
        <KpiRow kpis={kpis} />
        <Toolbar onExport={exportReport} onPrint={() => window.print()} />
        <RegionSummary
          regions={regions}
          activeRegion={filters.region}
          onSelect={(region) => setFilters(f => ({
            ...f,
            region: f.region === region ? '' : region
          }))}
        />
        <Simulator
          safetyBufferDays={safetyBufferDays}
          surgePct={surgePct}
          onSafetyChange={setSafetyBufferDays}
          onSurgeChange={setSurgePct}
        />
        <div className="workspace">
          <SkuTable
            skus={filtered}
            selectedId={selected?.id}
            safetyBufferDays={safetyBufferDays}
            categories={categories}
            regions={regionList}
            filters={filters}
            sort={sort}
            onFilterChange={setFilters}
            onSortChange={setSort}
            onSelect={setSelectedSkuId}
            categoryBadge={CATEGORY_BADGE}
          />
          <DetailPanel sku={selected} safetyBufferDays={safetyBufferDays} />
        </div>
        <AlertsFeed
          skus={skuData}
          acknowledged={acknowledged}
          onAcknowledge={(id, checked) => {
            setAcknowledged(prev => {
              const next = new Set(prev);
              if (checked) next.add(id); else next.delete(id);
              return next;
            });
          }}
          onSelect={setSelectedSkuId}
        />
        <About />
      </main>
    </>
  );
}

export { weekLabel, formatUnits };
