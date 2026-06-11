# MAROS Owner Portal

A standalone, lightweight web portal for restaurant owners to view sales reports, revenue trends, top items, and payment breakdowns remotely.

## Features

- 📊 **KPI Dashboard** — Revenue, orders, average ticket, cancellations
- 📈 **Revenue Trend Chart** — Visualize sales over time
- 🍽️ **Top Items** — Best-selling dishes with revenue breakdown
- 💳 **Payment Methods** — Pie chart of payment distribution
- 🚚 **Order Types** — Dine-in, takeaway, delivery breakdown
- 📄 **PDF Export** — One-click sales report PDF download
- 🌍 **Multi-language** — French, English, Arabic support

## Tech Stack

- React 18 + TypeScript
- Vite
- Tailwind CSS
- Recharts (charts)
- jsPDF + html2canvas (PDF export)
- Zustand (state management)

## Deploy to Vercel

### Option 1: One-Click Deploy (Recommended)

1. Go to [vercel.com](https://vercel.com) and sign in with your GitHub account
2. Click **"Add New Project"**
3. Import the repository `Safgate/Maros-Owner-portal`
4. Vercel will auto-detect Vite settings — just click **"Deploy"**
5. Your portal will be live in ~1 minute!

### Option 2: Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
vercel --prod
```

### Environment Variables

No environment variables are required for basic demo data. The portal ships with auto-generated demo orders for the past 30 days.

To connect to a real backend (Supabase, API, etc.), add:

| Variable | Description |
|----------|-------------|
| `VITE_API_URL` | Your backend API endpoint |
| `VITE_SUPABASE_URL` | Supabase project URL |
| `VITE_SUPABASE_ANON_KEY` | Supabase anon key |

## Local Development

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

## Build

```bash
npm run build
```

## Connecting to Real Data

By default, the portal uses 250 auto-generated demo orders. To connect to your MAROS POS data:

1. Export orders from your MAROS POS app (Settings → Data Export)
2. Or connect to the same Supabase backend as your main MAROS app
3. Replace the demo data in `src/store/seed.ts` with your real data source

---

Built for MAROS — Moroccan Restaurant OS 🇲🇦
