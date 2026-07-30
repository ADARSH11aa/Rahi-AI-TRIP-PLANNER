import pg from "pg";

const { Pool } = pg;

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

export async function initDb() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS trips (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      destination TEXT NOT NULL,
      total_days INTEGER NOT NULL,
      travel_style TEXT NOT NULL,
      itinerary JSONB NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT now()
    );
  `);
  console.log("Database ready (trips table checked/created)");
}

export async function saveTrip(itinerary) {
  const { rows } = await pool.query(
    `INSERT INTO trips (destination, total_days, travel_style, itinerary)
     VALUES ($1, $2, $3, $4)
     RETURNING id, created_at`,
    [itinerary.destination, itinerary.total_days, itinerary.travel_style, itinerary]
  );
  return rows[0];
}

export async function listTrips() {
  const { rows } = await pool.query(
    `SELECT id, destination, total_days, travel_style, created_at
     FROM trips
     ORDER BY created_at DESC`
  );
  return rows;
}

export async function getTripById(id) {
  const { rows } = await pool.query(`SELECT * FROM trips WHERE id = $1`, [id]);
  return rows[0] || null;
}

export async function updateTripItinerary(id, itinerary) {
  const { rows } = await pool.query(
    `UPDATE trips SET itinerary = $2 WHERE id = $1 RETURNING id, created_at, itinerary`,
    [id, itinerary]
  );
  return rows[0] || null;
}