import React, { useEffect, useState, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Compass, MapPin, Percent, Bot } from "lucide-react";

function Counter({ target, suffix = "" }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  useEffect(() => {
    if (!isInView) return;

    // Extract numeric part
    const numericTarget = parseInt(target.replace(/[^0-9]/g, ""), 10);
    if (isNaN(numericTarget)) return;

    let start = 0;
    const duration = 1800; // ms
    const steps = 60;
    const stepTime = duration / steps;
    const increment = numericTarget / steps;

    const timer = setInterval(() => {
      start += increment;
      if (start >= numericTarget) {
        setCount(numericTarget);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, stepTime);

    return () => clearInterval(timer);
  }, [isInView, target]);

  const hasPlus = target.includes("+");
  const hasPercent = target.includes("%");
  const is24_7 = target === "24/7";

  return (
    <span ref={ref} className="stat-card__number">
      {is24_7 ? "24/7" : `${count.toLocaleString()}${hasPlus ? "+" : ""}${hasPercent ? "%" : ""}${suffix}`}
    </span>
  );
}

const STATS = [
  {
    id: "trips",
    value: "5000+",
    label: "Trips Planned",
    desc: "Across all states and union territories in India",
    icon: Compass,
  },
  {
    id: "cities",
    value: "120+",
    label: "Cities",
    desc: "Verified destinations, routes, and local maps",
    icon: MapPin,
  },
  {
    id: "accuracy",
    value: "95%",
    label: "Budget Accuracy",
    desc: "Calculated with real transport, food & stay rates",
    icon: Percent,
  },
  {
    id: "support",
    value: "24/7",
    label: "AI Assistance",
    desc: "Instant itinerary adjustments on the go",
    icon: Bot,
  },
];

export function StatsSection() {
  return (
    <section className="stats-section" id="stats">
      <div className="container">
        <div className="stats-grid">
          {STATS.map((stat, i) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.id}
                className="stat-card"
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                whileHover={{ y: -6, scale: 1.02 }}
              >
                <div className="stat-card__icon-wrapper">
                  <Icon className="stat-card__icon" />
                </div>
                <Counter target={stat.value} />
                <h3 className="stat-card__label">{stat.label}</h3>
                <p className="stat-card__desc">{stat.desc}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
