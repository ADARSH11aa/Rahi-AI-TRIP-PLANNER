# Rāhi — AI Trip Planner

An AI-powered trip planner that generates day-by-day itineraries for Indian destinations, grounded in **real, verified locations** (not AI-hallucinated place names) via Google Places, with an interactive map, a conversational AI copilot for refining your plan, and persistent trip history.


---

## ✨ Features

- **AI-generated, verified itineraries** — Gemini plans your day, but every place it names is checked against the real Google Places API before it's included, so you get real hours, real locations, real coordinates — not invented restaurant names.
- **Interactive map** — every day's stops (morning/afternoon/evening activities, meals, hidden gems) plotted on a Leaflet map, color-coded by type, with hover-sync between the map and the place list.
- **AI copilot for live refinement** — ask it to reduce the budget, avoid crowds, find vegetarian food, or surface hidden gems, and it regenerates that day with newly verified places, not canned text.
- **Real distance & time estimates** — calculated from actual coordinates (Haversine distance + a city-traffic factor), not placeholders.
- **Trip history** — past trips are saved and can be reopened later.
- **Budget breakdown, packing checklist, local tips, weather insight**, and printable/exportable itineraries.

---

## 🏗️ Architecture

```
┌────────────┐      HTTPS      ┌────────────┐      SQL      ┌────────────┐
│  Frontend   │ ──────────────▶ │  Backend    │ ─────────────▶ │  Database   │
│  React+Vite  │ ◀────────────── │  Express     │ ◀───────────── │  Postgres    │
└────────────┘                 └────────────┘                └────────────┘
                                      │
                                      ▼
                          ┌───────────────────────┐
                          │  Gemini (itinerary AI)  │
                          │  Google Places (facts)   │
                          └───────────────────────┘
```

- **`frontend/`** — React + Vite single-page app. Talks to the backend over a REST API.
- **`backend/ai-trip-planner/`** — Node/Express API. Orchestrates Gemini + Google Places, validates AI output against a strict schema, persists trips to Postgres.
- **Database** — PostgreSQL (hosted on [Neon](https://neon.tech) in production), itineraries stored as `JSONB`.

---

## 🛠️ Tech Stack

| Layer | Tech |
|---|---|
| Frontend | React, Vite, Framer Motion, Lucide Icons, Leaflet / react-leaflet |
| Backend | Node.js, Express, Zod (schema validation) |
| AI | Google Gemini (with function/tool calling) |
| Places data | Google Places API |
| Database | PostgreSQL (`pg`) |
| Hosting | Vercel (frontend) · Render (backend) · Neon (database) |

---

## 🚀 Live Demo

- Frontend: https://rahi-ai-trip-planner.vercel.app/
- Backend API: https://rahi-ai-trip-planner.onrender.com

> Note: the backend runs on Render's free tier, which sleeps after 15 minutes of inactivity. The first request after idle time may take 30–60 seconds while it wakes up.

---

## 📦 Local Setup

### Prerequisites
- Node.js 18+
- A [Google AI Studio](https://aistudio.google.com/) API key (for Gemini)
- A [Google Cloud](https://console.cloud.google.com/) API key with the **Places API** enabled
- A PostgreSQL database — either local, or a free one from [Neon](https://neon.tech)

### 1. Clone the repo
```bash
git clone https://github.com/<your-username>/<your-repo>.git
cd <your-repo>
```

### 2. Set up the backend
```bash
cd backend/ai-trip-planner
npm install
cp .env.example .env
```
Edit `.env` and fill in:
```env
GEMINI_API_KEY=your_gemini_api_key_here
PLACES_API_KEY=your_google_places_api_key_here
DATABASE_URL=postgres://user:password@host:5432/dbname
PORT=3000
FRONTEND_ORIGIN=   # leave blank for local dev
```
Then start it:
```bash
npm start
```
You should see `Database ready (trips table checked/created)` and `AI trip planner backend running on port 3000`.

### 3. Set up the frontend
In a **new terminal**:
```bash
cd frontend
npm install
cp .env.example .env
```
Edit `.env`:
```env
VITE_API_BASE=http://localhost:3000
```
Then start it:
```bash
npm run dev
```
Open the URL Vite gives you (usually `http://localhost:5173`).

---

## 🔌 API Reference

| Method | Route | Description |
|---|---|---|
| `POST` | `/api/itinerary` | Generate a new trip itinerary from trip parameters (destination, days, budget, travel style, starting city). Rate-limited to 5 requests / 15 min per IP. |
| `GET` | `/api/trips` | List all saved trips (summary view). |
| `GET` | `/api/trips/:id` | Get a single trip's full itinerary. |
| `POST` | `/api/trips/:id/refine` | Refine a single day of an existing trip with a free-text instruction (used by the AI copilot). Rate-limited to 10 requests / 15 min per IP. |

<details>
<summary>Example: generate an itinerary</summary>

```bash
curl -X POST http://localhost:3000/api/itinerary \
  -H "Content-Type: application/json" \
  -d '{
    "city": "Jaipur",
    "days": 3,
    "budgetPerDay": 3000,
    "travelStyle": "mid-range",
    "startingCity": "Bhubaneswar"
  }'
```
</details>

<details>
<summary>Example: refine a day</summary>

```bash
curl -X POST http://localhost:3000/api/trips/<trip-id>/refine \
  -H "Content-Type: application/json" \
  -d '{
    "day": 1,
    "instruction": "Reduce budget for this day"
  }'
```
</details>

---

## 🔐 How real coordinates are guaranteed

The AI doesn't invent place names or coordinates. Every place it wants to include is first verified through a real `search_places` tool call against the Google Places API — the AI can only use the real name, coordinates, and `place_id` that come back. The final response is then validated against a strict schema (Zod) before it's ever saved or returned, with an automatic retry if the AI's output doesn't match the expected shape.

---

## 🗺️ Project Structure

```
.
├── backend/
│   └── ai-trip-planner/
│       ├── src/
│       │   ├── server.js           # Express app & routes
│       │   ├── generateItinerary.js # AI generation + refinement logic
│       │   ├── prompt.js           # System prompt & Zod schemas
│       │   ├── placesApi.js        # Google Places API wrapper
│       │   ├── db.js               # Postgres connection & queries
│       │   └── rateLimiter.js      # In-memory per-IP rate limiting
│       └── .env.example
└── frontend/
    └── src/
        ├── App.jsx                 # Root component, trip state, routing
        ├── components/
        │   ├── ItineraryDashboard.jsx
        │   ├── DayMap.jsx          # Leaflet map with colored, hover-synced markers
        │   ├── PlannerForm.jsx
        │   └── TripHistoryPage.jsx
        └── App.css
```

---

## ⚠️ Known Limitations

- Distance/time estimates are approximate (straight-line distance × a traffic-factor multiplier), not real road routing.
- The packing checklist is currently static, not personalized per trip.
- Rate limiting is in-memory and IP-based — resets on server restart, not suitable for multi-instance scaling without swapping to a shared store (e.g. Redis).
- Free-tier hosting means the backend may be slow to respond after a period of inactivity.

---

## 📄 License

<!-- 🚧 Add a license if you want one, e.g. MIT — see https://choosealicense.com/ -->
