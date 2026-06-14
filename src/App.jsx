import { useState, useEffect, useCallback } from 'react'
import TopBar from './components/TopBar.jsx'
import KpiCard from './components/KpiCard.jsx'
import DivisionHealthRow from './components/DivisionHealthRow.jsx'
import GateItem from './components/GateItem.jsx'
import ActionItem from './components/ActionItem.jsx'
import PipelineBar from './components/PipelineBar.jsx'
import ProjectCard from './components/ProjectCard.jsx'
import EngineStatus from './components/EngineStatus.jsx'

const TABS = [
  { id: 'overview',    label: 'Overview'          },
  { id: 'projects',    label: 'Projects'           },
  { id: 'system',      label: 'System Status'      },
]

function bust(url) {
  return `${url}?v=${Date.now()}`
}

async function fetchJson(path) {
  const res = await fetch(bust(`/data/${path}`))
  if (!res.ok) throw new Error(`Failed to load ${path}`)
  return res.json()
}

const STATUS_BANNER = {
  GREEN:  { cls: 'green',  text: 'All systems nominal — no items requiring attention' },
  YELLOW: { cls: 'yellow', text: null },
  RED:    { cls: 'red',    text: null },
}

export default function App() {
  const [tab, setTab]         = useState('overview')
  const [data, setData]       = useState(null)
  const [error, setError]     = useState(null)
  const [loading, setLoading] = useState(true)
  const [lastRefresh, setLastRefresh] = useState(null)

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
        (manifest.projects ?? [])
          .filter(p => p.enabled)
          .map(p => fetchJson(p.file).catch(() => null))
      )

      setData({ manifest, briefing, divisionHealth, operationalState, projects: projects.filter(Boolean) })
      setLastRefresh(new Date())
      setError(null)
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { loadAll() }, [loadAll])

  if (loading) return (
    <>
      <TopBar />
      <div className="loading-screen">
        <div className="spinner" />
        <span>Loading KLB OS data…</span>
      </div>
    </>
  )

  if (error) return (
    <>
      <TopBar />
      <div className="loading-screen">
        <div style={{ fontSize: 22 }}>⚠️</div>
        <span>Failed to load data: {error}</span>
        <button onClick={loadAll} style={{ marginTop: 12, padding: '8px 20px', borderRadius: 8, border: '1px solid var(--border)', cursor: 'pointer', background: 'var(--navy)', color: '#fff', fontSize: 13 }}>
          Retry
        </button>
      </div>
    </>
  )

  const { manifest, briefing, divisionHealth, operationalState, projects } = data

  return (
    <>
      <TopBar updatedAt={manifest.updated_at} />

      <nav className="tab-nav">
        {TABS.map(t => (
          <button
            key={t.id}
            className={`tab-btn ${tab === t.id ? 'active' : ''}`}
            onClick={() => setTab(t.id)}
          >
            {t.label}
          </button>
        ))}
        <div style={{ flex: 1 }} />
        <button
          onClick={loadAll}
          style={{ fontSize: 11, color: 'var(--text-muted)', background: 'none', border: 'none', cursor: 'pointer', padding: '0 4px' }}
          title="Refresh data"
        >
          {lastRefresh ? `Updated ${lastRefresh.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}` : ''}  ↻
        </button>
      </nav>

      {tab === 'overview' && <OverviewTab briefing={briefing} divisionHealth={divisionHealth} projects={projects} />}
      {tab === 'projects' && <ProjectsTab projects={projects} />}
      {tab === 'system'   && <SystemTab ops={operationalState} />}
    </>
  )
}

/* ──────────────────────────────────────
   OVERVIEW TAB
────────────────────────────────────── */
function OverviewTab({ briefing, divisionHealth, projects }) {
  const { headline, kpis = [], pending_gates = [], active_flags = [], pipeline_snapshot, recommended_actions = [] } = briefing
  const { system_status, system_status_reason } = headline
  const bannerCfg = STATUS_BANNER[system_status] || STATUS_BANNER.GREEN
  const bannerText = bannerCfg.text ?? system_status_reason
  const divisions = divisionHealth?.divisions ?? []

  return (
    <div className="main">

      {/* System status banner */}
      <div className={`alert-banner ${bannerCfg.cls}`}>
        <div className="alert-dot" />
        <div>
          <div className="alert-text">
            {system_status === 'GREEN' ? 'All Clear' : system_status === 'RED' ? 'Action Required' : 'Attention Required'}
          </div>
          <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 2 }}>{bannerText}</div>
        </div>
      </div>

      {/* KPI strip */}
      <div className="section-label">Key Metrics</div>
      <div className="stat-strip">
        {kpis.map(kpi => <KpiCard key={kpi.id} kpi={kpi} />)}
      </div>

      {/* Division health + Pipeline (2-col) */}
      <div className="grid-2">
        <div>
          <div className="section-label">Company Health</div>
          <div className="division-health-list">
            {divisions.length === 0
              ? <div className="empty-state"><div className="empty-state-icon">📊</div>No division signals yet</div>
              : divisions.map(d => <DivisionHealthRow key={d.division_id} division={d} />)
            }
          </div>
          <div className="division-footer">Pilot · signals manually seeded · {divisionHealth?.generated_at ? new Date(divisionHealth.generated_at).toLocaleDateString('en-US') : ''}</div>
        </div>

        <div>
          <div className="section-label">Deal Pipeline</div>
          <div className="panel">
            <div className="panel-body">
              <PipelineBar pipeline={pipeline_snapshot} />
            </div>
          </div>
        </div>
      </div>

      {/* Pending Gates + Recommended Actions (2-col) */}
      <div className="grid-2">
        <div>
          <div className="section-label">
            Pending Gates
            {pending_gates.length > 0 && <span style={{ color: 'var(--yellow)', marginLeft: 6 }}>({pending_gates.length})</span>}
          </div>
          <div className="panel">
            <div className="panel-body">
              {pending_gates.length === 0
                ? <div className="empty-state"><div className="empty-state-icon">✓</div>No pending gates</div>
                : <div className="item-list">{pending_gates.map(g => <GateItem key={g.gate_id} gate={g} />)}</div>
              }
            </div>
          </div>
        </div>

        <div>
          <div className="section-label">Recommended Actions</div>
          <div className="panel">
            <div className="panel-body">
              {recommended_actions.length === 0
                ? <div className="empty-state"><div className="empty-state-icon">✓</div>Nothing to act on</div>
                : <div className="item-list">{recommended_actions.map(a => <ActionItem key={a.rank} action={a} />)}</div>
              }
            </div>
          </div>
        </div>
      </div>

      {/* Active Flags */}
      {active_flags.length > 0 && (
        <>
          <div className="section-label" style={{ color: 'var(--red)' }}>Active Flags ({active_flags.length})</div>
          <div className="panel" style={{ marginBottom: 20 }}>
            <div className="panel-body">
              <div className="item-list">
                {active_flags.map((f, i) => (
                  <div key={i} className="gate-item critical">
                    <div className="gate-title"><span className="gate-tag red">{f.severity}</span>{f.flag_type}</div>
                    <div className="gate-desc">{f.description ?? f.entity_name}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      )}

      {/* Pilot project exec card in overview */}
      {projects.length > 0 && (
        <>
          <div className="section-label">Construction Division</div>
          {projects.slice(0, 1).map(p => <ProjectCard key={p.project_id} project={p} />)}
        </>
      )}

      <div className="dash-footer">
        KLB OS Executive Command Center · Generated by JARVIS · {manifest?.updated_at ? new Date(manifest.updated_at).toLocaleString('en-US') : '—'}
      </div>
    </div>
  )
}

/* ──────────────────────────────────────
   PROJECTS TAB
────────────────────────────────────── */
function ProjectsTab({ projects }) {
  return (
    <div className="main">
      <div className="section-label">Active Projects — Pilot Monitor</div>
      {projects.length === 0
        ? (
          <div className="empty-state" style={{ paddingTop: 60 }}>
            <div className="empty-state-icon">🏗️</div>
            No projects loaded. JARVIS can add projects by updating manifest.json and adding project files to data/projects/.
          </div>
        )
        : projects.map(p => <ProjectCard key={p.project_id} project={p} />)
      }
      <div className="dash-footer">
        KLB OS · Projects data updated by JARVIS via data/projects/ · Full portfolio onboarding pending Wave 1
      </div>
    </div>
  )
}

/* ──────────────────────────────────────
   SYSTEM TAB
────────────────────────────────────── */
function SystemTab({ ops }) {
  if (!ops) return <div className="main"><div className="loading-screen">No operational state data</div></div>

  const { system_status, active_projects_summary: aps, last_morning_briefing: lmb, engines = [], pending_actions = [] } = ops

  return (
    <div className="main">

      <div className="section-label">Portfolio Summary</div>
      <div className="ops-tiles">
        <div className="ops-tile">
          <div className="ops-tile-label">Total Active</div>
          <div className="ops-tile-value">{aps?.total_active ?? '—'}</div>
          <div className="ops-tile-sub">projects in portfolio</div>
        </div>
        <div className="ops-tile">
          <div className="ops-tile-label">In Construction</div>
          <div className="ops-tile-value" style={{ color: aps?.in_construction > 0 ? 'var(--navy)' : 'var(--text-muted)' }}>{aps?.in_construction ?? 0}</div>
          <div className="ops-tile-sub">active build sites</div>
        </div>
        <div className="ops-tile">
          <div className="ops-tile-label">Pre-Construction</div>
          <div className="ops-tile-value">{aps?.in_preconstruction ?? 0}</div>
          <div className="ops-tile-sub">projects in planning</div>
        </div>
        <div className="ops-tile">
          <div className="ops-tile-label">In Discovery</div>
          <div className="ops-tile-value">{aps?.in_discovery ?? 0}</div>
          <div className="ops-tile-sub">opportunities evaluating</div>
        </div>
      </div>

      <div className="section-label">Engine Status</div>
      <div style={{ marginBottom: 20 }}>
        <EngineStatus engines={engines} />
      </div>

      <div className="grid-2">
        <div>
          <div className="section-label">System</div>
          <div className="panel">
            <div className="panel-body">
              <div className="fin-rows">
                <div className="fin-row">
                  <span className="fin-label">Mode</span>
                  <span className="fin-value">{system_status?.mode ?? '—'}</span>
                </div>
                <div className="fin-row">
                  <span className="fin-label">Deployment Phase</span>
                  <span className="fin-value">{system_status?.deployment_phase?.replace(/_/g, ' ') ?? '—'}</span>
                </div>
                <div className="fin-row">
                  <span className="fin-label">Pilot Started</span>
                  <span className="fin-value">{system_status?.pilot_start_date ? new Date(system_status.pilot_start_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '—'}</span>
                </div>
                <div className="fin-row">
                  <span className="fin-label">Last Briefing</span>
                  <span className={`fin-value ${lmb?.status === 'complete' ? 'ok' : 'watch'}`}>
                    {lmb?.briefing_id ?? '—'}
                  </span>
                </div>
              </div>
              {system_status?.note && (
                <div style={{ marginTop: 12, fontSize: 12, color: 'var(--text-secondary)', background: 'var(--blue-bg)', border: '1px solid var(--blue-border)', borderRadius: 8, padding: '8px 12px' }}>
                  {system_status.note}
                </div>
              )}
            </div>
          </div>
        </div>

        {pending_actions.length > 0 && (
          <div>
            <div className="section-label">Pending Actions</div>
            <div className="panel">
              <div className="panel-body">
                <div className="item-list">
                  {pending_actions.map(a => (
                    <div key={a.action_id} className="action-item">
                      <div className="action-content">
                        <div className="action-title">{a.description}</div>
                        <div className="action-reason">{a.owner} · Due {a.due}</div>
                      </div>
                      <span className={`urgency-badge ${a.priority?.toUpperCase() === 'HIGH' ? 'HIGH' : 'MEDIUM'}`}>
                        {a.priority}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="dash-footer">
        KLB OS · 9 Engines Certified · KLB OS Production Ready · Pilot Phase Active
      </div>
    </div>
  )
}
