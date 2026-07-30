import React from "react";
import { motion } from "framer-motion";
import {
  Sparkles,
  CloudSun,
  Calculator,
  Map,
  UtensilsCrossed,
  CheckSquare,
  Download,
  FileText,
  ShieldCheck,
  Compass,
} from "lucide-react";

const FEATURES = [
  {
    id: "ai-itinerary",
    title: "AI Itinerary",
    desc: "Intelligent day-by-day plans tailored to your starting city, travel pace, and interests.",
    icon: Sparkles,
    tag: "Core Engine",
  },
  {
    id: "weather",
    title: "Weather",
    desc: "Seasonal weather forecasts and clothing suggestions for varied Indian climates.",
    icon: CloudSun,
    tag: "Real-time",
  },
  {
    id: "budget",
    title: "Budget",
    desc: "Precise cost breakdowns for food, stays, auto-rickshaws, and activities with 95% accuracy.",
    icon: Calculator,
    tag: "Smart Math",
  },
  {
    id: "maps",
    title: "Maps",
    desc: "Visual route planning and geotagged landmark coordinates to minimize travel time.",
    icon: Map,
    tag: "Interactive",
  },
  {
    id: "local-food",
    title: "Local Food",
    desc: "Handpicked street food hubs, iconic thali places, and local dining spots verified by locals.",
    icon: UtensilsCrossed,
    tag: "Curated",
  },
  {
    id: "packing-list",
    title: "Packing List",
    desc: "Customized checklist based on your destination's terrain, weather, and trip duration.",
    icon: CheckSquare,
    tag: "Smart Guide",
  },
  {
    id: "export-pdf",
    title: "Export PDF",
    desc: "Download clean, beautifully formatted PDFs or share direct web links with travel partners.",
    icon: Download,
    tag: "One-Click",
  },
  {
    id: "offline-guide",
    title: "Offline Guide",
    desc: "Access your complete trip plan anywhere without relying on active cellular data.",
    icon: FileText,
    tag: "Always Available",
  },
];

export function FeaturesGrid() {
  return (
    <section className="features-section" id="features">
      <div className="container">
        <div className="section-header text-center">
          <span className="section-eyebrow">Comprehensive Toolkit</span>
          <h2 className="section-title">Built for Smart India Travel</h2>
          <p className="section-subtitle">
            Every feature designed to elevate your journey with verified intelligence and zero hassle.
          </p>
        </div>

        <div className="features-grid">
          {FEATURES.map((feature, i) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.id}
                className="feature-glass-card"
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06, duration: 0.4 }}
                whileHover={{ y: -6, scale: 1.02 }}
              >
                <div className="feature-card-header">
                  <div className="feature-icon-container">
                    <Icon className="feature-icon" />
                  </div>
                  <span className="feature-tag">{feature.tag}</span>
                </div>
                <h3 className="feature-card-title">{feature.title}</h3>
                <p className="feature-card-desc">{feature.desc}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
