interface RiskGaugeProps {
  percentage: number;
}

export default function RiskGauge({ percentage }: RiskGaugeProps) {
  const getColor = (value: number) => {
    if (value < 25) return '#4ade80';
    if (value < 50) return '#fbbf24';
    if (value < 75) return '#fb923c';
    return '#ff6b6b';
  };

  const rotation = (percentage / 100) * 180;
  const color = getColor(percentage);

  return (
    <div className="relative w-64 h-32 mx-auto">
      <svg viewBox="0 0 200 100" className="w-full h-full">
        <defs>
          <linearGradient id="gaugeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" style={{ stopColor: '#4ade80', stopOpacity: 1 }} />
            <stop offset="25%" style={{ stopColor: '#fbbf24', stopOpacity: 1 }} />
            <stop offset="50%" style={{ stopColor: '#fb923c', stopOpacity: 1 }} />
            <stop offset="75%" style={{ stopColor: '#ff6b6b', stopOpacity: 1 }} />
          </linearGradient>
        </defs>

        <path
          d="M 20 90 A 80 80 0 0 1 180 90"
          fill="none"
          stroke="#e5e7eb"
          strokeWidth="16"
          strokeLinecap="round"
        />

        <path
          d="M 20 90 A 80 80 0 0 1 180 90"
          fill="none"
          stroke="url(#gaugeGradient)"
          strokeWidth="16"
          strokeLinecap="round"
        />

        <g transform={`rotate(${rotation - 90} 100 90)`}>
          <line
            x1="100"
            y1="90"
            x2="100"
            y2="20"
            stroke="#2C5282"
            strokeWidth="3"
            strokeLinecap="round"
          />
          <circle cx="100" cy="90" r="8" fill="#2C5282" />
          <circle cx="100" cy="20" r="6" fill="#2C5282" />
        </g>

        <text
          x="100"
          y="80"
          textAnchor="middle"
          className="text-4xl font-bold"
          fill={color}
        >
          {percentage}%
        </text>
      </svg>
    </div>
  );
}
