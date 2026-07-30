import React from "react";
import { PerspectiveCarousel } from "./PerspectiveCarousel";

const DESTINATIONS = [
  {
    id: "goa",
    city: "Goa",
    title: "Goa Sunshine & Heritage Coast",
    budget: "₹3,500/day",
    duration: "4 Days",
    season: "Nov - Feb",
    src: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=800&auto=format&fit=crop&q=80",
  },
  {
    id: "leh",
    city: "Leh",
    title: "Pangong Lake & Ladakh Circuit",
    budget: "₹4,500/day",
    duration: "6 Days",
    season: "May - Sep",
    src: "https://images.unsplash.com/photo-1581793745862-99fde7fa73d2?w=800&auto=format&fit=crop&q=80",
  },
  {
    id: "jaipur",
    city: "Jaipur",
    title: "The Royal Pink City & Forts",
    budget: "₹2,800/day",
    duration: "3 Days",
    season: "Oct - Mar",
    src: "https://images.unsplash.com/photo-1599661046289-e31897846e41?w=800&auto=format&fit=crop&q=80",
  },
  {
    id: "kerala",
    city: "Kerala",
    title: "Munnar Hills & Backwater Haven",
    budget: "₹3,200/day",
    duration: "5 Days",
    season: "Sep - Mar",
    src: "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=800&auto=format&fit=crop&q=80",
  },
  {
    id: "manali",
    city: "Manali",
    title: "Solang Valley & Old Manali Trails",
    budget: "₹3,000/day",
    duration: "4 Days",
    season: "Oct - Jun",
    src: "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=800&auto=format&fit=crop&q=80",
  },
  {
    id: "rishikesh",
    city: "Rishikesh",
    title: "Ganga Ghats & Himalayan Rafting",
    budget: "₹2,200/day",
    duration: "3 Days",
    season: "Sep - May",
    src: "https://images.unsplash.com/photo-1606293926075-69a00dbfde81?w=800&auto=format&fit=crop&q=80",
  },
  {
    id: "udaipur",
    city: "Udaipur",
    title: "Lake Pichola & City Palaces",
    budget: "₹4,000/day",
    duration: "3 Days",
    season: "Oct - Mar",
    src: "https://images.unsplash.com/photo-1615836245337-f5b9b2303f10?w=800&auto=format&fit=crop&q=80",
  },
  {
    id: "varanasi",
    city: "Varanasi",
    title: "Ancient Ghats & Evening Aarti",
    budget: "₹2,000/day",
    duration: "3 Days",
    season: "Oct - Mar",
    src: "https://images.unsplash.com/photo-1561361513-2d000a50f0dc?w=800&auto=format&fit=crop&q=80",
  },
];

export function PopularDestinations({ onSelectCity }) {
  return (
    <section className="destinations-section" id="destinations">
      <div className="container full-width">
        <div className="section-header text-center">
          <span className="section-eyebrow">Top Destinations</span>
          <h2 className="section-title">Popular Places in India</h2>
          <p className="section-subtitle">
            Explore curated destinations in 3D. Click any destination card to pre-fill your AI trip planner.
          </p>
        </div>

        <PerspectiveCarousel
          items={DESTINATIONS}
          defaultActiveIndex={2}
          onSelectCity={onSelectCity}
          slideWidth={340}
          rotationStep={20}
          inactiveScale={0.88}
          loop={true}
          showControls={true}
          showDots={true}
        />
      </div>
    </section>
  );
}
