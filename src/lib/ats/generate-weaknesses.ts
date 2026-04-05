import { KeywordAnalysis, ATSWeakness } from "@/types/ats-report"

/**
 * Generates concrete, grounded weaknesses based on scoring data.
 */
export function generateWeaknesses(
  keywordAnalysis: KeywordAnalysis,
  sectionScore: number,
  contentMetrics: { strong_action_bullets: number; quantified_bullets: number; total_bullets: number; weak_phrase_count: number; avg_bullet_length: number },
  formatScore: number,
  semanticScore: number,
  sectionDetails: Record<string, { present: boolean; quality: string }>
): ATSWeakness[] {
  const weaknesses: ATSWeakness[] = []

  // Missing keywords
  if (keywordAnalysis.missing_keywords.length > 3) {
    weaknesses.push({
      category: "Missing Keywords",
      message: `${keywordAnalysis.missing_keywords.length} required/preferred skills are not found in your resume: ${keywordAnalysis.missing_keywords.slice(0, 5).join(", ")}${keywordAnalysis.missing_keywords.length > 5 ? "..." : ""}.`,
      severity: "critical",
    })
  } else if (keywordAnalysis.missing_keywords.length > 0) {
    weaknesses.push({
      category: "Missing Keywords",
      message: `${keywordAnalysis.missing_keywords.length} target skill(s) missing: ${keywordAnalysis.missing_keywords.join(", ")}.`,
      severity: "moderate",
    })
  }

  // Missing tools
  if (keywordAnalysis.missing_tools.length > 2) {
    weaknesses.push({
      category: "Missing Technologies",
      message: `${keywordAnalysis.missing_tools.length} technologies from the JD are absent: ${keywordAnalysis.missing_tools.slice(0, 4).join(", ")}.`,
      severity: "moderate",
    })
  }

  // Weak phrasing
  if (contentMetrics.weak_phrase_count > 2) {
    weaknesses.push({
      category: "Weak Phrasing",
      message: `${contentMetrics.weak_phrase_count} bullets contain passive or vague phrasing like "responsible for" or "helped with". Rewrite with action verbs.`,
      severity: "moderate",
    })
  }

  // Low quantification
  if (contentMetrics.total_bullets > 3 && contentMetrics.quantified_bullets < 2) {
    weaknesses.push({
      category: "Lack of Metrics",
      message: "Very few bullets contain measurable impact or numbers. ATS systems rank quantified achievements higher.",
      severity: "moderate",
    })
  }

  // Low action verb usage
  if (contentMetrics.total_bullets > 3) {
    const actionRatio = contentMetrics.strong_action_bullets / contentMetrics.total_bullets
    if (actionRatio < 0.3) {
      weaknesses.push({
        category: "Action Verbs",
        message: `Only ${contentMetrics.strong_action_bullets} of ${contentMetrics.total_bullets} bullets start with a strong action verb. This weakens the resume's competitive positioning.`,
        severity: "minor",
      })
    }
  }

  // Template compatibility
  if (formatScore < 65) {
    weaknesses.push({
      category: "Template Risk",
      message: "Your chosen template may cause parsing issues with some ATS systems. Consider switching to ATS Classic for maximum compatibility.",
      severity: "moderate",
    })
  }

  // Missing sections
  for (const [section, detail] of Object.entries(sectionDetails)) {
    if (!detail.present) {
      weaknesses.push({
        category: `Missing ${section}`,
        message: `${section} section is missing from your resume. This may reduce your ATS score.`,
        severity: section === "Experience" ? "critical" : "minor",
      })
    } else if (detail.quality === "Thin" || detail.quality === "Weak or Missing") {
      weaknesses.push({
        category: `Thin ${section}`,
        message: `Your ${section} section could be strengthened with more detailed content.`,
        severity: "minor",
      })
    }
  }

  // Poor role alignment
  if (semanticScore < 45) {
    weaknesses.push({
      category: "Role Misalignment",
      message: "Limited overlap between your resume language and the job description's requirements. Consider tailoring your content more precisely.",
      severity: "critical",
    })
  }

  return weaknesses
}
