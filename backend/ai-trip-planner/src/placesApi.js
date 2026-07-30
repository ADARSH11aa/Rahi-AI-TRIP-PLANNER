// Thin wrapper around Places API (New) — Text Search.
const PLACES_ENDPOINT = "https://places.googleapis.com/v1/places:searchText";

const FIELD_MASK = [
  "places.displayName",
  "places.formattedAddress",
  "places.rating",
  "places.userRatingCount",
  "places.location",
  "places.id",
].join(",");

export async function searchPlaces(query) {
  if (!process.env.PLACES_API_KEY) {
    throw new Error("PLACES_API_KEY is not set in .env");
  }

  const response = await fetch(PLACES_ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Goog-Api-Key": process.env.PLACES_API_KEY,
      "X-Goog-FieldMask": FIELD_MASK,
    },
    body: JSON.stringify({ textQuery: query }),
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`Places API error (${response.status}): ${errText}`);
  }

  const data = await response.json();
  const places = data.places || [];

  return places.slice(0, 5).map((p) => ({
    name: p.displayName?.text ?? "Unknown",
    address: p.formattedAddress ?? "",
    rating: p.rating ?? null,
    rating_count: p.userRatingCount ?? null,
    lat: p.location?.latitude ?? null,
    lng: p.location?.longitude ?? null,
    place_id: p.id ?? null,
  }));
}

export const searchPlacesDeclaration = {
  name: "search_places",
  description:
    "Search for real places (restaurants, landmarks, markets, attractions) using Google Places. " +
    "Call this before naming ANY specific place in the itinerary, to confirm it actually exists and " +
    "to get its real address, rating, and coordinates. Do not invent place names without checking here first.",
  parameters: {
    type: "OBJECT",
    properties: {
      query: {
        type: "STRING",
        description:
          "A natural search query including the place name and city/area, e.g. 'Amber Fort Jaipur' or 'best street food near Bapu Bazaar Jaipur'.",
      },
    },
    required: ["query"],
  },
};