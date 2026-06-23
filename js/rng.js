import { TODAY, HISTORY_WEEKS } from './data.js';

export function hashStr(s) {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = ((h << 5) - h + s.charCodeAt(i)) | 0;
  return h >>> 0;
}

export function mulberry32(a) {
  return function () {
    a |= 0; a = a + 0x6D2B79F5 | 0;
    let t = Math.imul(a ^ a >>> 15, 1 | a);
    t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  };
}

export function boxMuller(rng) {
  let u = 0, v = 0;
  while (u === 0) u = rng();
  while (v === 0) v = rng();
  return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
}

function genSeasonalMultiplier(type, month) {
  switch (type) {
    case 'mildMonsoonWinter':
      if (month >= 5 && month <= 8) return 1.15;
      if (month >= 10 || month <= 1) return 1.12;
      return 1.0;
    case 'peakMonsoonWinter':
      if (month >= 5 && month <= 8) return 1.35;
      if (month >= 11 || month <= 1) return 1.3;
      return 1.0;
    case 'flatGrowth':
    case 'flatChronic':
      return 1.0;
    case 'sharpMonsoon':
      if (month >= 5 && month <= 8) return 1.55;
      return 0.92;
    case 'sharpDengue':
      if (month >= 6 && month <= 9) return 1.85;
      return 0.75;
    case 'summerMonsoon':
      if (month >= 2 && month <= 8) return 1.35;
      return 0.9;
    case 'preWinterVaccine':
      if (month >= 9 && month <= 11) return 1.8;
      return 0.7;
    case 'mildWinter':
      if (month >= 10 || month <= 1) return 1.18;
      return 1.0;
    case 'winterRespiratory':
      if (month >= 10 || month <= 1) return 1.45;
      return 0.88;
    case 'flatSlow':
      return 0.95;
    default:
      return 1.0;
  }
}

function trendPctForType(type) {
  if (type === 'flatChronic') return 0.001;
  if (type === 'flatGrowth') return 0.002;
  if (type === 'flatSlow') return 0.0003;
  return 0.0015;
}

export function generateHistory(sku) {
  const rng = mulberry32(hashStr(sku.id));
  const baseWeekly = sku.avgDailyDemand * 7;
  const trendPct = trendPctForType(sku.seasonality);
  const volatility = 0.08;
  const weeks = [];

  for (let i = 0; i < HISTORY_WEEKS; i++) {
    const weekEnd = new Date(TODAY);
    weekEnd.setDate(weekEnd.getDate() - (HISTORY_WEEKS - 1 - i) * 7);
    const month = weekEnd.getMonth();
    const seasonal = genSeasonalMultiplier(sku.seasonality, month);
    const noise = boxMuller(rng) * volatility;
    const units = Math.max(1, Math.round(baseWeekly * (1 + trendPct * i) * seasonal * (1 + noise)));
    weeks.push({ weekStart: weekEnd.toISOString(), units, month: month + 1 });
  }
  return weeks;
}
