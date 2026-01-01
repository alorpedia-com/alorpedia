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

  // Example logic: Group by 3 years starting from 1940
  // 1940-1942, 1943-1945, etc.

  const baseYear = 1940;
  const period = 3;

  if (year < baseYear) return "Elders";

  const diff = year - baseYear;
  const gradeIndex = Math.floor(diff / period);

  const startYear = baseYear + gradeIndex * period;
  const endYear = startYear + period - 1;

  // Custom names could be mapped here. For now, we use the years.
  const gradeNames: { [key: number]: string } = {
    0: "Ancient Roots",
    10: "Wisdom Bearers",
    20: "Community Pillars",
    // ... we can add more specific names
  };

  const name = gradeNames[gradeIndex] || `Age Grade ${startYear}-${endYear}`;

  return name;
}
