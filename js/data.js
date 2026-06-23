export const TODAY = new Date(2026, 5, 24);
export const HISTORY_WEEKS = 78;
export const RISK_ORDER = { HIGH: 0, MEDIUM: 1, LOW: 2, OVERSTOCK: 3 };

export const SKUS = [
  { id: 'PAR-500', name: 'ParaMax 500mg', category: 'Pain Relief', region: 'Maharashtra (Mumbai-Pune)', stock: 18000, avgDailyDemand: 650, leadTimeDays: 12, unitCost: 1.0, packSize: 100, seasonality: 'mildMonsoonWinter', isEssential: true },
  { id: 'AMX-625', name: 'Amoxiclav 625', category: 'Antibiotics', region: 'Delhi-NCR', stock: 4200, avgDailyDemand: 180, leadTimeDays: 18, unitCost: 12, packSize: 10, seasonality: 'peakMonsoonWinter', isEssential: true },
  { id: 'INS-PEN', name: 'InsuGlow Pen', category: 'Diabetes Care', region: 'Karnataka (Bengaluru)', stock: 2600, avgDailyDemand: 95, leadTimeDays: 35, unitCost: 350, packSize: 5, seasonality: 'flatGrowth', isEssential: true },
  { id: 'MET-500', name: 'MetforMax 500', category: 'Diabetes Care', region: 'Tamil Nadu (Chennai)', stock: 26000, avgDailyDemand: 900, leadTimeDays: 15, unitCost: 2.5, packSize: 100, seasonality: 'flatGrowth', isEssential: true },
  { id: 'AZI-250', name: 'AzithroCure 250', category: 'Antibiotics', region: 'West Bengal (Kolkata)', stock: 3100, avgDailyDemand: 140, leadTimeDays: 20, unitCost: 14, packSize: 10, seasonality: 'sharpMonsoon', isEssential: true },
  { id: 'CRP-5', name: 'CardioPress 5', category: 'Cardiac', region: 'Telangana (Hyderabad)', stock: 9000, avgDailyDemand: 310, leadTimeDays: 22, unitCost: 3, packSize: 30, seasonality: 'flatChronic', isEssential: true },
  { id: 'CLT-75', name: 'ClotGuard 75', category: 'Cardiac', region: 'Gujarat (Ahmedabad)', stock: 1400, avgDailyDemand: 70, leadTimeDays: 28, unitCost: 9, packSize: 30, seasonality: 'flatChronic', isEssential: true },
  { id: 'DEN-KIT', name: 'DengueChek Rapid Kit', category: 'Diagnostics', region: 'Uttar Pradesh (Lucknow)', stock: 800, avgDailyDemand: 55, leadTimeDays: 25, unitCost: 250, packSize: 20, seasonality: 'sharpDengue', isEssential: false },
  { id: 'ORS-PWD', name: 'ORS PowerSachet', category: 'Wellness/OTC', region: 'Bihar (Patna)', stock: 22000, avgDailyDemand: 700, leadTimeDays: 10, unitCost: 8, packSize: 200, seasonality: 'summerMonsoon', isEssential: true },
  { id: 'VAX-FLU', name: 'VaxShield Flu', category: 'Vaccines', region: 'Rajasthan (Jaipur)', stock: 5200, avgDailyDemand: 60, leadTimeDays: 45, unitCost: 450, packSize: 10, seasonality: 'preWinterVaccine', isEssential: false },
  { id: 'PNE-GEL', name: 'PainEase Gel', category: 'Pain Relief', region: 'Kerala (Kochi)', stock: 12000, avgDailyDemand: 240, leadTimeDays: 14, unitCost: 85, packSize: 50, seasonality: 'mildWinter', isEssential: false },
  { id: 'RSP-INH', name: 'RespiClear Inhaler', category: 'Respiratory', region: 'Delhi-NCR', stock: 2100, avgDailyDemand: 95, leadTimeDays: 20, unitCost: 180, packSize: 10, seasonality: 'winterRespiratory', isEssential: true },
  { id: 'IRN-SYR', name: 'IronPlus Syrup', category: 'Wellness/OTC', region: 'Madhya Pradesh (Bhopal)', stock: 15000, avgDailyDemand: 110, leadTimeDays: 16, unitCost: 95, packSize: 50, seasonality: 'flatSlow', isEssential: false },
  { id: 'THY-50', name: 'ThyroBalance 50', category: 'Endocrine', region: 'Punjab (Ludhiana)', stock: 7000, avgDailyDemand: 260, leadTimeDays: 30, unitCost: 1.8, packSize: 100, seasonality: 'flatGrowth', isEssential: true }
];

export const CATEGORY_BADGE = {
  'Pain Relief': 'badge-pain',
  'Antibiotics': 'badge-antibiotics',
  'Diabetes Care': 'badge-diabetes',
  'Cardiac': 'badge-cardiac',
  'Diagnostics': 'badge-diagnostics',
  'Wellness/OTC': 'badge-wellness',
  'Vaccines': 'badge-vaccines',
  'Respiratory': 'badge-respiratory',
  'Endocrine': 'badge-endocrine'
};
