import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  MapPin,
  Navigation,
  Calendar,
  Wallet,
  Sparkles,
  Users,
  Car,
  Heart,
  ArrowRight,
  Plane,
  Train,
  Bus,
  Check,
  Compass,
  Building2,
  UtensilsCrossed,
  Trees,
  Mountain,
  ShoppingBag,
  Camera,
  Moon,
  Smile
} from "lucide-react";
import { GlassDropdown } from "./GlassDropdown";

const TRAVEL_STYLE_OPTIONS = [
  {
    value: "budget",
    label: "Budget Traveler",
    description: "Authentic local stays, street eats & smart transit",
    icon: Smile,
  },
  {
    value: "mid-range",
    label: "Mid-range Comfort",
    description: "Boutique hotels, top rated dining & comfortable travel",
    icon: Compass,
  },
  {
    value: "luxury",
    label: "Heritage & Luxury",
    description: "5-Star heritage palaces, private cabs & fine dining",
    icon: Building2,
  },
];

const TRAVELERS_OPTIONS = [
  {
    value: "solo",
    label: "Solo Traveler",
    description: "1 Person • Freedom & exploration",
    icon: Users,
  },
  {
    value: "couple",
    label: "Couple",
    description: "2 Travelers • Romantic & private stays",
    icon: Heart,
  },
  {
    value: "family",
    label: "Family",
    description: "3-5 People • Family-friendly itineraries",
    icon: Users,
  },
  {
    value: "group",
    label: "Friends / Group",
    description: "6+ Travelers • Shared cabs & fun group spots",
    icon: Users,
  },
];

const TRANSPORT_OPTIONS = [
  {
    value: "flight",
    label: "Flight",
    description: "Fastest travel between long distances",
    icon: Plane,
  },
  {
    value: "train",
    label: "Express Train",
    description: "Scenic journeys & classic Indian railway",
    icon: Train,
  },
  {
    value: "car",
    label: "Private Cab / Drive",
    description: "Door-to-door flexibility & roadtrip routes",
    icon: Car,
  },
  {
    value: "bus",
    label: "Volvo Bus / Transit",
    description: "Overnight luxury buses & budget transit",
    icon: Bus,
  },
];

const INTEREST_OPTIONS = [
  { id: "culture", label: "Culture & Heritage", emoji: "🏰", icon: Building2 },
  { id: "food", label: "Food & Dining", emoji: "🍲", icon: UtensilsCrossed },
  { id: "nature", label: "Nature & Wildlife", emoji: "🌿", icon: Trees },
  { id: "adventure", label: "Adventure & Treks", emoji: "🏔️", icon: Mountain },
  { id: "shopping", label: "Markets & Shopping", emoji: "🛍️", icon: ShoppingBag },
  { id: "wellness", label: "Relaxation & Wellness", emoji: "🧘", icon: Compass },
  { id: "photography", label: "Photography Spots", emoji: "📸", icon: Camera },
  { id: "nightlife", label: "Nightlife & Vibe", emoji: "🌅", icon: Moon },
];

const POPULAR_DESTINATIONS = ["Jaipur", "Goa", "Kerala", "Udaipur", "Ladakh", "Varanasi"];
const POPULAR_STARTS = ["Delhi", "Mumbai", "Bengaluru", "Kolkata", "Chennai", "Ahmedabad"];
const BUDGET_PRESETS = [2500, 5000, 10000, 15000];

export function PlannerForm({ form, onChange, onSubmit, errorMsg }) {
  const [focusedField, setFocusedField] = useState(null);

  function toggleInterest(interestId) {
    const currentInterests = form.interests || [];
    let updated;
    if (currentInterests.includes(interestId)) {
      updated = currentInterests.filter((id) => id !== interestId);
    } else {
      updated = [...currentInterests, interestId];
    }
    onChange("interests", updated);
  }

  return (
    <div className="rahi-planner-card">
      <div className="rahi-planner-card__header">
        <div className="ai-badge">
          <Sparkles className="ai-badge-icon" />
          <span>Rāhi AI Engine 3.0</span>
        </div>
        <h2 className="rahi-planner-card__title">Plan Your Custom Journey</h2>
        <p className="rahi-planner-card__sub">
          Generate a verified, personalized Indian itinerary with realistic transit & local secrets.
        </p>
      </div>

      <form className="rahi-planner-form" onSubmit={onSubmit}>
        {/* Row 1: Destination & Starting From */}
        <div className="rahi-form-grid two-col">
          {/* Destination */}
          <div className="field-block">
            <div
              className={`floating-field-group ${focusedField === "city" ? "is-focused" : ""} ${
                form.city ? "has-value" : ""
              }`}
            >
              <div className="field-icon-wrapper">
                <MapPin className="field-icon" />
              </div>
              <div className="floating-input-content">
                <label htmlFor="city" className="floating-label">
                  Destination
                </label>
                <input
                  id="city"
                  type="text"
                  className="floating-input"
                  value={form.city || ""}
                  onChange={(e) => onChange("city", e.target.value)}
                  onFocus={() => setFocusedField("city")}
                  onBlur={() => setFocusedField(null)}
                  required
                />
              </div>
            </div>
            {/* Suggestions */}
            <div className="quick-suggestions">
              <span className="suggestion-label">Popular:</span>
              {POPULAR_DESTINATIONS.map((dest) => (
                <button
                  type="button"
                  key={dest}
                  className={`chip-suggestion ${form.city === dest ? "active" : ""}`}
                  onClick={() => onChange("city", dest)}
                >
                  {dest}
                </button>
              ))}
            </div>
          </div>

          {/* Starting From */}
          <div className="field-block">
            <div
              className={`floating-field-group ${focusedField === "startingCity" ? "is-focused" : ""} ${
                form.startingCity ? "has-value" : ""
              }`}
            >
              <div className="field-icon-wrapper">
                <Navigation className="field-icon" />
              </div>
              <div className="floating-input-content">
                <label htmlFor="startingCity" className="floating-label">
                  Starting From
                </label>
                <input
                  id="startingCity"
                  type="text"
                  className="floating-input"
                  value={form.startingCity || ""}
                  onChange={(e) => onChange("startingCity", e.target.value)}
                  onFocus={() => setFocusedField("startingCity")}
                  onBlur={() => setFocusedField(null)}
                  required
                />
              </div>
            </div>
            {/* Suggestions */}
            <div className="quick-suggestions">
              <span className="suggestion-label">Starts:</span>
              {POPULAR_STARTS.map((start) => (
                <button
                  type="button"
                  key={start}
                  className={`chip-suggestion ${form.startingCity === start ? "active" : ""}`}
                  onClick={() => onChange("startingCity", start)}
                >
                  {start}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Row 2: Days & Budget per Day */}
        <div className="rahi-form-grid two-col">
          {/* Days */}
          <div className="field-block">
            <div
              className={`floating-field-group ${focusedField === "days" ? "is-focused" : ""} ${
                form.days ? "has-value" : ""
              }`}
            >
              <div className="field-icon-wrapper">
                <Calendar className="field-icon" />
              </div>
              <div className="floating-input-content">
                <label htmlFor="days" className="floating-label">
                  Days
                </label>
                <input
                  id="days"
                  type="number"
                  min="1"
                  max="30"
                  className="floating-input"
                  value={form.days ?? 3}
                  onChange={(e) => onChange("days", e.target.value)}
                  onFocus={() => setFocusedField("days")}
                  onBlur={() => setFocusedField(null)}
                  required
                />
              </div>
              <div className="field-unit-tag">Days</div>
            </div>
            {/* Quick Days buttons */}
            <div className="quick-suggestions">
              <span className="suggestion-label">Preset:</span>
              {[3, 5, 7, 10].map((d) => (
                <button
                  type="button"
                  key={d}
                  className={`chip-suggestion ${Number(form.days) === d ? "active" : ""}`}
                  onClick={() => onChange("days", d)}
                >
                  {d} Days
                </button>
              ))}
            </div>
          </div>

          {/* Budget per Day */}
          <div className="field-block">
            <div
              className={`floating-field-group ${focusedField === "budgetPerDay" ? "is-focused" : ""} ${
                form.budgetPerDay ? "has-value" : ""
              }`}
            >
              <div className="field-icon-wrapper">
                <Wallet className="field-icon" />
              </div>
              <div className="floating-input-content">
                <label htmlFor="budgetPerDay" className="floating-label">
                  Budget per Day (₹)
                </label>
                <input
                  id="budgetPerDay"
                  type="number"
                  min="500"
                  step="500"
                  className="floating-input"
                  value={form.budgetPerDay ?? 3000}
                  onChange={(e) => onChange("budgetPerDay", e.target.value)}
                  onFocus={() => setFocusedField("budgetPerDay")}
                  onBlur={() => setFocusedField(null)}
                  required
                />
              </div>
              <div className="field-unit-tag">₹ / day</div>
            </div>
            {/* Quick Budget buttons */}
            <div className="quick-suggestions">
              <span className="suggestion-label">Quick:</span>
              {BUDGET_PRESETS.map((amt) => (
                <button
                  type="button"
                  key={amt}
                  className={`chip-suggestion ${Number(form.budgetPerDay) === amt ? "active" : ""}`}
                  onClick={() => onChange("budgetPerDay", amt)}
                >
                  ₹{(amt / 1000).toFixed(1)}k
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Row 3: Travel Style, Travelers, Preferred Transport */}
        <div className="rahi-form-grid three-col">
          {/* Travel Style */}
          <GlassDropdown
            id="travelStyle"
            label="Travel Style"
            icon={Sparkles}
            value={form.travelStyle || "mid-range"}
            options={TRAVEL_STYLE_OPTIONS}
            onChange={(val) => onChange("travelStyle", val)}
          />

          {/* Travelers */}
          <GlassDropdown
            id="travelers"
            label="Travelers"
            icon={Users}
            value={form.travelers || "couple"}
            options={TRAVELERS_OPTIONS}
            onChange={(val) => onChange("travelers", val)}
          />

          {/* Preferred Transport */}
          <GlassDropdown
            id="preferredTransport"
            label="Preferred Transport"
            icon={Car}
            value={form.preferredTransport || "flight"}
            options={TRANSPORT_OPTIONS}
            onChange={(val) => onChange("preferredTransport", val)}
          />
        </div>

        {/* Row 4: Interests Multi-select Chips */}
        <div className="interests-section">
          <div className="interests-header">
            <div className="field-icon-wrapper sm">
              <Heart className="field-icon" />
            </div>
            <span className="interests-title">Interests & Preferences</span>
            <span className="interests-subtitle">(Select any that apply)</span>
          </div>

          <div className="interests-chips-grid">
            {INTEREST_OPTIONS.map((item) => {
              const isSelected = (form.interests || []).includes(item.id);
              return (
                <button
                  type="button"
                  key={item.id}
                  className={`interest-chip ${isSelected ? "selected" : ""}`}
                  onClick={() => toggleInterest(item.id)}
                >
                  <span className="interest-emoji">{item.emoji}</span>
                  <span className="interest-label">{item.label}</span>
                  {isSelected && <Check className="interest-check-icon" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Error notification if any */}
        {errorMsg && (
          <div className="rahi-form-error">
            <span>⚠️ {errorMsg}</span>
          </div>
        )}

        {/* Full-width Submit CTA Button */}
        <motion.button
          className="rahi-submit-btn"
          type="submit"
          whileHover={{ scale: 1.015 }}
          whileTap={{ scale: 0.985 }}
        >
          <div className="submit-btn-glow" />
          <div className="submit-btn-content">
            <span>Generate My AI Trip</span>
            <ArrowRight className="submit-btn-arrow" />
          </div>
        </motion.button>
      </form>
    </div>
  );
}
