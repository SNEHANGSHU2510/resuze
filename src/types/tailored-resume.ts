import { ResumeDraftState } from "./resume-draft"
import { ParsedJobDescription } from "./job-description"

export interface TailoredResumeState extends ResumeDraftState {
  jd_id?: string
  parsed_jd: ParsedJobDescription
  tailoring_decisions: TailoringDecision[]
  match_score: number // 0-100 rough relevance estimate
}

export interface TailoringDecision {
  type: "rewrite" | "reorder" | "emphasize" | "hide" | "keyword_inject"
  section: "summary" | "experience" | "projects" | "skills" | "education"
  description: string
}
