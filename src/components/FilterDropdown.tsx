import { ChevronDown } from "lucide-react";

interface FilterDropdownProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
  icon?: React.ReactNode;
  className?: string;
}

export default function FilterDropdown({
  label,
  value,
  onChange,
  options,
  icon,
  className = "",
}: FilterDropdownProps) {
  return (
    <div
      className={`relative flex items-center space-x-2 bg-card/50 backdrop-blur-sm border border-border/50 rounded-xl px-3 md:px-4 py-2 md:py-2.5 shadow-sm hover:border-primary/30 transition-all focus-within:ring-2 focus-within:ring-primary/10 ${className}`}
    >
      {icon && <div className="shrink-0">{icon}</div>}
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="bg-transparent text-xs md:text-sm font-bold text-primary outline-none cursor-pointer uppercase tracking-wide md:tracking-wider pr-6 appearance-none w-full"
        aria-label={label}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <ChevronDown className="w-3.5 h-3.5 md:w-4 md:h-4 text-primary/40 absolute right-3 pointer-events-none" />
    </div>
  );
}
