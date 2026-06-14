export default function TopBar({ updatedAt }) {
  const date = updatedAt
    ? new Date(updatedAt).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })
    : new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })

  return (
    <header className="topbar">
      <div className="brand">
        <div className="brand-logo">KLB</div>
        <span className="brand-name">KLB OS</span>
        <span className="brand-sep">/</span>
        <span className="brand-sub">Executive Command Center</span>
      </div>
      <div className="topbar-right">
        <span className="system-badge">Pilot</span>
        <span className="user-info">Oscar Figueredo</span>
        <span className="live-date">{date}</span>
      </div>
    </header>
  )
}
