import { NormalizedResumeData } from "@/types/normalized-resume"

/**
 * Scores how complete the resume sections are.
 * Returns 0-100.
 */
export function scoreSections(data: NormalizedResumeData): {
  score: number
  details: Record<string, { present: boolean; quality: string }>
} {
  const details: Record<string, { present: boolean; quality: string }> = {}
  let earned = 0
  const maxPoints = 100

  // Contact basics (15 pts)
  const hasContact = !!(data.personal.email && data.personal.first_name && data.personal.last_name)
  const hasPhone = !!data.personal.phone
  const hasLocation = !!data.personal.location
  const contactPoints = (hasContact ? 10 : 0) + (hasPhone ? 2.5 : 0) + (hasLocation ? 2.5 : 0)
  earned += contactPoints
  details["Contact Information"] = { present: hasContact, quality: contactPoints >= 12 ? "Strong" : contactPoints > 5 ? "Partial" : "Missing" }

  // Summary (15 pts)
  const hasSummary = !!(data.personal.summary && data.personal.summary.length > 30)
  const summaryQuality = data.personal.summary ? (data.personal.summary.length > 100 ? 15 : data.personal.summary.length > 50 ? 10 : 5) : 0
  earned += summaryQuality
  details["Professional Summary"] = { present: hasSummary, quality: summaryQuality >= 12 ? "Strong" : summaryQuality > 5 ? "Adequate" : "Weak or Missing" }

  // Experience (25 pts)
  const expCount = data.experience.length
  const totalBullets = data.experience.reduce((sum, e) => sum + e.bullets.length, 0)
  const expScore = Math.min(25, expCount * 5 + totalBullets * 1.5)
  earned += expScore
  details["Experience"] = { present: expCount > 0, quality: expScore >= 20 ? "Strong" : expScore > 10 ? "Moderate" : expCount > 0 ? "Thin" : "Missing" }

  // Education (15 pts)
  const eduScore = Math.min(15, data.education.length * 7.5)
  earned += eduScore
  details["Education"] = { present: data.education.length > 0, quality: eduScore >= 10 ? "Strong" : eduScore > 0 ? "Present" : "Missing" }

  // Skills (15 pts)
  const skillScore = Math.min(15, data.skills.length * 1.5)
  earned += skillScore
  details["Skills"] = { present: data.skills.length > 0, quality: skillScore >= 12 ? "Strong" : skillScore > 5 ? "Moderate" : data.skills.length > 0 ? "Few" : "Missing" }

  // Projects (10 pts)
  const projBullets = data.projects.reduce((sum, p) => sum + p.bullets.length, 0)
  const projScore = Math.min(10, data.projects.length * 3 + projBullets * 1)
  earned += projScore
  details["Projects"] = { present: data.projects.length > 0, quality: projScore >= 7 ? "Strong" : projScore > 3 ? "Present" : data.projects.length > 0 ? "Thin" : "Not Included" }

  // Links (5 pts)
  const hasLinkedIn = !!data.personal.linkedin_url
  const hasGitHub = !!data.personal.github_url
  const linkScore = (hasLinkedIn ? 2.5 : 0) + (hasGitHub ? 2.5 : 0)
  earned += linkScore
  details["Professional Links"] = { present: hasLinkedIn || hasGitHub, quality: linkScore >= 4 ? "Strong" : linkScore > 0 ? "Partial" : "Missing" }

  return {
    score: Math.min(100, Math.round(earned)),
    details,
  }
}
