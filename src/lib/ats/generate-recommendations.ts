import { KeywordAnalysis, ATSRecommendation } from "@/types/ats-report"

/**
 * Generates actionable recommendations based on analysis gaps.
 */
export function generateRecommendations(
  keywordAnalysis: KeywordAnalysis,
  sectionScore: number,
  contentMetrics: { strong_action_bullets: number; quantified_bullets: number; total_bullets: number; weak_phrase_count: number },
  formatScore: number,
  semanticScore: number,
  overallScore: number
): ATSRecommendation[] {
  const recs: ATSRecommendation[] = []

  // Missing keywords
  if (keywordAnalysis.missing_keywords.length > 0) {
    recs.push({
      priority: keywordAnalysis.missing_keywords.length > 3 ? "high" : "medium",
      message: `Add missing target skills to your resume: ${keywordAnalysis.missing_keywords.slice(0, 5).join(", ")}.`,
      action: "Add these keywords to your Skills section or weave them into your experience bullets where truthfully applicable.",
    })
  }

  // Quantification
  if (contentMetrics.total_bullets > 0 && contentMetrics.quantified_bullets < contentMetrics.total_bullets * 0.4) {
    recs.push({
      priority: "high",
      message: "Add measurable impact to more bullets.",
      action: "Rewrite key bullets using the formula: Action Verb + Metric + Result. Example: 'Reduced page load time by 40% through code splitting and lazy loading.'",
    })
  }

  // Weak phrases
  if (contentMetrics.weak_phrase_count > 1) {
    recs.push({
      priority: "medium",
      message: "Replace passive or vague language with assertive action verbs.",
      action: "Change 'Responsible for building...' to 'Architected and deployed...' to demonstrate ownership.",
    })
  }

  // Template
  if (formatScore < 70) {
    recs.push({
      priority: "medium",
      message: "Consider switching to the ATS Classic template for higher parse reliability.",
      action: "Navigate to the Template Gallery and select ATS Classic before submitting to automated screening portals.",
    })
  }

  // Section completeness
  if (sectionScore < 60) {
    recs.push({
      priority: "high",
      message: "Complete your resume sections. Critical areas are missing or thin.",
      action: "Return to your Profile workspace and ensure all sections (Summary, Experience, Skills, Education) are fully populated.",
    })
  }

  // Role relevance
  if (semanticScore < 55) {
    recs.push({
      priority: "high",
      message: "Tailor your resume more closely to the target role.",
      action: "Use the JD-Targeted Resume Studio to automatically align your content with the job description's key responsibilities.",
    })
  }

  // Overall lift suggestions
  if (overallScore < 50) {
    recs.push({
      priority: "high",
      message: "Your overall ATS score needs significant improvement before submission.",
      action: "Focus on the critical weaknesses above. Adding missing keywords and quantifying achievements will have the largest impact on your score.",
    })
  } else if (overallScore < 75) {
    recs.push({
      priority: "medium",
      message: "Your resume is competitive but could rank higher with minor adjustments.",
      action: "Address the moderate weaknesses to push your score above 75%, the threshold where most ATS systems place candidates in the 'strong match' tier.",
    })
  }

  return recs
}
