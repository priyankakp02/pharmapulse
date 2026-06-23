export default function Simulator({ safetyBufferDays, surgePct, onSafetyChange, onSurgeChange }) {
  const sign = surgePct > 0 ? '+' : '';
  return (
    <section className="simulator" aria-label="What-if simulator">
      <h2>What-If Simulator</h2>
      <div className="slider-group">
        <div className="slider-field">
          <label>Safety buffer (days) <span>{safetyBufferDays}</span></label>
          <input type="range" min="0" max="30" value={safetyBufferDays} onChange={e => onSafetyChange(+e.target.value)} aria-label="Safety buffer days" />
        </div>
        <div className="slider-field">
          <label>Demand surge assumption <span>{sign}{surgePct}%</span></label>
          <input type="range" min="-20" max="60" value={surgePct} onChange={e => onSurgeChange(+e.target.value)} aria-label="Demand surge percentage" />
        </div>
      </div>
    </section>
  );
}
