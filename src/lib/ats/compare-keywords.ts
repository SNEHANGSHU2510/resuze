import { ParsedJobDescription } from "@/types/job-description"
import { KeywordAnalysis } from "@/types/ats-report"

/**
 * Compares extracted resume text against parsed JD signals.
 * Returns matched/missing keywords with coverage percentage.
 */
export function compareKeywords(
  resumeFullText: string,
  resumeSkillNames: string[],
  jd: ParsedJobDescription
): KeywordAnalysis {
  const lower = resumeFullText.toLowerCase()
  const skillSet = new Set(resumeSkillNames.map((s) => s.toLowerCase()))

  // Compare must-have + preferred skills
  const allJDSkills = [...jd.must_have_skills, ...jd.preferred_skills]
  const matched_keywords: string[] = []
  const missing_keywords: string[] = []

  for (const skill of allJDSkills) {
    const lowerSkill = skill.toLowerCase()
    if (lower.includes(lowerSkill) || skillSet.has(lowerSkill)) {
      matched_keywords.push(skill)
    } else {
      missing_keywords.push(skill)
    }
  }

  // Compare tools/technologies
  const matched_tools: string[] = []
  const missing_tools: string[] = []

  for (const tool of jd.tools_technologies) {
    const lowerTool = tool.toLowerCase()
    if (lower.includes(lowerTool) || skillSet.has(lowerTool)) {
      matched_tools.push(tool)
    } else {
      missing_tools.push(tool)
    }
  }

  const totalJDSignals = allJDSkills.length + jd.tools_technologies.length
  const totalMatched = matched_keywords.length + matched_tools.length
  const keyword_coverage_percent = totalJDSignals > 0
    ? Math.round((totalMatched / totalJDSignals) * 100)
    : 0

  return {
    matched_keywords: [...new Set(matched_keywords)],
    missing_keywords: [...new Set(missing_keywords)],
    matched_tools: [...new Set(matched_tools)],
    missing_tools: [...new Set(missing_tools)],
    keyword_coverage_percent,
  }
}
