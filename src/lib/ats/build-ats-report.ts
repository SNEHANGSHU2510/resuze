import { NormalizedResumeData } from "@/types/normalized-resume"
import { ParsedJobDescription } from "@/types/job-description"
import { ATSReport, ATSScores, ChartDataPoint } from "@/types/ats-report"
import { extractResumeKeywords } from "./extract-resume-keywords"
import { compareKeywords } from "./compare-keywords"
import { scoreSections } from "./score-sections"
import { scoreFormatting } from "./score-formatting"
import { scoreContentQuality } from "./score-content-quality"
import { scoreRoleRelevance } from "./score-role-relevance"
import { generateStrengths } from "./generate-strengths"
import { generateWeaknesses } from "./generate-weaknesses"
import { generateRecommendations } from "./generate-recommendations"

/**
 * The central ATS report builder. Orchestrates all sub-engines
 * and produces a complete, explainable ATSReport.
 *
 * Weighting:
 * - 40% keyword match
 * - 20% section completeness
 * - 15% formatting compatibility
 * - 15% content quality
 * - 10% role relevance
 */
export function buildATSReport(
  resumeData: NormalizedResumeData,
  jd: ParsedJobDescription,
  templateSlug: string,
  resumeId: string,
  jdId?: string
): ATSReport {
  // 1. Extract resume keywords
  const { full_text, skill_names } = extractResumeKeywords(resumeData)

  // 2. Compare against JD
  const keywordAnalysis = compareKeywords(full_text, skill_names, jd)
  const keyword_score = keywordAnalysis.keyword_coverage_percent

  // 3. Score sections
  const { score: section_score, details: sectionDetails } = scoreSections(resumeData)

  // 4. Score formatting
  const { score: format_score, label: formatLabel, note: formatNote } = scoreFormatting(templateSlug)

  // 5. Score content quality
  const { score: content_quality_score, metrics: contentMetrics } = scoreContentQuality(resumeData)

  // 6. Score role relevance
  const semantic_score = scoreRoleRelevance(resumeData, jd)

  // 7. Compute weighted overall
  const overall_score = Math.round(
    keyword_score * 0.40 +
    section_score * 0.20 +
    format_score * 0.15 +
    content_quality_score * 0.15 +
    semantic_score * 0.10
  )

  const scores: ATSScores = {
    overall_score,
    keyword_score,
    section_score,
    format_score,
    content_quality_score,
    semantic_score,
  }

  // 8. Generate strengths
  const strengths = generateStrengths(
    keywordAnalysis, section_score, contentMetrics, format_score, semantic_score, sectionDetails
  )

  // 9. Generate weaknesses
  const weaknesses = generateWeaknesses(
    keywordAnalysis, section_score, contentMetrics, format_score, semantic_score, sectionDetails
  )

  // 10. Generate recommendations
  const recommendations = generateRecommendations(
    keywordAnalysis, section_score, contentMetrics, format_score, semantic_score, overall_score
  )

  // 11. Build chart data
  const chart_data: ChartDataPoint[] = [
    { name: "Keywords", score: keyword_score, max: 100 },
    { name: "Sections", score: section_score, max: 100 },
    { name: "Format", score: format_score, max: 100 },
    { name: "Content", score: content_quality_score, max: 100 },
    { name: "Relevance", score: semantic_score, max: 100 },
  ]

  // 12. Build insight summary
  let insight_summary = ""
  if (overall_score >= 80) {
    insight_summary = `Excellent match. Your resume demonstrates strong keyword coverage (${keyword_score}%) and solid content quality. You are well-positioned for automated screening.`
  } else if (overall_score >= 60) {
    insight_summary = `Competitive resume with room for improvement. Keyword coverage is at ${keyword_score}% and ${keywordAnalysis.missing_keywords.length} target skills are missing. Address the high-priority recommendations to cross the 80% threshold.`
  } else if (overall_score >= 40) {
    insight_summary = `Below competitive threshold. ${keywordAnalysis.missing_keywords.length} critical keywords are missing and content quality needs strengthening. Use the JD tailoring studio to align your resume more closely.`
  } else {
    insight_summary = `Significant gaps detected. This resume may struggle to pass automated ATS filters for this role. Return to the Profile workspace and JD studio to rebuild a targeted version.`
  }

  return {
    scores,
    keywords: keywordAnalysis,
    strengths,
    weaknesses,
    recommendations,
    chart_data,
    template_compatibility: {
      label: formatLabel,
      score: format_score,
      note: formatNote,
    },
    insight_summary,
    resume_id: resumeId,
    jd_id: jdId,
  }
}
