import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Filter,
  ArrowUpDown,
  Sparkles,
  Wallet,
  MapPin,
  Calendar,
  Layers,
  Compass,
  Copy,
  Trash2,
  ExternalLink,
  Plus,
  TrendingUp,
  Clock,
  Check,
  AlertCircle
} from "lucide-react";

// Curated high quality travel imagery for destination cards
const DESTINATION_IMAGES = {
  Jaipur: "https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=800&q=80",
  Goa: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=800&q=80",
  Kerala: "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=800&q=80",
  Ladakh: "https://images.unsplash.com/photo-1581793745862-99fde7fa73d2?auto=format&fit=crop&w=800&q=80",
  Udaipur: "https://images.unsplash.com/photo-1615836245337-f5b9b2303f10?auto=format&fit=crop&w=800&q=80",
  Varanasi: "https://images.unsplash.com/photo-1561361513-2d000a50f0dc?auto=format&fit=crop&w=800&q=80",
  Manali: "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=800&q=80",
  Default: "https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=800&q=80"
};

const INITIAL_TRIP_HISTORY = [
  {
    id: "trip-jaipur-1",
    destination: "Jaipur",
    starting_from: "Delhi",
    total_days: 3,
    budget_total: 15000,
    budget_per_day: 5000,
    travel_style: "mid-range",
    created_at: "2026-07-27T10:15:00Z",
    image: DESTINATION_IMAGES.Jaipur,
    itinerary: {
      destination: "Jaipur",
      starting_from: "Delhi",
      total_days: 3,
      travel_style: "mid-range",
      days: [
        {
          day: 1,
          theme: "Heritage Forts & Royal Palaces",
          morning: { activity: "Amber Fort & Elephant Courtyard", location: "Amer, Jaipur", notes: "Go early to beat morning crowds." },
          afternoon: { activity: "City Palace & Jantar Mantar", location: "Old City, Jaipur", notes: "Hire official local guide." },
          evening: { activity: "Sunset view at Nahargarh Fort", location: "Nahargarh Hill", notes: "Best photography spot in Jaipur." },
          meals: {
            breakfast: { spot: "Rawat Mishthan Bhandar", cuisine: "Pyaaz Kachori & Chai", price_range_inr: "₹200", why: "Famous local breakfast spot." },
            lunch: { spot: "LMB Restaurant", cuisine: "Traditional Rajasthani Thali", price_range_inr: "₹650", why: "Authentic royal dining." },
            dinner: { spot: "1135 AD", cuisine: "Royal Mughlai & Rajputana", price_range_inr: "₹1,200", why: "Dine inside fort ramparts." }
          },
          hidden_gem: { activity: "Panna Meena ka Kund Stepwell", location: "Amer", notes: "Symmetrical geometric stepwell." },
          transport: [{ from: "Hotel", to: "Amber Fort", mode: "Auto Rickshaw", est_cost_inr: 300 }],
          day_total_est_inr: 5000
        }
      ],
      budget_breakdown: { accommodation_inr: 6000, food_inr: 4500, transport_inr: 2500, activities_inr: 1500, misc_inr: 500, total_inr: 15000 },
      best_time_to_visit: "October through March",
      what_to_avoid: "Skip unverified street guides near gate."
    }
  },
  {
    id: "trip-goa-2",
    destination: "Goa",
    starting_from: "Mumbai",
    total_days: 5,
    budget_total: 25000,
    budget_per_day: 5000,
    travel_style: "luxury",
    created_at: "2026-07-25T14:30:00Z",
    image: DESTINATION_IMAGES.Goa,
    itinerary: {
      destination: "Goa",
      starting_from: "Mumbai",
      total_days: 5,
      travel_style: "luxury",
      days: [
        {
          day: 1,
          theme: "North Goa Beaches & Sunset Shacks",
          morning: { activity: "Vagator Cliff Walk & Chapora Fort", location: "Vagator", notes: "Panoramic ocean views." },
          afternoon: { activity: "Latin Quarter Walk in Fontainhas", location: "Panaji", notes: "Colorful Portuguese architecture." },
          evening: { activity: "Sunset dinner at Curlies Beach Shack", location: "Anjuna", notes: "Live music & fresh seafood." },
          meals: {
            breakfast: { spot: "Infanteria Bakery", cuisine: "Goan Omelette & Pastries", price_range_inr: "₹350", why: "Popular morning cafe." },
            lunch: { spot: "Viva Panjim", cuisine: "Goan Fish Curry Rice", price_range_inr: "₹600", why: "Heritage Goan cuisine." },
            dinner: { spot: "Thalassa", cuisine: "Greek & Mediterranean", price_range_inr: "₹1,500", why: "Cliffside sunset dining." }
          },
          hidden_gem: { activity: "Kakolem Secret Beach Cove", location: "South Goa", notes: "Secluded pristine beach accessible via trail." },
          transport: [{ from: "Airport", to: "Resort", mode: "Private Taxi", est_cost_inr: 1200 }],
          day_total_est_inr: 5000
        }
      ],
      budget_breakdown: { accommodation_inr: 11000, food_inr: 7500, transport_inr: 4000, activities_inr: 1500, misc_inr: 1000, total_inr: 25000 },
      best_time_to_visit: "November through February",
      what_to_avoid: "Avoid swimming during high tide warning flags."
    }
  },
  {
    id: "trip-kerala-3",
    destination: "Kerala",
    starting_from: "Bengaluru",
    total_days: 7,
    budget_total: 28000,
    budget_per_day: 4000,
    travel_style: "mid-range",
    created_at: "2026-07-20T09:10:00Z",
    image: DESTINATION_IMAGES.Kerala,
    itinerary: {
      destination: "Kerala",
      starting_from: "Bengaluru",
      total_days: 7,
      travel_style: "mid-range",
      days: [
        {
          day: 1,
          theme: "Munnar Tea Gardens & Misty Valleys",
          morning: { activity: "Mattupetty Tea Plantation Tour", location: "Munnar", notes: "Fresh tea tasting and green hills." },
          afternoon: { activity: "Eravikulam National Park Safari", location: "Rajamalai", notes: "Spot the endangered Nilgiri Tahr." },
          evening: { activity: "Kathakali & Kalaripayattu Cultural Show", location: "Munnar Town", notes: "Traditional Kerala martial arts." },
          meals: {
            breakfast: { spot: "Saravana Bhavan", cuisine: "Idli, Vada & Filter Coffee", price_range_inr: "₹200", why: "Hot South Indian breakfast." },
            lunch: { spot: "Rapsy Restaurant", cuisine: "Kerala Parotta & Chicken Curry", price_range_inr: "₹350", why: "Local favorite." },
            dinner: { spot: "Teaking Restaurant", cuisine: "Traditional Kerala Sadhya", price_range_inr: "₹500", why: "Served on banana leaf." }
          },
          hidden_gem: { activity: "Lockhart Gap Viewpoint", location: "Munnar", notes: "Breathtaking valley view with minimal crowds." },
          transport: [{ from: "Cochin", to: "Munnar", mode: "AC Cab", est_cost_inr: 2500 }],
          day_total_est_inr: 4000
        }
      ],
      budget_breakdown: { accommodation_inr: 12000, food_inr: 8000, transport_inr: 5000, activities_inr: 2000, misc_inr: 1000, total_inr: 28000 },
      best_time_to_visit: "September through March",
      what_to_avoid: "Beware of heavy monsoon road closures in hilly curves."
    }
  },
  {
    id: "trip-ladakh-4",
    destination: "Ladakh",
    starting_from: "Delhi",
    total_days: 6,
    budget_total: 36000,
    budget_per_day: 6000,
    travel_style: "luxury",
    created_at: "2026-07-15T16:45:00Z",
    image: DESTINATION_IMAGES.Ladakh,
    itinerary: {
      destination: "Ladakh",
      starting_from: "Delhi",
      total_days: 6,
      travel_style: "luxury",
      days: [
        {
          day: 1,
          theme: "Acclimatization & Leh Palace",
          morning: { activity: "Rest & High Altitude Acclimatization", location: "Hotel in Leh", notes: "Mandatory rest for 24h." },
          afternoon: { activity: "Leh Palace & Shanti Stupa Walk", location: "Leh City", notes: "Panoramic Himalayan sunset." },
          evening: { activity: "Leh Main Market Evening Stroll", location: "Main Bazaar", notes: "Handicrafts and Tibetan silver." },
          meals: {
            breakfast: { spot: "The Tibetan Kitchen", cuisine: "Butter Tea & Khambir Bread", price_range_inr: "₹300", why: "Traditional Ladakhi food." },
            lunch: { spot: "Lamayuru Restaurant", cuisine: "Momos & Thukpa Noodle Soup", price_range_inr: "₹450", why: "Hearty mountain meal." },
            dinner: { spot: "Bon Appetit", cuisine: "Woodfired Pizza & Grill", price_range_inr: "₹900", why: "Stunning mountain sunset views." }
          },
          hidden_gem: { activity: "Sankar Gompa Monastery", location: "Leh Suburbs", notes: "Quiet monastery set amidst willow trees." },
          transport: [{ from: "Leh Airport", to: "Hotel", mode: "Taxi Union SUV", est_cost_inr: 800 }],
          day_total_est_inr: 6000
        }
      ],
      budget_breakdown: { accommodation_inr: 16000, food_inr: 9000, transport_inr: 7000, activities_inr: 3000, misc_inr: 1000, total_inr: 36000 },
      best_time_to_visit: "May through September",
      what_to_avoid: "Do not attempt high passes without proper acclimatization."
    }
  }
];

export function TripHistoryPage({ pastTrips = [], onSelectTrip, onPlanNewTrip }) {
  // Merge prop pastTrips with sample fallback trips if pastTrips is empty
  const [tripsList, setTripsList] = useState(() => {
    if (pastTrips && pastTrips.length > 0) {
      return pastTrips.map((t) => ({
        id: t.id || `trip-${Date.now()}`,
        destination: t.destination || t.itinerary?.destination || "Custom Trip",
        starting_from: t.starting_from || t.itinerary?.starting_from || "India",
        total_days: t.total_days || t.itinerary?.total_days || 3,
        budget_total: t.itinerary?.budget_breakdown?.total_inr || (t.total_days || 3) * 4000,
        budget_per_day: Math.round((t.itinerary?.budget_breakdown?.total_inr || (t.total_days || 3) * 4000) / Math.max(1, t.total_days || 3)),
        travel_style: t.travel_style || t.itinerary?.travel_style || "mid-range",
        created_at: t.created_at || new Date().toISOString(),
        image: DESTINATION_IMAGES[t.destination] || DESTINATION_IMAGES.Default,
        itinerary: t.itinerary || t
      }));
    }
    return INITIAL_TRIP_HISTORY;
  });

  // Search, Filter & Sort States
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDestination, setSelectedDestination] = useState("all");
  const [selectedBudget, setSelectedBudget] = useState("all"); // all | low (<10k) | mid (10k-25k) | high (>25k)
  const [selectedDuration, setSelectedDuration] = useState("all"); // all | short (1-3) | medium (4-7) | long (8+)
  const [sortBy, setSortBy] = useState("recent"); // recent | budget-high | duration-long | name

  const [toastMessage, setToastMessage] = useState(null);

  function triggerToast(msg) {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  }

  // Analytics Metrics Calculation
  const analytics = useMemo(() => {
    const totalTrips = tripsList.length;
    const totalMoney = tripsList.reduce((acc, t) => acc + (t.budget_total || 0), 0);
    const uniqueCities = new Set(tripsList.map((t) => t.destination)).size;
    const avgBudget = totalTrips > 0 ? Math.round(totalMoney / totalTrips) : 0;

    return {
      totalTrips,
      totalMoney,
      uniqueCities,
      avgBudget,
    };
  }, [tripsList]);

  // Unique destinations for filter dropdown
  const uniqueDestinationsList = useMemo(() => {
    const set = new Set(tripsList.map((t) => t.destination));
    return Array.from(set);
  }, [tripsList]);

  // Filtered and Sorted Trips List
  const filteredTrips = useMemo(() => {
    return tripsList
      .filter((t) => {
        // Search query
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchesDest = t.destination.toLowerCase().includes(q);
          const matchesStart = (t.starting_from || "").toLowerCase().includes(q);
          const matchesStyle = (t.travel_style || "").toLowerCase().includes(q);
          if (!matchesDest && !matchesStart && !matchesStyle) return false;
        }

        // Destination filter
        if (selectedDestination !== "all" && t.destination !== selectedDestination) {
          return false;
        }

        // Budget filter
        if (selectedBudget === "low" && t.budget_total >= 10000) return false;
        if (selectedBudget === "mid" && (t.budget_total < 10000 || t.budget_total > 25000)) return false;
        if (selectedBudget === "high" && t.budget_total <= 25000) return false;

        // Duration filter
        if (selectedDuration === "short" && t.total_days > 3) return false;
        if (selectedDuration === "medium" && (t.total_days < 4 || t.total_days > 7)) return false;
        if (selectedDuration === "long" && t.total_days < 8) return false;

        return true;
      })
      .sort((a, b) => {
        if (sortBy === "recent") {
          return new Date(b.created_at) - new Date(a.created_at);
        }
        if (sortBy === "budget-high") {
          return b.budget_total - a.budget_total;
        }
        if (sortBy === "duration-long") {
          return b.total_days - a.total_days;
        }
        if (sortBy === "name") {
          return a.destination.localeCompare(b.destination);
        }
        return 0;
      });
  }, [tripsList, searchQuery, selectedDestination, selectedBudget, selectedDuration, sortBy]);

  // Actions
  function handleDuplicate(trip) {
    const duplicated = {
      ...trip,
      id: `trip-copy-${Date.now()}`,
      destination: `${trip.destination} (Copy)`,
      created_at: new Date().toISOString(),
    };
    setTripsList((prev) => [duplicated, ...prev]);
    triggerToast(`Duplicated itinerary for ${trip.destination}!`);
  }

  function handleDelete(id, destName) {
    setTripsList((prev) => prev.filter((t) => t.id !== id));
    triggerToast(`Deleted trip itinerary for ${destName}.`);
  }

  function formatDate(isoStr) {
    if (!isoStr) return "Recently";
    try {
      const d = new Date(isoStr);
      return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
    } catch {
      return "Recently";
    }
  }

  return (
    <section className="trip-history-section" id="history">
      {/* Toast Notification Banner */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            className="history-toast"
            initial={{ opacity: 0, y: -20, x: "-50%" }}
            animate={{ opacity: 1, y: 0, x: "-50%" }}
            exit={{ opacity: 0, y: -20, x: "-50%" }}
          >
            <Sparkles className="toast-ic" />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="container">
        {/* Section Header */}
        <div className="history-header text-center">
          <span className="section-eyebrow">Trip Dashboard & History</span>
          <h2 className="history-title">Your Saved Travel Itineraries</h2>
          <p className="history-subtitle">
            Manage, duplicate, filter, and revisit your personalized AI trip plans anytime.
          </p>
        </div>

        {/* 1. TOP ANALYTICS SAAS DASHBOARD CARDS */}
        <div className="history-analytics-grid">
          <div className="history-stat-card">
            <div className="stat-card-head">
              <span className="stat-card-title">Trips Created</span>
              <div className="stat-ic-box blue">
                <Layers className="stat-ic" />
              </div>
            </div>
            <span className="stat-big-val">{analytics.totalTrips}</span>
            <span className="stat-sub-text">Total Itineraries Generated</span>
          </div>

          <div className="history-stat-card">
            <div className="stat-card-head">
              <span className="stat-card-title">Money Planned</span>
              <div className="stat-ic-box green">
                <Wallet className="stat-ic" />
              </div>
            </div>
            <span className="stat-big-val">₹{analytics.totalMoney.toLocaleString()}</span>
            <span className="stat-sub-text">Total Budget Optimized</span>
          </div>

          <div className="history-stat-card">
            <div className="stat-card-head">
              <span className="stat-card-title">Cities Visited</span>
              <div className="stat-ic-box purple">
                <MapPin className="stat-ic" />
              </div>
            </div>
            <span className="stat-big-val">{analytics.uniqueCities}</span>
            <span className="stat-sub-text">Unique Destinations</span>
          </div>

          <div className="history-stat-card">
            <div className="stat-card-head">
              <span className="stat-card-title">Average Budget</span>
              <div className="stat-ic-box cyan">
                <TrendingUp className="stat-ic" />
              </div>
            </div>
            <span className="stat-big-val">₹{analytics.avgBudget.toLocaleString()}</span>
            <span className="stat-sub-text">Per Trip Itinerary</span>
          </div>
        </div>

        {/* 2. FILTERING & SORTING CONTROL BAR */}
        <div className="history-controls-bar">
          {/* Search Input */}
          <div className="history-search-box">
            <Search className="search-ic" />
            <input
              type="text"
              placeholder="Search destination, starting city or style..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="history-search-input"
            />
            {searchQuery && (
              <button
                type="button"
                className="clear-search-btn"
                onClick={() => setSearchQuery("")}
              >
                ×
              </button>
            )}
          </div>

          {/* Filter Group */}
          <div className="history-filters-group">
            {/* Destination Selector */}
            <div className="filter-select-wrapper">
              <MapPin className="select-ic" />
              <select
                value={selectedDestination}
                onChange={(e) => setSelectedDestination(e.target.value)}
                className="history-select"
              >
                <option value="all">All Destinations</option>
                {uniqueDestinationsList.map((dest) => (
                  <option key={dest} value={dest}>
                    {dest}
                  </option>
                ))}
              </select>
            </div>

            {/* Budget Selector */}
            <div className="filter-select-wrapper">
              <Wallet className="select-ic" />
              <select
                value={selectedBudget}
                onChange={(e) => setSelectedBudget(e.target.value)}
                className="history-select"
              >
                <option value="all">All Budgets</option>
                <option value="low">Under ₹10,000</option>
                <option value="mid">₹10,000 - ₹25,000</option>
                <option value="high">Above ₹25,000</option>
              </select>
            </div>

            {/* Duration Selector */}
            <div className="filter-select-wrapper">
              <Calendar className="select-ic" />
              <select
                value={selectedDuration}
                onChange={(e) => setSelectedDuration(e.target.value)}
                className="history-select"
              >
                <option value="all">All Durations</option>
                <option value="short">1 - 3 Days</option>
                <option value="medium">4 - 7 Days</option>
                <option value="long">8+ Days</option>
              </select>
            </div>

            {/* Sort Menu */}
            <div className="filter-select-wrapper sort">
              <ArrowUpDown className="select-ic" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="history-select"
              >
                <option value="recent">Sort: Most Recent</option>
                <option value="budget-high">Sort: Highest Budget</option>
                <option value="duration-long">Sort: Longest Duration</option>
                <option value="name">Sort: Alphabetical</option>
              </select>
            </div>
          </div>
        </div>

        {/* 3. RESPONSIVE TRIP CARDS GRID OR EMPTY STATE */}
        {filteredTrips.length === 0 ? (
          /* EMPTY STATE ILLUSTRATION CARD */
          <div className="history-empty-card">
            <div className="empty-halo" />
            <div className="empty-icon-box">
              <Compass className="empty-ic" />
            </div>
            <h3 className="empty-title">No Trip Plans Found</h3>
            <p className="empty-desc">
              {searchQuery || selectedDestination !== "all" || selectedBudget !== "all" || selectedDuration !== "all"
                ? "No saved itineraries match your search parameters. Try clearing your filters!"
                : "You haven't planned any trips yet. Generate your first custom itinerary with Rāhi AI!"}
            </p>
            <button
              type="button"
              className="empty-cta-btn"
              onClick={onPlanNewTrip}
            >
              <span>Plan Your First Trip</span>
              <Plus className="btn-plus-ic" />
            </button>
          </div>
        ) : (
          /* TRIP CARDS GRID */
          <div className="history-cards-grid">
            {filteredTrips.map((t, idx) => (
              <motion.div
                key={t.id}
                className="trip-history-card-glass"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.06 }}
                whileHover={{ y: -6 }}
              >
                {/* Cover Image & Badges */}
                <div className="card-cover-box">
                  <img
                    src={t.image || DESTINATION_IMAGES[t.destination] || DESTINATION_IMAGES.Default}
                    alt={t.destination}
                    className="card-cover-img"
                  />
                  <div className="card-cover-gradient" />
                  <div className="card-top-badges">
                    <span className="cover-badge duration">
                      {t.total_days} {t.total_days === 1 ? "Day" : "Days"}
                    </span>
                    <span className="cover-badge style capitalize">{t.travel_style}</span>
                  </div>
                </div>

                {/* Card Body Info */}
                <div className="card-body">
                  <div className="card-dest-row">
                    <h3 className="card-dest-title">{t.destination}</h3>
                    <span className="card-date">{formatDate(t.created_at)}</span>
                  </div>

                  <p className="card-start-city">Starting from {t.starting_from}</p>

                  <div className="card-metrics-grid">
                    <div className="metric-box">
                      <span className="metric-lbl">Total Budget</span>
                      <span className="metric-val mono">₹{t.budget_total.toLocaleString()}</span>
                    </div>
                    <div className="metric-box">
                      <span className="metric-lbl">Daily Avg</span>
                      <span className="metric-val mono">₹{t.budget_per_day.toLocaleString()}</span>
                    </div>
                  </div>

                  {/* Actions Row */}
                  <div className="card-actions-row">
                    <button
                      type="button"
                      className="card-btn primary"
                      onClick={() => onSelectTrip(t.id, t.itinerary)}
                    >
                      <ExternalLink className="btn-ic" />
                      <span>View Itinerary</span>
                    </button>

                    <div className="card-secondary-actions">
                      <button
                        type="button"
                        className="card-btn icon-only"
                        title="Duplicate Trip"
                        onClick={() => handleDuplicate(t)}
                      >
                        <Copy className="btn-ic" />
                      </button>
                      <button
                        type="button"
                        className="card-btn icon-only danger"
                        title="Delete Trip"
                        onClick={() => handleDelete(t.id, t.destination)}
                      >
                        <Trash2 className="btn-ic" />
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
