export default function PipelineBar({ pipeline }) {
  if (!pipeline) return null
  const { stages, total_deals, total_value_usd } = pipeline
  const maxCount = Math.max(...stages.map(s => s.count), 1)

  const fmt = (n) =>
    n >= 1_000_000 ? `$${(n / 1_000_000).toFixed(1)}M`
    : n >= 1_000   ? `$${(n / 1_000).toFixed(0)}K`
    : `$${n}`

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
        <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>
          {total_deals} deal{total_deals !== 1 ? 's' : ''} active
        </span>
        <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-primary)' }}>
          {fmt(total_value_usd)} total
        </span>
      </div>
      <div className="pipeline-stages">
        {stages.map(stage => (
          <div key={stage.stage} className="pipeline-row">
            <div className="pipeline-label">{stage.stage}. {stage.label}</div>
            <div className="pipeline-track">
              <div
                className={`pipeline-fill ${stage.count > 0 ? 'active' : ''}`}
                style={{ width: `${(stage.count / maxCount) * 100}%` }}
              />
            </div>
            <div className="pipeline-count">{stage.count || ''}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
