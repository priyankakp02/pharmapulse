import { runwayColor } from '@lib/format.js';

export default function AlertsFeed({ skus, acknowledged, onAcknowledge, onSelect }) {
  const urgent = [...skus].sort((a, b) => a.daysOfCover - b.daysOfCover).slice(0, 5);

  return (
    <section className="alerts-section" aria-label="Urgent alerts">
      <h2>Alerts Feed</h2>
      {urgent.map(s => {
        const ack = acknowledged.has(s.id);
        return (
          <div
            key={s.id}
            className={`alert-row${ack ? ' acknowledged' : ''}`}
            onClick={() => onSelect(s.id)}
            style={{ cursor: 'pointer' }}
          >
            <span className="alert-dot" style={{ background: runwayColor(s.risk) }} />
            <div className="alert-info">
              <strong>{s.name}</strong> ({s.id})<br />
              <span className="days">{Math.round(s.daysOfCover)} days</span> of cover remaining · <span className={`risk-badge risk-${s.risk}`}>{s.risk}</span>
            </div>
            <label className="ack-toggle" onClick={e => e.stopPropagation()}>
              <input
                type="checkbox"
                checked={ack}
                onChange={e => onAcknowledge(s.id, e.target.checked)}
                aria-label={`Acknowledge alert for ${s.name}`}
              />
              Acknowledge
            </label>
          </div>
        );
      })}
    </section>
  );
}
