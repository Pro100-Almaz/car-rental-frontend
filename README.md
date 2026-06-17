# AutoFleet CRM — Frontend

Management dashboard for a car rental business operating in Kazakhstan. Built with Vue 3, Vite, and Tailwind CSS 4 on the TailAdmin Pro template.

## Tech Stack

- **Vue 3.5** — Composition API with `<script setup>`, TypeScript strict
- **Vite 6** — dev server & build
- **Tailwind CSS 4** — utility-first styling with design tokens
- **Pinia 3** — state management (auth store with `organizationId`)
- **Vue Router 4** — SPA routing with lazy-loaded views
- **ApexCharts** — dashboard charts via `vue3-apexcharts`
- **Axios** — API client with interceptors
- **lucide-vue-next** — icon library

## Modules

| Module | Path | Description |
|---|---|---|
| Dashboard | `/` | KPIs, weekly revenue chart, fleet status |
| Fleet | `/fleet` | Vehicle list, detail, create/edit with filters |
| Rentals | `/rentals` | Rental agreements, create/detail |
| Clients | `/clients` | Client directory and profiles |
| Investors | `/investors` | Investor profiles, vehicle binding, P&L, payouts |
| Investor Portal | `/portal` | Read-only investor view (dashboard, vehicles, payouts) |
| Fines | `/fines` | Traffic fine tracking |
| Maintenance | `/maintenance` | Vehicle maintenance records |
| Finance | `/finance` | Cash journal, expense categories |
| Settings | `/settings` | User management, organization settings |

## Getting Started

### Prerequisites

- Node.js 18+ (20+ recommended)
- Backend API running on `localhost:8000` (or configured via ngrok)

### Install & Run

```bash
npm install
npm run dev
```

The dev server proxies `/api` requests to `localhost:8000`.

### Build

```bash
npm run build-only
```

Output goes to `dist/`.

### Type Check

```bash
npm run build
```

Runs `vue-tsc` type checking alongside the build.

## Environment Variables

| Variable | Default | Description |
|---|---|---|
| `VITE_API_URL` | `/api/v1` | Backend API base URL |

- `.env.development` — uses Vite proxy (`/api/v1`)
- `.env.production` — points to the deployed backend URL

## Deploy to Vercel

```bash
npx vercel
```

`vercel.json` is pre-configured with SPA rewrites and `build-only` as the build command. Set `VITE_API_URL` in Vercel environment variables if the backend URL changes.

## Project Structure

```
src/
├── api/            # Axios client with auth interceptors
├── assets/         # Global CSS, fonts
├── components/     # Shared UI components, layout (sidebar, header)
├── composables/    # Reusable logic (useVehicles, useInvestors, etc.)
├── router/         # Route definitions
├── stores/         # Pinia stores (auth)
├── types/          # TypeScript interfaces
├── utils/          # Formatters (currency, dates)
└── views/          # Page components organized by module
```

## Conventions

- **Language**: Russian UI, KZT currency (`formatKZT` utility)
- **Icons**: `lucide-vue-next` exclusively
- **Font**: Plus Jakarta Sans
- **Design tokens**: `brand-500`, `error-500`, `warning-500`, `success-500`
- **API pattern**: composables return reactive refs + async functions, API calls include `organization_id` from auth store
