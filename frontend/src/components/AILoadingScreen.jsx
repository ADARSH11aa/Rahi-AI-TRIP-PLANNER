import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Compass,
  CloudSun,
  Hotel,
  Sparkles,
  Wallet,
  Navigation,
  UtensilsCrossed,
  Cpu,
  BookOpen,
  CheckCircle2,
  Check
} from "lucide-react";

const THINKING_STEPS = [
  { id: 1, text: "Understanding your destination...", icon: Compass },
  { id: 2, text: "Checking weather...", icon: CloudSun },
  { id: 3, text: "Finding hotels...", icon: Hotel },
  { id: 4, text: "Searching attractions...", icon: Sparkles },
  { id: 5, text: "Optimizing budget...", icon: Wallet },
  { id: 6, text: "Planning routes...", icon: Navigation },
  { id: 7, text: "Finding restaurants...", icon: UtensilsCrossed },
  { id: 8, text: "Generating itinerary...", icon: Cpu },
  { id: 9, text: "Preparing your travel guide...", icon: BookOpen },
];

export function AILoadingScreen({ currentLine, destinationName }) {
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    // 9 steps spread across ~9 seconds (1000ms per step)
    const interval = setInterval(() => {
      setActiveStep((prev) => {
        if (prev < THINKING_STEPS.length - 1) {
          return prev + 1;
        }
        return prev;
      });
    }, 950);

    return () => clearInterval(interval);
  }, []);

  const progressPercent = Math.min(
    100,
    Math.round(((activeStep + 1) / THINKING_STEPS.length) * 100)
  );

  const currentStepObj = THINKING_STEPS[activeStep] || THINKING_STEPS[THINKING_STEPS.length - 1];

  return (
    <motion.div
      className="ai-thinking-container"
      initial={{ opacity: 0, y: 16, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -16, scale: 0.98 }}
      transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
    >
      {/* Background ambient lighting */}
      <div className="ai-thinking-ambient-glow" />

      <div className="ai-thinking-card">
        {/* Top AI Thinking Badge */}
        <div className="ai-thinking-top-badge">
          <div className="ai-pulse-dot" />
          <span>Rāhi AI Engine • Thinking</span>
        </div>

        {/* Centerpiece: Large Animated AI Orb */}
        <div className="ai-orb-centerpiece">
          {/* Outer glowing blur halo */}
          <motion.div
            className="ai-orb-outer-halo"
            animate={{
              scale: [1, 1.25, 1],
              opacity: [0.35, 0.75, 0.35],
              rotate: [0, 180, 360],
            }}
            transition={{
              duration: 7,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />

          {/* Liquid gradient morphing ring */}
          <motion.div
            className="ai-orb-gradient-ring"
            animate={{
              rotate: [0, 360],
              scale: [1, 1.08, 1],
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: "linear",
            }}
          />

          {/* Secondary counter-rotating glow ring */}
          <motion.div
            className="ai-orb-counter-ring"
            animate={{
              rotate: [360, 0],
              scale: [1.05, 0.95, 1.05],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />

          {/* Central Glass Sphere Core */}
          <div className="ai-orb-core-sphere">
            <motion.div
              className="ai-orb-inner-spark"
              animate={{
                scale: [0.9, 1.15, 0.9],
                opacity: [0.8, 1, 0.8],
              }}
              transition={{
                duration: 2.5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              <Sparkles className="ai-orb-spark-icon" />
            </motion.div>
          </div>

          {/* Floating Energy Particles around Orb */}
          <motion.span
            className="ai-orb-particle p1"
            animate={{ y: [-6, 6, -6], opacity: [0.4, 0.9, 0.4] }}
            transition={{ duration: 3, repeat: Infinity }}
          />
          <motion.span
            className="ai-orb-particle p2"
            animate={{ x: [-8, 8, -8], opacity: [0.3, 0.8, 0.3] }}
            transition={{ duration: 4, repeat: Infinity, delay: 0.5 }}
          />
          <motion.span
            className="ai-orb-particle p3"
            animate={{ y: [6, -6, 6], opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 3.5, repeat: Infinity, delay: 1 }}
          />
        </div>

        {/* Live Status Header */}
        <div className="ai-thinking-header text-center">
          <AnimatePresence mode="wait">
            <motion.h2
              key={currentStepObj.id}
              className="ai-thinking-live-status"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25 }}
            >
              {currentStepObj.text}
            </motion.h2>
          </AnimatePresence>
          <p className="ai-thinking-sub">
            {destinationName
              ? `Synthesizing personalized journey for ${destinationName}...`
              : "Building a verified day-by-day travel plan..."}
          </p>
        </div>

        {/* Smooth Continuous Progress Bar */}
        <div className="ai-thinking-progress-wrapper">
          <div className="ai-thinking-progress-labels">
            <span className="ai-thinking-progress-title">AI Synthesis Progress</span>
            <span className="ai-thinking-progress-percent">{progressPercent}%</span>
          </div>
          <div className="ai-thinking-bar-track">
            <motion.div
              className="ai-thinking-bar-fill"
              initial={{ width: "0%" }}
              animate={{ width: `${progressPercent}%` }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            >
              <div className="ai-thinking-bar-leading-glow" />
            </motion.div>
          </div>
        </div>

        {/* Live Step Checklist with Animated Checkmarks */}
        <div className="ai-thinking-checklist">
          {THINKING_STEPS.map((step, index) => {
            const isCompleted = index < activeStep;
            const isCurrent = index === activeStep;
            const StepIcon = step.icon;

            return (
              <motion.div
                key={step.id}
                className={`ai-checklist-item ${
                  isCompleted ? "completed" : isCurrent ? "active" : "pending"
                }`}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <div className="ai-checklist-icon-box">
                  {isCompleted ? (
                    <motion.div
                      className="check-icon-wrapper"
                      initial={{ scale: 0, rotate: -25 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ type: "spring", stiffness: 450, damping: 22 }}
                    >
                      <Check className="icon-check-success" />
                    </motion.div>
                  ) : (
                    <StepIcon className={`icon-step-symbol ${isCurrent ? "pulse-active" : ""}`} />
                  )}
                </div>

                <span className="ai-checklist-text">{step.text}</span>

                {isCurrent && (
                  <motion.div
                    className="ai-checklist-live-pill"
                    initial={{ opacity: 0, scale: 0.85 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.2 }}
                  >
                    <span className="pill-dot" />
                    <span>Processing</span>
                  </motion.div>
                )}

                {isCompleted && (
                  <span className="ai-checklist-done-tag">Done</span>
                )}
              </motion.div>
            );
          })}
        </div>

        {/* Bottom AI Footer note */}
        <div className="ai-thinking-footer">
          <span>⚡ Grounded in verified places, weather data & local routes</span>
        </div>
      </div>
    </motion.div>
  );
}
