import { MapContainer, TileLayer, Marker, Polyline, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Leaflet's default marker icons reference image paths that don't resolve
// correctly under Vite's bundler — this rebuilds them from the CDN so
// markers actually render instead of showing broken image icons.
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
    iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
    shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

// Stop ids intentionally match the ids used by `activeDayStops` in
// ItineraryDashboard.jsx (morning, lunch, afternoon, gem, evening) so that
// hovering a row in the "Pinned Places" list highlights the right marker
// here, and vice versa. Breakfast/dinner have no counterpart in that list,
// so they just never highlight — that's expected.
function buildStops(day) {
    const candidates = [
        { id: "breakfast", label: "Breakfast", kind: "meal", ...day.meals?.breakfast, activity: day.meals?.breakfast?.spot },
        { id: "morning", label: "Morning", kind: "activity", ...day.morning },
        { id: "lunch", label: "Lunch", kind: "meal", ...day.meals?.lunch, activity: day.meals?.lunch?.spot },
        { id: "afternoon", label: "Afternoon", kind: "activity", ...day.afternoon },
        { id: "evening", label: "Evening", kind: "activity", ...day.evening },
        { id: "dinner", label: "Dinner", kind: "meal", ...day.meals?.dinner, activity: day.meals?.dinner?.spot },
        { id: "gem", label: "Hidden gem", kind: "gem", ...day.hidden_gem },
    ];

    return candidates.filter(
        (s) => typeof s.lat === "number" && typeof s.lng === "number"
    );
}

const MARKER_COLORS = {
    activity: "#16233a",
    meal: "#e0604f",
    gem: "#e8a33d",
};

function createIcon(color, isHighlighted) {
    const size = isHighlighted ? 26 : 18;
    return L.divIcon({
        className: "day-map__marker",
        html: `<div style="
            width: ${size}px;
            height: ${size}px;
            border-radius: 50%;
            background: ${color};
            border: 2px solid #fff;
            box-shadow: ${isHighlighted ? "0 0 0 4px rgba(255,255,255,0.45), 0 2px 6px rgba(0,0,0,0.4)" : "0 1px 3px rgba(0,0,0,0.4)"};
            transition: all 0.15s ease;
        "></div>`,
        iconSize: [size, size],
        iconAnchor: [size / 2, size / 2],
        popupAnchor: [0, -size / 2],
    });
}

export default function DayMap({ day, hoveredPin, setHoveredPin }) {
    const stops = buildStops(day);

    if (stops.length === 0) {
        return (
            <div className="day-map day-map--empty">
                No verified locations to show for this day yet.
            </div>
        );
    }

    const center = [stops[0].lat, stops[0].lng];
    const routeLine = stops.map((s) => [s.lat, s.lng]);

    return (
        <div className="day-map">
            <MapContainer center={center} zoom={13} scrollWheelZoom={false} style={{ height: "320px", width: "100%", borderRadius: "16px" }}>
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <Polyline positions={routeLine} pathOptions={{ color: "#6e9cc4", weight: 3, dashArray: "6 8" }} />
                {stops.map((s) => (
                    <Marker
                        key={s.id}
                        position={[s.lat, s.lng]}
                        icon={createIcon(MARKER_COLORS[s.kind], hoveredPin === s.id)}
                        eventHandlers={{
                            mouseover: () => setHoveredPin?.(s.id),
                            mouseout: () => setHoveredPin?.(null),
                        }}
                    >
                        <Popup>
                            <strong>{s.label}</strong>
                            <br />
                            {s.activity}
                            {s.location && (
                                <>
                                    <br />
                                    <span style={{ opacity: 0.7 }}>{s.location}</span>
                                </>
                            )}
                        </Popup>
                    </Marker>
                ))}
            </MapContainer>

            <div className="day-map__legend">
                {Object.entries(MARKER_COLORS).map(([kind, color]) => (
                    <span key={kind} className="day-map__legend-item">
                        <span className="day-map__swatch" style={{ background: color }} />
                        {kind === "gem" ? "Hidden gem" : kind === "meal" ? "Meal" : "Activity"}
                    </span>
                ))}
            </div>
        </div>
    );
}
