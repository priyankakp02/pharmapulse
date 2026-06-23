export const ForecastEngine = {
  seasonalIndex(history) {
    const byMonth = {};
    const counts = {};
    let total = 0, n = 0;
    history.forEach(w => {
      total += w.units; n++;
      byMonth[w.month] = (byMonth[w.month] || 0) + w.units;
      counts[w.month] = (counts[w.month] || 0) + 1;
    });
    const overallAvg = total / n;
    const idx = {};
    for (let m = 1; m <= 12; m++) {
      idx[m] = counts[m] ? (byMonth[m] / counts[m]) / overallAvg : 1;
      idx[m] = Math.max(0.01, idx[m]);
    }
    return idx;
  },

  deseasonalize(weeks, seasonalIndex) {
    return weeks.map(w => w.units / seasonalIndex[w.month]);
  },

  mean(arr) {
    return arr.reduce((a, b) => a + b, 0) / arr.length;
  },

  olsSlope(values) {
    const n = values.length;
    let sumX = 0, sumY = 0, sumXY = 0, sumX2 = 0;
    for (let i = 0; i < n; i++) {
      sumX += i; sumY += values[i];
      sumXY += i * values[i]; sumX2 += i * i;
    }
    const denom = n * sumX2 - sumX * sumX;
    return denom === 0 ? 0 : (n * sumXY - sumX * sumY) / denom;
  },

  stdDev(arr) {
    const m = this.mean(arr);
    return Math.sqrt(arr.reduce((s, x) => s + (x - m) ** 2, 0) / arr.length);
  },

  forecast(history, horizon, endDate) {
    const seasonalIndex = this.seasonalIndex(history);
    const last12 = history.slice(-12);
    const deseason = this.deseasonalize(last12, seasonalIndex);
    const level = this.mean(deseason.slice(-8));
    const trend = this.olsSlope(deseason);

    const residuals = last12.map((w, i) => {
      const fitted = level + trend * i;
      return w.units / seasonalIndex[w.month] - fitted;
    });
    const residStd = this.stdDev(residuals);

    const end = endDate instanceof Date ? endDate : new Date(endDate);
    const results = [];
    for (let t = 1; t <= horizon; t++) {
      const futureDate = new Date(end);
      futureDate.setDate(futureDate.getDate() + t * 7);
      const futureMonth = futureDate.getMonth() + 1;
      const base = (level + trend * (11 + t)) * seasonalIndex[futureMonth];
      const band = 1.28 * residStd * Math.sqrt(t);
      results.push({
        weekStart: futureDate.toISOString(),
        month: futureMonth,
        forecast: Math.max(0, base),
        upper: Math.max(0, base + band),
        lower: Math.max(0, base - band)
      });
    }
    return { seasonalIndex, forecast: results, level, trend, residStd };
  },

  backtestMape(history) {
    if (history.length < 20) return 12;
    const holdout = 8;
    const train = history.slice(0, -holdout);
    const actuals = history.slice(-holdout);
    const endTrain = train[train.length - 1].weekStart;
    const fc = this.forecast(train, holdout, endTrain);
    let sumAPE = 0, count = 0;
    actuals.forEach((w, i) => {
      if (w.units > 0) {
        sumAPE += Math.abs(w.units - fc.forecast[i].forecast) / w.units;
        count++;
      }
    });
    return count ? (sumAPE / count) * 100 : 12;
  }
};
