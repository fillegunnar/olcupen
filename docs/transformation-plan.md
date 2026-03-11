# 🎯 Transformation Plan: Ölcupen Static → Full-Stack Application

## Current State Analysis

- **Domain:** loaolcup.se (Swedish football/beer cup tournament)
- **Tech:** Static HTML/CSS/JS with custom SPA-like navigation
- **Data:** Hardcoded in HTML, Google Sheets embeds for tables/schedules
- **Forms:** Google Forms for registration (external)
- **Features:** Home, Rules, Contact, Player rosters, Tables/Schedules

---

## 📋 Phased Transformation Plan

### Phase 1: Foundation & Infrastructure (Week 1-2)

| Task                    | Description                                                                |
| ----------------------- | -------------------------------------------------------------------------- |
| Set up monorepo         | Create workspace with `frontend/` (React) and `backend/` (TypeScript/Node) |
| React app scaffold      | Vite + React + TypeScript + TailwindCSS                                    |
| TS backend scaffold     | Express + TypeScript with basic API structure                              |
| Database design         | PostgreSQL schema for teams, players, matches, scores                      |
| CI/CD pipeline          | GitHub Actions for build/test/deploy                                       |
| Development environment | Docker Compose for local dev                                               |

#### Backend framework choice

- **Start with:** Express + TypeScript (ubiquitous ecosystem, easy onboarding, great for a first iteration).

### Phase 2a: Frontend Styling & Polish (Static) (Week 2-3)

Before migrating to dynamic data, improve the static frontend with better design and add new content pages:

| Task               | Description                                                     |
| ------------------ | --------------------------------------------------------------- |
| Modern styling     | Apply TailwindCSS, improve responsive design, visual hierarchy  |
| Hall of Fame page  | Display historical tournament winners and notable players       |
| Tournament History | Archive of past tournaments with results and statistics         |
| Do You Know page   | Interesting facts, records, trivia about the tournament         |
| Navigation polish  | Improved header/footer, better mobile experience, accessibility |
| Brand consistency  | Update colors, typography, imagery across all pages             |

### Phase 2b: Backend API Development (Week 3-5)

| Feature       | Endpoints                          |
| ------------- | ---------------------------------- |
| Teams         | `GET/POST/PUT/DELETE /api/teams`   |
| Players       | `GET/POST/PUT/DELETE /api/players` |
| Matches       | `GET/POST/PUT /api/matches`        |
| Scores/Tables | `GET /api/groups/{id}/standings`   |
| Tournament    | `GET /api/tournament/schedule`     |
| Registration  | `POST /api/registration`           |
| Admin auth    | JWT-based admin authentication     |

### Phase 3: Frontend Migration (Week 4-6)

| Component           | Description                         |
| ------------------- | ----------------------------------- |
| Layout & Navigation | React Router with responsive navbar |
| Home page           | Hero section with event info        |
| Rules page          | Static content (markdown support)   |
| Teams/Players       | Dynamic from API, searchable        |
| Tables & Schedule   | Live standings, match results       |
| Registration form   | Replace Google Forms                |
| Admin dashboard     | Manage teams, scores, players       |

### Phase 4: Advanced Features (Week 7-8)

| Feature           | Description                 |
| ----------------- | --------------------------- |
| Real-time updates | WebSockets for live scores  |
| Historical data   | Past tournaments archive    |
| Statistics        | Player/team stats over time |
| Notifications     | Match reminders             |

### Phase 5: Self-Hosting on Home Server (Week 9-10)

| Task               | Description                                                   |
| ------------------ | ------------------------------------------------------------- |
| Server setup       | Install Ubuntu Server or Debian on old PC                     |
| Network config     | Static local IP, port forwarding (80, 443) on router          |
| Dynamic DNS        | Cloudflare Tunnel (recommended) or DuckDNS for dynamic IP     |
| Reverse proxy      | Caddy for automatic HTTPS and routing                         |
| Containerization   | Docker images for frontend, backend, and database             |
| Orchestration      | Docker Compose for simple multi-container management          |
| SSL/TLS            | Automatic via Caddy + Cloudflare, or Let's Encrypt            |
| Domain DNS         | Point loaolcup.se to Cloudflare Tunnel or DDNS                |
| Database hosting   | PostgreSQL in Docker with persistent volumes                  |
| Monitoring         | Uptime Kuma (lightweight, self-hosted status page)            |
| Backup strategy    | Automated database backups to external drive or cloud storage |
| Security hardening | Firewall (ufw), fail2ban, SSH key-only, unattended-upgrades   |
| Power management   | Configure BIOS for auto-restart after power loss              |

#### Home Server Architecture

```
┌──────────────────────────────────────────────────────────────────────┐
│                         Your Home Network                             │
│                                                                       │
│  ┌─────────────┐      ┌─────────────────────────────────────────┐    │
│  │   Router    │      │            Old PC (Home Server)          │    │
│  │             │      │  ┌─────────────────────────────────────┐ │    │
│  │ Port 443 ───┼──────┼─▶│  Cloudflare Tunnel / Caddy          │ │    │
│  │             │      │  │  (Secure ingress + Auto HTTPS)      │ │    │
│  └─────────────┘      │  └──────────────┬──────────────────────┘ │    │
│                       │                 │                         │    │
│                       │    ┌────────────┴────────────┐            │    │
│                       │    │                         │            │    │
│                       │  ┌─▼───────────┐  ┌─────────▼─────────┐  │    │
│                       │  │  Frontend   │  │ Backend (Node/TS) │  │    │
│                       │  │  (React)    │  │ Express API       │  │    │
│                       │  │  Port 3000  │  │  Port 3001        │  │    │
│                       │  └─────────────┘  └─────────┬─────────┘  │    │
│                       │                             │             │    │
│                       │                   ┌─────────▼─────────┐  │    │
│                       │                   │   PostgreSQL      │  │    │
│                       │                   │   Port 5432       │  │    │
│                       │                   └───────────────────┘  │    │
│                       │  ┌─────────────────────────────────────┐ │    │
│                       │  │  Uptime Kuma (Monitoring)           │ │    │
│                       │  └─────────────────────────────────────┘ │    │
│                       └─────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────────────────────────┘

                                    │
                                    ▼
┌──────────────────────────────────────────────────────────────────────┐
│                          Internet                                     │
│   loaolcup.se ──▶ Cloudflare ──▶ Tunnel ──▶ Your Home Server         │
└──────────────────────────────────────────────────────────────────────┘
```

#### Home Server Setup Checklist

| Step | Task                            | Notes                                       |
| ---- | ------------------------------- | ------------------------------------------- |
| 1    | Install Ubuntu Server 24.04 LTS | Minimal install, enable SSH                 |
| 2    | Set static local IP             | e.g., 192.168.1.100 in router DHCP settings |
| 3    | Install Docker & Docker Compose | Official Docker repos                       |
| 4    | Set up Cloudflare Tunnel        | Free, no port forwarding needed, secure     |
| 5    | Configure domain in Cloudflare  | Point loaolcup.se to tunnel                 |
| 6    | Deploy with docker-compose      | Single command deployment                   |
| 7    | Set up automated backups        | Cron job to external drive                  |
| 8    | Configure unattended-upgrades   | Auto security patches                       |

#### Why Cloudflare Tunnel? (Recommended)

- **No port forwarding** — works behind any NAT/firewall
- **No exposed home IP** — your IP stays hidden
- **Free tier** — includes HTTPS, DDoS protection
- **Works with dynamic IP** — no DDNS needed
- **Simple setup** — just run `cloudflared` container

---

## 🤖 AI Agent Practice Strategy

Here's how we can practice with AI agents throughout this project:

### Agent Workflow per Feature

```
User Story → RED (AI writes tests) → GREEN (AI implements) → REFACTOR (clean-coder agent) → COMMIT
```

## 🏗️ Recommended Project Structure

```
olcupen/
├── .github/
│   ├── workflows/          # CI/CD
│   └── copilot-instructions.md
├── frontend/               # React app
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── hooks/
│   │   ├── api/
│   │   └── tests/
│   ├── package.json
│   └── vite.config.ts
├── backend/                # Node.js + TypeScript API (Express)
│   ├── src/
│   │   ├── api/
│   │   ├── db/
│   │   └── tests/
│   ├── package.json
│   ├── tsconfig.json
│   └── migrations/
├── shared/                 # Shared types/contracts
├── docs/                   # User stories, ADRs
├── deploy/                 # Deployment configs
│   ├── docker-compose.prod.yml
│   ├── Caddyfile
│   └── backup-scripts/
├── docker-compose.yml
└── README.md
```

---

## 🚀 Recommended Next Steps

1. **Create the monorepo structure** - Scaffold both React and Node/TypeScript projects
2. **Write user stories** - Document features in `docs/user-stories/`
3. **Start with US-001** - Follow full TDD cycle together
4. **Iterate** - Continue with remaining user stories using ATDD methodology
