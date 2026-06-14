import { useState, useEffect, useCallback, useRef } from 'react'

// ── SVG PATHS ────────────────────────────────────────────────
const IC = {
  brand:   '<path d="M3 21h18M5 21V7l8-4v18M19 21V11l-6-3"/><path d="M9 9v.01M9 12v.01M9 15v.01M9 18v.01"/>',
  grid:    '<rect x="3" y="3" width="7" height="9"/><rect x="14" y="3" width="7" height="5"/><rect x="14" y="12" width="7" height="9"/><rect x="3" y="16" width="7" height="5"/>',
  con:     '<path d="M6 21V8l6-4 6 4v13"/><path d="M3 21h18"/>',
  cap:     '<path d="M3 7h18v12H3z"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/><circle cx="12" cy="13" r="2"/>',
  ame:     '<path d="M2 7l10-5 10 5-10 5z"/><path d="M2 17l10 5 10-5M2 12l10 5 10-5"/>',
  ir:      '<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>',
  com:     '<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>',
  ops:     '<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>',
  warning: '<path d="M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z"/><path d="M12 9v4M12 17h.01"/>',
  list:    '<path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01"/>',
  check:   '<path d="M9 11l3 3 8-8"/><path d="M20 12v6a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h9"/>',
  shield:  '<path d="M12 2 4 5v6c0 5 3.4 8.5 8 11 4.6-2.5 8-6 8-11V5z"/><path d="M12 8v4M12 16h.01"/>',
  pulse:   '<path d="M22 12h-4l-3 9L9 3l-3 9H2"/>',
  bell:    '<path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9M13.7 21a2 2 0 0 1-3.4 0"/>',
  clock:   '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
  jarvis:  '<circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3M5 5l2 2M17 17l2 2M19 5l-2 2M7 17l-2 2"/>',
  send:    '<path d="M22 2 11 13M22 2l-7 20-4-9-9-4z"/>',
  arrow:   '<path d="M5 12h14M13 6l6 6-6 6"/>',
  db:      '<ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M3 5v14a9 3 0 0 0 18 0V5"/><path d="M3 12a9 3 0 0 0 18 0"/>',
  doc:     '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6M16 13H8M16 17H8M10 9H8"/>',
}

const DIV_ICON = { construction: 'con', capital: 'cap', ame: 'ame', ir: 'ir', com: 'com', executive_ops: 'ops' }
const DIV_COLOR = {
  construction:  { bg: 'rgba(230,126,34,0.14)', color: '#f0a868' },
  capital:       { bg: 'rgba(63,191,127,0.14)',  color: '#5fd6a0' },
  ame:           { bg: 'rgba(124,156,245,0.14)', color: '#9fb6f7' },
  ir:            { bg: 'rgba(201,162,39,0.16)',  color: '#e0c25f' },
  com:           { bg: 'rgba(79,163,255,0.14)',  color: '#7cbcff' },
  executive_ops: { bg: 'rgba(79,163,255,0.14)',  color: '#7cbcff' },
}
const KPI_ICON = {
  open_risks: 'shield', pending_decisions: 'check', active_projects: 'grid',
  open_gates: 'warning', pipeline_value: 'pulse', cash_position: 'cap',
}

// ── HELPERS ──────────────────────────────────────────────────
function bust(url) { return `${url}?v=${Date.now()}` }
async function fetchJson(path) {
  const res = await fetch(bust(`/data/${path}`))
  if (!res.ok) throw new Error(`Failed to load ${path}`)
  return res.json()
}

function fmtVal(kpi) {
  if (kpi.unit === 'USD') {
    const v = Number(kpi.value)
    if (!isNaN(v)) {
      if (v >= 1000000) return `$${(v / 1000000).toFixed(0)}M`
      if (v >= 1000) return `$${(v / 1000).toFixed(0)}K`
      return `$${v}`
    }
  }
  return String(kpi.value)
}

function kpiCls(status) {
  if (status === 'GREEN') return 'kpi-good'
  if (status === 'YELLOW' || status === 'RED') return 'kpi-warn'
  return ''
}
function kpiSubCls(status) {
  if (status === 'GREEN') return 'c-green'
  if (status === 'RED') return 'c-red'
  if (status === 'YELLOW') return 'c-warn'
  return ''
}
function divCls(status) {
  if (status === 'GREEN') return 'h-good'
  if (status === 'YELLOW') return 'h-watch'
  if (status === 'RED') return 'h-act'
  return 'h-dim'
}
function healthScore(divisions) {
  const scored = divisions.filter(d => d.health_score != null)
  if (!scored.length) return 0
  return Math.round(scored.reduce((s, d) => s + d.health_score, 0) / scored.length)
}
function attnCount(divisions) {
  return divisions.filter(d => d.status !== 'GREEN' && d.status !== 'INACTIVE').length
}
function fmtDate(s) {
  if (!s) return ''
  return new Date(s + 'T12:00:00').toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
}
function fmtTime(s) {
  if (!s) return ''
  return new Date(s).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
}
function nowTime() {
  return new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
}

// ── SVG COMPONENT ────────────────────────────────────────────
function Svg({ name, size = 18, style }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
      width={size} height={size} style={style}>
      <g dangerouslySetInnerHTML={{ __html: IC[name] || '' }} />
    </svg>
  )
}

// ── APP ──────────────────────────────────────────────────────
export default function App() {
  const [data, setData]           = useState(null)
  const [error, setError]         = useState(null)
  const [loading, setLoading]     = useState(true)
  const [lastRefresh, setLast]    = useState(null)
  const [activeDiv, setActiveDiv] = useState(null)

  const loadAll = useCallback(async () => {
    try {
      setLoading(true)
      const manifest = await fetchJson('manifest.json')
      const [briefing, divisionHealth, operationalState] = await Promise.all([
        fetchJson('executive_briefing.json'),
        fetchJson('division_health_signal.json'),
        fetchJson('operational_state.json'),
      ])
      const projects = await Promise.all(
        (manifest.projects ?? []).filter(p => p.enabled).map(p => fetchJson(p.file).catch(() => null))
      )
      setData({ manifest, briefing, divisionHealth, operationalState, projects: projects.filter(Boolean) })
      setLast(new Date())
      setError(null)
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { loadAll() }, [loadAll])

  if (loading) return (
    <div className="loading-screen">
      <div className="spinner" />
      <span>Loading KLB OS…</span>
    </div>
  )

  if (error) return (
    <div className="loading-screen">
      <span style={{ fontSize: 26, color: 'var(--red)' }}>⚠</span>
      <span>Error: {error}</span>
      <button className="retry-btn" onClick={loadAll}>Retry</button>
    </div>
  )

  const { briefing, divisionHealth, manifest } = data
  const divisions = divisionHealth?.divisions ?? []
  const allFlags  = divisions.flatMap(d => d.active_flags_summary ?? [])
  const actions   = briefing.recommended_actions ?? []
  const gates     = briefing.pending_gates ?? []
  const score     = healthScore(divisions)
  const attn      = attnCount(divisions)
  const bellCount = actions.length
  const hbCls     = briefing.headline.system_status.toLowerCase()

  return (
    <div className="shell">

      {/* ── SIDEBAR ── */}
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-logo"><Svg name="brand" size={22} /></div>
          <div className="brand-text">
            <h1>KLB OS</h1>
            <span>Executive Command Center</span>
          </div>
        </div>

        <div className="nav-label">Command</div>
        <div className={`nav-item ${!activeDiv ? 'active' : ''}`} onClick={() => setActiveDiv(null)}>
          <Svg name="grid" size={18} />
          Executive
        </div>

        <div className="nav-label">Divisions</div>
        {divisions.map(d => {
          const flags   = d.active_flags_count + d.pending_decisions_count
          const pillCls = (d.highest_flag_severity === 'HIGH' || d.pending_decisions_count > 0) ? 'alert' : 'watch'
          return (
            <div key={d.division_id}
              className={`nav-item ${activeDiv === d.division_id ? 'active' : ''}`}
              onClick={() => setActiveDiv(d.division_id)}>
              <Svg name={DIV_ICON[d.division_id] || 'grid'} size={18} />
              {d.division_name}
              {flags > 0 && (
                <span className={`nav-pill ${pillCls}`} data-tip={d.status_reason}>{flags}</span>
              )}
            </div>
          )
        })}

        <div className="nav-label">System</div>
        <div className="nav-item"><Svg name="db" size={18} />Memory</div>
        <div className="nav-item"><Svg name="doc" size={18} />Reports</div>

        <div className="sidebar-foot">
          <div className="sidebar-foot-icon"><Svg name="brand" size={16} /></div>
          <div>
            <strong>KLB Construction LLC</strong>
            <small>Building with integrity.</small>
          </div>
        </div>
      </aside>

      {/* ── MAIN ── */}
      <main className="main">

        {/* Topbar */}
        <div className="topbar">
          <div className="greet">
            <h2>Good morning, Oscar.</h2>
            <p>Here's how KLB is performing across every division today.</p>
          </div>
          <div className="topbar-right">
            <div className="topbar-when">
              <b>{fmtDate(briefing.briefing_date)}</b>
              <small>{fmtTime(briefing.generated_at)}</small>
            </div>
            <div className="bell">
              <Svg name="bell" size={20} />
              {bellCount > 0 && <span className="bell-badge">{bellCount}</span>}
            </div>
            <div className="avatar">OB</div>
            <button className="refresh-btn" onClick={loadAll} title="Refresh">↻</button>
          </div>
        </div>

        {/* Health bar */}
        <div className={`health-bar hb-${hbCls}`}>
          <div className="hb-left">
            <span className="hb-dot" />
            <div className="hb-score">
              <b>KLB Health</b>
              <span className="hb-num">{score}</span>
              <span className="hb-max">/100</span>
            </div>
            <span className="hb-note">
              {attn} division{attn !== 1 ? 's' : ''} require{attn === 1 ? 's' : ''} attention
            </span>
          </div>
          <div className="hb-right">
            <span className="hb-fresh">
              <Svg name="clock" size={13} />
              Last updated {fmtTime(briefing.generated_at)}
            </span>
            <span className={`hb-status hb-status-${hbCls}`}>
              <span className="hb-status-dot" />
              {hbCls === 'green' ? 'All Clear' : hbCls === 'red' ? 'Action Required' : 'Watch'}
            </span>
          </div>
        </div>

        {/* KPI cards */}
        <div className="kpi-row">
          {briefing.kpis.map(kpi => (
            <div key={kpi.id} className={`kpi ${kpiCls(kpi.status)}`}>
              <div className="kpi-head">
                <span className="kpi-lbl">{kpi.label}</span>
                <Svg name={KPI_ICON[kpi.id] || 'grid'} size={17} />
              </div>
              <div className="val">{fmtVal(kpi)}</div>
              <div className={`sub ${kpiSubCls(kpi.status)}`}>{kpi.meta}</div>
            </div>
          ))}
        </div>

        {/* Attention */}
        {actions.length > 0 && (
          <div className="attention">
            <div className="attention-head">
              <Svg name="warning" size={18} />
              <span className="attention-title">Needs Oscar's Attention</span>
            </div>
            <div className="att-grid">
              {actions.slice(0, 3).map((a, i) => (
                <div key={i} className="att-item">
                  <span className="att-dot" />
                  <div className="att-body">
                    <p>{a.action}</p>
                    <small>{a.reason}</small>
                  </div>
                  <span className={`att-tag ${a.urgency === 'HIGH' || a.urgency === 'CRITICAL' ? 'tag-alert' : 'tag-watch'}`}>
                    {a.urgency}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Executive Operating Layer */}
        <div className="section-title">
          <h3><Svg name="pulse" size={15} />Executive Operating Layer</h3>
          <span>Decisions, priorities, and risks across the whole company.</span>
        </div>
        <div className="triple">

          {/* Priorities */}
          <div className="panel">
            <div className="panel-head">
              <Svg name="list" size={16} /><h4>Executive Priorities</h4>
              <span className="panel-count">Top {Math.min(actions.length, 4)}</span>
            </div>
            {actions.slice(0, 4).map((a, i) => (
              <div key={i} className="prio">
                <span className="prio-num">{String(i + 1).padStart(2, '0')}</span>
                <div className="prio-body">
                  <p>{a.action}</p>
                  <span className="prio-src">
                    <span className="prio-dot" style={{ background: a.urgency === 'HIGH' ? 'var(--red)' : 'var(--yellow)' }} />
                    {a.reason.split('—')[0].trim()}
                  </span>
                </div>
                <span className={`lvl ${a.urgency === 'HIGH' || a.urgency === 'CRITICAL' ? 'lvl-high' : 'lvl-med'}`}>
                  {a.urgency}
                </span>
              </div>
            ))}
            {actions.length === 0 && <div className="empty-panel">No priorities — all clear.</div>}
            <div className="view-all">View all priorities <Svg name="arrow" size={13} /></div>
          </div>

          {/* Decisions */}
          <div className="panel">
            <div className="panel-head">
              <Svg name="check" size={16} /><h4>Pending Decisions</h4>
              <span className="panel-count">{gates.length}</span>
            </div>
            {gates.map(g => (
              <div key={g.gate_id} className="dec">
                <div className="dec-top">
                  <span className="dec-id">{g.gate_id}</span>
                  <span className="dec-badge">Pending</span>
                  <span className="dec-div">{g.engine}</span>
                </div>
                <p>{g.description}</p>
                <small>{g.entity_name} · {g.priority}</small>
              </div>
            ))}
            {gates.length === 0 && <div className="empty-panel">No pending decisions.</div>}
            <div className="view-all">View all decisions <Svg name="arrow" size={13} /></div>
          </div>

          {/* Risks */}
          <div className="panel">
            <div className="panel-head">
              <Svg name="shield" size={16} /><h4>Risk Register</h4>
              <span className="panel-count">{allFlags.length}</span>
            </div>
            {allFlags.slice(0, 4).map((f, i) => (
              <div key={i} className="risk">
                <span className={`risk-sev sev-${f.severity.toLowerCase()}`} />
                <div className="risk-body">
                  <p>{f.description}</p>
                  <span className="risk-meta">
                    <b>{f.severity}</b> · {f.flag_type.replace(/_/g, ' ')}
                  </span>
                </div>
              </div>
            ))}
            {allFlags.length === 0 && <div className="empty-panel">No active risks.</div>}
            <div className="view-all">View full register <Svg name="arrow" size={13} /></div>
          </div>
        </div>

        {/* Division strip */}
        <div className="section-title">
          <h3><Svg name="pulse" size={15} />Division Health</h3>
          <span>Status across all divisions — click any to open its workspace.</span>
        </div>
        <div className="div-strip">
          {divisions.map(d => {
            const hCls    = divCls(d.status)
            const clr     = DIV_COLOR[d.division_id] || { bg: 'rgba(79,163,255,0.14)', color: '#7cbcff' }
            const icon    = DIV_ICON[d.division_id] || 'grid'
            const flags   = d.active_flags_count + d.pending_decisions_count
            const showAtt = d.status !== 'INACTIVE' && d.status !== 'GREEN'
            const attCls  = (d.highest_flag_severity === 'HIGH' || d.pending_decisions_count > 0) ? 'a-alert' : 'a-watch'
            return (
              <div key={d.division_id} className={`dcell ${hCls}`} onClick={() => setActiveDiv(d.division_id)}>
                <div className="dc-top">
                  <div className="dc-icon" style={{ background: clr.bg, color: clr.color }}>
                    <Svg name={icon} size={14} />
                  </div>
                  <div className="dc-name">{d.division_name}</div>
                  <span className={`dc-dot ${hCls}`} />
                </div>
                <div className="dc-metric">{d.status_reason}</div>
                {showAtt
                  ? <span className={`dc-att ${attCls}`}><span className="dc-att-dot" />{flags} flag{flags !== 1 ? 's' : ''}</span>
                  : <span style={{ fontSize: '10.5px', color: 'var(--t-lo)' }}>{d.status}</span>
                }
              </div>
            )
          })}
        </div>

        <div className="dash-footer">
          KLB OS Executive Command Center · Generated by JARVIS ·{' '}
          {lastRefresh ? lastRefresh.toLocaleString('en-US') : manifest?.updated_at ? new Date(manifest.updated_at).toLocaleString('en-US') : '—'}
        </div>
      </main>

      {/* ── JARVIS ── */}
      <JarvisPanel data={data} />
    </div>
  )
}

// ── JARVIS PANEL ─────────────────────────────────────────────
function JarvisPanel({ data }) {
  const { briefing, divisionHealth } = data
  const divisions = divisionHealth?.divisions ?? []
  const allFlags  = divisions.flatMap(d => d.active_flags_summary ?? [])
  const actions   = briefing.recommended_actions ?? []
  const gates     = briefing.pending_gates ?? []

  const [messages, setMessages] = useState([])
  const [showChips, setShowChips] = useState(true)
  const [input, setInput] = useState('')
  const endRef = useRef(null)

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const CHIPS = [
    'What needs my attention today?',
    'How is KLB performing overall?',
    'Show me active risks',
    'What are the pending decisions?',
    'Capital & cash position?',
    'Generate executive summary',
  ]

  function buildResponse(text) {
    const t = text.toLowerCase()
    if (t.includes('attention') || t.includes('today')) {
      return {
        text: `<b>${actions.length} item${actions.length !== 1 ? 's' : ''}</b> require your attention right now:`,
        bullets: actions.map(a => a.action),
      }
    }
    if (t.includes('performing') || t.includes('overall')) {
      return {
        text: `KLB Health: <b>${healthScore(divisions)}/100</b>. ${attnCount(divisions)} division${attnCount(divisions) !== 1 ? 's' : ''} need attention.`,
        bullets: briefing.kpis.map(k => `${k.label}: ${fmtVal(k)} — ${k.meta}`),
      }
    }
    if (t.includes('risk')) {
      return {
        text: `<b>${allFlags.length} active flag${allFlags.length !== 1 ? 's' : ''}</b> across all divisions:`,
        bullets: allFlags.map(f => `${f.severity}: ${f.description}`),
      }
    }
    if (t.includes('decision') || t.includes('gate')) {
      return {
        text: `<b>${gates.length} decision${gates.length !== 1 ? 's' : ''}</b> pending your approval:`,
        bullets: gates.map(g => `${g.gate_id}: ${g.description}`),
      }
    }
    if (t.includes('cash') || t.includes('capital')) {
      const cashKpi = briefing.kpis.find(k => k.id === 'cash_position')
      return {
        text: `Cash position: <b>${fmtVal(cashKpi || { value: '—', unit: null })}</b>. ${cashKpi?.meta ?? ''}`,
        bullets: gates.map(g => `${g.gate_id} · ${g.entity_name}`),
      }
    }
    if (t.includes('summary') || t.includes('report')) {
      return {
        text: 'Executive summary generated.',
        bullets: [
          `KLB Health: ${healthScore(divisions)}/100`,
          `${attnCount(divisions)} divisions need attention`,
          `${actions.length} recommended actions`,
          `${gates.length} pending decisions`,
          `${allFlags.length} active flags`,
        ],
        actions: ['Export', 'Save to Memory'],
      }
    }
    return {
      text: 'In production, JARVIS aggregates data from all engines and returns a structured AI-powered response.',
      bullets: [],
    }
  }

  function send(text) {
    if (!text.trim()) return
    setInput('')
    setShowChips(false)
    setMessages(prev => [...prev, { type: 'user', text: text.trim() }])
    setTimeout(() => {
      setMessages(prev => [...prev, { type: 'jarvis', ts: nowTime(), ...buildResponse(text) }])
    }, 800)
  }

  return (
    <aside className="jarvis">
      <div className="j-head">
        <div className="j-orb"><Svg name="jarvis" size={20} /></div>
        <div className="j-head-text">
          <h4>JARVIS</h4>
          <small>AI Assistant</small>
        </div>
      </div>

      <div className="j-briefing">
        <div className="j-eyebrow">TODAY</div>
        {actions.slice(0, 3).map((a, i) => (
          <div key={i} className="j-line">
            <span className={`j-dot ${a.urgency === 'HIGH' || a.urgency === 'CRITICAL' ? 'jd-red' : 'jd-amber'}`} />
            {a.action.split('—')[0].trim()}
          </div>
        ))}
        <div className="j-summary">
          <b>{actions.length} action{actions.length !== 1 ? 's' : ''}</b> required today.
        </div>
        <div className="j-ts">{fmtTime(briefing.generated_at)}</div>
      </div>

      <div className="j-messages">
        {messages.map((m, i) => (
          <div key={i} className={`j-msg ${m.type === 'user' ? 'user-msg' : ''}`}>
            {m.type === 'user'
              ? <p>{m.text}</p>
              : <>
                  <p dangerouslySetInnerHTML={{ __html: m.text }} />
                  {m.bullets?.length > 0 && (
                    <ul>{m.bullets.map((b, j) => <li key={j}>{b}</li>)}</ul>
                  )}
                  {m.actions?.length > 0 && (
                    <div className="j-msg-actions">
                      {m.actions.map((a, j) => (
                        <button key={j} className={`j-action-btn ${j === 0 ? 'primary' : ''}`}>{a}</button>
                      ))}
                    </div>
                  )}
                  <div className="j-ts">{m.ts}</div>
                </>
            }
          </div>
        ))}
        <div ref={endRef} />
      </div>

      {showChips && (
        <div className="j-chips">
          {CHIPS.map(c => (
            <button key={c} className="j-chip" onClick={() => send(c)}>{c}</button>
          ))}
        </div>
      )}

      <div className="j-input">
        <input
          type="text"
          placeholder="Ask JARVIS anything…"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && send(input)}
        />
        <button className="j-send" onClick={() => send(input)}>
          <Svg name="send" size={16} />
        </button>
      </div>
      <div className="j-footer">JARVIS aggregates data across every<br />division to give company-level insight.</div>
    </aside>
  )
}
