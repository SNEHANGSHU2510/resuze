import { NormalizedProject } from "@/types/normalized-resume"
import { ParsedJobDescription } from "@/types/job-description"
import { scoreProject } from "./score-resume-relevance"

/**
 * Reorders project entries by JD relevance, putting the
 * most relevant projects first. Low-relevance projects are
 * pushed to the end but NOT removed (user decides visibility).
 */
export function tailorProjects(
  projects: NormalizedProject[],
  jd: ParsedJobDescription
): NormalizedProject[] {
  const scored = projects.map((proj) => ({
    proj,
    score: scoreProject(proj, jd),
  }))

  scored.sort((a, b) => b.score - a.score)

  return scored.map(({ proj }) => ({
    ...proj,
    bullets: reorderProjectBullets(proj.bullets, jd),
  }))
}

function reorderProjectBullets(bullets: string[], jd: ParsedJobDescription): string[] {
  if (bullets.length <= 1) return bullets

  const allSignals = [
    ...jd.must_have_skills,
    ...jd.preferred_skills,
    ...jd.keywords.slice(0, 15),
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
