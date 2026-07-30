import React from "react";
import { motion } from "framer-motion";
import { Hotel, Bus, Utensils, Ticket, ShoppingBag, ShieldAlert } from "lucide-react";

const CATEGORIES = [
  { name: "Accommodation", percentage: 38, cost: "₹3,420", icon: Hotel, color: "#7DA2CC" },
  { name: "Transport", percentage: 22, cost: "₹1,980", icon: Bus, color: "#B8D1E7" },
  { name: "Food & Dining", percentage: 20, cost: "₹1,800", icon: Utensils, color: "#DCEAF6" },
  { name: "Activities & Sightseeing", percentage: 12, cost: "₹1,080", icon: Ticket, color: "#6094C9" },
  { name: "Shopping", percentage: 5, cost: "₹450", icon: ShoppingBag, color: "#4C82B7" },
  { name: "Emergency Buffer", percentage: 3, cost: "₹270", icon: ShieldAlert, color: "#9BB8DA" },
];

export function AnalyticsSection() {
  return (
    <section className="analytics-section">
      <div className="container">
        <div className="analytics-glass-card">
          <div className="analytics-header">
            <div>
              <span className="section-eyebrow">Smart Budget Intelligence</span>
              <h2 className="analytics-title">Estimated Spending Breakdown</h2>
              <p className="analytics-desc">
                How a typical 3-day mid-range itinerary distributes your budget efficiently across India.
              </p>
            </div>
            <div className="analytics-total-badge">
              <span className="total-label">Est. Total</span>
              <span className="total-amount">₹9,000</span>
            </div>
          </div>

          <div className="analytics-categories-grid">
            {CATEGORIES.map((cat, index) => {
              const Icon = cat.icon;
              return (
                <motion.div
                  key={cat.name}
                  className="analytics-cat-card"
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.08 }}
                >
                  <div className="cat-card-top">
                    <div className="cat-icon-box" style={{ background: `${cat.color}20`, color: cat.color }}>
                      <Icon className="cat-icon" />
                    </div>
                    <span className="cat-cost">{cat.cost}</span>
                  </div>

                  <h3 className="cat-name">{cat.name}</h3>

                  <div className="cat-progress-track">
                    <motion.div
                      className="cat-progress-fill"
                      style={{ background: cat.color }}
                      initial={{ width: 0 }}
                      whileInView={{ width: `${cat.percentage}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.8, ease: "easeOut" }}
                    />
                  </div>

                  <span className="cat-percent-label">{cat.percentage}% of total budget</span>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
