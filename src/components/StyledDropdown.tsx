"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronDown, Check } from "lucide-react";

interface StyledDropdownProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
  icon?: React.ReactNode;
  className?: string;
  disabled?: boolean;
  disabledMessage?: string;
}

export default function StyledDropdown({
  label,
  value,
  onChange,
  options,
  icon,
  className = "",
  disabled = false,
  disabledMessage,
}: StyledDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find((opt) => opt.value === value);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const isDisabled = disabled || options.length === 0;

  return (
    <div ref={dropdownRef} className={`relative ${className}`}>
      <button
        type="button"
        onClick={() => !isDisabled && setIsOpen(!isOpen)}
        disabled={isDisabled}
        className={`relative flex items-center space-x-2 bg-card border border-border rounded-xl px-4 py-2.5 shadow-sm transition-all focus:ring-2 focus:ring-primary/20 focus:outline-none w-full ${
          isDisabled
            ? "opacity-50 cursor-not-allowed"
            : "hover:border-primary/50 cursor-pointer"
        }`}
        aria-label={label}
        aria-expanded={isOpen}
      >
        {icon && <div className="shrink-0">{icon}</div>}
        <span
          className={`text-sm font-semibold uppercase tracking-wide flex-1 text-left ${
            !value || !selectedOption ? "text-foreground/40" : "text-primary"
          }`}
        >
          {selectedOption?.label ||
            (isDisabled && disabledMessage) ||
            `Select ${label.toLowerCase()}...`}
        </span>
        <ChevronDown
          className={`w-4 h-4 text-primary/40 transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {isOpen && !isDisabled && (
        <div className="absolute z-50 w-full mt-2 bg-card border border-border rounded-xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="max-h-64 overflow-y-auto scrollbar-thin scrollbar-thumb-primary/20 scrollbar-track-transparent">
            {options.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => {
                  onChange(option.value);
                  setIsOpen(false);
                }}
                className={`w-full flex items-center justify-between px-4 py-3 text-sm font-semibold uppercase tracking-wide transition-colors ${
                  option.value === value
                    ? "bg-primary/10 text-primary"
                    : "text-foreground/70 hover:bg-primary/5 hover:text-primary"
                }`}
              >
                <span>{option.label}</span>
                {option.value === value && (
                  <Check className="w-4 h-4 text-primary" />
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
