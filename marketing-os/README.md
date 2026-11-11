# Marketing OS

Shareef's daily marketing work operating system. Every day it shows **🔴 Overdue · 🟡 Today · 🟢 Next 7 days**, so work across all brands never stops.

React + Vite + TypeScript + Tailwind · installable PWA · local-first (IndexedDB via Dexie) · optional Claude AI.

## Run it

```bash
cd marketing-os
npm install
npm run dev        # http://localhost:5173 (also on your Wi-Fi IP, so you can open it on your phone)
npm test           # engine + Hinglish parser tests
npm run build      # production build in dist/
npm run preview    # serve the production build (service worker + install work here)
```

## Folder structure

```
marketing-os/
├─ public/icons/           app icons (PWA)
├─ src/
│  ├─ data/                ← ALL marketing knowledge. Edit/extend freely.
│  │  ├─ projects.ts       your 6 brands: brief, brand-specific recurring tasks, 20 brand ideas each
│  │  ├─ industries/       15 industry packs (recurring tasks + KPIs for new projects)
│  │  ├─ playbooks/        22 "I'm stuck" playbooks (steps, tips, mistakes, template, AI prompt)
│  │  ├─ chains.ts         chain workflows (blog → publish → index → repurpose, reel → reply → insights…)
│  │  ├─ proMoves.ts       33 advanced tactics
│  │  ├─ checklists.ts     6 checklists
│  │  ├─ calendar.ts       Indian marketing calendar (verify: true = lunar date)
│  │  ├─ prompts.ts        prompt library
│  │  └─ channels.ts       channel emojis + quick-add aliases
│  ├─ db/                  Dexie database, first-run seed, JSON backup/restore
│  ├─ lib/                 engine (recurring + chains), Hinglish parser, dates, AI, reminders, health score
│  ├─ components/          TaskCard (swipe), TaskSheet, QuickAdd, StuckSheet, FocusMode, MorningBrief…
│  ├─ pages/               Today, Projects, ProjectDetail, Library, Calendar, Tools, WeeklyReview, Search, Settings
│  └─ sw.ts                service worker (offline + daily reminder)
├─ vercel.json / netlify.toml   SPA routing for free hosting
```

## How the engine works

- **Recurring**: each recurring task has exactly one open instance. Completing it creates the next one. Missed days roll into **one** overdue instance (the latest missed date) and skipped days are logged as "missed" for the health score — no pile-up.
- **Chains**: a task with "Done hone ke baad (chain)" set creates the next step when completed. Set a *Topic* (e.g. the blog title) so next steps are named properly.
- **Health score**: on-time % of recurring tasks over the last 14 days.
- **Quick add**: `Trendy Prints GBP post tomorrow`, `BM write blog today urgent`, `Cloudforz LinkedIn post every monday`, `RN World reel friday 5pm`, `report monthly 1 dec`, `backup every 3 days`. (Hindi words like kal / aaj / har roz are still understood.)
- **Brand ideas, not generic ideas**: each project has its own idea bank (Library → Brand Ideas, or the project's 💡 Ideas tab). Your 6 brands come with 20 ideas each (`src/data/projects.ts`). For a new project, fill the **brand brief** and tap *Generate 20 brand ideas* (with a Claude key) — or copy the brand prompt into ChatGPT/Claude and paste the answer back to import.
- **Add your own projects**: Projects → **Add project** (or the dashed "Add a new project" card). Pick the industry, fill the brand brief, and the app schedules recurring tasks and opens the Ideas tab. Projects can be edited, archived or deleted.

## Deploy free (Vercel — recommended)

1. Push this repo to GitHub (already done if you're reading this on GitHub).
2. Go to vercel.com → sign in with GitHub → **Add New → Project** → import `being-marketive-marketing-skill`.
3. **Root Directory: `marketing-os`** (important). Framework preset: Vite (auto). Build command `npm run build`, output `dist` (auto).
4. Deploy. You get `https://<name>.vercel.app`.

**Netlify alternative**: app.netlify.com → Add new site → Import from Git → pick the repo → Base directory `marketing-os`, build `npm run build`, publish `marketing-os/dist` → Deploy. (`netlify.toml` already handles routing.)

## Install on your phone

- **Android (Chrome)**: open the URL → menu ⋮ → **Install app** / Add to Home screen.
- **iPhone (Safari)**: open the URL → Share → **Add to Home Screen**.
- Then Tools → Settings → set reminder time → **Turn on reminder** (allow notifications).

## Data & backup

Everything lives on the device (IndexedDB). Tools → Settings → **Export** a JSON backup weekly; **Import** restores it on a new phone. The Claude API key is never included in backups.

## AI

Add your Claude API key in Settings. The key is stored only on your device and calls go straight from your phone to the Claude API. Without a key every AI button shows **Copy prompt** so you can paste into any AI app.
