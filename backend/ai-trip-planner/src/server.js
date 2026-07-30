import "dotenv/config";
import express from "express";
import { z } from "zod";
import { generateItinerary, refineDay } from "./generateItinerary.js";
import { initDb, saveTrip, listTrips, getTripById, updateTripItinerary } from "./db.js";
import { rateLimit } from "./rateLimiter.js";

const app = express();

// In local dev, leave FRONTEND_ORIGIN unset and this falls back to "*" so
// nothing breaks. Before deploying, set FRONTEND_ORIGIN in your backend's
// .env to your actual deployed frontend URL (e.g. https://your-app.vercel.app)
// so random sites/scripts can't call this API directly from a browser.
const FRONTEND_ORIGIN = process.env.FRONTEND_ORIGIN || "*";
if (FRONTEND_ORIGIN === "*") {
  console.warn(
    "⚠️  CORS is wide open (FRONTEND_ORIGIN not set). Fine for local dev — " +
    "set FRONTEND_ORIGIN in .env before deploying publicly."
  );
}

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", FRONTEND_ORIGIN);
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, PATCH, DELETE");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  if (req.method === "OPTIONS") return res.sendStatus(200);
  next();
});

app.use(express.json());

const TripRequestSchema = z.object({
  city: z.string().min(2),
  days: z.number().int().min(1).max(30),
  budgetPerDay: z.number().positive(),
  travelStyle: z.string().default("mid-range"),
  startingCity: z.string().min(2),
  travelers: z.string().optional(),
  preferredTransport: z.string().optional(),
  interests: z.array(z.string()).optional(),
});

// 5 generations per 15 minutes per IP — this endpoint calls Gemini + Google
// Places multiple times, so it's the most expensive one to leave unprotected.
const generateLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 5 });

app.post("/api/itinerary", generateLimiter, async (req, res) => {
  const parsedInput = TripRequestSchema.safeParse(req.body);
  if (!parsedInput.success) {
    return res.status(400).json({ error: "Invalid trip request", details: parsedInput.error.flatten() });
  }

  try {
    const itinerary = await generateItinerary(parsedInput.data);
    const saved = await saveTrip(itinerary);
    res.json({ id: saved.id, created_at: saved.created_at, itinerary });
  } catch (err) {
    console.error("Itinerary generation error:", err);
    res.status(500).json({ error: "Failed to generate itinerary", message: err.message });
  }
});

const RefineRequestSchema = z.object({
  day: z.number().int().min(1),
  instruction: z.string().min(2),
});

// 10 refinements per 15 minutes per IP — cheaper than a full generation
// (one day, not the whole trip) but still calls the AI + Places API.
const refineLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 10 });

app.post("/api/trips/:id/refine", refineLimiter, async (req, res) => {
  const parsedInput = RefineRequestSchema.safeParse(req.body);
  if (!parsedInput.success) {
    return res.status(400).json({ error: "Invalid refine request", details: parsedInput.error.flatten() });
  }

  try {
    const trip = await getTripById(req.params.id);
    if (!trip) {
      return res.status(404).json({ error: "Trip not found" });
    }

    const targetDay = trip.itinerary.days.find((d) => d.day === parsedInput.data.day);
    if (!targetDay) {
      return res.status(404).json({ error: `Day ${parsedInput.data.day} not found in this trip` });
    }

    const refinedDay = await refineDay({
      itinerary: trip.itinerary,
      day: targetDay,
      instruction: parsedInput.data.instruction,
    });

    const updatedItinerary = {
      ...trip.itinerary,
      days: trip.itinerary.days.map((d) => (d.day === refinedDay.day ? refinedDay : d)),
    };

    const saved = await updateTripItinerary(req.params.id, updatedItinerary);
    res.json({ id: saved.id, created_at: saved.created_at, itinerary: saved.itinerary, refined_day: refinedDay.day });
  } catch (err) {
    console.error("Day refinement error:", err);
    res.status(500).json({ error: "Failed to refine day", message: err.message });
  }
});

app.get("/api/trips", async (_req, res) => {
  try {
    const trips = await listTrips();
    res.json(trips);
  } catch (err) {
    console.error("Failed to list trips:", err);
    res.status(500).json({ error: "Failed to list trips", message: err.message });
  }
});

app.get("/api/trips/:id", async (req, res) => {
  try {
    const trip = await getTripById(req.params.id);
    if (!trip) {
      return res.status(404).json({ error: "Trip not found" });
    }
    res.json(trip);
  } catch (err) {
    console.error("Failed to fetch trip:", err);
    res.status(500).json({ error: "Failed to fetch trip", message: err.message });
  }
});

app.get("/health", (_req, res) => res.json({ status: "ok" }));

const PORT = process.env.PORT || 3000;

initDb()
  .then(() => {
    app.listen(PORT, () => console.log(`AI trip planner backend running on port ${PORT}`));
  })
  .catch((err) => {
    console.error("Failed to initialize database:", err);
    process.exit(1);
  });