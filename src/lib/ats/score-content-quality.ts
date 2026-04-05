import { NormalizedResumeData } from "@/types/normalized-resume"

const STRONG_ACTION_VERBS = new Set([
  "achieved","accelerated","architected","automated","built","created",
  "decreased","delivered","deployed","designed","developed","drove",
  "eliminated","engineered","established","exceeded","expanded","generated",
  "grew","implemented","improved","increased","integrated","launched",
  "led","managed","migrated","optimized","orchestrated","pioneered",
  "reduced","refactored","resolved","revamped","scaled","shipped",
  "spearheaded","streamlined","surpassed","transformed","tripled","upgraded",
])

const WEAK_PHRASES = [
  "responsible for","duties included","helped with","worked on",
  "assisted in","involved in","tasked with","participated in",
  "was responsible","exposure to","familiar with","basic knowledge",
]

const QUANTIFIER_PATTERN = /\d+[\+%xX]?|\$[\d,]+|[\d,]+ (users|customers|requests|transactions|records|entries|endpoints|services|projects|teams|members|months|weeks|sprints)/i

/**
 * Scores the quality of resume content based on bullet strength,
 * action verb usage, quantified impact, and weak phrasing penalties.
 * Returns 0-100.
 */
export function scoreContentQuality(data: NormalizedResumeData): {
  score: number
  metrics: {
    total_bullets: number
    strong_action_bullets: number
    quantified_bullets: number
    weak_phrase_count: number
    avg_bullet_length: number
  }
} {
  const allBullets = [
    ...data.experience.flatMap((e) => e.bullets),
    ...data.projects.flatMap((p) => p.bullets),
  ].filter((b) => b.trim().length > 0)

  const total_bullets = allBullets.length

  if (total_bullets === 0) {
    return {
      score: 15,
      metrics: { total_bullets: 0, strong_action_bullets: 0, quantified_bullets: 0, weak_phrase_count: 0, avg_bullet_length: 0 }
    }
  }

  let strong_action_bullets = 0
  let quantified_bullets = 0
  let weak_phrase_count = 0
  let totalLength = 0

  for (const bullet of allBullets) {
    const lower = bullet.toLowerCase().trim()
    totalLength += bullet.length

    // Check for strong action verb start
    const firstWord = lower.split(/\s+/)[0].replace(/[^a-z]/g, "")
    if (STRONG_ACTION_VERBS.has(firstWord)) {
      strong_action_bullets++
    }

    // Check for quantified impact
    if (QUANTIFIER_PATTERN.test(bullet)) {
      quantified_bullets++
    }

    // Check for weak phrases
    for (const phrase of WEAK_PHRASES) {
      if (lower.includes(phrase)) {
        weak_phrase_count++
        break
      }
    }
  }

  const avg_bullet_length = Math.round(totalLength / total_bullets)

  // Scoring logic
  let score = 50 // baseline

  // Action verb bonus: up to +20
  const actionRatio = strong_action_bullets / total_bullets
  score += Math.round(actionRatio * 20)

  // Quantified impact bonus: up to +20
  const quantifiedRatio = quantified_bullets / total_bullets
  score += Math.round(quantifiedRatio * 20)

  // Bullet density bonus: up to +10
  if (total_bullets >= 8) score += 10
  else if (total_bullets >= 5) score += 6
  else if (total_bullets >= 3) score += 3

  // Weak phrase penalty: up to -15
  const weakRatio = weak_phrase_count / total_bullets
  score -= Math.round(weakRatio * 15)

  // Average length quality: short bullets penalized, very long too
  if (avg_bullet_length < 30) score -= 5
  else if (avg_bullet_length > 200) score -= 3

  return {
    score: Math.max(0, Math.min(100, score)),
    metrics: {
      total_bullets,
      strong_action_bullets,
      quantified_bullets,
      weak_phrase_count,
      avg_bullet_length,
    }
  }
}
