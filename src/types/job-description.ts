export interface ParsedJobDescription {
  raw_text: string
  role_title: string
  company: string
  // Extracted signals
  must_have_skills: string[]
  preferred_skills: string[]
  keywords: string[]
  responsibilities: string[]
  domain_focus: string[]
  action_verbs: string[]
  seniority_level: "junior" | "mid" | "senior" | "lead" | "executive" | "unknown"
  tools_technologies: string[]
}

export interface JDInputState {
  raw_text: string
  role_title: string
  company: string
}
