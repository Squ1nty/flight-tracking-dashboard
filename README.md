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