import { NormalizedExperience } from "@/types/normalized-resume"
import { ParsedJobDescription } from "@/types/job-description"
import { scoreExperience } from "./score-resume-relevance"

/**
 * Reorders experience entries by JD relevance, putting the
 * most relevant roles first. Also reorders bullets within
 * each experience entry to prioritize JD-aligned content.
 */
export function tailorExperience(
  experiences: NormalizedExperience[],
  jd: ParsedJobDescription
): NormalizedExperience[] {
  // Score and sort experiences by relevance
  const scored = experiences.map((exp) => ({
    exp,
    score: scoreExperience(exp, jd),
  }))

  scored.sort((a, b) => b.score - a.score)

  // Within each experience, reorder bullets by relevance
  return scored.map(({ exp }) => ({
    ...exp,
    bullets: reorderBullets(exp.bullets, jd),
  }))
}

function reorderBullets(bullets: string[], jd: ParsedJobDescription): string[] {
  if (bullets.length <= 1) return bullets

  const allSignals = [
    ...jd.must_have_skills,
    ...jd.preferred_skills,
    ...jd.keywords.slice(0, 15),
    ...jd.action_verbs,
  ].map((s) => s.toLowerCase())

  const scored = bullets.map((bullet) => {
    const lower = bullet.toLowerCase()
    let score = 0
    for (const signal of allSignals) {
      if (lower.includes(signal)) score++
    }
    return { bullet, score }
  })

  scored.sort((a, b) => b.score - a.score)
  return scored.map((s) => s.bullet)
}
