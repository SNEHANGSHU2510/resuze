import { NormalizedResumeData, NormalizedExperience, NormalizedProject, NormalizedSkill } from "@/types/normalized-resume"
import { ParsedJobDescription } from "@/types/job-description"

/**
 * Score how relevant a text string is against the parsed JD signals.
 * Returns a number 0..1 representing match quality.
 */
function textRelevanceScore(text: string, jd: ParsedJobDescription): number {
  if (!text) return 0
  const lowerText = text.toLowerCase()
  let score = 0
  let maxScore = 0

  // Must-have skills: highest weight
  for (const skill of jd.must_have_skills) {
    maxScore += 3
    if (lowerText.includes(skill.toLowerCase())) score += 3
  }

  // Preferred skills: medium weight
  for (const skill of jd.preferred_skills) {
    maxScore += 2
    if (lowerText.includes(skill.toLowerCase())) score += 2
  }

  // General keywords: low weight
  for (const keyword of jd.keywords.slice(0, 20)) {
    maxScore += 1
    if (lowerText.includes(keyword.toLowerCase())) score += 1
  }

  // Action verbs: tiny bump for language alignment
  for (const verb of jd.action_verbs) {
    maxScore += 0.5
    if (lowerText.includes(verb.toLowerCase())) score += 0.5
  }

  return maxScore > 0 ? score / maxScore : 0
}

/**
 * Scores an individual experience entry against the JD.
 */
export function scoreExperience(exp: NormalizedExperience, jd: ParsedJobDescription): number {
  const combinedText = [exp.title, exp.company, exp.description, ...exp.bullets].join(" ")
  return textRelevanceScore(combinedText, jd)
}

/**
 * Scores an individual project entry against the JD.
 */
export function scoreProject(proj: NormalizedProject, jd: ParsedJobDescription): number {
  const combinedText = [proj.name, proj.role, proj.description, ...proj.bullets].join(" ")
  return textRelevanceScore(combinedText, jd)
}

/**
 * Scores the entire resume data against the JD.
 */
export function scoreResumeRelevance(data: NormalizedResumeData, jd: ParsedJobDescription): number {
  // Composite: all text in the entire resume
  const allText = [
    data.personal.summary,
    data.personal.headline,
    ...data.experience.flatMap((e) => [e.title, e.company, ...e.bullets]),
    ...data.projects.flatMap((p) => [p.name, p.role, ...p.bullets]),
    ...data.skills.map((s) => s.name),
  ].join(" ")

  return Math.round(textRelevanceScore(allText, jd) * 100)
}

/**
 * Returns skills sorted by JD relevance. Must-have skills first, then preferred, then others.
 */
export function rankSkillsByRelevance(skills: NormalizedSkill[], jd: ParsedJobDescription): NormalizedSkill[] {
  const mustHaveSet = new Set(jd.must_have_skills.map((s) => s.toLowerCase()))
  const preferredSet = new Set(jd.preferred_skills.map((s) => s.toLowerCase()))
  const keywordSet = new Set(jd.keywords.map((k) => k.toLowerCase()))

  return [...skills].sort((a, b) => {
    const aName = a.name.toLowerCase()
    const bName = b.name.toLowerCase()

    const aScore =
      (mustHaveSet.has(aName) ? 100 : 0) +
      (preferredSet.has(aName) ? 50 : 0) +
      (keywordSet.has(aName) ? 10 : 0)

    const bScore =
      (mustHaveSet.has(bName) ? 100 : 0) +
      (preferredSet.has(bName) ? 50 : 0) +
      (keywordSet.has(bName) ? 10 : 0)

    return bScore - aScore
  })
}
