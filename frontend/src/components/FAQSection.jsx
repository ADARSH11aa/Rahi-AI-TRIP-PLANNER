import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, HelpCircle } from "lucide-react";

const FAQS = [
  {
    q: "How does Rāhi generate realistic budgets for Indian travel?",
    a: "Rāhi cross-references place locations with real-world price data for auto-rickshaws, state buses, mid-range hotels, local dining spots, and entrance fees across 120+ Indian cities.",
  },
  {
    q: "Are the suggested attractions and restaurants verified?",
    a: "Yes! Every single spot in your itinerary is checked against active map coordinates and operational data before it's included in your day-by-day plan.",
  },
  {
    q: "Can I customize the generated itinerary or change the budget?",
    a: "Absolutely. You can modify your destination, days, budget per day, or travel style at any time to regenerate instant tailored itineraries.",
  },
  {
    q: "Does Rāhi work offline when traveling without cell reception?",
    a: "Yes! You can view past itineraries in your History section, print clean PDFs, or export them to your phone for offline reference during mountain or desert trips.",
  },
  {
    q: "Is Rāhi free to use for planning trips across India?",
    a: "Rāhi is 100% free for generating day-by-day travel itineraries across all Indian states and union territories.",
  },
];

export function FAQSection() {
  const [openIndex, setOpenIndex] = useState(0);

  const toggle = (idx) => {
    setOpenIndex(openIndex === idx ? -1 : idx);
  };

  return (
    <section className="faq-section" id="faq">
      <div className="container">
        <div className="section-header text-center">
          <span className="section-eyebrow">Got Questions?</span>
          <h2 className="section-title">Frequently Asked Questions</h2>
          <p className="section-subtitle">
            Everything you need to know about planning journeys with Rāhi.
          </p>
        </div>

        <div className="faq-accordion-container">
          {FAQS.map((faq, i) => {
            const isOpen = openIndex === i;
            return (
              <div key={i} className={`faq-glass-item ${isOpen ? "open" : ""}`}>
                <button
                  className="faq-trigger-btn"
                  onClick={() => toggle(i)}
                  type="button"
                >
                  <div className="faq-question-text">
                    <HelpCircle className="faq-icon" />
                    <span>{faq.q}</span>
                  </div>
                  <motion.div animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.25 }}>
                    <ChevronDown className="faq-chevron" />
                  </motion.div>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      className="faq-answer-wrapper"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                    >
                      <p className="faq-answer">{faq.a}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
