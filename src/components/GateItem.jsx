export default function GateItem({ gate }) {
  const { gate_id, engine, entity_name, description, priority, hours_pending } = gate
  const colorClass = priority === 'CRITICAL' ? 'critical' : 'high'
  const tagClass   = priority === 'CRITICAL' ? 'red' : 'yellow'

  return (
    <div className={`gate-item ${colorClass}`}>
      <div className="gate-title">
        <span className={`gate-tag ${tagClass}`}>{priority}</span>
        {entity_name}
      </div>
      <div className="gate-desc">{description}</div>
      <div className="gate-meta">
        {gate_id} · {engine} engine
        {hours_pending != null ? ` · ${hours_pending}h pending` : ''}
      </div>
    </div>
  )
}
