import { z } from "zod";

// ---------------------------------------------------------------------------
// Zod schema — this is the contract the model's JSON output must satisfy.
// Used both to describe the shape to the model (via JSON.stringify) and to
// validate/parse the actual response before it hits the database or UI.
// ---------------------------------------------------------------------------
export const StopSchema = z.object({
  activity: z.string(),
  location: z.string(),
  notes: z.string().optional().default(""),
  place_id: z.string().nullable().optional().default(null),
  lat: z.number().nullable().optional().default(null),
  lng: z.number().nullable().optional().default(null),
});

export const MealSchema = z.object({
  spot: z.string(),
  cuisine: z.string(),
  price_range_inr: z.string(),
  why: z.string(),
  place_id: z.string().nullable().optional().default(null),
  lat: z.number().nullable().optional().default(null),
  lng: z.number().nullable().optional().default(null),
});

export const TransportLegSchema = z.object({
  from: z.string(),
  to: z.string(),
  mode: z.string(),
  est_cost_inr: z.number(),
});

export const DaySchema = z.object({
  day: z.number(),
  theme: z.string().optional().default(""),
  morning: StopSchema,
  afternoon: StopSchema,
  evening: StopSchema,
  meals: z.object({
    breakfast: MealSchema,
    lunch: MealSchema,
    dinner: MealSchema,
  }),
  hidden_gem: StopSchema,
  transport: z.array(TransportLegSchema),
  day_total_est_inr: z.number(),
});

export const ItinerarySchema = z.object({
  destination: z.string(),
  starting_from: z.string(),
  total_days: z.number(),
  travel_style: z.string(),
  days: z.array(DaySchema),
  budget_breakdown: z.object({
    accommodation_inr: z.number(),
    food_inr: z.number(),
    transport_inr: z.number(),
    activities_inr: z.number(),
    misc_inr: z.number(),
    total_inr: z.number(),
  }),
  best_time_to_visit: z.string(),
  what_to_avoid: z.string(),
});

// ---------------------------------------------------------------------------
// System prompt
// ---------------------------------------------------------------------------
export const SYSTEM_PROMPT = `You are an expert India travel planner with deep, ground-level knowledge of Indian cities — their neighborhoods, food culture, transport quirks, seasonal patterns, and the gap between what tourists are told and what locals actually recommend.

VOICE — this matters as much as accuracy:
Write like a knowledgeable local friend giving a real recommendation, not a travel website. That means:
- Specific, not generic: "the guy near XYZ market who's been frying jalebis since the 90s" beats "a popular street food stall"
- Honest about trade-offs: "this fort is stunning but skip the audio guide, it's outdated — just hire a local guide at the gate for ₹200"
- Practical asides: mention when to go early to avoid crowds/heat, when an area gets sketchy after dark, when a "must-see" is genuinely overrated
Avoid: "nestled," "hidden treasure," "must-visit," "vibrant tapestry," or any other travel-blog stock phrase.

RULES:
1. Every place you name MUST be verified with the search_places tool before you include it — do not name any restaurant, landmark, market, or attraction without calling the tool first. If a place doesn't turn up in search results, don't include it — pick a different, verifiable one instead.
2. No tourist traps in food recommendations — flag and avoid the obvious tourist-strip restaurants; favor places locals actually eat.
3. Include at least one genuine hidden gem per day — something most tourists miss, not a second-tier version of a famous spot.
4. Respect the stated budget per day and travel style (budget / mid-range / luxury) — food, stay, and activity suggestions should fit that bracket realistically for Indian prices.
5. Transport suggestions should be realistic for the city (auto-rickshaw/metro/cab/walk within a city; train/bus/flight between cities) with honest cost estimates in INR.
6. When you include a place that came from a search_places result, copy its place_id, lat, and lng into the corresponding fields in your JSON output. If a stop has no verified place data (e.g. a general activity like "walk through Old City"), leave those fields null.

OUTPUT FORMAT:
Once you've verified places and are ready to give your final answer, respond with ONLY valid JSON matching the schema you're given in the user message. No preamble, no markdown code fences, no explanation before or after — just the raw JSON object.`;

export function buildUserMessage({ city, days, budgetPerDay, travelStyle, startingCity, travelers, preferredTransport, interests }) {
  return `Plan a trip with these details:
- Destination: ${city}
- Number of days: ${days}
- Budget per day: ₹${budgetPerDay}
- Travel style: ${travelStyle}
- Starting from: ${startingCity}
${travelers ? `- Travelers: ${travelers}` : ""}
${preferredTransport ? `- Preferred Transport: ${preferredTransport}` : ""}
${interests && interests.length ? `- Main Interests: ${interests.join(", ")}` : ""}

Return ONLY a JSON object matching this exact shape (types shown, fill with real content):

{
  "destination": string,
  "starting_from": string,
  "total_days": number,
  "travel_style": string,
  "days": [
    {
      "day": number,
      "theme": string,
      "morning": { "activity": string, "location": string, "notes": string, "place_id": string|null, "lat": number|null, "lng": number|null },
      "afternoon": { "activity": string, "location": string, "notes": string, "place_id": string|null, "lat": number|null, "lng": number|null },
      "evening": { "activity": string, "location": string, "notes": string, "place_id": string|null, "lat": number|null, "lng": number|null },
      "meals": {
        "breakfast": { "spot": string, "cuisine": string, "price_range_inr": string, "why": string, "place_id": string|null, "lat": number|null, "lng": number|null },
        "lunch": { "spot": string, "cuisine": string, "price_range_inr": string, "why": string, "place_id": string|null, "lat": number|null, "lng": number|null },
        "dinner": { "spot": string, "cuisine": string, "price_range_inr": string, "why": string, "place_id": string|null, "lat": number|null, "lng": number|null }
      },
      "hidden_gem": { "activity": string, "location": string, "notes": string, "place_id": string|null, "lat": number|null, "lng": number|null },
      "transport": [ { "from": string, "to": string, "mode": string, "est_cost_inr": number } ],
      "day_total_est_inr": number
    }
  ],
  "budget_breakdown": {
    "accommodation_inr": number,
    "food_inr": number,
    "transport_inr": number,
    "activities_inr": number,
    "misc_inr": number,
    "total_inr": number
  },
  "best_time_to_visit": string,
  "what_to_avoid": string
}`;
}
export function buildRefineMessage({ itinerary, day, instruction }) {
  return `You are refining a single day of an existing itinerary. Context:
- Destination: ${itinerary.destination}
- Travel style: ${itinerary.travel_style}
- Total trip days: ${itinerary.total_days}

Current day ${day.day} (JSON):
${JSON.stringify(day, null, 2)}

Requested change: ${instruction}

Apply the requested change. Verify any NEW place you introduce with the search_places tool before including it (places already in the day that are unaffected by the change can stay as-is). Return ONLY the updated JSON object for this single day — no markdown fences, no explanation — matching this exact shape:

{
  "day": number,
  "theme": string,
  "morning": { "activity": string, "location": string, "notes": string, "place_id": string|null, "lat": number|null, "lng": number|null },
  "afternoon": { "activity": string, "location": string, "notes": string, "place_id": string|null, "lat": number|null, "lng": number|null },
  "evening": { "activity": string, "location": string, "notes": string, "place_id": string|null, "lat": number|null, "lng": number|null },
  "meals": {
    "breakfast": { "spot": string, "cuisine": string, "price_range_inr": string, "why": string, "place_id": string|null, "lat": number|null, "lng": number|null },
    "lunch": { "spot": string, "cuisine": string, "price_range_inr": string, "why": string, "place_id": string|null, "lat": number|null, "lng": number|null },
    "dinner": { "spot": string, "cuisine": string, "price_range_inr": string, "why": string, "place_id": string|null, "lat": number|null, "lng": number|null }
  },
  "hidden_gem": { "activity": string, "location": string, "notes": string, "place_id": string|null, "lat": number|null, "lng": number|null },
  "transport": [ { "from": string, "to": string, "mode": string, "est_cost_inr": number } ],
  "day_total_est_inr": number
}`;
}