const DOT = { GREEN: 'dot-green', YELLOW: 'dot-yellow', RED: 'dot-red' }

export default function EngineStatus({ engines = [] }) {
  return (
    <div className="engine-grid">
      {engines.map(engine => (
        <div key={engine.id} className="engine-tile">
          <div className={`engine-dot ${DOT[engine.status] || 'dot-inactive'}`} />
          <div className="engine-info">
            <div className="engine-label">{engine.label}</div>
            <div className="engine-meta">
              {engine.last_run
                ? `Last run ${new Date(engine.last_run).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`
                : 'Not run'}
              {engine.note ? ` · ${engine.note}` : ''}
            </div>
          </div>
          {engine.version && <div className="engine-version">{engine.version}</div>}
        </div>
      ))}
    </div>
  )
}
