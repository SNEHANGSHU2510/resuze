import { NormalizedResumeData } from "@/types/normalized-resume"
import { ParsedJobDescription } from "@/types/job-description"

/**
 * Generates a tailored professional summary grounded in the user's
 * existing profile data and aligned to the JD signals.
 *
 * This is a rule-based rewriter. It will NOT fabricate information.
 * It constructs the summary from real profile fields + JD keywords.
 */
export function tailorSummary(
  originalData: NormalizedResumeData,
  jd: ParsedJobDescription
): string {
  const { personal, experience, skills } = originalData

  // If the user already has a summary, use it as a base
  if (personal.summary && personal.summary.length > 30) {
    return enhanceExistingSummary(personal.summary, jd)
  }

  // Otherwise, construct one from scratch using profile facts
  return constructSummaryFromProfile(originalData, jd)
}

function enhanceExistingSummary(summary: string, jd: ParsedJobDescription): string {
  let enhanced = summary

  // Inject role alignment at the beginning if not already present
  if (jd.role_title && !summary.toLowerCase().includes(jd.role_title.toLowerCase())) {
    // Prepend a role-aligned opener
    const opener = jd.role_title
    enhanced = enhanced.replace(
      /^(.)/,
      `Results-driven professional targeting ${opener} opportunities. $1`
    )
  }

  // Append relevant must-have skills that aren't already mentioned
  const missingSkills = jd.must_have_skills.filter(
    (skill) => !summary.toLowerCase().includes(skill.toLowerCase())
  )
  if (missingSkills.length > 0 && missingSkills.length <= 5) {
    enhanced += ` Proficient in ${missingSkills.join(", ")}.`
  }

  return enhanced.trim()
}

function constructSummaryFromProfile(
  data: NormalizedResumeData,
  jd: ParsedJobDescription
): string {
  const parts: string[] = []
  const { personal, experience, skills } = data

  // Opening
  const totalYears = experience.length > 0
    ? Math.max(1, new Date().getFullYear() - new Date(experience[experience.length - 1]?.start_date || "").getFullYear())
    : 0

  const headline = personal.headline || jd.role_title || "Software Professional"

  if (totalYears > 0) {
    parts.push(`${headline} with ${totalYears}+ years of experience.`)
  } else {
    parts.push(`${headline} with a strong technical foundation.`)
  }

  // Skills alignment
  const topSkills = skills.slice(0, 5).map((s) => s.name)
  if (topSkills.length > 0) {
    parts.push(`Core expertise in ${topSkills.join(", ")}.`)
  }

  // Recent experience
  if (experience.length > 0) {
    const recent = experience[0]
    parts.push(`Most recently served as ${recent.title} at ${recent.company}.`)
  }

  // Company targeting
  if (jd.company) {
    parts.push(`Eager to contribute to ${jd.company}'s mission.`)
  }

  return parts.join(" ")
}
