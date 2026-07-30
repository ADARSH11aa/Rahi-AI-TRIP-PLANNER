import React, { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, MapPin, Wallet, ArrowUpRight } from "lucide-react";

const DEFAULT_TRANSITION = {
  type: "spring",
  bounce: 0.14,
  duration: 0.9,
};

const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

export function PerspectiveCarousel({
  items = [],
  activeIndex,
  defaultActiveIndex = 0,
  onActiveIndexChange,
  onSelectCity,
  loop = true,
  slideWidth = 330,
  rotationStep = 20,
  inactiveScale = 0.88,
  transition = DEFAULT_TRANSITION,
  showControls = true,
  showDots = true,
}) {
  const maxIndex = Math.max(0, items.length - 1);
  const [uncontrolledIndex, setUncontrolledIndex] = useState(() =>
    clamp(defaultActiveIndex, 0, maxIndex)
  );
  const currentIndex = clamp(activeIndex ?? uncontrolledIndex, 0, maxIndex);
  const safeSlideWidth = Math.max(96, slideWidth);
  const safeInactiveScale = clamp(inactiveScale, 0.5, 1);

  const selectSlide = useCallback(
    (nextIndex) => {
      if (!items.length) return;

      const resolvedIndex = loop
        ? (nextIndex + items.length) % items.length
        : clamp(nextIndex, 0, maxIndex);

      if (activeIndex === undefined) {
        setUncontrolledIndex(resolvedIndex);
      }

      onActiveIndexChange?.(resolvedIndex);
    },
    [activeIndex, items.length, loop, maxIndex, onActiveIndexChange]
  );

  if (!items.length) return null;

  const isPreviousDisabled = !loop && currentIndex === 0;
  const isNextDisabled = !loop && currentIndex === maxIndex;

  const handleKeyDown = (event) => {
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      selectSlide(currentIndex - 1);
    }
    if (event.key === "ArrowRight") {
      event.preventDefault();
      selectSlide(currentIndex + 1);
    }
  };

  return (
    <div
      role="region"
      aria-roledescription="carousel"
      aria-label="Perspective destination carousel"
      tabIndex={0}
      onKeyDown={handleKeyDown}
      className="perspective-carousel-wrapper"
    >
      <div className="perspective-carousel-viewport">
        <motion.div
          className="perspective-carousel-track"
          animate={{ x: -(currentIndex * safeSlideWidth + safeSlideWidth / 2) }}
          transition={transition}
        >
          {items.map((item, index) => {
            const isActive = currentIndex === index;

            return (
              <div
                key={`${item.src || item.img}-${index}`}
                className="perspective-slide-container"
                style={{ width: safeSlideWidth }}
              >
                <motion.div
                  className="perspective-slide-inner"
                  animate={{
                    rotateY: (currentIndex - index) * rotationStep,
                    scale: isActive ? 1 : safeInactiveScale,
                  }}
                  transition={transition}
                >
                  <button
                    type="button"
                    aria-label={`Show ${item.title}`}
                    aria-current={isActive ? "true" : undefined}
                    className={`perspective-card-btn ${isActive ? "active" : ""}`}
                    onClick={() => {
                      selectSlide(index);
                      if (onSelectCity) {
                        onSelectCity(item.city || item.title);
                      }
                    }}
                  >
                    {/* Top Image Box with Badges */}
                    <div className="perspective-card-image-box">
                      <img
                        src={item.src || item.img}
                        alt={item.alt ?? item.title}
                        draggable={false}
                        className="perspective-card-img"
                      />
                      <div className="perspective-card-top-badges">
                        {item.duration && (
                          <span className="perspective-badge duration">{item.duration}</span>
                        )}
                        {item.season && (
                          <span className="perspective-badge season">{item.season}</span>
                        )}
                      </div>
                    </div>

                    {/* Bottom Details (Exact Match to Image 2) */}
                    <div className="perspective-card-details">
                      <div className="perspective-city-row">
                        <MapPin className="perspective-pin-icon" />
                        <span className="perspective-city-name">{item.city || "Destination"}</span>
                      </div>
                      <h3 className="perspective-card-title">{item.title}</h3>

                      {item.budget && (
                        <div className="perspective-budget-row">
                          <Wallet className="perspective-wallet-icon" />
                          <span>{item.budget}</span>
                        </div>
                      )}

                      <div className="perspective-explore-btn">
                        <span>Explore Plan</span>
                        <ArrowUpRight className="perspective-arrow-icon" />
                      </div>
                    </div>
                  </button>
                </motion.div>
              </div>
            );
          })}
        </motion.div>
      </div>

      {showControls && (
        <div className="perspective-controls-bar">
          <button
            type="button"
            aria-label="Show previous slide"
            disabled={isPreviousDisabled}
            className="perspective-nav-btn"
            onClick={() => selectSlide(currentIndex - 1)}
          >
            <ChevronLeft className="perspective-nav-icon" />
          </button>

          {showDots && (
            <div className="perspective-dots-row">
              {items.map((item, index) => (
                <button
                  key={`${item.title}-${index}`}
                  type="button"
                  aria-label={`Show slide ${index + 1}: ${item.title}`}
                  aria-current={currentIndex === index ? "true" : undefined}
                  className={`perspective-dot ${currentIndex === index ? "active" : ""}`}
                  onClick={() => selectSlide(index)}
                />
              ))}
            </div>
          )}

          <button
            type="button"
            aria-label="Show next slide"
            disabled={isNextDisabled}
            className="perspective-nav-btn"
            onClick={() => selectSlide(currentIndex + 1)}
          >
            <ChevronRight className="perspective-nav-icon" />
          </button>
        </div>
      )}
    </div>
  );
}

export default PerspectiveCarousel;
