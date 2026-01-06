import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// ============================================
// AUTHENTIC ALOR CULTURAL DATA
// ============================================

/**
 * The 6 villages of Alor
 */
export const VILLAGES = [
  "Umuoshi",
  "Uruezeani",
  "Ide",
  "Etiti",
  "Okebunoye",
  "Umuokwu",
] as const;

export type Village = (typeof VILLAGES)[number];

/**
 * The 18 kindreds (Umunna) organized by village
 */
export const KINDREDS: Record<string, string[]> = {
  Umuoshi: ["Odu", "Ota", "Idee"],
  Uruezeani: ["Enyi", "Ọbá", "Okua"],
  Ide: ["Onyima", "Ewulu", "Oshimili", "Yim"],
  Etiti: ["Ehulue", "Ajilija", "Ezu"],
  Okebunoye: ["Mkpume", "Ngene", "Agbudugbu"],
  Umuokwu: ["Agụ", "Atu"],
};

/**
 * Age Grade structure with authentic Alor names and year ranges
 */
export interface AgeGrade {
  name: string;
  start: number;
  end: number;
  role: "The Elders" | "The Workforce";
}

/**
 * Complete Alor Age Grade system (1800-1997)
 * 22 age grades spanning nearly 200 years
 */
export const AGE_GRADES: AgeGrade[] = [
  // The Elders (1800-1967)
  { name: "Isi Ogbo", start: 1800, end: 1912, role: "The Elders" },
  { name: "Alordimma", start: 1913, end: 1917, role: "The Elders" },
  { name: "Chizolu", start: 1918, end: 1922, role: "The Elders" },
  { name: "Anadodo", start: 1923, end: 1927, role: "The Elders" },
  { name: "Okona", start: 1928, end: 1932, role: "The Elders" },
  { name: "Igwebuike", start: 1933, end: 1937, role: "The Elders" },
  { name: "Ifeatu", start: 1938, end: 1942, role: "The Elders" },
  { name: "Ochiagha", start: 1943, end: 1947, role: "The Elders" },
  { name: "Ifeadigo", start: 1948, end: 1952, role: "The Elders" },
  { name: "Oganiru", start: 1953, end: 1957, role: "The Elders" },
  { name: "Ofuobi", start: 1958, end: 1962, role: "The Elders" },
  { name: "Udogadi", start: 1963, end: 1967, role: "The Elders" },

  // The Workforce (1968-1997)
  { name: "Umu Oma", start: 1968, end: 1970, role: "The Workforce" },
  { name: "Obialunamma", start: 1971, end: 1973, role: "The Workforce" },
  { name: "Udokamma", start: 1974, end: 1976, role: "The Workforce" },
  { name: "Ugobueze", start: 1977, end: 1979, role: "The Workforce" },
  { name: "Umuebube", start: 1980, end: 1982, role: "The Workforce" },
  { name: "Umuife", start: 1983, end: 1985, role: "The Workforce" },
  { name: "Nwannebuife", start: 1986, end: 1988, role: "The Workforce" },
  { name: "Ikukuoma", start: 1989, end: 1991, role: "The Workforce" },
  { name: "Obinwanne", start: 1992, end: 1994, role: "The Workforce" },
  { name: "Ifedimma", start: 1995, end: 1997, role: "The Workforce" },
];

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Calculate age grade from birth year
 * @param birthYear - Year of birth
 * @returns AgeGrade object or null if not found
 */
export function calculateAgeGrade(birthYear: number): AgeGrade | null {
  return (
    AGE_GRADES.find(
      (grade) => birthYear >= grade.start && birthYear <= grade.end
    ) || null
  );
}

/**
 * Format age grade for display (backward compatible)
 * @param ageGrade - Age grade name or full string
 * @returns Object with name and years
 */
export function formatAgeGrade(ageGrade: string | null | undefined): {
  name: string;
  years: string;
} {
  if (!ageGrade) return { name: "Not Set", years: "" };

  // If it's already formatted with parentheses, split it
  const parts = ageGrade.split(" (");
  if (parts.length >= 2) {
    return {
      name: parts[0],
      years: `(${parts[1]}`,
    };
  }

  // Otherwise, just return the name
  return { name: ageGrade, years: "" };
}

/**
 * Get all kindreds for a specific village
 * @param village - Village name
 * @returns Array of kindred names
 */
export function getKindredsForVillage(village: string): string[] {
  return KINDREDS[village] || [];
}

/**
 * Validate that a kindred belongs to a village
 * @param village - Village name
 * @param kindred - Kindred name
 * @returns true if valid, false otherwise
 */
export function isValidKindred(village: string, kindred: string): boolean {
  return KINDREDS[village]?.includes(kindred) ?? false;
}

/**
 * Get age grade display string with role
 * @param ageGradeName - Name of the age grade
 * @param role - Generational role
 * @returns Formatted string
 */
export function getAgeGradeDisplay(
  ageGradeName: string | null | undefined,
  role?: string | null
): string {
  if (!ageGradeName) return "Not Set";
  return role ? `${ageGradeName} (${role})` : ageGradeName;
}

/**
 * Get all age grades for a specific role
 * @param role - "The Elders" or "The Workforce"
 * @returns Array of age grades
 */
export function getAgeGradesByRole(
  role: "The Elders" | "The Workforce"
): AgeGrade[] {
  return AGE_GRADES.filter((grade) => grade.role === role);
}

/**
 * Get user initials from full name
 * @param name - Full name
 * @returns First and last initials (e.g., "John Doe" -> "JD")
 */
export function getUserInitials(name: string | null | undefined): string {
  if (!name) return "U";

  const parts = name.trim().split(/\s+/);

  if (parts.length === 1) {
    // Single name: return first two letters
    return parts[0].substring(0, 2).toUpperCase();
  }

  // Multiple names: return first letter of first and last name
  const firstInitial = parts[0][0];
  const lastInitial = parts[parts.length - 1][0];
  return (firstInitial + lastInitial).toUpperCase();
}
