export default function RegionSummary({ regions, activeRegion, onSelect }) {
  return (
    <section className="region-summary" aria-label="Risk by region">
      <h2>Hub risk overview</h2>
      <div className="region-chips">
        {regions.map(r => (
          <button
            key={r.region}
            type="button"
            className={`region-chip${activeRegion === r.region ? ' active' : ''}`}
            onClick={() => onSelect(r.region)}
          >
            {r.region}
            {r.high > 0 && <> · <span className="high">{r.high} high</span></>}
          </button>
        ))}
      </div>
    </section>
  );
}
