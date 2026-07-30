# AI Trip Planner — Step 1: Itinerary Generation Backend

Minimal Express backend that turns trip parameters into a structured,
validated JSON itinerary using Gemini. This is deliberately scoped to
just the AI generation loop — no DB, no frontend, no tool-use yet.
Get this working reliably first, then build outward (see project plan).

## Setup

```bash
npm install
cp .env.example .env
# edit .env and add your GEMINI_API_KEY
npm run dev
```

## Try it

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

You should get back a full JSON itinerary matching the schema in
`src/prompt.js` — day-by-day activities, meals, hidden gems, transport
legs with cost, and a budget breakdown.

## How it works

- `src/prompt.js` — the system prompt (defines the "local friend" voice
  and rules) plus the Zod schema that doubles as (a) the shape shown to
  the model and (b) the validator for its response.
- `src/generateItinerary.js` — calls the model, parses the JSON, and
  retries once with a corrective message if parsing/validation fails.
  This retry is the single most important reliability feature here —
  raw LLM JSON output fails validation more often than you'd expect.
- `src/server.js` — the one API route (`POST /api/itinerary`), with
  input validation on the way in.

## What's deliberately NOT here yet (see project roadmap)

- Tool-use grounding against a real Places API (Step 2 — this is what
  stops the model from inventing restaurant/landmark names)
- Persistence (Step 3 — Postgres: trips/days/stops)
- Frontend (Step 4)
- On-trip chatbot, PDF export, live pricing (deferred to v2)

## Notes

- Model calls use `gemini-2.0-flash`. Swap the model string in
  `generateItinerary.js` if you want to test cost/quality tradeoffs
  against a smaller model.
- Longer trips (7+ days) can hit output length limits and get
  truncated mid-JSON — this shows up as a parse failure and triggers
  the retry. If you see this a lot, add `maxOutputTokens` to the
  `generationConfig` in `generateItinerary.js`.
- `generationConfig.responseMimeType: "application/json"` tells
  Gemini to skip markdown fences and return raw JSON directly — this
  alone fixes most of the parsing headaches you'd otherwise get.
