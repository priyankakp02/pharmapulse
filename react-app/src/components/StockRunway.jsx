import { runwayColor } from '@lib/format.js';

export default function StockRunway({ daysOfCover, replenishmentDays, safetyBuffer, risk, width = 120, height = 20, expanded = false }) {
  const maxScale = Math.max(daysOfCover, replenishmentDays + safetyBuffer, 90);
  const fillPct = Math.min(100, (daysOfCover / maxScale) * 100);
  const tickPct = (replenishmentDays / maxScale) * 100;
  const h = height;
  const w = width;
  const color = runwayColor(risk);
  const ariaLabel = `${Math.round(daysOfCover)} days of cover; replenishment point at ${replenishmentDays} days${fillPct < tickPct ? ' — stockout before reorder arrives' : ''}`;

  return (
    <svg width={expanded ? '100%' : w} height={h} viewBox={`0 0 ${w} ${h}`} role="img" aria-label={ariaLabel} preserveAspectRatio="none">
      <rect x="0" y={h * 0.35} width={w} height={h * 0.3} rx="3" fill="#E8EEF0" />
      <rect x="0" y={h * 0.35} width={(fillPct / 100) * w} height={h * 0.3} rx="3" fill={color} />
      <line x1={(tickPct / 100) * w} y1={h * 0.15} x2={(tickPct / 100) * w} y2={h * 0.85} stroke="#0D3B45" strokeWidth="2" strokeDasharray="3,2" />
      {expanded && (
        <text x={(tickPct / 100) * w} y={h * 0.12} textAnchor="middle" fontSize="9" fill="#5B7480" fontFamily="Inter,sans-serif">Reorder point</text>
      )}
    </svg>
  );
}
