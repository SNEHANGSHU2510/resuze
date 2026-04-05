import { KeywordAnalysis } from "@/types/ats-report"
import { ATSStrength } from "@/types/ats-report"

/**
 * Generates concrete, grounded strengths based on scoring data.
 */
export function generateStrengths(
  keywordAnalysis: KeywordAnalysis,
  sectionScore: number,
  contentMetrics: { strong_action_bullets: number; quantified_bullets: number; total_bullets: number },
  formatScore: number,
  semanticScore: number,
  sectionDetails: Record<string, { present: boolean; quality: string }>
): ATSStrength[] {
  const strengths: ATSStrength[] = []

  // Keyword strengths
  if (keywordAnalysis.keyword_coverage_percent >= 70) {
    strengths.push({
      category: "Keyword Coverage",
      message: `Strong keyword alignment at ${keywordAnalysis.keyword_coverage_percent}% coverage. ${keywordAnalysis.matched_keywords.length} of the target skills matched.`,
      impact: "high",
    })
  } else if (keywordAnalysis.keyword_coverage_percent >= 45) {
    strengths.push({
      category: "Keyword Coverage",
      message: `Moderate keyword presence with ${keywordAnalysis.matched_keywords.length} matched skills and technologies.`,
      impact: "medium",
    })
  }

  // Content quality
  if (contentMetrics.total_bullets > 0) {
    const actionRatio = contentMetrics.strong_action_bullets / contentMetrics.total_bullets
    if (actionRatio > 0.5) {
      strengths.push({
        category: "Action Language",
        message: `${contentMetrics.strong_action_bullets} of ${contentMetrics.total_bullets} bullets use strong action verbs. This is above industry average.`,
        impact: "high",
      })
    }

    if (contentMetrics.quantified_bullets >= 3) {
      strengths.push({
        category: "Quantified Impact",
        message: `${contentMetrics.quantified_bullets} bullets contain measurable outcomes or metrics. Quantified achievements increase ATS ranking.`,
        impact: "high",
      })
    }
  }

  // Section completeness
  if (sectionScore >= 80) {
    strengths.push({
      category: "Section Completeness",
      message: "All major resume sections are present and well-populated. ATS systems parse this structure reliably.",
      impact: "high",
    })
  }

  // Template compatibility
  if (formatScore >= 85) {
    strengths.push({
      category: "Template Compatibility",
      message: "Selected template is highly ATS-compatible with clean single-column formatting.",
      impact: "medium",
    })
  }

  // Role relevance
  if (semanticScore >= 70) {
    strengths.push({
      category: "Role Alignment",
      message: "Strong lexical alignment between your resume content and the target role requirements.",
      impact: "high",
    })
  }

  // Individual section strengths
  for (const [section, detail] of Object.entries(sectionDetails)) {
    if (detail.quality === "Strong") {
      strengths.push({
        category: section,
        message: `Your ${section} section is well-constructed and complete.`,
        impact: "low",
      })
    }
  }

  return strengths
}
