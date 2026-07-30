import React from "react";
import { motion } from "framer-motion";
import { MapPin, Wallet, Sparkles, Navigation, ArrowRight, CheckCircle2 } from "lucide-react";

const STEPS = [
  {
    step: "01",
    title: "Choose Destination",
    desc: "Pick any Indian destination — from Jaipur or Kerala backwaters to Leh Ladakh.",
    icon: MapPin,
    detail: "120+ Indian Cities Supported",
  },
  {
    step: "02",
    title: "Set Budget",
    desc: "Define your preferred daily spending and choose your travel style (Budget to Luxury).",
    icon: Wallet,
    detail: "Real ₹ Cost Calculations",
  },
  {
    step: "03",
    title: "AI Generates Plan",
    desc: "Our model generates a verified, day-by-day itinerary with exact timings, stays & spots.",
    icon: Sparkles,
    detail: "Under 15 Seconds",
  },
  {
    step: "04",
    title: "Travel",
    desc: "Access offline guidance, verified maps, food recommendations, and instant adjustments.",
    icon: Navigation,
    detail: "Seamless Journey",
  },
];

export function HowItWorks() {
  return (
    <section className="how-it-works-section" id="how">
      <div className="container">
        <div className="section-header text-center">
          <span className="section-eyebrow">Seamless Journey</span>
          <h2 className="section-title">How Rāhi Works</h2>
          <p className="section-subtitle">
            From empty search box to verified Indian travel plan in 4 simple steps.
          </p>
        </div>

        <div className="timeline-container">
          {/* Connecting line */}
          <div className="timeline-track" />

          <div className="timeline-grid">
            {STEPS.map((item, index) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={item.step}
                  className="timeline-card"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.15, duration: 0.5 }}
                  whileHover={{ y: -8 }}
                >
                  <div className="timeline-step-badge">{item.step}</div>
                  <div className="timeline-icon-box">
                    <Icon className="timeline-icon" />
                  </div>
                  <h3 className="timeline-title">{item.title}</h3>
                  <p className="timeline-desc">{item.desc}</p>
                  
                  <div className="timeline-detail-tag">
                    <CheckCircle2 className="timeline-check-icon" />
                    <span>{item.detail}</span>
                  </div>

                  {index < STEPS.length - 1 && (
                    <div className="timeline-arrow-connector">
                      <ArrowRight className="timeline-connector-icon" />
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
