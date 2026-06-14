const STATUS_CLASS = { GREEN: 'green', YELLOW: 'yellow', RED: 'red' }
const KPI_STATUS   = { GREEN: '',      YELLOW: 'yellow',  RED: 'red'  }

export default function ProjectCard({ project }) {
  if (!project) return null
  const {
    name, type, location, status, progress,
    kpis = [], this_week = [], attention_items = [], financial = [],
  } = project

  const badgeClass = STATUS_CLASS[status] || 'green'
  const typeLabel  = type?.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase()) ?? ''

  return (
    <div className="project-card">
      <div className="exec-card-header">
        <div>
          <div className="project-name">{name}</div>
          <div className="project-sub">{typeLabel} · {location}</div>
        </div>
        <span className={`health-badge ${badgeClass}`}>
          <span className="health-dot" />
          {status}
        </span>
      </div>

      {progress && (
        <div className="progress-row">
          <div className="progress-label">
            <span>Progress — Phase {progress.phases_complete} of {progress.phases_total}: {progress.current_phase}</span>
            <span style={{ fontWeight: 600 }}>{progress.pct_complete}%</span>
          </div>
          <div className="progress-track">
            <div className="progress-fill" style={{ width: `${progress.pct_complete}%` }} />
          </div>
          {progress.target_completion && (
            <div style={{ fontSize: 11, color: progress.completion_at_risk ? 'var(--yellow)' : 'var(--text-muted)', marginTop: 4 }}>
              Target: {new Date(progress.target_completion).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
              {progress.completion_at_risk ? ' — At Risk' : ''}
            </div>
          )}
        </div>
      )}

      {kpis.length > 0 && (
        <div className="project-kpi-grid">
          {kpis.map(k => (
            <div key={k.id} className="project-kpi-cell">
              <div className="project-kpi-label">{k.label}</div>
              <div className={`project-kpi-value ${KPI_STATUS[k.status] || ''}`}>{formatKpiValue(k)}</div>
              {k.note && <div className="project-kpi-note">{k.note}</div>}
            </div>
          ))}
        </div>
      )}

      <div className="exec-sections">
        {this_week.length > 0 && (
          <div className="exec-section">
            <div className="exec-section-head">THIS WEEK</div>
            <ul className="exec-list">
              {this_week.map((item, i) => <li key={i}>{item}</li>)}
            </ul>
          </div>
        )}

        {attention_items.length > 0 && (
          <div className="exec-section attn">
            <div className="exec-section-head">ATTENTION ({attention_items.length})</div>
            <ul className="exec-list">
              {attention_items.map((item, i) => <li key={i}>{item}</li>)}
            </ul>
          </div>
        )}

        {financial.length > 0 && (
          <div className="exec-section">
            <div className="exec-section-head">FINANCIAL</div>
            <div className="fin-rows">
              {financial.map((row, i) => (
                <div key={i} className="fin-row">
                  <span className="fin-label">{row.label}</span>
                  <span>
                    <span className={`fin-value ${row.status || ''}`}>{row.value}</span>
                    {row.note && <span className="fin-note">{row.note}</span>}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function formatKpiValue(kpi) {
  if (kpi.unit === 'USD' && typeof kpi.value === 'number') {
    return kpi.value >= 1_000_000
      ? `$${(kpi.value / 1_000_000).toFixed(1)}M`
      : `$${kpi.value.toLocaleString()}`
  }
  return kpi.value
}
