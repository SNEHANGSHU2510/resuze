/**
 * Scores template formatting/ATS compatibility.
 * Returns 0-100.
 */
export function scoreFormatting(templateSlug: string): {
  score: number
  label: string
  note: string
} {
  switch (templateSlug) {
    case "ats-classic":
      return {
        score: 95,
        label: "ATS Safe",
        note: "Single-column serif layout with zero graphical noise. Top tier for automated parsing systems."
      }
    case "corporate-modern":
      return {
        score: 72,
        label: "Hybrid",
        note: "Two-column layout with a dark header. Most modern ATS handle this well, but some legacy systems may misread the sidebar."
      }
    case "executive-glass":
      return {
        score: 55,
        label: "Visual Premium",
        note: "Elegant minimalist design oriented toward human readers. Some ATS systems may struggle with the unconventional spacing and grid structure."
      }
    default:
      return {
        score: 70,
        label: "Unknown",
        note: "Template compatibility not assessed. Consider using ATS Classic for maximum parsing reliability."
      }
  }
}
