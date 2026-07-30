// A minimal in-memory rate limiter — no extra dependency needed.
//
// This protects the two endpoints that actually cost money (Gemini +
// Google Places API calls): /api/itinerary and /api/trips/:id/refine.
// It's IP-based, so it's not bulletproof (shared IPs, proxies, VPNs can
// dodge it), but it stops the simple "someone loops a script against your
// URL and drains your API quota" scenario, which is the realistic risk
// for a small deployed side project.
//
// NOTE: this resets if the server restarts, and won't work correctly if
// you ever run multiple backend instances behind a load balancer (each
// instance would track its own counts). If you outgrow that, swap this
// for a Redis-backed limiter or the `express-rate-limit` package.

const buckets = new Map(); // ip -> { count, resetAt }

export function rateLimit({ windowMs, max }) {
    return (req, res, next) => {
        const ip = req.headers["x-forwarded-for"]?.split(",")[0].trim() || req.socket.remoteAddress || "unknown";
        const now = Date.now();

        let bucket = buckets.get(ip);
        if (!bucket || bucket.resetAt <= now) {
            bucket = { count: 0, resetAt: now + windowMs };
            buckets.set(ip, bucket);
        }

        bucket.count += 1;

        if (bucket.count > max) {
            const retryAfterSec = Math.ceil((bucket.resetAt - now) / 1000);
            res.setHeader("Retry-After", retryAfterSec);
            return res.status(429).json({
                error: "Too many requests",
                message: `You've hit the limit for this action. Try again in about ${retryAfterSec} seconds.`,
            });
        }

        next();
    };
}

// Periodic cleanup so the map doesn't grow forever with stale IPs.
setInterval(() => {
    const now = Date.now();
    for (const [ip, bucket] of buckets.entries()) {
        if (bucket.resetAt <= now) buckets.delete(ip);
    }
}, 10 * 60 * 1000).unref();