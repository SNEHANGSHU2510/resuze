import { NormalizedResumeData } from "./normalized-resume"

export interface ATSScores {
  overall_score: number
  keyword_score: number
  section_score: number
  format_score: number
  content_quality_score: number
  semantic_score: number
}

export interface KeywordAnalysis {
  matched_keywords: string[]
  missing_keywords: string[]
  matched_tools: string[]
  missing_tools: string[]
  keyword_coverage_percent: number
}

export interface ATSStrength {
  category: string
  message: string
  impact: "high" | "medium" | "low"
}

export interface ATSWeakness {
  category: string
  message: string
  severity: "critical" | "moderate" | "minor"
}

export interface ATSRecommendation {
  priority: "high" | "medium" | "low"
  message: string
  action: string
}

export interface ChartDataPoint {
  name: string
  score: number
  max: number
}

export interface ATSReport {
  scores: ATSScores
  keywords: KeywordAnalysis
  strengths: ATSStrength[]
  weaknesses: ATSWeakness[]
  recommendations: ATSRecommendation[]
  chart_data: ChartDataPoint[]
  template_compatibility: {
    label: string
    score: number
    note: string
  }
  insight_summary: string
  resume_id: string
  jd_id?: string
}
