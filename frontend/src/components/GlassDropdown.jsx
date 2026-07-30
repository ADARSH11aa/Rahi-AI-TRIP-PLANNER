import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Check } from "lucide-react";

export function GlassDropdown({
  label,
  icon: Icon,
  value,
  options,
  onChange,
  placeholder = "Select option",
  id,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const selectedOption = options.find((opt) => opt.value === value) || null;

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const hasValue = Boolean(value);

  return (
    <div
      className={`floating-field-group glass-dropdown-container ${isOpen ? "is-open" : ""} ${
        hasValue ? "has-value" : ""
      }`}
      ref={dropdownRef}
    >
      <button
        type="button"
        id={id}
        className="floating-input-trigger"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-expanded={isOpen}
      >
        {Icon && (
          <div className="field-icon-wrapper">
            <Icon className="field-icon" />
          </div>
        )}

        <div className="floating-input-content">
          <span className="floating-label">{label}</span>
          <span className="floating-value-display">
            {selectedOption ? selectedOption.label : placeholder}
          </span>
        </div>

        <ChevronDown className={`dropdown-chevron ${isOpen ? "rotated" : ""}`} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.ul
            className="glass-dropdown-menu"
            initial={{ opacity: 0, y: 8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.98 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
          >
            {options.map((option) => {
              const isSelected = option.value === value;
              const OptionIcon = option.icon;

              return (
                <li key={option.value}>
                  <button
                    type="button"
                    className={`glass-dropdown-item ${isSelected ? "selected" : ""}`}
                    onClick={() => {
                      onChange(option.value);
                      setIsOpen(false);
                    }}
                  >
                    <div className="dropdown-item-left">
                      {OptionIcon ? (
                        <OptionIcon className="dropdown-item-icon" />
                      ) : (
                        <div className="dropdown-item-bullet" />
                      )}
                      <div className="dropdown-item-text">
                        <span className="dropdown-item-label">{option.label}</span>
                        {option.description && (
                          <span className="dropdown-item-desc">{option.description}</span>
                        )}
                      </div>
                    </div>
                    {isSelected && <Check className="dropdown-check-icon" />}
                  </button>
                </li>
              );
            })}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}
