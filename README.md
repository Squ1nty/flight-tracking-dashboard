![Where's my Flight?](./public/title.svg)

A live flight-tracking web app for Australian and New Zealand airspace. It's built with Next.js 16, TypeScript, and Tailwind CSS v4, using Leaflet for the interactive map. Live aircraft positions come from OpenSky Network, while AviationStack fills in schedule and route data. Each flight gets a detail page with a phase-aware ETA (climbing, cruising, descending, landing) and ground-status detection for parked, taxiing, departing, and arrived aircraft. Signed-in users can save flights to a personal dashboard with live status and custom nicknames, backed by MongoDB and NextAuth. The app also supports dark/light theming and remembers your last-viewed page and map state.


## Features
- 🗺️ Live map — real-time aircraft positions across AUS/NZ airspace with rotating plane markers and airport cluster panels
- 🔍 Flight search — live dropdown search by callsign or airline
- ✈️ Flight detail pages — route, schedule, phase-aware ETA (climbing/cruising/descending/on approach/landing), and live position
- 🛬 Ground status detection — Parked/Taxiing/Departing/Arrived based on airport proximity
- ⛏️ FIFO flight tagging — mining charter flights (Cobham, Alliance, Skippers, Network, Airwork) flagged for WA regional operations
- ⭐ Saved flights dashboard — authenticated users can save flights, set custom nicknames, and track live status from a personal account page
- 🌓 Dark/light theme
- 🧭 Session persistence — remembers last-viewed page and map state (zoom, center, open panels) across navigation


## Tech Stack
**Framework:** Next.js 16 (App Router)

**Language:** TypeScript

**Styling:** Tailwind CSS v4

**Map:** Leaflet + React-Leaflet

**Live-Position Data:** OpenSky Network

**Schedule/Route Data:** Aviation Stack

**Database:** MongoDB Atlas + Mongoose

**Auth:** NextAuth.js (credentials) + bcryptjs

# Getting Started
## Prerequisites
- Node.js 18+
- A MongoDB Atlas cluster (or local MongoDB instance)
- Free PI keys for OpenSky and Aviation Stack

## Installation
```bash 
git clone https://github.com/Squ1nty/flight-tracking-dashboard.git
cd flight-tracking-dashboard
npm install
```

## Environment Variables

To run this project, you will need to add the following environment variables to a .env file in the project's root directory

`MONGODB_URI`

`NEXTAUTH_SECRET`

`NEXTAUTH_URL` = http://localhost:3000

`AVIATIONSTACK_KEY`

`NEXT_PUBLIC_LOGO_DEV_TOKEN`

`NEXT_PUBLIC_BASE_URL` = http://localhost:3000

`REST_COUNTRIES_API_KEY`'

## Run Locally
```bash
npm run dev
```

Visit http://localhost:3000

## Project Structure
```
app/
    ├── page.tsx                  # Search tab
    ├── map/                      # Map tab
    ├── flight/[callsign]/        # Flight detail page
    ├── account/                  # Saved flights dashboard
    ├── login/ register/          # Auth pages
    ├── api/                      # Route handlers (auth, flights, opensky, saved-flights)
    └── components/               # UI components
lib/                              # Data fetching/caching, ETA/status logic, hooks
models/                           # Mongoose schemas (User, SavedFlight)
```

## Known Limitations
- AviationStack's free tier occasionally returns mismatched recurring flight numbers, which was mitigated with date and airport matching
- OpenSky ground coverage is sparse outside major airports — regional/mining airstrips often show no tracked aircrafts
- OpenSky's anonymous tier has a fairly low rate limit; expect occasional 429 codes during heavy testing
- Note* that OpenSky blocks hyperscaler IP ranges including Vercel's, and built graceful fallback handling for when live data is unavailable

## License

This project is licensed under the [MIT License](./LICENSE)