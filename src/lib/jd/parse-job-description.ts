import { ParsedJobDescription, JDInputState } from "@/types/job-description"
import { extractJDKeywords } from "./extract-jd-keywords"

/**
 * Parses raw JD text into a structured ParsedJobDescription object
 * by combining keyword extraction with structural analysis.
 */
export function parseJobDescription(input: JDInputState): ParsedJobDescription {
  const { raw_text, role_title, company } = input
  const lowerText = raw_text.toLowerCase()

  const { keywords, tools_technologies, action_verbs, seniority_level } = extractJDKeywords(raw_text)

  // Responsibilities extraction: look for lines that start with dash, bullet, or number
  const lines = raw_text.split(/\n/)
  const responsibilities: string[] = []
  for (const line of lines) {
    const trimmed = line.trim()
    if (/^[-•●▪*]\s/.test(trimmed) || /^\d+[\.\)]\s/.test(trimmed)) {
      const cleaned = trimmed.replace(/^[-•●▪*\d\.\)]+\s*/, "").trim()
      if (cleaned.length > 15) {
        responsibilities.push(cleaned)
      }
    }
  }

  // Separate must-have vs preferred skills from tools
  // Naïve heuristic: if the tool appears near "required" or "must", it's must-have
  const must_have_skills: string[] = []
  const preferred_skills: string[] = []

  for (const tool of tools_technologies) {
    // Search for the tool in text and check surrounding context
    const idx = lowerText.indexOf(tool.toLowerCase())
    if (idx === -1) {
      preferred_skills.push(tool)
      continue
    }
    const surroundingWindow = lowerText.substring(Math.max(0, idx - 150), Math.min(lowerText.length, idx + 150))
    if (
      surroundingWindow.includes("required") ||
      surroundingWindow.includes("must") ||
      surroundingWindow.includes("essential") ||
      surroundingWindow.includes("mandatory")
    ) {
      must_have_skills.push(tool)
    } else if (
      surroundingWindow.includes("preferred") ||
      surroundingWindow.includes("nice to have") ||
      surroundingWindow.includes("bonus") ||
      surroundingWindow.includes("plus")
    ) {
      preferred_skills.push(tool)
    } else {
      // Default: treat as must-have if no context clue found
      must_have_skills.push(tool)
    }
  }

  // Domain focus extraction — look for industry/domain signals
  const domainPatterns = [
    "fintech","healthcare","healthtech","e-commerce","ecommerce","edtech",
    "saas","b2b","b2c","marketplace","social media","ad tech","adtech",
    "cybersecurity","security","blockchain","web3","crypto","defi",
    "media","entertainment","gaming","real estate","proptech","insurtech",
    "logistics","supply chain","transportation","automotive","iot",
    "biotech","pharma","legal","legaltech","govtech","climate","cleantech",
  ]
  const domain_focus = domainPatterns.filter((d) => lowerText.includes(d))

  return {
    raw_text,
    role_title: role_title || "",
    company: company || "",
    must_have_skills,
    preferred_skills,
    keywords,
    responsibilities,
    domain_focus,
    action_verbs,
    seniority_level,
    tools_technologies,
  }
}
