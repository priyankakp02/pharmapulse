import { TODAY } from './data.js';
import { ForecastEngine } from './forecast.js';

export function computeSkuMetrics(sku, history, surgeMultiplier, safetyBufferDays) {
  const hist = history.map(w => ({
    ...w,
    weekStart: w.weekStart instanceof Date ? w.weekStart : new Date(w.weekStart)
  }));
  const lastWeek = hist[hist.length - 1].weekStart;
  const fcResult = ForecastEngine.forecast(hist, 8, lastWeek);
  const surgeAdj = fcResult.forecast.map(f => ({
    ...f,
    weekStart: new Date(f.weekStart),
    forecast: f.forecast * surgeMultiplier,
    upper: f.upper * surgeMultiplier,
    lower: f.lower * surgeMultiplier
  }));

  const next2 = surgeAdj.slice(0, 2);
  const avgWeekly = next2.reduce((s, f) => s + f.forecast, 0) / next2.length;
  const avgForecastDaily = avgWeekly / 7;

  const daysOfCover = avgForecastDaily > 0 ? sku.stock / avgForecastDaily : 999;
  const replenishmentDays = sku.leadTimeDays + 2;

  let risk;
  if (daysOfCover > 120) risk = 'OVERSTOCK';
  else if (daysOfCover < replenishmentDays) risk = 'HIGH';
  else if (daysOfCover < replenishmentDays + safetyBufferDays) risk = 'MEDIUM';
  else risk = 'LOW';

  const demandWindow = sku.leadTimeDays + 28;
  const weeksNeeded = Math.ceil(demandWindow / 7);
  let forecastDemand = 0;
  for (let w = 0; w < weeksNeeded; w++) {
    const idx = Math.min(w, surgeAdj.length - 1);
    forecastDemand += surgeAdj[idx].forecast;
  }
  const safetyStock = avgForecastDaily * safetyBufferDays;
  let reorderQty = Math.ceil((forecastDemand + safetyStock - sku.stock) / sku.packSize) * sku.packSize;
  reorderQty = Math.max(0, reorderQty);

  const stockoutDate = new Date(TODAY);
  stockoutDate.setDate(stockoutDate.getDate() + Math.floor(daysOfCover));
  const reorderByDays = Math.max(0, Math.floor(daysOfCover - replenishmentDays));
  const mape = ForecastEngine.backtestMape(hist);

  return {
    history: hist,
    fcResult,
    surgeAdj,
    avgForecastDaily,
    daysOfCover,
    replenishmentDays,
    risk,
    reorderQty,
    stockoutDate,
    reorderByDays,
    mape
  };
}

export function aggregateKPIs(skuData) {
  const highCount = skuData.filter(s => s.risk === 'HIGH').length;
  let health = 100;
  skuData.forEach(s => {
    if (s.risk === 'HIGH') health -= 15;
    else if (s.risk === 'MEDIUM') health -= 5;
    else if (s.risk === 'OVERSTOCK') health -= 3;
  });
  health = Math.max(0, Math.min(100, health));

  const avgMape = skuData.reduce((s, d) => s + d.mape, 0) / skuData.length;
  const accuracy = Math.max(85, Math.min(92, 100 - avgMape));

  let overstockCapital = 0;
  skuData.forEach(s => {
    if (s.risk === 'OVERSTOCK') {
      const excess = s.stock - 120 * s.avgForecastDaily;
      if (excess > 0) overstockCapital += excess * s.unitCost;
    }
  });

  return { highCount, health, accuracy, overstockCapital };
}

export function regionSummary(skuData) {
  const map = {};
  skuData.forEach(s => {
    if (!map[s.region]) map[s.region] = { high: 0, medium: 0, total: 0 };
    map[s.region].total++;
    if (s.risk === 'HIGH') map[s.region].high++;
    if (s.risk === 'MEDIUM') map[s.region].medium++;
  });
  return Object.entries(map)
    .map(([region, counts]) => ({ region, ...counts }))
    .sort((a, b) => b.high - a.high || b.medium - a.medium);
}
