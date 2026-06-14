# KLB OS — Executive Dashboard

Static React dashboard for KLB OS. JARVIS writes JSON to `public/data/`. The UI reads it on every load. Zero hardcoded data.

---

## Deploy to Vercel

1. Push this repo to GitHub (new repo, any name — e.g. `klb-dashboard`)
2. Go to [vercel.com](https://vercel.com) → **Add New Project** → import the repo
3. Vercel auto-detects Vite. Settings:
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
   - **Install Command:** `npm install`
4. Click **Deploy** — live in ~60 seconds
5. Every `git push` to `main` auto-redeploys

---

## How JARVIS Updates the Dashboard

JARVIS **only touches files inside `public/data/`**. The UI code never changes when data changes.

### Daily update flow

```
1. JARVIS generates new BREF
2. JARVIS translates BREF → public/data/executive_briefing.json
3. JARVIS updates public/data/division_health_signal.json
4. JARVIS updates public/data/operational_state.json
5. JARVIS updates manifest.json updated_at timestamp
6. git commit + push → Vercel auto-deploys in ~30s
```

### Adding a new project (zero UI changes)

```json
// In manifest.json, add to projects[]:
{ "id": "PROJ-KLB-2026-002", "file": "projects/PROJ-KLB-2026-002.json", "name": "New Project", "enabled": true }

// Create public/data/projects/PROJ-KLB-2026-002.json following the schema below
// Push → project appears automatically
```

### Adding a new division (zero UI changes)

```json
// In division_health_signal.json, add to divisions[]:
{ "division_id": "realty", "division_name": "Realty", "status": "GREEN", ... }
// Push → division row appears automatically
```

---

## JSON Schema Reference

### `manifest.json` — master control file

The UI reads this first. Everything else is referenced here.

```json
{
  "schema_version": "1.0.0",
  "updated_at": "ISO-TIMESTAMP",        // when JARVIS last wrote data
  "generated_by": "JARVIS",
  "workspace": "KLB",
  "sections": [
    { "id": "executive_briefing",  "file": "executive_briefing.json",   "enabled": true },
    { "id": "division_health",     "file": "division_health_signal.json","enabled": true },
    { "id": "operational_state",   "file": "operational_state.json",     "enabled": true }
  ],
  "projects": [
    { "id": "PROJ-KLB-2026-001", "file": "projects/PROJ-KLB-2026-001.json", "name": "...", "enabled": true }
  ],
  "reports": []
}
```

**Rule:** set `"enabled": false` to hide any section or project without deleting data.

---

### `executive_briefing.json` — daily JARVIS briefing

```json
{
  "schema_version": "1.0.0",
  "bref_id": "BREF-KLB-YYYY-NNN",
  "generated_at": "ISO-TIMESTAMP",
  "briefing_date": "YYYY-MM-DD",
  "briefing_type": "daily | weekly | on_demand",

  "headline": {
    "system_status": "GREEN | YELLOW | RED",
    "system_status_reason": "One-line explanation shown in the banner",
    "requires_attention": true
  },

  "kpis": [
    {
      "id": "unique_id",
      "label": "Display Label",
      "value": 42,                       // number or string
      "unit": "USD | count | % | null",
      "status": "GREEN | YELLOW | RED",
      "trend": "up | down | flat | null",
      "meta": "Sub-line text"            // optional
    }
  ],

  "pending_gates": [
    {
      "gate_id": "CAP-GATE-001",
      "engine": "capital | construction | ame | ir",
      "entity_id": "CSTK-KLB-2026-001",
      "entity_name": "Display name",
      "description": "What needs Oscar's decision",
      "priority": "CRITICAL | HIGH | MEDIUM | LOW",
      "hours_pending": 55
    }
  ],

  "active_flags": [],                    // same shape as pending_gates

  "pipeline_snapshot": {
    "total_deals": 1,
    "total_value_usd": 20000000,
    "stages": [
      { "stage": 1, "label": "Screening",        "count": 0, "value_usd": 0 },
      { "stage": 2, "label": "Due Diligence",     "count": 0, "value_usd": 0 },
      { "stage": 3, "label": "Capital Formation", "count": 1, "value_usd": 20000000 },
      // ... stages 4-8
    ]
  },

  "investor_health": {
    "total_active": 0,
    "strong": 0, "healthy": 0, "at_risk": 0, "lapsed": 0,
    "highest_severity": "NONE | LOW | MEDIUM | HIGH | CRITICAL"
  },

  "communication_health": {
    "total_contacts": 0,
    "healthy": 0, "watch": 0, "at_risk": 0, "critical": 0,
    "highest_severity": "NONE | LOW | MEDIUM | HIGH | CRITICAL"
  },

  "recommended_actions": [
    {
      "rank": 1,
      "action": "What to do — imperative, concise",
      "reason": "Why it matters",
      "urgency": "CRITICAL | HIGH | MEDIUM | LOW",
      "linked_entity": "entity_id | null"
    }
  ]
}
```

**KPI rule:** JARVIS can add any KPI to `kpis[]` — it renders automatically with the same card component. No UI changes needed.

---

### `division_health_signal.json` — company health by division

```json
{
  "schema_version": "1.0.0",
  "generated_at": "ISO-TIMESTAMP",
  "signal_source": "pilot_manual | division_aggregator",
  "divisions": [
    {
      "division_id": "construction | capital | ame | ir | com | executive_ops",
      "division_name": "Display Name",
      "health_score": 85,               // 0-100; null if INACTIVE
      "status": "GREEN | YELLOW | RED | INACTIVE",
      "status_reason": "One-line · max 80 chars",
      "active_flags_count": 0,
      "highest_flag_severity": "NONE | LOW | MEDIUM | HIGH | CRITICAL",
      "pending_decisions_count": 0,
      "active_flags_summary": [
        {
          "flag_id": "FLAG-XXX-001",
          "flag_type": "schedule_risk | budget_overrun | ...",
          "severity": "CRITICAL | HIGH | MEDIUM",
          "description": "What the flag means",
          "linked_entity_id": "PROJ-KLB-2026-001 | null"
        }
      ],
      "pending_decisions_summary": [],
      "top_risk": { "risk_description": "...", "severity": "HIGH", "linked_entity_id": null },
      "cash_impact_usd": 12500,         // null if no financial exposure
      "data_as_of": "ISO-TIMESTAMP",
      "notes": ""
    }
  ]
}
```

**Division rule:** JARVIS adds a new object to `divisions[]` → new row appears in the Company Health panel automatically.

---

### `operational_state.json` — system pulse

```json
{
  "schema_version": "1.0.0",
  "generated_at": "ISO-TIMESTAMP",
  "system_status": {
    "operational": true,
    "mode": "pilot | production",
    "deployment_phase": "pilot_1_project | wave_1 | full",
    "pilot_start_date": "YYYY-MM-DD",
    "note": "Human-readable status note"
  },
  "active_projects_summary": {
    "total_active": 18,
    "in_construction": 5,
    "in_preconstruction": 6,
    "in_discovery": 7,
    "pilot_monitored": 1
  },
  "last_morning_briefing": {
    "date": "YYYY-MM-DD",
    "briefing_id": "BREF-KLB-YYYY-NNN",
    "status": "complete | pending"
  },
  "engines": [
    {
      "id": "capital",
      "label": "Capital Engine",
      "status": "GREEN | YELLOW | RED",
      "last_run": "YYYY-MM-DD",
      "version": "v3.0.0",
      "note": "Optional note"           // optional
    }
  ],
  "pending_actions": [
    {
      "action_id": "ACT-001",
      "description": "What needs to happen",
      "owner": "JARVIS | Oscar Figueredo",
      "priority": "high | medium | low",
      "due": "YYYY-MM-DD"
    }
  ]
}
```

**Engine rule:** JARVIS adds any engine to `engines[]` → appears in the System Status tab automatically.

---

### `projects/{id}.json` — per-project card

```json
{
  "schema_version": "1.0.0",
  "project_id": "PROJ-KLB-2026-001",
  "name": "Project Display Name",
  "type": "new_construction | renovation | development | acquisition",
  "status": "GREEN | YELLOW | RED",
  "stage": "discovery | preconstruction | construction | stabilization | operations",
  "location": "City, ST",
  "client": "Client name",
  "last_updated": "ISO-TIMESTAMP",

  "progress": {
    "phases_complete": 80,
    "phases_total": 114,
    "pct_complete": 62,
    "current_phase": "Carpentry / Tiling",
    "target_completion": "YYYY-MM-DD",
    "completion_at_risk": true
  },

  "kpis": [
    { "id": "unique_id", "label": "Label", "value": "42 | $185,000", "unit": "USD | % | days | null", "status": "GREEN | YELLOW | RED", "note": "Optional sub-line" }
  ],

  "this_week": ["Bullet 1", "Bullet 2"],
  "attention_items": ["Issue 1", "Issue 2"],

  "financial": [
    { "label": "Contract Value", "value": "$185,000", "status": null },
    { "label": "AR Outstanding", "value": "$12,500",  "status": "alert", "note": "Draw 4 pending" }
  ],

  "active_flags": []
}
```

**Project rule:** Add entry to `manifest.json projects[]` + create file → project appears in Projects tab and Overview. No UI code changes.

---

## Local Development

```bash
cd klb-dashboard
npm install
npm run dev
# Open http://localhost:5173
```

## Architecture

```
klb-dashboard/
├── public/
│   ├── icon.svg                     ← PWA icon (KLB gold logo)
│   ├── manifest.webmanifest         ← PWA installable
│   ├── sw.js                        ← Service worker (data always network-first)
│   └── data/                        ← JARVIS writes here ONLY
│       ├── manifest.json            ← Master index + updated_at
│       ├── executive_briefing.json  ← Daily BREF for UI
│       ├── division_health_signal.json
│       ├── operational_state.json
│       └── projects/
│           └── PROJ-KLB-2026-001.json
├── src/
│   ├── main.jsx                     ← Entry point + SW registration
│   ├── App.jsx                      ← Fetch logic + tab routing + all sections
│   ├── index.css                    ← Design system (navy/gold/traffic lights)
│   └── components/
│       ├── TopBar.jsx
│       ├── KpiCard.jsx              ← Generic — renders any kpi{}
│       ├── DivisionHealthRow.jsx    ← Generic — renders any division{}
│       ├── GateItem.jsx
│       ├── ActionItem.jsx
│       ├── PipelineBar.jsx
│       ├── ProjectCard.jsx          ← Generic — renders any project JSON
│       └── EngineStatus.jsx         ← Generic — renders any engines[]
├── index.html
├── vite.config.js
└── package.json
```

**Invariant:** The `src/` folder never changes when data changes. JARVIS owns `public/data/`. UI code owns everything else.
