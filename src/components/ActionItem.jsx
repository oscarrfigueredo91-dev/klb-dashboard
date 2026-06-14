export default function ActionItem({ action }) {
  const { rank, action: title, reason, urgency } = action
  return (
    <div className="action-item">
      <div className="action-rank">{rank}</div>
      <div className="action-content">
        <div className="action-title">{title}</div>
        <div className="action-reason">{reason}</div>
      </div>
      <span className={`urgency-badge ${urgency}`}>{urgency}</span>
    </div>
  )
}
