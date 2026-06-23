import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { weekLabel, formatUnits } from '@lib/format.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Filler, Tooltip, Legend);

const todayLinePlugin = {
  id: 'todayLine',
  afterDraw(chart) {
    const idx = 11;
    const { ctx, chartArea, scales } = chart;
    const x = scales.x.getPixelForValue(idx);
    ctx.save();
    ctx.strokeStyle = '#F2A541';
    ctx.lineWidth = 2;
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    ctx.moveTo(x, chartArea.top);
    ctx.lineTo(x, chartArea.bottom);
    ctx.stroke();
    ctx.fillStyle = '#F2A541';
    ctx.font = '11px Inter, sans-serif';
    ctx.fillText('Today', x + 4, chartArea.top + 14);
    ctx.restore();
  }
};

export default function ForecastChart({ sku }) {
  if (!sku) return null;

  const hist12 = sku.history.slice(-12);
  const fc8 = sku.surgeAdj;
  const labels = [...hist12.map(w => weekLabel(w.weekStart)), ...fc8.map(w => weekLabel(w.weekStart))];

  const data = {
    labels,
    datasets: [
      {
        label: 'Actual',
        data: [...hist12.map(w => w.units), ...Array(8).fill(null)],
        borderColor: '#0D3B45',
        borderWidth: 2,
        pointRadius: 2,
        tension: 0.2
      },
      {
        label: 'Forecast',
        data: [...Array(11).fill(null), hist12[11].units, ...fc8.map(w => w.forecast)],
        borderColor: '#1C7293',
        borderDash: [5, 4],
        borderWidth: 2,
        pointRadius: 2,
        tension: 0.2
      },
      {
        label: 'Upper',
        data: [...Array(12).fill(null), ...fc8.map(w => w.upper)],
        borderColor: 'transparent',
        backgroundColor: 'rgba(28, 114, 147, 0.12)',
        fill: '+1',
        pointRadius: 0,
        tension: 0.2
      },
      {
        label: 'Lower',
        data: [...Array(12).fill(null), ...fc8.map(w => w.lower)],
        borderColor: 'transparent',
        backgroundColor: 'rgba(28, 114, 147, 0.12)',
        fill: false,
        pointRadius: 0,
        tension: 0.2
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: { mode: 'index', intersect: false },
    plugins: {
      legend: { display: true, position: 'bottom', labels: { boxWidth: 12, font: { size: 11 } } },
      tooltip: {
        callbacks: {
          label(ctx) {
            if (ctx.parsed.y == null) return null;
            return `${ctx.dataset.label}: ${formatUnits(ctx.parsed.y)} units`;
          }
        }
      }
    },
    scales: {
      x: { ticks: { font: { family: 'Inter', size: 10 }, maxRotation: 45 } },
      y: {
        ticks: { font: { family: 'IBM Plex Mono', size: 10 } },
        title: { display: true, text: 'Units / week', font: { size: 11 } }
      }
    }
  };

  return (
    <div className="chart-wrap">
      <Line data={data} options={options} plugins={[todayLinePlugin]} />
    </div>
  );
}
