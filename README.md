# SalesHunter Desk

VisionFrameStudios outbound console for high-ROI prospecting, messaging, and follow-up planning.

## Quick Start

```bash
npm install
npm run dev
```

Visit `http://localhost:3000` to use the dashboard.

## What It Does

- Filters a curated list of Creative Directors, Heads of Content, and E-com Marketing Managers hitting $1M+ revenue bands.
- Auto-generates LinkedIn openers and cold emails anchored to each prospect's latest campaign.
- Tracks daily outreach capacity (30 touchpoints) and supports both LinkedIn + email workflows.
- Logs outreach payloads to a lightweight API stub that can be wired into Notion, HubSpot, or any CRM.
- Produces a ready-to-run 3-step follow-up plan for every prospect (demo loop, case study share, calendar hold).

## Integrations

Two API routes are included as stubs for future integrations:

- `POST /api/outreach` – persist prospect/channel/message details to Notion or HubSpot.
- `POST /api/calendar-hold` – trigger calendar placeholders or reminders.

Add your own logic within those handlers to connect to `notion_api`, `gmail_send`, or `calendar_create` services.

## Tech Stack

- Next.js 14 (App Router)
- React 18 + TypeScript
- Minimal CSS (no external UI frameworks)

## Production Build

```bash
npm run build
npm start
```

Deploy directly to Vercel:

```bash
vercel deploy --prod --yes --token $VERCEL_TOKEN --name agentic-8f940c8d
```

## Testing & Linting

```bash
npm run lint
```

(Static UI — no additional tests required.)

## Customizing

- Extend `lib/prospects.ts` with live data from LinkedIn or any CRM.
- Adjust `lib/messages.ts` to refine personalization templates.
- Enhance `/api` routes to sync with Notion, HubSpot, or Slack alerts.
