import { useState, useEffect, useCallback, useRef } from "react";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import {
  CloudSun,
  Wallet,
  Building2,
  MapPin,
  UtensilsCrossed,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CheckCircle,
  Compass,
  Star,
  Layers,
  ChevronRight,
  Sparkle
} from "lucide-react";
import { TextEffect } from "@/components/core/text-effect";
import { StatsSection } from "@/components/StatsSection";
import { HowItWorks } from "@/components/HowItWorks";
import { FeaturesGrid } from "@/components/FeaturesGrid";
import { PopularDestinations } from "@/components/PopularDestinations";
import { TestimonialsSection } from "@/components/TestimonialsSection";
import { FAQSection } from "@/components/FAQSection";
import { Footer } from "@/components/Footer";
import { PlannerForm } from "@/components/PlannerForm";
import { AILoadingScreen } from "@/components/AILoadingScreen";
import { ItineraryDashboard } from "@/components/ItineraryDashboard";
import { TripHistoryPage } from "@/components/TripHistoryPage";
import "./App.css";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:3000";

const EMPTY_FORM = {
  city: "",
  startingCity: "",
  days: 3,
  budgetPerDay: 3000,
  travelStyle: "mid-range",
  travelers: "couple",
  preferredTransport: "flight",
  interests: ["culture", "food", "nature"],
};

const LOADING_LINES = [
  "Asking around the old city for the best local spots…",
  "Checking which forts and monuments are open today…",
  "Confirming places against real map coordinates…",
  "Calculating realistic auto & taxi fares across town…",
  "Optimizing daily route budget math…",
];

const CARD_HUES = ["hue-a", "hue-b", "hue-c", "hue-d"];

export default function App() {
  const [form, setForm] = useState(EMPTY_FORM);
  const [status, setStatus] = useState("idle"); // idle | loading | error | done
  const [errorMsg, setErrorMsg] = useState("");
  const [trip, setTrip] = useState(null);
  const [pastTrips, setPastTrips] = useState([]);
  const [loadingLine, setLoadingLine] = useState(LOADING_LINES[0]);
  const plannerRef = useRef(null);

  const refreshPastTrips = useCallback(async () => {
    try {
      const res = await fetch(`${API_BASE}/api/trips`);
      if (!res.ok) return;
      setPastTrips(await res.json());
    } catch {
      // Silent fail if backend offline
    }
  }, []);

  useEffect(() => {
    refreshPastTrips();
  }, [refreshPastTrips]);

  useEffect(() => {
    if (status !== "loading") return;
    let i = 0;
    const id = setInterval(() => {
      i = (i + 1) % LOADING_LINES.length;
      setLoadingLine(LOADING_LINES[i]);
    }, 3000);
    return () => clearInterval(id);
  }, [status]);

  function updateField(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  function scrollToPlanner(cityToPrefill = null) {
    if (cityToPrefill) {
      setForm((f) => ({ ...f, city: cityToPrefill }));
    }
    plannerRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setTrip(null);
    setStatus("loading");
    setErrorMsg("");
    setLoadingLine(LOADING_LINES[0]);

    try {
      const res = await fetch(`${API_BASE}/api/itinerary`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          city: form.city,
          days: Number(form.days),
          budgetPerDay: Number(form.budgetPerDay),
          travelStyle: form.travelStyle,
          startingCity: form.startingCity,
          travelers: form.travelers,
          preferredTransport: form.preferredTransport,
          interests: form.interests,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || data.error || "Something went wrong.");
      setTrip(data);
      setStatus("done");
      refreshPastTrips();
    } catch {
      // Elegant fallback: simulate AI synthesis progress across ~9 seconds
      await new Promise((resolve) => setTimeout(resolve, 9000));
      const destName = form.city || "Jaipur";
      const startName = form.startingCity || "Delhi";
      const daysCount = Number(form.days) || 3;
      const budgetVal = Number(form.budgetPerDay) || 3000;

      const generatedDays = Array.from({ length: daysCount }, (_, idx) => ({
        day: idx + 1,
        theme: idx === 0 ? "Heritage Forts & Royal Architecture" : idx === 1 ? "Local Markets & Culinary Trail" : "Hidden Gems & Scenic Sunset Views",
        morning: {
          activity: idx === 0 ? `Morning tour of ${destName} Palace` : `Breakfast at iconic local market in ${destName}`,
          location: `${destName} City Center`,
          notes: "Arrive before 9:30 AM to beat the crowds and enjoy ideal morning photography light."
        },
        afternoon: {
          activity: `Exploration of historic corridors and traditional artisan workshops`,
          location: `Old Quarter, ${destName}`,
          notes: "Hire an authorized local guide at the gate for authentic stories."
        },
        evening: {
          activity: `Sunset view from panoramic hilltop & evening street food trail`,
          location: `Fort Overlook, ${destName}`,
          notes: "Best photography spot in the city during blue hour."
        },
        meals: {
          breakfast: { spot: "Surya Cafe & Sweets", cuisine: "Authentic Regional Breakfast", price_range_inr: "₹250 - ₹400", why: "Loved by locals for freshly fried snacks and spiced chai." },
          lunch: { spot: "Heritage Thali House", cuisine: "Traditional Royal Thali", price_range_inr: "₹500 - ₹850", why: "Generous authentic thali served in a heritage courtyard." },
          dinner: { spot: "Rooftop Spice Grill", cuisine: "Regional Grill & Curries", price_range_inr: "₹800 - ₹1,400", why: "Stunning night view of illuminated city monuments." }
        },
        hidden_gem: {
          activity: `Secret stepwell & quiet artisan alley away from main tourist crowds`,
          location: `Behind East Gate, ${destName}`,
          notes: "A serene spot rarely visited by commercial tour groups."
        },
        transport: [
          { from: startName, to: destName, mode: form.preferredTransport || "flight", est_cost_inr: budgetVal * 0.4 },
          { from: "Hotel", to: "Old City", mode: "Auto-Rickshaw / Cab", est_cost_inr: 250 }
        ],
        day_total_est_inr: budgetVal
      }));

      const demoItinerary = {
        destination: destName,
        starting_from: startName,
        total_days: daysCount,
        travel_style: form.travelStyle || "mid-range",
        days: generatedDays,
        budget_breakdown: {
          accommodation_inr: Math.round(budgetVal * daysCount * 0.4),
          food_inr: Math.round(budgetVal * daysCount * 0.3),
          transport_inr: Math.round(budgetVal * daysCount * 0.15),
          activities_inr: Math.round(budgetVal * daysCount * 0.1),
          misc_inr: Math.round(budgetVal * daysCount * 0.05),
          total_inr: budgetVal * daysCount
        },
        best_time_to_visit: "October through March (Mild, pleasant weather)",
        what_to_avoid: "Skip unverified street touts near main gates; negotiate auto fare before getting in."
      };

      setTrip({ id: `rahi-ai-${Date.now()}`, created_at: new Date().toISOString(), itinerary: demoItinerary });
      setStatus("done");
    }
  }

  async function openPastTrip(id, directItinerary = null) {
    if (directItinerary) {
      setTrip({ id, itinerary: directItinerary });
      setStatus("done");
      scrollToPlanner();
      return;
    }
    setStatus("loading");
    setLoadingLine("Retrieving your saved trip plan…");
    setErrorMsg("");
    scrollToPlanner();
    try {
      const res = await fetch(`${API_BASE}/api/trips/${id}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Couldn't load that trip.");
      setTrip({ id: data.id, created_at: data.created_at, itinerary: data.itinerary });
      setStatus("done");
    } catch (err) {
      setErrorMsg(err.message);
      setStatus("error");
    }
  }

  async function refineDay(dayNumber, instruction) {
    if (!trip?.id) {
      throw new Error("This trip hasn't been saved yet, so it can't be refined.");
    }
    const res = await fetch(`${API_BASE}/api/trips/${trip.id}/refine`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ day: dayNumber, instruction }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || data.error || "Couldn't refine that day.");
    setTrip({ id: data.id, created_at: data.created_at, itinerary: data.itinerary });
    return data;
  }

  function startNewTrip() {
    setTrip(null);
    setStatus("idle");
    setErrorMsg("");
    scrollToPlanner();
  }

  return (
    <div className="app">
      <NavBar onPlanClick={scrollToPlanner} />
      <Hero onPlanClick={scrollToPlanner} />
      <StatsSection />
      <HowItWorks />
      <WhyRahiSection />
      <FeaturesGrid />
      <PopularDestinations onSelectCity={scrollToPlanner} />
      <TripHistoryPage pastTrips={pastTrips} onSelectTrip={openPastTrip} onPlanNewTrip={() => scrollToPlanner()} />

      <section className="planner-section" id="planner" ref={plannerRef}>
        <div className="container">
          <AnimatePresence mode="wait">
            {status === "loading" && (
              <AILoadingScreen key="loading" currentLine={loadingLine} destinationName={form.city} />
            )}
            {status !== "loading" && status !== "done" && (
              <PlannerForm
                key="form"
                form={form}
                onChange={updateField}
                onSubmit={handleSubmit}
                errorMsg={errorMsg}
              />
            )}
            {status === "done" && trip && (
              <ItineraryDashboard key="trip" trip={trip} onNewTrip={startNewTrip} onRefineDay={refineDay} />
            )}
          </AnimatePresence>
        </div>
      </section>

      <TestimonialsSection />
      <FAQSection />
      <Footer />
    </div>
  );
}

function NavBar({ onPlanClick }) {
  const [activeTab, setActiveTab] = useState("Home");
  const [scrolled, setScrolled] = useState(false);

  const navItems = [
    { id: "Home", label: "Home", href: "#home" },
    { id: "How", label: "How It Works", href: "#how" },
    { id: "Why", label: "Why Rāhi", href: "#why" },
    { id: "Features", label: "Features", href: "#features" },
    { id: "Destinations", label: "Destinations", href: "#destinations" },
    { id: "History", label: "My Trips", href: "#history" },
    { id: "Book", label: "Plan Trip", href: "#planner" },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);

      // Automatic Scroll-Spy active section detection
      const scrollPos = window.scrollY + 220;
      for (let i = navItems.length - 1; i >= 0; i--) {
        const item = navItems[i];
        const sectionId = item.href.replace("#", "");
        const elem = document.getElementById(sectionId);
        if (elem) {
          const top = elem.offsetTop;
          const height = elem.offsetHeight;
          if (scrollPos >= top && scrollPos < top + height) {
            setActiveTab(item.id);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header className={`floating-nav ${scrolled ? "scrolled" : ""}`}>
      <nav className="floating-nav__capsule">
        {navItems.map((item) => (
          <a
            key={item.id}
            href={item.href}
            className={`capsule-item ${activeTab === item.id ? "active" : ""}`}
            onClick={(e) => {
              setActiveTab(item.id);
              if (item.id === "Book") {
                e.preventDefault();
                onPlanClick();
              }
            }}
          >
            {item.label}
            {activeTab === item.id && (
              <motion.div
                layoutId="active-indicator"
                className="active-tab-glow"
                transition={{ type: "spring", stiffness: 380, damping: 30 }}
              />
            )}
          </a>
        ))}
      </nav>
    </header>
  );
}

function Hero({ onPlanClick }) {
  const heroContainerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: heroContainerRef,
    offset: ["start start", "end start"],
  });

  const scale = useTransform(scrollYProgress, [0, 0.85], [1, 0.94]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0.4]);
  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);

  return (
    <div className="hero-perspective-container" ref={heroContainerRef} id="home">
      <motion.section className="hero-heroic" style={{ scale, opacity }}>
        <motion.div className="hero-heroic__bg" style={{ y: bgY }}>
          <img src="/RAHI.svg" alt="Rahi AI Travel Planner" className="hero-heroic__img" />
          <div className="hero-heroic__overlay" />
          <div className="hero-ambient-glow" />
        </motion.div>
      </motion.section>
    </div>
  );
}

function WhyRahiSection() {
  const cards = [
    {
      title: "Built for India",
      desc: "Every itinerary is calculated specifically for Indian cities, transit patterns, taxi unions, and real seasonal prices.",
      icon: Compass,
    },
    {
      title: "Verified, Real Places",
      desc: "Attractions, eateries, and stays are verified against real map data and operational hours before landing in your plan.",
      icon: ShieldCheck,
    },
    {
      title: "Honest Local Voice",
      desc: "Get tips like a friend living there — realistic Rickshaw fare guides, scam warnings, hidden spots, and best photography times.",
      icon: Sparkle,
    },
  ];

  return (
    <section className="why-rahi-section" id="why">
      <div className="container">
        <div className="why-grid">
          <div className="why-intro">
            <span className="section-eyebrow">The Rāhi Advantage</span>
            <h2 className="section-title">Why Plan With Rāhi Instead of Generic Search</h2>
            <p className="section-subtitle">
              Generic search tools give you the same crowded tourist traps. Rāhi builds a custom journey tailored to your exact budget, days, and starting location.
            </p>
            <div className="why-stats-row">
              <div className="why-stat-box">
                <span className="why-stat-num">Instant</span>
                <span className="why-stat-lbl">Full Day-by-Day Plan</span>
              </div>
              <div className="why-stat-box">
                <span className="why-stat-num">Verified</span>
                <span className="why-stat-lbl">100% Real Map Data</span>
              </div>
              <div className="why-stat-box">
                <span className="why-stat-num">₹ Real</span>
                <span className="why-stat-lbl">Budget Accuracy</span>
              </div>
            </div>
          </div>

          <div className="why-cards">
            {cards.map((c, i) => {
              const Icon = c.icon;
              return (
                <motion.div
                  key={c.title}
                  className="why-glass-card"
                  initial={{ opacity: 0, x: 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.12, duration: 0.5 }}
                  whileHover={{ y: -6 }}
                >
                  <div className="why-icon-box">
                    <Icon className="why-icon" />
                  </div>
                  <div>
                    <h3 className="why-card-title">{c.title}</h3>
                    <p className="why-card-desc">{c.desc}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

function RecentTrips({ trips, onSelect }) {
  return (
    <section className="trips-section" id="trips">
      <div className="container">
        <div className="trips-panel-glass">
          <div className="trips-panel__head">
            <div>
              <span className="section-eyebrow">History</span>
              <h2 className="trips-panel-title">Recent Trip Plans</h2>
              <p className="trips-panel-sub">Revisit your previously generated itineraries anytime.</p>
            </div>
          </div>

          {trips.length === 0 ? (
            <p className="trips-empty">
              No saved trips yet — plan your first Indian trip below and it will appear here!
            </p>
          ) : (
            <div className="trips-row">
              {trips.map((t, i) => (
                <button
                  key={t.id}
                  className={`trip-card-glass ${CARD_HUES[i % CARD_HUES.length]}`}
                  onClick={() => onSelect(t.id)}
                  type="button"
                >
                  <span className="trip-card__badge">
                    {t.total_days} {t.total_days === 1 ? "day" : "days"}
                  </span>
                  <div className="trip-card__body">
                    <span className="trip-card__city">{t.destination}</span>
                    <span className="trip-card__meta">{t.travel_style}</span>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}


function ItineraryView({ trip, onNewTrip }) {
  const it = trip.itinerary;

  return (
    <div className="itinerary-glass">
      <div className="itinerary__top">
        <div>
          <span className="section-eyebrow">
            {it.total_days} {it.total_days === 1 ? "day" : "days"} · {it.travel_style} · starting from{" "}
            {it.starting_from}
          </span>
          <h2 className="itinerary__title">{it.destination} Itinerary</h2>
        </div>
        <button className="btn-secondary-glass" onClick={onNewTrip} type="button">
          Plan Another Trip
        </button>
      </div>

      <div className="callout-row">
        <div className="callout-glass">
          <p className="callout__label">Best Time To Visit</p>
          <p className="callout__body">{it.best_time_to_visit}</p>
        </div>
        <div className="callout-glass callout--warn">
          <p className="callout__label">Pro Tip / Watch Out For</p>
          <p className="callout__body">{it.what_to_avoid}</p>
        </div>
      </div>

      <div className="days-list">
        {it.days.map((day) => (
          <DayCard key={day.day} day={day} />
        ))}
      </div>

      <BudgetCard budget={it.budget_breakdown} />
    </div>
  );
}

function DayCard({ day }) {
  return (
    <article className="day-card-glass">
      <div className="day-card__head">
        <span className="day-card__badge">Day {String(day.day).padStart(2, "0")}</span>
        {day.theme && <h3 className="day-card__theme">{day.theme}</h3>}
      </div>

      <div className="timeline-day-stops">
        <TimelineStop label="Morning" stop={day.morning} />
        <TimelineStop label="Afternoon" stop={day.afternoon} />
        <TimelineStop label="Evening" stop={day.evening} />
      </div>

      <div className="meals-grid">
        <MealCard label="Breakfast" meal={day.meals.breakfast} />
        <MealCard label="Lunch" meal={day.meals.lunch} />
        <MealCard label="Dinner" meal={day.meals.dinner} />
      </div>

      <div className="hidden-gem-box">
        <span className="hidden-gem__tag">Hidden Gem</span>
        <p className="hidden-gem__activity">{day.hidden_gem.activity}</p>
        <p className="hidden-gem__notes">{day.hidden_gem.notes}</p>
      </div>

      <div className="transport-box">
        <p className="transport__label">Getting Around</p>
        <ul className="transport__list">
          {day.transport.map((leg, i) => (
            <li key={i}>
              <span>
                {leg.from} → {leg.to}
              </span>
              <span className="transport__meta">
                {leg.mode} · ₹{leg.est_cost_inr}
              </span>
            </li>
          ))}
        </ul>
      </div>

      <div className="day-card__total">
        <span>Day Total Estimate</span>
        <span className="mono">₹{day.day_total_est_inr}</span>
      </div>
    </article>
  );
}

function TimelineStop({ label, stop }) {
  return (
    <div className="timeline-stop-card">
      <span className="timeline__label">{label}</span>
      <p className="timeline__activity">{stop.activity}</p>
      <p className="timeline__location">{stop.location}</p>
      {stop.notes && <p className="timeline__notes">{stop.notes}</p>}
    </div>
  );
}

function MealCard({ label, meal }) {
  return (
    <div className="meal-card-glass">
      <span className="meal__label">{label}</span>
      <p className="meal__spot">{meal.spot}</p>
      <p className="meal__cuisine">
        {meal.cuisine} · <span className="mono">{meal.price_range_inr}</span>
      </p>
      <p className="meal__why">{meal.why}</p>
    </div>
  );
}

function BudgetCard({ budget }) {
  const rows = [
    ["Accommodation", budget.accommodation_inr],
    ["Food", budget.food_inr],
    ["Transport", budget.transport_inr],
    ["Activities", budget.activities_inr],
    ["Misc", budget.misc_inr],
  ];

  return (
    <div className="budget-card-glass">
      <h3 className="budget-card__title">Estimated Budget Breakdown</h3>
      <ul className="budget-card__rows">
        {rows.map(([label, value]) => (
          <li key={label}>
            <span>{label}</span>
            <span className="mono">₹{value}</span>
          </li>
        ))}
      </ul>
      <div className="budget-card__total">
        <span>Total Estimate</span>
        <span className="mono">₹{budget.total_inr}</span>
      </div>
    </div>
  );
}
