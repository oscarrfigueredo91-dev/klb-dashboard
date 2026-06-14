const STATUS_FLAG = {
  RED:    'red',
  YELLOW: 'yellow',
  GREEN:  'green',
}

function formatValue(value, unit) {
  if (unit === 'USD' && typeof value === 'number') {
    return value >= 1_000_000
      ? `$${(value / 1_000_000).toFixed(1)}M`
      : value >= 1_000
      ? `$${(value / 1_000).toFixed(0)}K`
      : `$${value.toLocaleString()}`
  }
  return value
}

export default function KpiCard({ kpi }) {
  const { label, value, unit, status, meta } = kpi
  const colorClass = STATUS_FLAG[status] || ''
  const showFlag = status === 'RED' || status === 'YELLOW'

  return (
    <div className="stat-card">
      <div className="stat-label">{label}</div>
      <div className={`stat-value ${colorClass}`}>{formatValue(value, unit)}</div>
      {meta && <div className="stat-meta">{meta}</div>}
      {showFlag && (
        <span className={`stat-flag ${colorClass}`}>
          {status === 'RED' ? 'Action Required' : 'Watch'}
        </span>
      )}
    </div>
  )
}
