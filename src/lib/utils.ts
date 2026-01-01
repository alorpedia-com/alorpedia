import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const VILLAGES = [
  "Umunri",
  "Ifite",
  "Ikenga",
  "Amamu",
  "Umuokala",
  "Ogbu",
];

export function calculateAgeGrade(birthDate: Date): string {
  const year = birthDate.getFullYear();
  const baseYear = 1940;
  const period = 3;

  if (year < baseYear) return "Council of Elders (< 1940)";

  const diff = year - baseYear;
  const gradeIndex = Math.floor(diff / period);
  const startYear = baseYear + gradeIndex * period;
  const endYear = startYear + period - 1;

  const names = [
    "Ancient Roots",
    "Wisdom Keepers",
    "Heritage Guardians",
    "Community Pillars",
    "Bridge Builders",
    "Cultural Sentinels",
    "Golden Generation",
    "Future Seedlings",
    "Morning Dew",
    "Rising Pioneers",
    "New Horizons",
  ];

  const name = names[gradeIndex % names.length];
  return `${name} (${startYear}-${endYear})`;
}
export function formatAgeGrade(ageGrade: string) {
  if (!ageGrade) return { name: "", years: "" };
  const parts = ageGrade.split(" (");
  if (parts.length < 2) return { name: ageGrade, years: "" };
  return {
    name: parts[0],
    years: `(${parts[1]}`, // Re-add the opening parenthesis
  };
}
