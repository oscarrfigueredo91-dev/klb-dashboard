const STATUS_CONFIG = {
  GREEN:    { dotClass: 'dot-green',    badgeClass: 'green',    label: 'Clear'    },
  YELLOW:   { dotClass: 'dot-yellow',   badgeClass: 'yellow',   label: 'Watch'    },
  RED:      { dotClass: 'dot-red',      badgeClass: 'red',      label: 'Critical' },
  INACTIVE: { dotClass: 'dot-inactive', badgeClass: 'inactive', label: 'Inactive' },
}

export default function DivisionHealthRow({ division }) {
  const { division_name, status, status_reason } = division
  const cfg = STATUS_CONFIG[status] || STATUS_CONFIG.INACTIVE

  return (
    <div className="division-health-row">
      <div className="division-name-group">
        <div className={`division-status-dot ${cfg.dotClass}`} />
        <span className="division-name">{division_name}</span>
      </div>
      <span className="division-note">{status_reason}</span>
      <span className={`division-badge ${cfg.badgeClass}`}>{cfg.label}</span>
    </div>
  )
}
