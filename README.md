# CC Engage Lite (email-builder-fe)

A React + Vite front-end application for building and previewing email creatives.

**Quick links**
- **Run (dev):** `npm run dev` — starts Vite dev server with HMR
- **Build:** `npm run build` — creates production build
- **Preview:** `npm run preview` — serve the production build locally
- **Lint:** `npm run lint`

**Prerequisites**
- Node.js 18 or newer (recommended)
- npm (comes with Node.js) or Yarn

## Installation

1. Clone the repository

```bash
git clone <repo-url>
cd CC_Engage_Lite
```

2. Install dependencies

```bash
npm install
# or using yarn
# yarn
```

3. Start the development server

```bash
npm run dev
# open http://localhost:5173 (default Vite port)
```

## Environment variables

If the app needs any runtime configuration (API base URL, feature flags), create a `.env` file at the project root. Example:

```env
VITE_API_BASE_URL=https://api.example.com
# Vite exposes variables prefixed with VITE_ to the client
```

After adding or changing env variables, restart the dev server.

## Build & Preview

Create an optimized production build:

```bash
npm run build
```

Preview the production build locally:

```bash
npm run preview
# then open the printed local URL in your browser
```

## Linting

Run ESLint across the project:

```bash
npm run lint
```

## Project structure

- `index.html` — Vite entry
- `src/` — application source
	- `app/` — route-level pages and feature folders (auth, dashboard, creatives, etc.)
	- `components/` — reusable UI components
	- `contexts/` — React context providers
	- `utils/` — helper functions and constants

## Running tests

This repository currently does not include automated unit tests. If you add tests, include instructions here (e.g., `npm run test`).

## Troubleshooting

- If you see module resolution errors, delete `node_modules` and reinstall: `rm -rf node_modules && npm install`
- If ports conflict, set `PORT` env variable before running `npm run dev`:

```bash
PORT=3000 npm run dev
```

## Contributing

1. Create a branch for your change
2. Make your changes and run `npm run lint`
3. Open a pull request with a clear description of changes

## Where to look next

- Main entry: `src/main.jsx`
- App routing and pages: `src/app/`
- API helpers: `src/app/api/apiService.js`

---

If you want, I can also add example `.env` templates, CI instructions, or update docs with screenshots of the UI.
