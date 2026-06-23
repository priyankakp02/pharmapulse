export function formatINR(n) {
  if (n < 0) n = 0;
  if (n < 1e5) return '₹' + Math.round(n).toLocaleString('en-IN');
  if (n < 1e7) return '₹' + (n / 1e5).toFixed(2) + ' L';
  return '₹' + (n / 1e7).toFixed(2) + ' Cr';
}

export function formatUnits(n) {
  return Math.round(n).toLocaleString('en-IN');
}

export function formatDate(d) {
  const date = d instanceof Date ? d : new Date(d);
  return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}

export function weekLabel(d) {
  const date = d instanceof Date ? d : new Date(d);
  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  return months[date.getMonth()] + ' ' + date.getDate();
}

export function runwayColor(risk) {
  if (risk === 'HIGH') return '#C8553D';
  if (risk === 'MEDIUM') return '#F2A541';
  if (risk === 'OVERSTOCK') return '#5B7480';
  return '#1C9C7C';
}
