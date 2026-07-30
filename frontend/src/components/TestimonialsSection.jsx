import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, ChevronLeft, ChevronRight, Quote, MapPin } from "lucide-react";

const TESTIMONIALS = [
  {
    id: 1,
    name: "Aarav Sharma",
    location: "Bengaluru → Himachal",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80",
    rating: 5,
    review:
      "Rāhi planned a 6-day Spiti Valley circuit that perfectly accounted for altitude acclimatization, taxi union rules, and mountain homestay prices. It felt like having a seasoned local guide in my pocket!",
  },
  {
    id: 2,
    name: "Priya Nair",
    location: "Mumbai → Rajasthan",
    avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200&auto=format&fit=crop&q=80",
    rating: 5,
    review:
      "The budget accuracy was unbelievable! We specified ₹3,500/day for Jaipur and Udaipur, and every recommendation matched our actual expenses down to auto rickshaw rates and entry tickets.",
  },
  {
    id: 3,
    name: "Vikram & Ananya",
    location: "Delhi → Varkala & Munnar",
    avatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=200&auto=format&fit=crop&q=80",
    rating: 5,
    review:
      "The food spot recommendations were the absolute highlight of our Kerala trip. We ate at authentic sea-facing cliff eateries and local tea gardens that generic travel blogs never mention.",
  },
];

export function TestimonialsSection() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextTestimonial = () => {
    setCurrentIndex((prev) => (prev + 1) % TESTIMONIALS.length);
  };

  const prevTestimonial = () => {
    setCurrentIndex((prev) => (prev - 1 + TESTIMONIALS.length) % TESTIMONIALS.length);
  };

  const current = TESTIMONIALS[currentIndex];

  return (
    <section className="testimonials-section" id="testimonials">
      <div className="container">
        <div className="section-header text-center">
          <span className="section-eyebrow">Traveler Stories</span>
          <h2 className="section-title">Loved by Indian Explorers</h2>
          <p className="section-subtitle">
            See how Rāhi helps thousands of travelers discover verified places with zero stress.
          </p>
        </div>

        <div className="testimonial-carousel-container">
          <div className="testimonial-glass-card">
            <Quote className="testimonial-quote-bg" />

            <AnimatePresence mode="wait">
              <motion.div
                key={current.id}
                className="testimonial-content"
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -30 }}
                transition={{ duration: 0.35, ease: "easeInOut" }}
              >
                <div className="testimonial-stars">
                  {[...Array(current.rating)].map((_, i) => (
                    <Star key={i} className="star-icon" />
                  ))}
                </div>

                <p className="testimonial-review">"{current.review}"</p>

                <div className="testimonial-author">
                  <img src={current.avatar} alt={current.name} className="testimonial-avatar" />
                  <div className="testimonial-author-info">
                    <h4 className="testimonial-name">{current.name}</h4>
                    <div className="testimonial-location">
                      <MapPin className="pin-icon" />
                      <span>{current.location}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>

            <div className="testimonial-controls">
              <button
                className="t-control-btn"
                onClick={prevTestimonial}
                aria-label="Previous testimonial"
                type="button"
              >
                <ChevronLeft />
              </button>
              
              <div className="t-dots">
                {TESTIMONIALS.map((t, idx) => (
                  <button
                    key={t.id}
                    className={`t-dot ${idx === currentIndex ? "active" : ""}`}
                    onClick={() => setCurrentIndex(idx)}
                    aria-label={`Go to slide ${idx + 1}`}
                    type="button"
                  />
                ))}
              </div>

              <button
                className="t-control-btn"
                onClick={nextTestimonial}
                aria-label="Next testimonial"
                type="button"
              >
                <ChevronRight />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
