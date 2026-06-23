export default function About() {
  return (
    <details className="about">
      <summary>About this model</summary>
      <p>
        PharmaPulse estimates future weekly demand by decomposing 18 months of sales history into seasonal patterns (indexed per calendar month), a baseline level, and a linear trend — then re-applies seasonality to project the next 8 weeks. Confidence bands widen with forecast horizon based on historical forecast error. <strong>All data shown is synthetic</strong> and generated for demonstration; SKU tags reflect National List of Essential Medicines (NLEM) categories where applicable.
      </p>
    </details>
  );
}
